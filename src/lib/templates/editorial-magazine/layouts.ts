import { W, H, hexToRgba, rct } from "../helpers";
import type { CanvasBuilder, SlideContent } from "../types";
import {
  EM,
  emCanvas,
  emHeadline,
  emKicker,
  emDeck,
  emByline,
  emRunningHeader,
  emDropCap,
  emBodyColumn,
  emPullQuote,
  emSidebar,
  emSectionNumber,
  emCaption,
  emDivider,
  emIssueLabel,
  emStatCallout,
  emImageSlot,
  emText,
} from "./helpers";

// Helper functions
function bodyText(c: SlideContent, fallback: string) {
  return c.body?.trim() || fallback;
}

function points(c: SlideContent, fallback: string[], max = 4) {
  return (c.points?.length ? c.points : fallback).slice(0, max);
}

function imageContent(c: SlideContent, fallback: string): SlideContent {
  return { ...c, imageQuery: c.imageQuery ?? c.imageAlt ?? c.heading ?? fallback };
}

// Smart text splitter that respects word boundaries
function splitTextSmart(text: string, parts: number): string[] {
  if (parts === 1) return [text];

  const words = text.split(/(\s+)/); // Split by whitespace but keep the spaces
  const totalLength = text.length;
  const targetLength = totalLength / parts;

  const result: string[] = [];
  let currentPart = '';
  let currentLength = 0;
  let partIndex = 0;

  for (const word of words) {
    if (partIndex >= parts - 1) {
      // Last part gets everything remaining
      currentPart += word;
    } else if (currentLength + word.length > targetLength && currentPart.length > 0) {
      // Move to next part if we've hit target length
      result.push(currentPart.trim());
      currentPart = word;
      currentLength = word.length;
      partIndex++;
    } else {
      currentPart += word;
      currentLength += word.length;
    }
  }

  // Add final part
  if (currentPart.trim()) {
    result.push(currentPart.trim());
  }

  // Pad with empty strings if needed
  while (result.length < parts) {
    result.push('');
  }

  return result.slice(0, parts);
}

function titleFs(text: string, base = 72) {
  if (text.length > 80) return Math.max(42, base - 30);
  if (text.length > 60) return Math.max(52, base - 20);
  if (text.length > 40) return Math.max(62, base - 10);
  return base;
}

function bodyFs(text: string, max = 17, min = 14) {
  if (text.length > 500) return min;
  if (text.length > 350) return Math.max(min, max - 2);
  if (text.length > 250) return Math.max(min, max - 1);
  return max;
}

function charsForBox(width: number, height: number, fontSize: number, lineHeight = 1.56) {
  const charsPerLine = Math.max(8, Math.floor(width / (fontSize * 0.54)));
  const lines = Math.max(1, Math.floor(height / (fontSize * lineHeight)));
  return Math.floor(charsPerLine * lines * 0.92);
}

function clampText(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;
  const sliced = text.slice(0, Math.max(0, maxChars - 1));
  const boundary = Math.max(sliced.lastIndexOf("."), sliced.lastIndexOf(";"), sliced.lastIndexOf(","), sliced.lastIndexOf(" "));
  const clean = sliced.slice(0, boundary > maxChars * 0.58 ? boundary : sliced.length).trim();
  return `${clean.replace(/[,:;.-]+$/, "")}...`;
}

function safeBody(text: string, width: number, height: number, fontSize: number, lineHeight = 1.56) {
  return clampText(text, charsForBox(width, height, fontSize, lineHeight));
}

function fittedBodyColumn(text: string, left: number, top: number, width: number, height: number, max = 16, min = 12) {
  const size = bodyFs(text, max, min);
  return emBodyColumn(safeBody(text, width, height, size), left, top, width, size);
}

function fittedText(p: {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
  fill?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: number;
}) {
  const lineHeight = p.lineHeight ?? 1.3;
  return emText({
    ...p,
    text: safeBody(p.text, p.width, p.height, p.fontSize, lineHeight),
    lineHeight,
  });
}

const accent = EM.electric; // Default accent color

// ── COVER LAYOUTS ──────────────────────────────────────────────────────

export const emCover: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Editorial Magazine";
  const deck = c.subheading ?? bodyText(c, "A modern take on long-form visual storytelling");
  const fs = titleFs(heading, 84);

  return emCanvas([
    ...emIssueLabel(c.label ?? "Feature Story", "2026", 60, 60),
    emHeadline(heading, 60, 180, 720, fs, accent),
    emDeck(deck, 60, 180 + (fs * 1.1) + 32, 680, 24),
    emDivider(60, 480, 320, accent),
    ...emByline(c.author ?? "Editorial Team", c.quote ?? "Spring 2026", 60, 520),
    ...emImageSlot({ ...imageContent(c, "editorial feature image"), x: 840, y: 100, w: 340, h: 520, accent }),
  ]);
};

