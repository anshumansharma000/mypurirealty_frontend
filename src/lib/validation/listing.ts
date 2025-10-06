import { z } from "zod";

export const ListingDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  price_inr: z.number(),
  images: z.array(z.string()).default([]),
  bhk: z.number().optional(),
  area_sqft: z.number().optional(),
  posted_at: z.string().datetime(),
  broker: z
    .object({
      id: z.string(),
      name: z.string(),
      phone: z.string().optional(),
    })
    .optional(),
});

export const ListingsResponseSchema = z.object({
  items: z.array(ListingDTOSchema),
  total: z.number(),
});
