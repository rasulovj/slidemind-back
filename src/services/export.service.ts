import { prisma } from "@/lib/prisma";
import { buildPdf } from "@/lib/export/pdf";
import { buildPptx } from "@/lib/export/pptx";

export type ExportFormat = "pptx" | "pdf";

export async function exportPresentation(id: string, userId: string, format: ExportFormat) {
  const presentation = await prisma.presentation.findFirst({
    where: { id, userId },
    include: { slides: { orderBy: { position: "asc" } } },
  });

  if (!presentation) throw new Error("NOT_FOUND");

  const deck = {
    presentation,
    slides: presentation.slides,
  };

  if (format === "pptx") {
    return {
      ...(await buildPptx(deck)),
      contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
  }

  return {
    ...(await buildPdf(deck)),
    contentType: "application/pdf",
  };
}
