import { W, H, rct, cir, hexToRgba } from "../helpers";
import { iconToFabric } from "../icons";
import type { CanvasBuilder, SlideContent } from "../types";
import { adCanvas, adText, adTitle, adHeader, adCard, adBullet, adRule, adImageSlot, adArrow } from "./helpers";

function body(c: SlideContent, fallback: string) {
  return c.body?.trim() || fallback;
}

function points(c: SlideContent, fallback: string[], max = 4) {
  return (c.points?.length ? c.points : fallback).slice(0, max);
}

function steps(c: SlideContent, fallback: string[], max = 5) {
  return (c.steps?.length ? c.steps : c.points?.length ? c.points : fallback).slice(0, max);
}

function stats(c: SlideContent, fallback: Array<{ value: string; label: string }>, max = 4) {
  return (c.stats?.length ? c.stats : fallback).slice(0, max);
}

function left(c: SlideContent, fallback: string[]) {
  return (c.leftPoints?.length ? c.leftPoints : fallback).slice(0, 4);
}

function right(c: SlideContent, fallback: string[]) {
  return (c.rightPoints?.length ? c.rightPoints : fallback).slice(0, 4);
}

function colors(t: { dark: string; accent: string; surface: string }) {
  return [t.accent, t.dark, "#0F766E", "#B7791F", "#BE3455"];
}

function imageContent(c: SlideContent, fallback: string): SlideContent {
  return { ...c, imageQuery: c.imageQuery ?? c.imageAlt ?? c.heading ?? fallback };
}

// ── COVER VARIANTS ────────────────────────────────────────────────────────

export const adGradientCover: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  rct({ left: 0, top: 0, width: W, height: H, fill: t.dark }),
  rct({ left: 0, top: 0, width: W, height: H, fill: hexToRgba(t.accent, 0.12) }),
  cir({ left: W - 100, top: -80, radius: 340, fill: hexToRgba(t.accent, 0.15) }),
  cir({ left: -120, top: H - 40, radius: 220, fill: hexToRgba(t.accent, 0.08) }),
  adText(t, { text: (c.label ?? "PRESENTATION").toUpperCase(), left: 0, top: 180, width: W, fontSize: 12, fill: t.accent, fontWeight: "900", textAlign: "center", mode: "dark" }),
  adTitle(t, c.heading ?? "Untitled Deck", 80, 220, W - 160, 160, 72, "dark", "center"),
  adRule(W / 2 - 160, 420, 320, t.accent, 4),
  adText(t, { text: c.subheading ?? body(c, "Subtitle goes here"), left: 120, top: 450, width: W - 240, height: 80, fontSize: 22, fill: "rgba(255,255,255,0.72)", lineHeight: 1.3, textAlign: "center", mode: "dark" }),
], "dark");

export const adMinimalCover: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, ""),
  adTitle(t, c.heading ?? "Untitled Deck", 0, 220, W, 140, 68, "light", "center"),
  adText(t, { text: c.subheading ?? body(c, "A clear subtitle"), left: 0, top: 400, width: W, height: 56, fontSize: 22, fill: hexToRgba(t.dark, 0.6), textAlign: "center", lineHeight: 1.3 }),
  adRule(W / 2 - 60, 480, 120, t.accent, 3),
]);

export const adSplitImageCover: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  rct({ left: 0, top: 0, width: 600, height: H, fill: t.dark }),
  ...adImageSlot(t, { ...imageContent(c, "topic hero image"), x: 600, y: 0, w: 680, h: H, color: t.accent, mode: "dark" }),
  adText(t, { text: (c.label ?? "VISUAL STORY").toUpperCase(), left: 60, top: 200, width: 440, fontSize: 12, fill: t.accent, fontWeight: "900", mode: "dark" }),
  adTitle(t, c.heading ?? "Untitled Deck", 60, 240, 500, 160, 58, "dark"),
  adText(t, { text: c.subheading ?? body(c, "A visual-first presentation approach"), left: 64, top: 430, width: 460, height: 80, fontSize: 19, fill: "rgba(255,255,255,0.7)", lineHeight: 1.32, mode: "dark" }),
  adRule(64, 540, 260, t.accent, 4),
], "dark");

// ── CONTENT LAYOUTS ───────────────────────────────────────────────────────

