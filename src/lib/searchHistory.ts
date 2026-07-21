const KEY = 'mlgxgame_search_history';

export function addToHistory(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;

  const raw = localStorage.getItem(KEY);
  let history: string[] = raw ? JSON.parse(raw) : [];

  history = history.filter((q) => q.toLowerCase() !== query.toLowerCase());
  history.unshift(query);
  history = history.slice(0, 8);

  localStorage.setItem(KEY, JSON.stringify(history));
}

export function getHistory(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}