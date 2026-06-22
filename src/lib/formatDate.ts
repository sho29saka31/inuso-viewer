type Timestamp = { seconds?: number; _seconds?: number } | null | undefined;

export function formatDate(
  ts: Timestamp,
  options: { year?: boolean; month?: "numeric" | "long" } = {}
): string {
  if (!ts) return "";
  const secs = ts.seconds ?? ts._seconds;
  if (secs == null) return "";
  const d = new Date(secs * 1000);
  return d.toLocaleDateString("ja-JP", {
    ...(options.year && { year: "numeric" }),
    month: options.month ?? "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
