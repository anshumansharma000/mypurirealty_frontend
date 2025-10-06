export const qk = {
  listings: (p: unknown) => ["listings", p] as const,
  listing: (id: string) => ["listing", id] as const,
  similar: (id: string) => ["similar", id] as const,
};
