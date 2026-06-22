type Timestamp = { seconds?: number; _seconds?: number } | null | undefined;

export function formatDate(ts: Timestamp, includeYear = false): string {
  if (!ts) return "";
  const secs = ts.seconds ?? ts._seconds;
  if (secs == null) return "";
  const d = new Date(secs * 1000);
  return d.toLocaleDateString("ja-JP", {
    ...(includeYear && { year: "numeric" }),
    month: includeYear ? "long" : "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