export const adNumberedList: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["First insight", "Second insight", "Third insight", "Fourth insight"], 5);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Key Points", 72, 80, 700, 70, 42),
    adText(t, { text: body(c, "A structured walkthrough of the main points."), left: 76, top: 160, width: 800, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    ...items.map((item, i) => {
      const y = 270 + i * 85;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: 88, top: y + 12, size: 26, fill: colors(t)[i], opacity: 0.8 }) : null;
      return [
        rct({ left: 76, top: y, width: 50, height: 50, fill: hexToRgba(colors(t)[i], 0.14), rx: 25 }),
        ...(icon ? [icon] : [adText(t, { text: String(i + 1), left: 76, top: y + 12, width: 50, height: 30, fontSize: 20, fill: colors(t)[i], fontWeight: "900", textAlign: "center" })]),
        adText(t, { text: item, left: 148, top: y + 12, width: 1000, height: 38, fontSize: 19, fill: t.dark, fontWeight: "750" }),
      ];
    }).flat(),
  ]);
};

export const adIconGrid: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["First item", "Second item", "Third item", "Fourth item", "Fifth item", "Sixth item"], 6);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "At a Glance", 72, 80, 700, 70, 42),
    ...items.map((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 100 + col * 380;
      const y = 240 + row * 200;
      return [
        cir({ left: x + 16, top: y + 16, radius: 24, fill: hexToRgba(colors(t)[i % 5], 0.14) }),
        adText(t, { text: item, left: x, top: y + 72, width: 320, height: 48, fontSize: 17, fill: t.dark, fontWeight: "750", lineHeight: 1.3 }),
      ];
    }).flat(),
  ]);
};

export const adTwoColumn: CanvasBuilder = (t, c = {}) => {
  const l = left(c, ["Point A", "Point B", "Point C"]);
  const r = right(c, ["Detail A", "Detail B", "Detail C"]);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Two Perspectives", 72, 80, 800, 70, 42),
    adText(t, { text: body(c, "Comparing two dimensions of the topic."), left: 76, top: 160, width: 900, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    rct({ left: W / 2 - 1, top: 260, width: 2, height: 380, fill: hexToRgba(t.dark, 0.1) }),
    adText(t, { text: c.subheading ?? "Left Column", left: 76, top: 260, width: 520, height: 34, fontSize: 20, fill: t.accent, fontWeight: "850" }),
    ...l.map((p, i) => adBullet(t, p, 92, 310 + i * 54, 500, t.accent, 38)).flat(),
    adText(t, { text: c.quote ?? "Right Column", left: 680, top: 260, width: 520, height: 34, fontSize: 20, fill: colors(t)[2], fontWeight: "850" }),
    ...r.map((p, i) => adBullet(t, p, 696, 310 + i * 54, 500, colors(t)[2], 38)).flat(),
  ]);
};

