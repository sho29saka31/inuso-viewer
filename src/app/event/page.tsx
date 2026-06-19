import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
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
function formatDay(day: string): string {
  const d = new Date(day + "T00:00:00");
  return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
}
export default async function EventPage() {
  const result = await getEvents();
  if ("error" in result) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">イベントスケジュール</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。</p>
        <p className="text-xs text-red-400 mt-2 break-all">{result.error}</p>
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
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([day, items]) => (
            <section key={day}>
              <h2 className="text-sm font-bold text-[var(--color-primary)] mb-2 pb-1 border-b border-[var(--color-primary)]">
                {formatDay(day)}
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((ev) => (
                  <div key={ev.eventId} className="flex gap-3 rounded-xl bg-white border border-gray-100 shadow-sm p-3">
                    <div className="flex flex-col items-center text-xs text-[var(--color-text-sub)] shrink-0 w-16 pt-0.5">
                      <span className="font-bold text-sm text-[var(--color-text-main)]">{ev.startTime.slice(0, 5)}</span>
                      <span>〜</span>
                      <span>{ev.endTime.slice(0, 5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm text-[var(--color-text-main)]">{ev.eventName}</p>
                        {ev.isDelayed && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                            遅延 +{ev.delayMinutes}分
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-sub)] mt-0.5">{ev.location}</p>
                      {ev.details && (
                        <p className="text-xs text-[var(--color-text-sub)] mt-1">{ev.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}