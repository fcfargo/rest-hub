export const mergeUniqueById = <T extends { id: string | number }>(prev: T[], next: T[]) =>
  Array.from(new Map([...prev, ...next].map((item) => [item.id, item])).values());