export const emCoverBold: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Editorial Magazine";
  const deck = c.subheading ?? bodyText(c, "A modern take on long-form visual storytelling");
  const fs = titleFs(heading, 96);

  return emCanvas([
    ...emImageSlot({ ...imageContent(c, "editorial cover image"), x: 0, y: 0, w: W, h: 380, accent }),
    rct({ left: 0, top: 350, width: W, height: H - 350, fill: EM.white }),
    ...emKicker(c.label ?? "Feature", 60, 420, accent),
    emHeadline(heading, 60, 460, 1000, fs, accent),
    emDeck(deck, 64, 460 + (fs * 1.1) + 28, 880, 22),
  ]);
};

export const emCoverMinimal: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Editorial Magazine";
  const deck = c.subheading ?? bodyText(c, "A modern take on long-form visual storytelling");
  const fs = titleFs(heading, 80);

  return emCanvas([
    // Centered label
    emText({ text: (c.label ?? "In This Issue").toUpperCase(), left: 0, top: 160, width: W, fontSize: 12, fill: accent, fontWeight: "800", textAlign: "center" }),
    rct({ left: W / 2 - 20, top: 182, width: 40, height: 3, fill: accent }),

    // Centered headline
    {
      ...emHeadline(heading, 80, 210, W - 160, fs, accent),
      textAlign: "center",
    },

    // Centered divider
    rct({ left: W / 2 - 60, top: 210 + fs * 1.15 + 20, width: 120, height: 2, fill: accent }),

    // Centered deck
    emText({ text: deck, left: 200, top: 210 + fs * 1.15 + 44, width: W - 400, fontSize: 20, fill: EM.muted, textAlign: "center", lineHeight: 1.4, fontWeight: "400" }),

    // Bottom issue label
    emText({ text: c.quote ?? "Volume 1 · Issue 12", left: 0, top: H - 60, width: W, fontSize: 13, fill: EM.muted, textAlign: "center", fontWeight: "600" }),
  ]);
};

// ── FEATURE OPENER (text-heavy) ────────────────────────────────────────

export const emFeatureOpener: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "The Story Begins";
  const body = bodyText(c, "Every great piece starts with a compelling opening. This layout gives you space for a substantial introduction—up to 350 words—spread across elegant columns that mirror the best magazine layouts. The drop cap adds traditional editorial flair while the pull quote provides a visual anchor and teaser for what's ahead.");
  const fs = titleFs(heading, 52);
  const headerH = 56; // running header
  const headingTop = headerH + 16;
  const deckTop = headingTop + fs * 1.1 + 8;
  const dividerTop = deckTop + 28 + 12;
  const bodyTop = dividerTop + 24;

  // Two body columns + pull quote on right
  // Layout: [dropcap(80)] [col1(340)] [gap(20)] [col2(340)] [gap(20)] [pullquote(360)]
  // Total: 60 + 80 + 340 + 20 + 340 + 20 + 360 = 1220 (fits in 1280 with 60 left margin)
  const firstChar = body.charAt(0);
  const restOfText = body.substring(1);
  const [col1Text, col2Text] = splitTextSmart(restOfText, 2);
  const colFs = bodyFs(body, 16, 14);

  return emCanvas([
    ...emRunningHeader(c.label ?? "Feature", "01"),
    emHeadline(heading, 60, headingTop, 820, fs, accent),
    emDeck(c.subheading ?? "An exploration of ideas through visual storytelling", 60, deckTop, 820, 19),
    emDivider(60, dividerTop, 200, accent),

    // Drop cap + col1
    emDropCap(firstChar, 60, bodyTop, accent),
    fittedBodyColumn(col1Text, 150, bodyTop, 340, 620 - bodyTop, colFs, 12),

    // col2 continuation
    fittedBodyColumn(col2Text, 530, bodyTop, 340, 620 - bodyTop, colFs, 12),

    // Pull quote — right panel
    ...emPullQuote(c.quote ?? "The most important ideas deserve the most careful presentation", 910, bodyTop + 20, 330, accent),
  ]);
};

