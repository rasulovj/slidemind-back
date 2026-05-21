import { z } from "zod";

export const SUPPORTED_LANGUAGES = ["en", "uz", "ru", "tr", "uz_cyrl"] as const;

export const GeneratePresentationSchema = z.object({
  presentationId: z.string().min(1),
  topic: z.string().min(1).max(500),
  slideCount: z.number().int().min(3).max(20).default(8),
  language: z.enum(SUPPORTED_LANGUAGES).default("en"),
  presetId: z.string().min(1).optional(),
});

export type GeneratePresentationInput = z.infer<typeof GeneratePresentationSchema>;
