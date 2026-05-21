import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { buildCanvas } from "@/lib/templates/registry";
import { sanitize } from "@/lib/templates/helpers";

const DARK_LAYOUTS = new Set([
  "heroCentered", "heroSplit", "coverAccent", "chapterDivider",
  "sectionBreak", "keyMessage", "singleStat", "versus",
  "thankYou", "ctaBold", "qaSlide",
  "cbTitle", "cbObjectives", "cbConceptMap", "cbDefinition",
  "cbFormula", "cbExampleSetup", "cbSolutionSteps", "cbMistakes",
  "cbSecondExample", "cbPractice", "cbTakeaways", "cbConclusion",
]);

async function verifyPresentationOwnership(presentationId: string, userId: string) {
  const presentation = await prisma.presentation.findFirst({
    where: { id: presentationId, userId },
  });
  if (!presentation) throw new Error("NOT_FOUND");
  return presentation;
}

async function verifySlideOwnership(slideId: string, userId: string) {
  const slide = await prisma.slide.findFirst({
    where: { id: slideId, presentation: { userId } },
    include: { presentation: true },
  });
  if (!slide) throw new Error("NOT_FOUND");
  return slide;
}

export async function list(presentationId: string, userId: string) {
  await verifyPresentationOwnership(presentationId, userId);
  return prisma.slide.findMany({
    where: { presentationId },
    orderBy: { position: "asc" },
  });
}

export async function create(data: {
  presentationId: string;
  userId: string;
  position?: number;
  layoutId?: string;
  canvasJson?: Prisma.InputJsonValue;
  background?: Prisma.InputJsonValue;
  speakerNotes?: string;
}) {
  const presentation = await verifyPresentationOwnership(data.presentationId, data.userId);

  return prisma.$transaction(async (tx) => {
    const maxPositionResult = await tx.slide.aggregate({
      where: { presentationId: data.presentationId },
      _max: { position: true },
    });

    const position = data.position ?? (maxPositionResult._max.position ?? -1) + 1;

    // Shift existing slides if inserting mid-deck
    if (data.position !== undefined) {
      await tx.slide.updateMany({
        where: { presentationId: data.presentationId, position: { gte: data.position } },
        data: { position: { increment: 1 } },
      });
    }

    let canvasJson: Prisma.InputJsonValue = data.canvasJson ?? {};
    let background: Prisma.InputJsonValue = data.background ?? { type: "color", value: "#ffffff" };

    if (data.layoutId && !data.canvasJson) {
      // Derive theme from presentation's most recent slide or use defaults.
      const lastSlide = await tx.slide.findFirst({
        where: { presentationId: data.presentationId },
        orderBy: { position: "desc" },
      });
      const lastBg = (lastSlide?.background as { type: string; value: string } | null);
      const accentGuess = "#AB3E16";
      const isDark = DARK_LAYOUTS.has(data.layoutId);
      const theme = {
        dark: sanitize(lastBg?.value ?? "#0f172a"),
        accent: accentGuess,
        surface: sanitize(presentation.themeId ?? "#f8fafc"),
      };
      canvasJson = buildCanvas(data.layoutId, theme) as Prisma.InputJsonValue;
      background = { type: "color", value: isDark ? theme.dark : theme.surface } as Prisma.InputJsonValue;
    }

    const slide = await tx.slide.create({
      data: {
        presentationId: data.presentationId,
        position,
        canvasJson,
        background,
        speakerNotes: data.speakerNotes,
      },
    });

    await tx.presentation.update({
      where: { id: data.presentationId },
      data: { slideCount: { increment: 1 } },
    });

    return slide;
  });
}

export async function update(
  slideId: string,
  userId: string,
  data: {
    canvasJson?: Prisma.InputJsonValue;
    background?: Prisma.InputJsonValue;
    speakerNotes?: string;
  }
) {
  await verifySlideOwnership(slideId, userId);
  return prisma.slide.update({ where: { id: slideId }, data });
}

export async function remove(slideId: string, userId: string) {
  const slide = await verifySlideOwnership(slideId, userId);

  await prisma.$transaction(async (tx) => {
    await tx.slide.delete({ where: { id: slideId } });

    // Compact positions after deletion
    const remaining = await tx.slide.findMany({
      where: { presentationId: slide.presentationId },
      orderBy: { position: "asc" },
    });

    await Promise.all(
      remaining.map((s, i) =>
        tx.slide.update({ where: { id: s.id }, data: { position: i } })
      )
    );

    await tx.presentation.update({
      where: { id: slide.presentationId },
      data: { slideCount: remaining.length },
    });
  });
}

export async function duplicate(slideId: string, userId: string) {
  const slide = await verifySlideOwnership(slideId, userId);

  return prisma.$transaction(async (tx) => {
    // Shift slides after current position
    await tx.slide.updateMany({
      where: { presentationId: slide.presentationId, position: { gt: slide.position } },
      data: { position: { increment: 1 } },
    });

    const copy = await tx.slide.create({
      data: {
        presentationId: slide.presentationId,
        position: slide.position + 1,
        canvasJson: slide.canvasJson as Prisma.InputJsonValue,
        background: slide.background as Prisma.InputJsonValue,
        speakerNotes: slide.speakerNotes,
      },
    });

    await tx.presentation.update({
      where: { id: slide.presentationId },
      data: { slideCount: { increment: 1 } },
    });

    return copy;
  });
}

export async function reorder(data: {
  presentationId: string;
  userId: string;
  order: string[];
}) {
  await verifyPresentationOwnership(data.presentationId, data.userId);

  await prisma.$transaction(
    data.order.map((slideId, index) =>
      prisma.slide.updateMany({
        where: { id: slideId, presentationId: data.presentationId },
        data: { position: index },
      })
    )
  );
}
