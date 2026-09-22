export const HISTORY_KEY = 'unite.history.v1';
export const HISTORY_LIMIT = 6;
const unitGroups = { length: ['m', 'km', 'cm', 'ft', 'in', 'mi'], volume: ['l', 'ml', 'gal-us', 'gal-imp'], temperature: ['c', 'f', 'k'] };

export function isHistoryEntry(entry) {
  return Boolean(entry && typeof entry === 'object'
    && Number.isFinite(entry.value) && Number.isFinite(entry.result)
    && unitGroups[entry.category]?.includes(entry.from) && unitGroups[entry.category]?.includes(entry.to)
    && ['fromSymbol', 'toSymbol'].every((key) => typeof entry[key] === 'string' && entry[key].length > 0 && entry[key].length <= 10));
}

export function loadHistory(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isHistoryEntry).slice(0, HISTORY_LIMIT) : [];
  } catch { return []; }
}

export function appendHistory(history, entry) {
  if (!isHistoryEntry(entry)) return history;
  return [entry, ...history].slice(0, HISTORY_LIMIT);
}

export function saveHistory(storage, history) {
  try { storage.setItem(HISTORY_KEY, JSON.stringify(history)); return true; }
  catch { return false; }
}
