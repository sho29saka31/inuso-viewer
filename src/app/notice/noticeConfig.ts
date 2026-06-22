export const TYPE_CONFIG: Record<string, { label: string; card: string; badge: string }> = {
  urgent:  { label: "緊急",    card: "bg-red-50 border-red-200",       badge: "bg-red-500 text-white" },
  warning: { label: "注意",    card: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-500 text-white" },
  info:    { label: "お知らせ", card: "bg-blue-50 border-blue-200",    badge: "bg-blue-500 text-white" },
  other:   { label: "その他",  card: "bg-gray-50 border-gray-200",    badge: "bg-gray-500 text-white" },
};

export function resolveType(n: { type?: string; isUrgent?: boolean }): string {
  if (n.type) return n.type;
  return n.isUrgent ? "urgent" : "info";
}