export const adFunnel: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Awareness", "Interest", "Evaluation", "Decision"], 5);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Conversion Funnel", 72, 80, 700, 70, 42),
    adText(t, { text: body(c, "How the process narrows from broad input to focused outcome."), left: 76, top: 160, width: 800, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    ...items.map((item, i) => {
      const maxW = 900;
      const w = maxW - i * (maxW / items.length) * 0.6;
      const x = (W - w) / 2;
      const y = 270 + i * 95;
      return [
        rct({ left: x, top: y, width: w, height: 68, fill: hexToRgba(colors(t)[i], 0.12), rx: 8 }),
        rct({ left: x, top: y, width: 5, height: 68, fill: colors(t)[i], rx: 2 }),
        adText(t, { text: item, left: x + 24, top: y + 20, width: w - 48, height: 32, fontSize: 18, fill: t.dark, fontWeight: "780", textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const adPyramid: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Foundation", "Structure", "Execution", "Excellence"], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Priority Hierarchy", 72, 80, 700, 70, 42),
    adText(t, { text: body(c, "Each level builds on the one beneath it."), left: 76, top: 160, width: 800, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    ...items.map((item, i) => {
      const reversed = items.length - 1 - i;
      const w = 300 + reversed * 180;
      const x = (W - w) / 2;
      const y = 310 + i * 95;
      return [
        rct({ left: x, top: y, width: w, height: 70, fill: hexToRgba(colors(t)[i], 0.12), rx: 6 }),
        adText(t, { text: item, left: x, top: y + 20, width: w, height: 34, fontSize: 18, fill: t.dark, fontWeight: "800", textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const adProsCons: CanvasBuilder = (t, c = {}) => {
  const pros = left(c, ["Advantage one", "Advantage two", "Advantage three"]);
  const cons = right(c, ["Drawback one", "Drawback two", "Drawback three"]);
  const green = "#0F766E";
  const red = "#BE3455";
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Tradeoffs", 72, 80, 800, 70, 42),
    ...adCard(t, 72, 220, 550, 420, green),
    ...adCard(t, 660, 220, 550, 420, red),
    adText(t, { text: "ADVANTAGES", left: 110, top: 252, width: 470, fontSize: 12, fill: green, fontWeight: "900" }),
    adText(t, { text: "DRAWBACKS", left: 698, top: 252, width: 470, fontSize: 12, fill: red, fontWeight: "900" }),
    ...pros.map((p, i) => adBullet(t, p, 110, 295 + i * 64, 470, green, 48)).flat(),
    ...cons.map((p, i) => adBullet(t, p, 698, 295 + i * 64, 470, red, 48)).flat(),
  ]);
};

export const adQuoteCard: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "", "dark"),
  rct({ left: 180, top: 140, width: W - 360, height: 420, fill: "rgba(255,255,255,0.06)", rx: 16 }),
  adText(t, { text: '"', left: W / 2 - 40, top: 160, width: 80, fontSize: 140, fill: hexToRgba(t.accent, 0.35), textAlign: "center", fontWeight: "900", mode: "dark" }),
  adText(t, { text: c.quote ?? c.heading ?? "A meaningful insight that deserves its own space.", left: 240, top: 260, width: W - 480, height: 140, fontSize: 34, fill: t.surface, fontWeight: "800", textAlign: "center", lineHeight: 1.22, mode: "dark" }),
  adRule(W / 2 - 80, 430, 160, t.accent, 3),
  adText(t, { text: c.author ?? c.subheading ?? "Source", left: 240, top: 460, width: W - 480, height: 36, fontSize: 16, fill: "rgba(255,255,255,0.6)", textAlign: "center", fontWeight: "700", mode: "dark" }),
  adText(t, { text: body(c, "Context for why this quote matters."), left: 240, top: 510, width: W - 480, height: 60, fontSize: 16, fill: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.32, mode: "dark" }),
], "dark");

export const adBigNumber: CanvasBuilder = (t, c = {}) => {
  const data = stats(c, [{ value: "47%", label: "of the target metric" }], 1);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adText(t, { text: data[0].value, left: 0, top: 140, width: W, height: 200, fontSize: 160, fill: t.accent, fontWeight: "900", textAlign: "center" }),
    adText(t, { text: data[0].label, left: 200, top: 370, width: W - 400, height: 50, fontSize: 24, fill: hexToRgba(t.dark, 0.7), textAlign: "center", fontWeight: "750" }),
    adRule(W / 2 - 80, 440, 160, t.accent, 3),
    adText(t, { text: body(c, "The context behind the number."), left: 200, top: 480, width: W - 400, height: 100, fontSize: 18, fill: hexToRgba(t.dark, 0.6), textAlign: "center", lineHeight: 1.36 }),
  ]);
};

export const adTeamGrid: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Team Lead", "Designer", "Engineer", "Analyst"], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "The Team", 72, 80, 700, 70, 42),
    ...items.map((item, i) => {
      const x = 100 + i * 280;
      return [
        cir({ left: x + 90, top: 285, radius: 36, fill: hexToRgba(colors(t)[i], 0.14) }),
        adText(t, { text: item, left: x, top: 370, width: 230, fontSize: 18, fill: t.dark, fontWeight: "800", textAlign: "center" }),
        adText(t, { text: body(c, "Role description").substring(0, 60), left: x, top: 410, width: 230, fontSize: 16, fill: hexToRgba(t.dark, 0.6), textAlign: "center", lineHeight: 1.3 }),
      ];
    }).flat(),
  ]);
};

export const adPhotoGrid: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, ""),
  adTitle(t, c.heading ?? "Visual Evidence", 72, 65, 700, 64, 42),
  ...adImageSlot(t, { ...imageContent(c, "primary scene"), x: 72, y: 140, w: 730, h: 440, color: t.accent }),
  ...adImageSlot(t, { imageQuery: c.subheading ?? "detail view", x: 820, y: 140, w: 380, h: 210, color: colors(t)[2] }),
  ...adImageSlot(t, { imageQuery: c.quote ?? "context shot", x: 820, y: 370, w: 380, h: 210, color: colors(t)[3] }),
]);

