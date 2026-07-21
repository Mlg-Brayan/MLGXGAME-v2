const STORAGE_KEY = 'mlgxgame_category_scores';

export function trackCategoryClick(category: string) {
  if (typeof window === 'undefined' || !category) return;

  const raw = localStorage.getItem(STORAGE_KEY);
  const scores: Record<string, number> = raw ? JSON.parse(raw) : {};

  scores[category] = (scores[category] ?? 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export function getTopCategories(limit = 3): string[] {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const scores: Record<string, number> = JSON.parse(raw);
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category]) => category);
}

export function sortByPreference<T extends { category?: string }>(items: T[]): T[] {
  const topCategories = getTopCategories();
  if (topCategories.length === 0) return items;

  return [...items].sort((a, b) => {
    const aScore = a.category && topCategories.includes(a.category) ? topCategories.indexOf(a.category) : 999;
    const bScore = b.category && topCategories.includes(b.category) ? topCategories.indexOf(b.category) : 999;
    return aScore - bScore;
  });
}