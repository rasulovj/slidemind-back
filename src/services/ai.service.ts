import { deepseek, DEEPSEEK_MODEL } from "@/lib/deepseek";
import { prisma } from "@/lib/prisma";
import { logger } from "@/utils/logger";
import { buildCanvas, getAllMeta } from "@/lib/templates/registry";
import { sanitize } from "@/lib/templates/helpers";
import { getPreset } from "@/lib/templates/presets";
import { resolveImage } from "@/services/image.service";
import { applyFonts, getLanguageInstruction } from "@/lib/templates/fonts";
import type { Theme, SlideContent } from "@/lib/templates/types";

const GENERATION_MARKER = "__SLIDEMIND_GENERATING__";
const GENERATION_MARKER_TTL_MS = 10 * 60 * 1000;

// ── AI prompt ──────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  const metas = getAllMeta();
  const byCategory = metas.reduce<Record<string, string[]>>((acc, m) => {
    (acc[m.category] ??= []).push(`"${m.id}" — ${m.description}`);
    return acc;
  }, {});

  const layoutDocs = Object.entries(byCategory)
    .map(([cat, items]) => `${cat.toUpperCase()}:\n${items.map((s) => `  • ${s}`).join("\n")}`)
    .join("\n\n");

  return `
You are a professional presentation designer. Generate a complete slide deck as structured JSON.
Return ONLY valid JSON — no markdown, no code fences, no explanation.

Output schema:
{
  "title": "string — concise presentation title",
  "theme": {
    "dark": "#hexcolor — dark bg for hero/dark slides, topic-relevant",
    "accent": "#hexcolor — vibrant accent matching the topic mood",
    "surface": "#hexcolor — light bg for content slides (near white, slight tint)"
  },
  "slides": [
    {
      "layout": "<layoutId from list below>",
      "heading": "string — max 8 words",
      "subheading": "string or null",
      "body": "string or null — short paragraph for wide-text layouts",
      "label": "string or null — 1–3 word category tag",
      "points": ["string max 10 words", ...] or null,
      "stats": [{ "value": "84%", "label": "Conversion Rate" }, ...] or null,
      "quote": "string or null — for quoteLarge layout",
      "author": "string or null — quote attribution",
      "steps": ["string", ...] or null — for timeline or versus",
      "leftPoints": ["string", ...] or null — left column for compare/two-col",
      "rightPoints": ["string", ...] or null — right column for compare/two-col",
      "icon": "string or null — single Lucide icon name for the slide (e.g. 'rocket', 'chart-bar', 'lightbulb')",
      "icons": ["string", ...] or null — array of Lucide icon names, one per bullet point"
    }
  ]
}

AVAILABLE LAYOUTS:
${layoutDocs}

STRICT RULES:
1. Theme colors MUST match the topic:
   - Tech/AI/Software  → dark=#0f172a, accent=#38bdf8, surface=#f0f9ff
   - Business/Finance  → dark=#1c1917, accent=#d97706, surface=#fffbeb
   - Health/Medical    → dark=#0c2340, accent=#06b6d4, surface=#ecfeff
   - Environment       → dark=#052e16, accent=#4ade80, surface=#f0fdf4
   - Education/Science → dark=#1e1b4b, accent=#818cf8, surface=#eef2ff
   - Marketing/Creative→ dark=#450a0a, accent=#f97316, surface=#fff7ed
   - Politics/Social   → dark=#1a1a2e, accent=#e879f9, surface=#fdf4ff
   - Other             → choose contextually appropriate colors
2. FIRST slide: always use "heroCentered" or "coverAccent" — no points/stats, no label
3. LAST slide: always use "thankYou", "ctaBold", or "qaSlide"
4. Vary layouts throughout — do NOT repeat the same layout consecutively
5. Use dark layouts (heroCentered, keyMessage, singleStat, sectionBreak, versus, thankYou, ctaBold, qaSlide) for impact moments — about 30% of slides
6. Use "bulletsClassic" or "bulletsCards" for most informational slides — 3–5 points each
7. Use "threeStats" or "fourStats" when you have numerical data to show
8. Use "quoteLarge" or "tipHighlight" for one memorable insight
9. Use "agendaNumbered" or "agendaPills" as the second slide for structure
10. Do NOT put markdown in any text field
11. Text must be SHORT: heading max 8 words, points max 12 words each, body max 2 sentences
12. For "body" fields: maximum 120 characters. Never write paragraphs — use concise summaries
13. For "points" array items: maximum 4 words each. They must fit in a small card
14. NEVER use "..." or ellipsis in any text field. Always write complete text. If too long, shorten the phrase instead of truncating
15. Include "icon" field on content slides with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe", "zap", "heart")
16. For bulletsClassic/bulletsCards slides, include "icons" array with one icon per point (same length as "points" array)
17. Use simple, common Lucide icon names: lowercase with hyphens (e.g. "arrow-right", "check-circle", "trending-up", "book-open")
18. NEVER repeat information across slides. Each slide MUST cover a unique subtopic, angle, or time period. No two slides should share the same thesis, examples, or data. Plan the full content arc first: divide the topic into distinct facets and assign one per slide.
`.trim();
}