export const adFullImage: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adImageSlot(t, { ...imageContent(c, "immersive scene"), x: 0, y: 0, w: W, h: H, color: t.accent }),
  rct({ left: 0, top: H - 200, width: W, height: 200, fill: "rgba(0,0,0,0.55)" }),
  adText(t, { text: c.heading ?? "Immersive Visual", left: 60, top: H - 170, width: W - 120, height: 60, fontSize: 36, fill: "#FFFFFF", fontWeight: "850", mode: "dark" }),
  adText(t, { text: c.subheading ?? body(c, "Caption or context"), left: 60, top: H - 100, width: W - 120, height: 44, fontSize: 17, fill: "rgba(255,255,255,0.8)", mode: "dark" }),
], "dark");

// ── DATA / ANALYTICS LAYOUTS ──────────────────────────────────────────────

export const adBarChart: CanvasBuilder = (t, c = {}) => {
  const data = stats(c, [
    { value: "72%", label: "Category A" },
    { value: "58%", label: "Category B" },
    { value: "91%", label: "Category C" },
    { value: "45%", label: "Category D" },
  ], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Performance Overview", 72, 80, 700, 70, 42),
    adText(t, { text: body(c, "How the key metrics compare."), left: 76, top: 160, width: 800, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    ...data.map((s, i) => {
      const y = 270 + i * 100;
      const pct = parseInt(s.value) || 50;
      const barW = Math.max(60, (pct / 100) * 700);
      return [
        adText(t, { text: s.label, left: 80, top: y + 8, width: 200, height: 30, fontSize: 15, fill: hexToRgba(t.dark, 0.7), fontWeight: "700" }),
        rct({ left: 300, top: y + 8, width: 740, height: 34, fill: hexToRgba(t.dark, 0.06), rx: 4 }),
        rct({ left: 300, top: y + 8, width: barW, height: 34, fill: hexToRgba(colors(t)[i], 0.7), rx: 4 }),
        adText(t, { text: s.value, left: 300 + barW + 12, top: y + 10, width: 80, height: 30, fontSize: 16, fill: colors(t)[i], fontWeight: "900" }),
      ];
    }).flat(),
  ]);
};

export const adScorecard: CanvasBuilder = (t, c = {}) => {
  const data = stats(c, [
    { value: "92", label: "Customer Score" },
    { value: "3.8x", label: "Efficiency" },
    { value: "24%", label: "Growth Rate" },
  ], 3);
  return adCanvas(t, [
    ...adHeader(t, c.label, "", "dark"),
    adTitle(t, c.heading ?? "Scorecard", 72, 100, 700, 80, 50, "dark"),
    adText(t, { text: body(c, "Key performance indicators at a glance."), left: 76, top: 190, width: 800, height: 50, fontSize: 17, fill: "rgba(255,255,255,0.65)", lineHeight: 1.3, mode: "dark" }),
    ...data.map((s, i) => {
      const x = 120 + i * 370;
      return [
        rct({ left: x, top: 290, width: 320, height: 280, fill: "rgba(255,255,255,0.06)", rx: 12 }),
        adText(t, { text: s.value, left: x, top: 340, width: 320, height: 80, fontSize: 56, fill: colors(t)[i], fontWeight: "900", textAlign: "center" }),
        adText(t, { text: s.label, left: x + 20, top: 440, width: 280, height: 40, fontSize: 16, fill: "rgba(255,255,255,0.7)", textAlign: "center", fontWeight: "750", mode: "dark" }),
        adRule(x + 80, 500, 160, colors(t)[i], 3),
      ];
    }).flat(),
  ], "dark");
};

export const adGaugeMetrics: CanvasBuilder = (t, c = {}) => {
  const data = stats(c, [
    { value: "85%", label: "Completion" },
    { value: "4.2", label: "Rating" },
    { value: "+18%", label: "Growth" },
    { value: "97%", label: "Uptime" },
  ], 4);
  const hasIcons = c.icons && c.icons.length >= data.length;
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Status Report", 72, 80, 700, 70, 42),
    ...data.map((s, i) => {
      const x = 80 + i * 290;
      const iconObj = hasIcons ? iconToFabric({ name: c.icons![i], left: x + 112, top: 260, size: 36, fill: colors(t)[i], opacity: 0.5 }) : null;
      return [
        rct({ left: x, top: 240, width: 260, height: 340, fill: "#FFFFFF", rx: 12 }),
        rct({ left: x, top: 240, width: 260, height: 4, fill: colors(t)[i], rx: 2 }),
        ...(iconObj ? [iconObj] : []),
        adText(t, { text: s.value, left: x, top: iconObj ? 310 : 290, width: 260, fontSize: 48, fill: colors(t)[i], fontWeight: "900", textAlign: "center" }),
        adText(t, { text: s.label, left: x + 20, top: iconObj ? 400 : 380, width: 220, fontSize: 16, fill: hexToRgba(t.dark, 0.65), textAlign: "center", fontWeight: "700" }),
        adRule(x + 70, 500, 120, colors(t)[i], 3),
      ];
    }).flat(),
  ]);
};

