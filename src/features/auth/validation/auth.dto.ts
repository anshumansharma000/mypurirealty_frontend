import { z } from "zod";

export const LoginResponseDTO = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z
    .object({
      access_token: z.string(),
      refresh_token: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type LoginResponseDTOType = z.infer<typeof LoginResponseDTO>;
