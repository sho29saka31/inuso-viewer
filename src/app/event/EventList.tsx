"use client";

import { useEffect, useState } from "react";

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

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

function getEventState(ev: Event, now: Date): "upcoming" | "active" | "done" {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (ev.day > today) return "upcoming";
  if (ev.day < today) return "done";
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(ev.startTime);
  const end = toMinutes(ev.endTime);
  if (nowMin < start) return "upcoming";
  if (nowMin >= end) return "done";
  return "active";
}

function isAllDay(ev: Event): boolean {
  return /日目/.test(ev.eventName) || ev.startTime === "00:00" || ev.startTime === "00:00:00";
}

export default function EventList({ grouped }: { grouped: Record<string, Event[]> }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  function formatDay(day: string): string {
    const d = new Date(day + "T00:00:00");
    return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([day, items]) => {
        const allDayEvents = items.filter(isAllDay);
        const regularEvents = items.filter((e) => !isAllDay(e));
        return (
          <section key={day}>
            <h2 className="text-sm font-bold text-[var(--color-primary)] mb-2 pb-1 border-b border-[var(--color-primary)]">
              {formatDay(day)}
            </h2>
            {allDayEvents.map((ev) => (
              <div
                key={ev.eventId}
                className="mb-3 rounded-xl bg-[var(--color-primary)] text-white px-4 py-2.5 flex items-center gap-2 shadow-sm"
              >
                <span className="text-xs font-bold opacity-80">終日</span>
                <span className="font-bold text-sm">{ev.eventName}</span>
                {ev.isDelayed && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-white/20 font-medium">
                    遅延 +{ev.delayMinutes}分
                  </span>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2">
              {regularEvents.map((ev) => {
                const state = now ? getEventState(ev, now) : "upcoming";
                const isDone = state === "done";
                const isActive = state === "active";
                return (
                  <div
                    key={ev.eventId}
                    className={`flex gap-3 rounded-xl border shadow-sm p-3 transition-colors ${
                      isDone
                        ? "bg-gray-50 border-gray-100 opacity-50"
                        : isActive
                        ? "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/30"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className={`flex flex-col items-center text-xs shrink-0 w-16 pt-0.5 ${isDone ? "text-gray-400" : "text-[var(--color-text-sub)]"}`}>
                      <span className={`font-bold text-sm ${isDone ? "text-gray-400" : "text-[var(--color-text-main)]"}`}>
                        {ev.startTime.slice(0, 5)}
                      </span>
                      <span>〜</span>
                      <span>{ev.endTime.slice(0, 5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-bold text-sm ${isDone ? "text-gray-400" : "text-[var(--color-text-main)]"}`}>
                          {ev.eventName}
                        </p>
                        {isActive && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white font-bold animate-pulse">
                            進行中
                          </span>
                        )}
                        {ev.isDelayed && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                            遅延 +{ev.delayMinutes}分
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isDone ? "text-gray-400" : "text-[var(--color-text-sub)]"}`}>
                        {ev.location}
                      </p>
                      {ev.details && (
                        <p className={`text-xs mt-1 whitespace-pre-wrap ${isDone ? "text-gray-400" : "text-[var(--color-text-sub)]"}`}>
                          {ev.details}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