// ── NARRATIVE / EDITORIAL ─────────────────────────────────────────────────

export const adStoryBlock: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, ""),
  adTitle(t, c.heading ?? "The Story", 72, 80, 1100, 70, 42),
  adRule(76, 160, 200, t.accent, 4),
  adText(t, { text: body(c, "A narrative paragraph that gives the audience context, stakes, and direction."), left: 76, top: 185, width: 1100, fontSize: 18, fill: hexToRgba(t.dark, 0.72), lineHeight: 1.56 }),
]);

export const adHighlight: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, ""),
  rct({ left: 60, top: 100, width: W - 120, height: 520, fill: hexToRgba(t.accent, 0.06), rx: 14 }),
  rct({ left: 60, top: 100, width: 6, height: 520, fill: t.accent, rx: 3 }),
  adTitle(t, c.heading ?? "Key Highlight", 110, 140, 1000, 80, 44),
  adText(t, { text: body(c, "An important point that needs emphasis and visual weight."), left: 114, top: 250, width: 1000, fontSize: 20, fill: hexToRgba(t.dark, 0.7), lineHeight: 1.52 }),
]);

export const adCallToAction: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "", "dark"),
  adText(t, { text: (c.label ?? "NEXT STEP").toUpperCase(), left: 0, top: 180, width: W, fontSize: 13, fill: t.accent, fontWeight: "900", textAlign: "center", mode: "dark" }),
  adTitle(t, c.heading ?? "Ready to Move Forward?", 120, 220, W - 240, 120, 56, "dark"),
  adRule(W / 2 - 100, 380, 200, t.accent, 4),
  adText(t, { text: body(c, "The specific action for the audience."), left: 200, top: 420, width: W - 400, height: 100, fontSize: 20, fill: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.36, mode: "dark" }),
  rct({ left: W / 2 - 140, top: 540, width: 280, height: 54, fill: t.accent, rx: 8 }),
  adText(t, { text: c.quote ?? "Take Action", left: W / 2 - 140, top: 556, width: 280, height: 30, fontSize: 17, fill: "#FFFFFF", fontWeight: "800", textAlign: "center", mode: "dark" }),
], "dark");

export const adThankYou: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "", "dark"),
  cir({ left: W / 2 - 200, top: 100, radius: 250, fill: hexToRgba(t.accent, 0.1) }),
  adTitle(t, c.heading ?? "Thank You", 0, 240, W, 120, 72, "dark"),
  adText(t, { text: c.subheading ?? body(c, "Questions and discussion"), left: 0, top: 400, width: W, height: 50, fontSize: 22, fill: "rgba(255,255,255,0.65)", textAlign: "center", mode: "dark" }),
  adRule(W / 2 - 60, 470, 120, t.accent, 3),
  adText(t, { text: c.quote ?? "contact@example.com", left: 0, top: 510, width: W, height: 36, fontSize: 16, fill: "rgba(255,255,255,0.5)", textAlign: "center", mode: "dark" }),
], "dark");

// ── PROCESS / FLOW LAYOUTS ────────────────────────────────────────────────

