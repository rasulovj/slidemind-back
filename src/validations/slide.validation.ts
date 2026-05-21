import { z } from "zod";

export const CreateSlideSchema = z.object({
  presentationId: z.string().min(1),
  position: z.number().int().min(0).optional(),
  layoutId: z.string().optional(),
  canvasJson: z.record(z.unknown()).optional(),
  background: z.record(z.unknown()).optional(),
  speakerNotes: z.string().optional(),
});

export const UpdateSlideSchema = z.object({
  canvasJson: z.record(z.unknown()).optional(),
  background: z.record(z.unknown()).optional(),
  speakerNotes: z.string().optional(),
});

export const ReorderSlidesSchema = z.object({
  presentationId: z.string().min(1),
  order: z.array(z.string()).min(1),
});

export type CreateSlideInput = z.infer<typeof CreateSlideSchema>;
export type UpdateSlideInput = z.infer<typeof UpdateSlideSchema>;
export type ReorderSlidesInput = z.infer<typeof ReorderSlidesSchema>;
