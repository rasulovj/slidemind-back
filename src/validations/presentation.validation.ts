import { z } from "zod";

export const CreatePresentationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  aspectRatio: z.enum(["16:9", "4:3", "1:1"]).optional(),
  themeId: z.string().optional(),
});

export const UpdatePresentationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  aspectRatio: z.enum(["16:9", "4:3", "1:1"]).optional(),
  themeId: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type CreatePresentationInput = z.infer<typeof CreatePresentationSchema>;
export type UpdatePresentationInput = z.infer<typeof UpdatePresentationSchema>;