export const adCircularProcess: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Plan", "Build", "Test", "Ship"], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Cycle", 72, 80, 500, 70, 42),
    adText(t, { text: body(c, "A repeating process that feeds back into itself."), left: 76, top: 160, width: 500, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    cir({ left: W / 2 + 100, top: H / 2 - 20, radius: 180, fill: hexToRgba(t.accent, 0.06) }),
    ...items.map((item, i) => {
      const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      const cx = W / 2 + 100 + Math.cos(angle) * 140;
      const cy = H / 2 - 20 + Math.sin(angle) * 140;
      return [
        cir({ left: cx - 30, top: cy - 30, radius: 30, fill: hexToRgba(colors(t)[i], 0.18) }),
        adText(t, { text: String(i + 1), left: cx - 12, top: cy - 12, width: 24, height: 24, fontSize: 16, fill: colors(t)[i], fontWeight: "900", textAlign: "center" }),
        adText(t, { text: item, left: cx - 60, top: cy + 40, width: 120, height: 36, fontSize: 16, fill: t.dark, fontWeight: "750", textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const adVerticalSteps: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Step one", "Step two", "Step three", "Step four"], 5);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Step by Step", 72, 80, 480, 70, 42),
    adText(t, { text: body(c, "A clear sequence from start to finish."), left: 76, top: 160, width: 460, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    rct({ left: 620, top: 130, width: 3, height: 460, fill: hexToRgba(t.dark, 0.1) }),
    ...items.map((item, i) => {
      const y = 140 + i * (440 / Math.max(items.length - 1, 1));
      return [
        cir({ left: 612, top: y, radius: 12, fill: colors(t)[i] }),
        adText(t, { text: String(i + 1).padStart(2, "0"), left: 650, top: y - 8, width: 50, height: 28, fontSize: 18, fill: colors(t)[i], fontWeight: "900" }),
        adText(t, { text: item, left: 710, top: y - 8, width: 480, height: 36, fontSize: 18, fill: t.dark, fontWeight: "750" }),
      ];
    }).flat(),
  ]);
};

export const adRoadmap: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Q1: Foundation", "Q2: Growth", "Q3: Scale", "Q4: Optimize"], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, "", "dark"),
    adTitle(t, c.heading ?? "Roadmap", 72, 100, 700, 80, 50, "dark"),
    adText(t, { text: body(c, "Key milestones on the path forward."), left: 76, top: 190, width: 800, height: 50, fontSize: 17, fill: "rgba(255,255,255,0.65)", lineHeight: 1.3, mode: "dark" }),
    adRule(100, 320, W - 200, "rgba(255,255,255,0.15)", 3),
    ...items.map((item, i) => {
      const x = 140 + i * 270;
      return [
        cir({ left: x, top: 312, radius: 12, fill: colors(t)[i] }),
        rct({ left: x - 50, top: 360, width: 220, height: 180, fill: "rgba(255,255,255,0.06)", rx: 10 }),
        adText(t, { text: item, left: x - 40, top: 400, width: 200, height: 80, fontSize: 16, fill: t.surface, fontWeight: "750", textAlign: "center", lineHeight: 1.28, mode: "dark" }),
      ];
    }).flat(),
  ], "dark");
};

// ── COMPARISON / DECISION ─────────────────────────────────────────────────

export const adVersus: CanvasBuilder = (t, c = {}) => {
  const l = left(c, ["Approach A point 1", "Approach A point 2"]);
  const r = right(c, ["Approach B point 1", "Approach B point 2"]);
  return adCanvas(t, [
    ...adHeader(t, c.label, "", "dark"),
    rct({ left: 0, top: 0, width: W / 2, height: H, fill: t.dark }),
    rct({ left: W / 2, top: 0, width: W / 2, height: H, fill: t.surface }),
    cir({ left: W / 2 - 30, top: H / 2 - 30, radius: 30, fill: t.accent }),
    adText(t, { text: "VS", left: W / 2 - 30, top: H / 2 - 14, width: 60, height: 28, fontSize: 16, fill: "#FFFFFF", fontWeight: "900", textAlign: "center", mode: "dark" }),
    adText(t, { text: c.subheading ?? "Option A", left: 60, top: 130, width: 500, height: 40, fontSize: 28, fill: t.surface, fontWeight: "850", mode: "dark" }),
    ...l.map((p, i) => adBullet(t, p, 80, 220 + i * 64, 480, t.accent, 48, "dark")).flat(),
    adText(t, { text: c.quote ?? "Option B", left: W / 2 + 60, top: 130, width: 500, height: 40, fontSize: 28, fill: t.dark, fontWeight: "850" }),
    ...r.map((p, i) => adBullet(t, p, W / 2 + 80, 220 + i * 64, 480, colors(t)[2], 48)).flat(),
  ], "dark");
};

export const adDecisionTree: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["If condition A → action 1", "If condition B → action 2", "Otherwise → action 3"], 3);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Decision Logic", 72, 80, 700, 70, 42),
    adText(t, { text: body(c, "How to choose the right path."), left: 76, top: 160, width: 800, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    cir({ left: W / 2 - 20, top: 280, radius: 20, fill: hexToRgba(t.accent, 0.2) }),
    adText(t, { text: "?", left: W / 2 - 20, top: 270, width: 40, height: 28, fontSize: 20, fill: t.accent, fontWeight: "900", textAlign: "center" }),
    ...items.map((item, i) => {
      const x = 140 + i * 380;
      const y = 380;
      return [
        rct({ left: x, top: y, width: 320, height: 120, fill: hexToRgba(colors(t)[i], 0.1), rx: 10 }),
        rct({ left: x, top: y, width: 4, height: 120, fill: colors(t)[i], rx: 2 }),
        adText(t, { text: item, left: x + 24, top: y + 30, width: 272, height: 60, fontSize: 16, fill: t.dark, fontWeight: "720", lineHeight: 1.28 }),
      ];
    }).flat(),
  ]);
};

