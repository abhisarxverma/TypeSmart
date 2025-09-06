export function useSearch<T>(data: T[], query: string, keys: (keyof T)[]): T[] {
  const lowerQuery = query.toLowerCase().trim();

  return data.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return typeof value === "string" && value.toLowerCase().includes(lowerQuery);
    })
  );
}
