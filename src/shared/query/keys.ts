export const qk = {
  listings: (p: unknown) => ["listings", p] as const,
  listing: (id: string) => ["listing", id] as const,
  similar: (id: string) => ["similar", id] as const,
  listingInterests: (id: string, page: number, pageSize: number) =>
    ["listing-interests", id, page, pageSize] as const,
};