export const adSwot: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Strength", "Weakness", "Opportunity", "Threat"], 4);
  const quadColors = [t.accent, "#BE3455", "#0F766E", "#B7791F"];
  const labels = ["STRENGTHS", "WEAKNESSES", "OPPORTUNITIES", "THREATS"];
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "SWOT Analysis", 72, 70, 700, 60, 38),
    ...items.map((item, i) => {
      const x = 72 + (i % 2) * 590;
      const y = 150 + Math.floor(i / 2) * 270;
      return [
        rct({ left: x, top: y, width: 560, height: 240, fill: hexToRgba(quadColors[i], 0.07), rx: 10 }),
        rct({ left: x, top: y, width: 560, height: 4, fill: quadColors[i], rx: 2 }),
        adText(t, { text: labels[i], left: x + 24, top: y + 20, width: 200, fontSize: 11, fill: quadColors[i], fontWeight: "900" }),
        adText(t, { text: item, left: x + 24, top: y + 50, width: 510, height: 160, fontSize: 17, fill: t.dark, fontWeight: "700", lineHeight: 1.36 }),
      ];
    }).flat(),
  ]);
};

// ── CLOSING VARIANTS ──────────────────────────────────────────────────────

export const adSummaryClosing: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Key takeaway one", "Key takeaway two", "Key takeaway three"], 3);
  return adCanvas(t, [
    ...adHeader(t, c.label, ""),
    adTitle(t, c.heading ?? "Key Takeaways", 72, 80, 700, 70, 42),
    adText(t, { text: body(c, "What to remember from this presentation."), left: 76, top: 160, width: 800, fontSize: 16, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
    ...items.map((item, i) => {
      const y = 270 + i * 120;
      return [
        ...adCard(t, 80, y, 1080, 90, colors(t)[i]),
        adText(t, { text: String(i + 1).padStart(2, "0"), left: 110, top: y + 25, width: 50, height: 36, fontSize: 26, fill: colors(t)[i], fontWeight: "900" }),
        adText(t, { text: item, left: 180, top: y + 28, width: 920, height: 40, fontSize: 19, fill: t.dark, fontWeight: "750" }),
      ];
    }).flat(),
  ]);
};

export const adContactClosing: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "", "dark"),
  cir({ left: W / 2 - 250, top: 50, radius: 300, fill: hexToRgba(t.accent, 0.08) }),
  adTitle(t, c.heading ?? "Let's Connect", 0, 200, W, 100, 60, "dark"),
  adRule(W / 2 - 80, 320, 160, t.accent, 4),
  adText(t, { text: body(c, "Reach out for collaboration."), left: 0, top: 360, width: W, height: 60, fontSize: 20, fill: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.3, mode: "dark" }),
  adText(t, { text: c.quote ?? "email@example.com", left: 0, top: 450, width: W, height: 36, fontSize: 18, fill: t.accent, textAlign: "center", fontWeight: "800", mode: "dark" }),
  adText(t, { text: c.author ?? "Your Name", left: 0, top: 510, width: W, height: 36, fontSize: 16, fill: "rgba(255,255,255,0.55)", textAlign: "center", mode: "dark" }),
], "dark");