// ── Main export ────────────────────────────────────────────────────────

export async function generatePresentation(params: {
  presentationId: string;
  userId: string;
  topic: string;
  slideCount: number;
  language: string;
  presetId?: string;
}) {
  const presentation = await prisma.presentation.findFirst({
    where: { id: params.presentationId, userId: params.userId },
  });
  if (!presentation) throw new Error("NOT_FOUND");

  const generationState = await claimGeneration(params.presentationId);
  if (generationState.status === "exists") {
    return { slides: generationState.slides, title: presentation.title, generated: false };
  }
  if (generationState.status === "in_progress") {
    throw new Error("GENERATION_IN_PROGRESS");
  }

  const preset = params.presetId ? getPreset(params.presetId) : undefined;

  // For presets that support dynamic slide counts, clamp user input to the allowed range
  const effectiveCount = preset
    ? Math.max(preset.minSlides ?? preset.slideCount, Math.min(preset.maxSlides ?? preset.slideCount, params.slideCount))
    : params.slideCount;

  const dynamic = preset?.buildDynamic?.(effectiveCount);
  const systemPrompt = dynamic?.aiPrompt ?? preset?.aiPrompt ?? buildSystemPrompt();
  const langInstruction = getLanguageInstruction(params.language);
  const userMsg = preset
    ? `Create a ${preset.name} presentation about: "${params.topic}". ${langInstruction} Return only JSON.`
    : `Create a ${params.slideCount}-slide presentation about: "${params.topic}". ${langInstruction} Return only JSON.`;

  const completion = await deepseek.chat.completions.create({
    model: DEEPSEEK_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMsg },
    ],
    temperature: 0.75,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  logger.info({ presentationId: params.presentationId }, "AI response received");

  let parsed: { title: string; theme: Theme; slides: Array<{ layout: string } & SlideContent & { label?: string }> };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  if (!Array.isArray(parsed.slides) || !parsed.slides.length) {
    throw new Error("AI returned no slides");
  }

  const aiTheme: Theme = {
    dark: sanitize(parsed.theme?.dark ?? preset?.darkColor ?? "#0f172a"),
    accent: sanitize(parsed.theme?.accent ?? preset?.accentColor ?? "#38bdf8"),
    surface: sanitize(parsed.theme?.surface ?? preset?.surfaceColor ?? "#f8fafc"),
  };

  const theme: Theme = preset && !preset.allowAiTheme
    ? {
        dark: sanitize(preset.darkColor),
        accent: sanitize(preset.accentColor),
        surface: sanitize(preset.surfaceColor ?? preset.darkColor),
      }
    : aiTheme;

  function isCanvasDark(canvasJson: Record<string, unknown>, themeDark: string): boolean {
    const bg = canvasJson.background as string | undefined;
    if (!bg) return false;
    if (bg === themeDark) return true;
    const hex = bg.replace("#", "");
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 < 100;
    }
    const rgba = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgba) {
      const r = parseInt(rgba[1]);
      const g = parseInt(rgba[2]);
      const b = parseInt(rgba[3]);
      return (r * 299 + g * 587 + b * 114) / 1000 < 100;
    }
    return false;
  }

  let bulletCount = 0;
  const presetLayouts = dynamic?.layouts ?? preset?.layouts;
  const slideInputs = presetLayouts
    ? presetLayouts.map((layout, i) => ({ ...(parsed.slides[i] ?? {}), layout }))
    : parsed.slides;

  const preparedSlides = await Promise.all(
    slideInputs.map(async (slideData, i) => {
      const layout = slideData.layout ?? "bulletsClassic";
      if (layout === "bulletsClassic") bulletCount++;

      const content: SlideContent = {
        heading:     slideData.heading,
        subheading:  slideData.subheading ?? undefined,
        body:        slideData.body ?? undefined,
        imageQuery:  slideData.imageQuery ?? undefined,
        imageUrl:    slideData.imageUrl ?? undefined,
        imageAlt:    slideData.imageAlt ?? undefined,
        imageCredit: slideData.imageCredit ?? undefined,
        imageProvider: slideData.imageProvider ?? undefined,
        imageSourceUrl: slideData.imageSourceUrl ?? undefined,
        imageWidth: slideData.imageWidth ?? undefined,
        imageHeight: slideData.imageHeight ?? undefined,
        label:       slideData.label ?? undefined,
        points:      slideData.points ?? undefined,
        stats:       slideData.stats ?? undefined,
        quote:       slideData.quote ?? undefined,
        author:      slideData.author ?? undefined,
        steps:       slideData.steps ?? undefined,
        leftPoints:  slideData.leftPoints ?? undefined,
        rightPoints: slideData.rightPoints ?? undefined,
        icon:        slideData.icon ?? undefined,
        icons:       slideData.icons ?? undefined,
      };

      const resolvedImage = await resolveImage(
        content.imageUrl
          ? {}
          : {
              query: content.imageQuery,
              heading: content.heading,
              label: content.label,
            }
      );
      if (resolvedImage) {
        content.imageUrl = resolvedImage.imageUrl;
        content.imageAlt = content.imageAlt ?? resolvedImage.imageAlt;
        content.imageCredit = resolvedImage.imageCredit;
        content.imageProvider = resolvedImage.imageProvider;
        content.imageSourceUrl = resolvedImage.imageSourceUrl;
        content.imageWidth = resolvedImage.imageWidth;
        content.imageHeight = resolvedImage.imageHeight;
      }

      const rawCanvas = buildCanvas(layout, theme, content, bulletCount);
      const canvasJson = applyFonts(rawCanvas, params.language);
      const isDark = isCanvasDark(canvasJson as Record<string, unknown>, theme.dark);

      return {
        position: i,
        canvasJson,
        background: {
          type: "color",
          value: isDark ? theme.dark : theme.surface,
        },
      };
    })
  );

  const title = parsed.title || params.topic;
  const slides = await prisma.$transaction(async (tx) => {
    await tx.slide.deleteMany({ where: { presentationId: params.presentationId } });

    const createdSlides = [];
    for (const slide of preparedSlides) {
      createdSlides.push(
        await tx.slide.create({
          data: {
            presentationId: params.presentationId,
            position: slide.position,
            canvasJson: slide.canvasJson as object,
            background: slide.background,
          },
        })
      );
    }

    await tx.presentation.update({
      where: { id: params.presentationId },
      data: { title, slideCount: createdSlides.length },
    });

    return createdSlides;
  });

  return { slides, title, generated: true };
}