export const emFeatureOpenerWide: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "The Story Begins";
  const body = bodyText(c, "Every great piece starts with a compelling opening. This layout gives you maximum space for deep introductions. It's perfect for setting context, establishing stakes, or laying out complex arguments that need room to breathe. The wide format feels luxurious and gives your words the prominence they deserve.");
  const fs = titleFs(heading, 52);
  // Use label for kicker, subheading goes below headline as deck
  const deck = c.subheading ?? "";
  const headerH = 56;
  const headingTop = headerH + 20;
  const deckTop = headingTop + fs * 1.1 + 8;
  const hasDeck = deck.length > 0 && deck.length < 150;
  const dividerTop = hasDeck ? deckTop + 26 + 12 : headingTop + fs * 1.1 + 8;
  const bodyTop = dividerTop + 20;

  return emCanvas([
    ...emRunningHeader(c.label ?? "Feature", "01"),
    emHeadline(heading, 60, headingTop, 1160, fs, accent),
    ...(hasDeck ? [emDeck(deck, 60, deckTop, 1000, 19)] : []),
    emDivider(60, dividerTop, 200, accent),
    // Single wide text block with a hard visual fit.
    fittedBodyColumn(body, 60, bodyTop, 1160, 650 - bodyTop, 17, 14),
  ]);
};

// ── DATA STORY (stat + analysis text) ──────────────────────────────────

export const emDataStory: CanvasBuilder = (_t, c = {}) => {
  const stats = c.stats?.length ? c.stats : [
    { value: "84%", label: "of readers prefer long-form content when it's well designed" },
    { value: "2.4x", label: "higher engagement with editorial layouts vs generic slides" },
  ];
  const body = bodyText(c, "Numbers tell stories, but they need context to mean something. This layout pairs bold statistics with substantial analysis text—up to 300 words—so you can explain what the data means, why it matters, and what readers should take away from it.");

  // Smart split for two columns
  const [col1Text, col2Text] = splitTextSmart(body, 2);

  // Two analysis columns: 60 | 550 | 20 | 550 | 60 = 1240 + margins
  const colW2 = 550;
  return emCanvas([
    ...emRunningHeader(c.label ?? "Data & Analysis", "03"),
    emHeadline(c.heading ?? "By The Numbers", 60, 60, 700, 48, accent),

    // Stats side by side
    ...stats.slice(0, 2).map((s, i) => emStatCallout(s.value, s.label, 60 + i * 580, 160, i === 0 ? accent : EM.magenta)).flat(),

    // Analysis text in two full columns with vertical fit.
    fittedBodyColumn(col1Text, 60, 400, colW2, 255, 16, 13),
    fittedBodyColumn(col2Text, 60 + colW2 + 20, 400, colW2, 255, 16, 13),
  ]);
};

// ── INTERVIEW / Q&A FORMAT ─────────────────────────────────────────────

export const emInterview: CanvasBuilder = (_t, c = {}) => {
  const qa = points(c, [
    "What drives your approach to this work?",
    "Where do you see the biggest opportunities for change?",
    "How do you balance competing priorities?",
  ], 3);
  const body = bodyText(c, "The traditional Q&A format creates natural rhythm and makes long conversations readable. Each question gets bold typography treatment while answers flow in comfortable body text. This can handle substantial exchanges—up to 400 words total.");

  return emCanvas([
    ...emRunningHeader(c.label ?? "Interview", "05"),
    ...emKicker("In Conversation", 60, 96, accent),
    emHeadline(c.heading ?? c.author ?? "Sarah Chen", 60, 132, 680, 56, accent),
    emDeck(c.subheading ?? c.quote ?? "Product designer and editorial strategist", 60, 228, 520, 18),

    // Q&A items
    ...qa.map((q, i) => {
      const y = 300 + i * 120;
      return [
        emText({ text: "Q", left: 60, top: y, width: 40, fontSize: 32, fill: accent, fontWeight: "900" }),
        fittedText({ text: q, left: 110, top: y + 2, width: 620, height: 42, fontSize: 17, fill: EM.ink, fontWeight: "700", lineHeight: 1.34 }),
        fittedText({ text: body, left: 110, top: y + 52, width: 620, height: 58, fontSize: 14, fill: EM.ink, lineHeight: 1.44 }),
      ];
    }).flat(),
  ]);
};

// ── SIDEBAR FEATURE ────────────────────────────────────────────────────

