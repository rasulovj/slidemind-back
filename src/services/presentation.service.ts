import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function create(data: {
  userId: string;
  title?: string;
  aspectRatio?: string;
  themeId?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const presentation = await tx.presentation.create({
      data: {
        userId: data.userId,
        title: data.title ?? "Sarlavsiz prezentatsiya",
        aspectRatio: data.aspectRatio ?? "16:9",
        themeId: data.themeId ?? "default",
      },
    });

    await tx.slide.create({
      data: { presentationId: presentation.id, position: 0 },
    });

    return tx.presentation.update({
      where: { id: presentation.id },
      data: { slideCount: 1 },
    });
  });
}

export async function list(params: {
  userId: string;
  page: number;
  limit: number;
  search: string;
}) {
  const where: Prisma.PresentationWhereInput = {
    userId: params.userId,
    ...(params.search && { title: { contains: params.search, mode: "insensitive" } }),
  };

  const [presentations, total] = await Promise.all([
    prisma.presentation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      include: {
        slides: {
          where: { position: 0 },
          take: 1,
          select: { background: true, canvasJson: true },
        },
      },
    }),
    prisma.presentation.count({ where }),
  ]);

  const presentationsWithPreview = presentations.map((p) => {
    const firstSlide = p.slides[0];
    return {
      ...p,
      slides: undefined,
      firstSlideCanvas: firstSlide?.canvasJson ?? null,
    };
  });

  return { presentations: presentationsWithPreview, total, page: params.page, limit: params.limit };
}

export async function findOwnedOrThrow(id: string, userId: string) {
  const presentation = await prisma.presentation.findFirst({ where: { id, userId } });
  if (!presentation) throw new Error("NOT_FOUND");
  return presentation;
}

export async function getById(id: string, userId: string) {
  return findOwnedOrThrow(id, userId);
}

export async function update(
  id: string,
  userId: string,
  data: { title?: string; aspectRatio?: string; themeId?: string; isPublic?: boolean }
) {
  await findOwnedOrThrow(id, userId);
  return prisma.presentation.update({ where: { id }, data });
}

export async function remove(id: string, userId: string) {
  await findOwnedOrThrow(id, userId);
  await prisma.presentation.delete({ where: { id } });
}

export async function duplicate(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const original = await tx.presentation.findFirst({
      where: { id, userId },
      include: { slides: { orderBy: { position: "asc" } } },
    });
    if (!original) throw new Error("NOT_FOUND");

    const copy = await tx.presentation.create({
      data: {
        userId,
        title: `${original.title} (copy)`,
        aspectRatio: original.aspectRatio,
        themeId: original.themeId,
        slideCount: original.slides.length,
      },
    });

    if (original.slides.length > 0) {
      await tx.slide.createMany({
        data: original.slides.map((s) => ({
          presentationId: copy.id,
          position: s.position,
          canvasJson: s.canvasJson as Prisma.InputJsonValue,
          background: s.background as Prisma.InputJsonValue,
          speakerNotes: s.speakerNotes ?? undefined,
        })),
      });
    }

    return copy;
  });
}

export async function toggleShare(id: string, userId: string) {
  const presentation = await findOwnedOrThrow(id, userId);

  if (presentation.isPublic) {
    return prisma.presentation.update({
      where: { id },
      data: { isPublic: false, shareToken: null },
    });
  }

  const { randomBytes } = await import("crypto");
  const shareToken = randomBytes(16).toString("hex");
  return prisma.presentation.update({
    where: { id },
    data: { isPublic: true, shareToken },
  });
}

export async function getByShareToken(shareToken: string) {
  const presentation = await prisma.presentation.findUnique({
    where: { shareToken },
    include: { slides: { orderBy: { position: "asc" } } },
  });
  if (!presentation || !presentation.isPublic) throw new Error("NOT_FOUND");
  return presentation;
}
