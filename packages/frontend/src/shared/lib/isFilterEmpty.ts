export function isFilterEmpty(filter: Record<string, any>): boolean {
  return Object.values(filter).every((value) => {
    if (value === undefined || value === null || value === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  });
}
