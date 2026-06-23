import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";
import EventList from "./EventList";
import * as Sentry from "@sentry/nextjs";

export const revalidate = 300;
export const metadata: Metadata = { title: "イベントスケジュール" };
interface Event {
  eventId: string;
  eventName: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  details?: string;
  isDelayed?: boolean;
  delayMinutes?: number;
}
async function getEvents(): Promise<{ events: Event[] } | { error: string }> {
  try {
    const db = getDb();
    const snap = await db.collection("events").orderBy("day").orderBy("startTime").get();
    return { events: snap.docs.map((d) => d.data() as Event) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}
export default async function EventPage() {
  const result = await getEvents();
  if ("error" in result) {
    Sentry.captureException(new Error(result.error));
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">イベントスケジュール</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。時間をおいて再度お試しください。</p>
      </div>
    );
  }
  const { events } = result;
  const grouped = events.reduce<Record<string, Event[]>>((acc, e) => {
    if (!acc[e.day]) acc[e.day] = [];
    acc[e.day].push(e);
    return acc;
  }, {});
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-6">イベントスケジュール</h1>
      {events.length === 0 ? (
        <p className="text-sm text-[var(--color-text-sub)]">現在登録されているイベントはありません。</p>
      ) : (
        <EventList grouped={grouped} />
      )}
    </div>
  );
}