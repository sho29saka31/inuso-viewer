// ブースのカテゴリ表示名・並び順・絞り込みで共通利用する定義

export const CATEGORY_LABELS: Record<string, string> = {
  class: "クラス発表",
  club: "部活動",
  pe: "有志発表",
  "pe-gym": "有志発表",
  health: "委員会",
  committee: "委員会",
  game: "ゲーム",
  food: "食品",
  eat: "飲食",
  stage: "ステージ",
  exhibition: "展示",
  other: "その他",
};

// 一覧画面の並び順: クラス→部活動→飲食→有志発表→委員会（それ以外は末尾にまとめる）
const CATEGORY_SORT_ORDER: Record<string, number> = {
  class: 0,
  club: 1,
  eat: 2,
  food: 2,
  pe: 3,
  "pe-gym": 3,
  health: 4,
  committee: 4,
};

export function categorySortRank(category: string): number {
  return CATEGORY_SORT_ORDER[category] ?? 99;
}

// 絞り込み用のカテゴリ区分（委員会・有志発表等は「その他」にまとめる）
export type CategoryFilter = "class" | "club" | "eat" | "other";

export const CATEGORY_FILTER_OPTIONS: { key: CategoryFilter; label: string }[] = [
  { key: "class", label: "クラス" },
  { key: "club", label: "部活" },
  { key: "eat", label: "飲食" },
  { key: "other", label: "その他" },
];

export function categoryFilterGroup(category: string): CategoryFilter {
  if (category === "class") return "class";
  if (category === "club") return "club";
  if (category === "eat" || category === "food") return "eat";
  return "other";
}