export const emSidebarFeature: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "Sometimes you need to tell two stories at once. The main column gets the primary narrative while the sidebar holds related information, context, or a parallel story. Perfect for historical background or expert commentary that enhances the main flow.");
  const sidebarText = c.quote ?? "Related context or parallel story goes here, creating a second narrative thread.";

  // Sidebar title: use subheading but cap at 60 chars to prevent overflow
  const rawTitle = c.subheading ?? "Related";
  const sidebarTitle = rawTitle.length > 60 ? rawTitle.substring(0, 57).trimEnd() + "…" : rawTitle;

  // Layout: fixed safe gap between narrative and sidebar.
  const mainW = 600;
  const sidebarX = 760;
  const sidebarW = 460;
  const headingFs = titleFs(c.heading ?? "", 48);
  const headingBottom = 56 + headingFs * 1.04;
  const bodyTop = Math.min(260, headingBottom + 22);
  const bodyH = 650 - bodyTop;

  return emCanvas([
    ...emRunningHeader(c.label ?? "Feature", "07"),
    emHeadline(c.heading ?? "Main Story + Context", 60, 56, mainW, headingFs, accent),
    emDivider(60, headingBottom + 4, 180, accent),

    // Single main column with bounded text, so it never disappears under the sidebar.
    fittedBodyColumn(body, 60, bodyTop, mainW, bodyH, 16, 12),

    // Sidebar
    ...emSidebar(sidebarX, 40, sidebarW, 640, EM.magenta),
    emText({ text: "CONTEXT", left: sidebarX + 28, top: 72, width: sidebarW - 56, fontSize: 11, fill: EM.magenta, fontWeight: "800" }),
    fittedText({ text: sidebarTitle, left: sidebarX + 28, top: 92, width: sidebarW - 56, height: 82, fontSize: 20, fill: EM.ink, fontWeight: "800", lineHeight: 1.18 }),
    emDivider(sidebarX + 28, 180, 100, EM.magenta),
    fittedBodyColumn(sidebarText, sidebarX + 28, 206, sidebarW - 56, 415, 15, 12),
  ]);
};

// ── PHOTO ESSAY (image-heavy with long captions) ───────────────────────

export const emPhotoEssay: CanvasBuilder = (_t, c = {}) => {
  const caption = bodyText(c, "Great photojournalism needs great captions. This layout gives you space for substantial image descriptions—up to 250 words—that can provide context, tell backstories, or explain what you're seeing. The editorial caption style makes even long descriptions feel natural.");

  // Use different image queries for variety
  const mainImageQuery = c.imageQuery ?? c.heading ?? "editorial photo essay main image";
  const detail1Query = c.subheading ?? c.quote?.substring(0, 50) ?? "detail view closeup";
  const detail2Query = c.author ?? "context establishing shot";

  return emCanvas([
    ...emRunningHeader(c.label ?? "Photo Essay", "09"),

    // Large main image
    ...emImageSlot({ imageQuery: mainImageQuery, x: 60, y: 80, w: 700, h: 420, accent }),

    // Two smaller images with different queries
    ...emImageSlot({ imageQuery: detail1Query, x: 780, y: 80, w: 340, h: 200, accent: EM.magenta }),
    ...emImageSlot({ imageQuery: detail2Query, x: 780, y: 300, w: 340, h: 200, accent: EM.emerald }),

    // Long caption with bounded text.
    emCaption(safeBody(caption, 1060, 112, 13, 1.42), 60, 520, 1060),
  ]);
};

// ── PULL QUOTE SPREAD ──────────────────────────────────────────────────

export const emQuoteSpread: CanvasBuilder = (_t, c = {}) => {
  const quote = c.quote ?? "The most powerful insights often come from the simplest observations about human nature and the world we build around ourselves.";
  const body = bodyText(c, "Sometimes a single thought deserves a full page. This layout centers a powerful quote while surrounding it with context and analysis. Up to 200 words of supporting text explain where the quote comes from, why it matters, and what it reveals.");

  return emCanvas([
    ...emRunningHeader(c.label ?? "Insight", "11"),

    // Large centered quote
    emText({ text: '"', left: W / 2 - 60, top: 100, width: 120, fontSize: 180, fill: hexToRgba(accent, 0.15), fontWeight: "900", textAlign: "center" }),
    {
      ...emText({ text: quote, left: 180, top: 220, width: W - 360, fontSize: 38, fill: EM.ink, fontWeight: "700", lineHeight: 1.32, textAlign: "center" }),
      fontFamily: "Georgia, serif",
    },

    // Attribution
    emDivider(W / 2 - 80, 440, 160, accent),
    emText({ text: c.author ?? c.heading ?? "Editorial Note", left: 0, top: 468, width: W, fontSize: 16, fill: EM.muted, fontWeight: "600", textAlign: "center" }),

    // Context text
    fittedBodyColumn(body, 280, 540, 720, 100, 15, 12),
  ]);
};