async function claimGeneration(presentationId: string): Promise<
  | { status: "claimed" }
  | { status: "exists"; slides: Awaited<ReturnType<typeof prisma.slide.findMany>> }
  | { status: "in_progress" }
> {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "Presentation" WHERE id = ${presentationId} FOR UPDATE`;

    const slides = await tx.slide.findMany({
      where: { presentationId },
      orderBy: { position: "asc" },
    });

    const hasRealContent = slides.some((slide) => {
      const canvasJson = slide.canvasJson;
      if (!canvasJson || typeof canvasJson !== "object" || Array.isArray(canvasJson)) return false;
      const json = canvasJson as Record<string, unknown>;
      if (json.generationStatus === GENERATION_MARKER) return false;
      return Array.isArray(json.objects) && json.objects.length > 0;
    });

    if (hasRealContent) return { status: "exists", slides };

    const markerSlide = slides.find((slide) => {
      const canvasJson = slide.canvasJson;
      if (!canvasJson || typeof canvasJson !== "object" || Array.isArray(canvasJson)) return false;
      return (canvasJson as Record<string, unknown>).generationStatus === GENERATION_MARKER;
    });
    if (markerSlide && !isStaleGenerationMarker(markerSlide.canvasJson)) {
      return { status: "in_progress" };
    }

    if (slides[0]) {
      await tx.slide.update({
        where: { id: slides[0].id },
        data: { canvasJson: generationMarker() },
      });
    } else {
      await tx.slide.create({
        data: {
          presentationId,
          position: 0,
          canvasJson: generationMarker(),
        },
      });
      await tx.presentation.update({
        where: { id: presentationId },
        data: { slideCount: 1 },
      });
    }

    return { status: "claimed" };
  });
}

function generationMarker() {
  return {
    generationStatus: GENERATION_MARKER,
    generationStartedAt: new Date().toISOString(),
  };
}

function isStaleGenerationMarker(canvasJson: unknown) {
  if (!canvasJson || typeof canvasJson !== "object" || Array.isArray(canvasJson)) return false;
  const startedAt = (canvasJson as Record<string, unknown>).generationStartedAt;
  if (typeof startedAt !== "string") return true;
  const startedTime = Date.parse(startedAt);
  if (!Number.isFinite(startedTime)) return true;
  return Date.now() - startedTime > GENERATION_MARKER_TTL_MS;
}
