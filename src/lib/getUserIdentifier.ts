export function getUserIdentifier(): string {
  const key = 'mlgxgame_user_id';
  let id = localStorage.getItem(key);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }

  return id;
}