// ── SECTION BREAK ──────────────────────────────────────────────────────

export const emSectionBreak: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Next Chapter";
  const fs = titleFs(heading, 72);
  // Use subheading only for the deck — never body (which is long prose)
  const deck = c.subheading && c.subheading.length < 120 ? c.subheading : undefined;

  return emCanvas([
    ...emKicker(c.label ?? "Part Two", 60, 180, accent),
    emHeadline(heading, 60, 230, 1000, fs, accent),
    ...(deck ? [emDeck(deck, 60, 230 + fs * 1.1 + 16, 800, 22)] : []),
    emDivider(60, 580, 480, accent),
  ]);
};

// ── CONCLUSION (wrap-up with key takeaways) ────────────────────────────

export const emConclusion: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "Every great piece needs a strong finish. This conclusion layout gives you room for final thoughts, synthesis, and forward-looking statements—up to 350 words. The three-column format creates a sense of completeness while the pull quote can highlight your ultimate takeaway.");
  const takeaways = points(c, [
    "First key takeaway from the entire piece",
    "Second important lesson or insight",
    "Final thought or call to reflection",
  ], 3);

  // Smart split into three columns
  const [col1Text, col2Text, col3Text] = splitTextSmart(body, 3);

  // 3 equal columns: 60 | 373 | 20 | 373 | 20 | 373 | 60
  const cColW = 373;
  const cGap = 20;

  return emCanvas([
    ...emRunningHeader(c.label ?? "Conclusion", "12"),
    ...emKicker("Final Thoughts", 60, 56, accent),
    emHeadline(c.heading ?? "Where We Stand", 60, 92, 900, 48, accent),
    emDivider(60, 92 + 48 * 1.1 + 8, 200, accent),

    // Three-column conclusion text (flowing), bounded above the takeaway row.
    fittedBodyColumn(col1Text, 60, 210, cColW, 330, 15, 12),
    fittedBodyColumn(col2Text, 60 + cColW + cGap, 210, cColW, 330, 15, 12),
    fittedBodyColumn(col3Text, 60 + (cColW + cGap) * 2, 210, cColW, 330, 15, 12),

    // Key takeaways at bottom
    ...takeaways.map((t, i) => [
      rct({ left: 60 + i * 393, top: 580, width: 353, height: 2, fill: i === 0 ? accent : i === 1 ? EM.magenta : EM.emerald }),
      emText({ text: `${i + 1}`, left: 60 + i * 393, top: 596, width: 36, fontSize: 20, fill: i === 0 ? accent : i === 1 ? EM.magenta : EM.emerald, fontWeight: "900" }),
      fittedText({ text: t, left: 104 + i * 393, top: 598, width: 300, height: 70, fontSize: 13, fill: EM.ink, lineHeight: 1.34, fontWeight: "600" }),
    ]).flat(),
  ]);
};

// ── LIST FEATURE (numbered insights) ───────────────────────────────────

export const emListFeature: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, [
    "First major insight or principle",
    "Second key observation",
    "Third important element",
    "Fourth critical factor",
  ], 4);
  const body = bodyText(c, "Sometimes the best way to structure information is a clear numbered list. But this isn't a basic bullet list—each item gets space for 40-60 words of explanation.");

  return emCanvas([
    ...emRunningHeader(c.label ?? "Analysis", "06"),
    emHeadline(c.heading ?? "Four Key Insights", 60, 100, 700, 56, accent),
    emDeck(c.subheading ?? body.substring(0, 120), 60, 200, 640, 18),

    ...items.map((item, i) => {
      const y = 280 + i * 90;
      const itemAccent = [accent, EM.magenta, EM.emerald, EM.amber][i];
      return [
        rct({ left: 60, top: y, width: 80, height: 64, fill: hexToRgba(itemAccent, 0.1), rx: 2 }),
        emText({ text: `${i + 1}`, left: 80, top: y + 14, width: 40, fontSize: 32, fill: itemAccent, fontWeight: "900", textAlign: "center" }),
        fittedText({ text: item, left: 160, top: y + 6, width: 520, height: 35, fontSize: 19, fill: EM.ink, fontWeight: "700", lineHeight: 1.25 }),
        fittedBodyColumn(body, 160, y + 42, 520, 38, 13, 11),
      ];
    }).flat(),
  ]);
};
