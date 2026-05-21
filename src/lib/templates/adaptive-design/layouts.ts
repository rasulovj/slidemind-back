import { W, H, rct, cir, hexToRgba } from "../helpers";
import { iconToFabric } from "../icons";
import type { CanvasBuilder, SlideContent } from "../types";
import { adArrow, adBullet, adCanvas, adCard, adHeader, adImageSlot, adRule, adText, adTitle } from "./helpers";

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

export const adCover: CanvasBuilder = (t, c = {}) => {
  const icon = c.icon ? iconToFabric({ name: c.icon, left: W / 2 - 20, top: 90, size: 40, fill: t.accent, opacity: 0.6 }) : null;
  return adCanvas(t, [
    ...adHeader(t, c.label, "01 / 12"),
    cir({ left: W - 200, top: -100, radius: 300, fill: hexToRgba(t.accent, 0.06) }),
    ...(icon ? [icon] : []),
    adText(t, { text: (c.label ?? "PRESENTATION").toUpperCase(), left: 0, top: icon ? 150 : 130, width: W, fontSize: 12, fill: t.accent, fontWeight: "900", textAlign: "center" }),
    adTitle(t, c.heading ?? "Adaptive Presentation", 80, icon ? 195 : 175, W - 160, 160, 64, "light", "center"),
    adRule(W / 2 - 180, icon ? 400 : 380, 360, t.accent, 5),
    adText(t, { text: c.subheading ?? body(c, "A custom visual system generated from the topic, audience, and structure."), left: 120, top: icon ? 435 : 415, width: W - 240, height: 100, fontSize: 21, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32, textAlign: "center" }),
    ...(c.quote ? [adText(t, { text: c.quote, left: 120, top: icon ? 565 : 545, width: W - 240, height: 42, fontSize: 16, fill: hexToRgba(t.dark, 0.5), fontWeight: "700", textAlign: "center" })] : []),
  ]);
};

export const adDarkCover: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "01 / 12", "dark"),
  cir({ left: W - 180, top: -60, radius: 280, fill: hexToRgba(t.accent, 0.08) }),
  cir({ left: W - 80, top: H - 100, radius: 160, fill: hexToRgba(t.accent, 0.06) }),
  adText(t, { text: (c.label ?? "Adaptive Brief").toUpperCase(), left: 76, top: 140, width: 300, fontSize: 12, fill: t.accent, fontWeight: "900", mode: "dark" }),
  adTitle(t, c.heading ?? "Adaptive Presentation", 76, 190, 1060, 160, 68, "dark"),
  adRule(80, 410, 360, t.accent, 4),
  adText(t, { text: c.subheading ?? body(c, "AI chooses the palette while the base system protects spacing, typography, and text flow."), left: 80, top: 440, width: 900, height: 100, fontSize: 22, fill: "rgba(255,255,255,0.72)", lineHeight: 1.32, mode: "dark" }),
], "dark");

export const adImageCover: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adImageSlot(t, { ...imageContent(c, "topic documentary scene"), x: 690, y: 105, w: 500, h: 470, color: t.accent }),
  ...adHeader(t, c.label, "01 / 12"),
  adText(t, { text: "ADAPTIVE VISUAL", left: 76, top: 120, width: 240, fontSize: 12, fill: t.accent, fontWeight: "900" }),
  adTitle(t, c.heading ?? "Adaptive Presentation", 76, 172, 560, 138, 58),
  adText(t, { text: c.subheading ?? body(c, "A custom visual direction selected from the topic and rendered with controlled image placement."), left: 80, top: 350, width: 520, height: 128, fontSize: 20, fill: hexToRgba(t.dark, 0.67), lineHeight: 1.32 }),
  adRule(80, 520, 330, t.accent, 5),
]);

export const adBoldCover: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  rct({ left: 0, top: 0, width: 455, height: 720, fill: t.accent }),
  rct({ left: 455, top: 0, width: 825, height: 720, fill: t.dark }),
  ...adHeader(t, c.label, "01 / 12", "dark"),
  adText(t, { text: "BOLD SYSTEM", left: 72, top: 126, width: 270, fontSize: 12, fill: t.surface, fontWeight: "900", mode: "dark" }),
  adTitle(t, c.heading ?? "Adaptive Presentation", 70, 185, 760, 150, 66, "dark"),
  adText(t, { text: c.subheading ?? body(c, "A high-contrast mode for presentations that need stronger hierarchy and more energy."), left: 500, top: 390, width: 590, height: 120, fontSize: 22, fill: "rgba(255,255,255,0.72)", lineHeight: 1.32, mode: "dark" }),
  adRule(500, 545, 420, t.accent, 5),
], "dark");

export const adAgenda: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Set context", "Read signals", "Compare options", "Choose path"], 5);
  return adCanvas(t, [
    ...adHeader(t, c.label, "02 / 12"),
    adTitle(t, c.heading ?? "Presentation Route", 72, 80, 720, 70, 42),
    adText(t, { text: body(c, "The route explains how the presentation moves from context to evidence, then into choices and next steps."), left: 76, top: 165, width: 900, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => {
      const w = items.length <= 4 ? 245 : 205;
      const gap = 24;
      const rowW = items.length * w + (items.length - 1) * gap;
      const x = (W - rowW) / 2 + i * (w + gap);
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x + w / 2 - 12, top: 460, size: 24, fill: colors(t)[i], opacity: 0.7 }) : null;
      return [
        ...adCard(t, x, 440, w, 132, colors(t)[i]),
        ...(icon ? [icon] : [adText(t, { text: String(i + 1).padStart(2, "0"), left: x + 20, top: 465, width: 54, height: 36, fontSize: 26, fill: colors(t)[i], fontWeight: "900" })]),
        adText(t, { text: item, left: x + 24, top: icon ? 500 : 522, width: w - 48, height: 36, fontSize: 17, fill: t.dark, fontWeight: "800", textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const adSummary: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Main pressure", "Critical tradeoff", "Recommended focus"], 3);
  return adCanvas(t, [
    ...adHeader(t, c.label, "03 / 12"),
    adTitle(t, c.heading ?? "Executive Summary", 72, 80, 560, 70, 42),
    adText(t, { text: body(c, "This slide gives enough context to understand the situation, the tradeoff, and the decision the rest of the deck will support."), left: 76, top: 165, width: 540, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.34 }),
    ...adCard(t, 705, 125, 360, 405, t.accent),
    adText(t, { text: c.subheading ?? "Decision readout", left: 745, top: 170, width: 280, height: 44, fontSize: 27, fill: t.dark, fontWeight: "850", textAlign: "center" }),
    ...items.map((p, i) => adBullet(t, p, 765, 265 + i * 78, 230, colors(t)[i], 48, "light", i)).flat(),
  ]);
};

export const adEditorialBrief: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Historical context", "Current pressure", "Interpretation"], 3);
  return adCanvas(t, [
    ...adHeader(t, c.label, "03 / 12"),
    adText(t, { text: "FIELD NOTE", left: 86, top: 80, width: 160, fontSize: 11, fill: t.accent, fontWeight: "900" }),
    adTitle(t, c.heading ?? "Context and Meaning", 84, 105, 690, 80, 42),
    adText(t, { text: body(c, "This editorial layout gives the topic enough narrative space to explain the background, the current tension, and the interpretation the audience should carry forward."), left: 88, top: 200, width: 620, fontSize: 16, fill: hexToRgba(t.dark, 0.68), lineHeight: 1.38 }),
    rct({ left: 790, top: 138, width: 330, height: 410, fill: "#FFFFFF", rx: 4 }),
    adRule(820, 178, 210, t.accent, 4),
    ...items.map((item, i) => adBullet(t, item, 835, 255 + i * 80, 220, colors(t)[i], 45)).flat(),
  ]);
};

export const adStatement: CanvasBuilder = (t, c = {}) => {
  const claim = c.quote ?? c.heading ?? "The most useful deck makes the decision obvious.";
  const fs = claim.length > 120 ? 30 : claim.length > 92 ? 34 : claim.length > 50 ? 38 : 44;
  return adCanvas(t, [
    ...adHeader(t, c.label, "04 / 12", "dark"),
    adText(t, { text: "KEY IDEA", left: 80, top: 100, width: 160, fontSize: 12, fill: t.accent, fontWeight: "900", mode: "dark" }),
    adText(t, { text: claim, left: 130, top: 150, width: 920, fontSize: fs, fill: t.surface, textAlign: "center", fontWeight: "850", lineHeight: 1.15, mode: "dark" }),
    adRule(360, 430, 560, t.accent, 4),
    adText(t, { text: body(c, "Use the supporting note to explain the evidence behind the claim and why it changes the next decision."), left: 250, top: 460, width: 780, fontSize: 17, fill: "rgba(255,255,255,0.72)", textAlign: "center", lineHeight: 1.34, mode: "dark" }),
  ], "dark");
};

export const adSplit: CanvasBuilder = (t, c = {}) => {
  const l = left(c, ["Current constraint", "Affected group", "Reason it matters"]);
  const r = right(c, ["Likely response", "Required capability", "Next decision"]);
  return adCanvas(t, [
    ...adHeader(t, c.label, "05 / 12"),
    adTitle(t, c.heading ?? "Structured Analysis", 72, 80, 720, 70, 42),
    adText(t, { text: body(c, "The paragraph frames the tradeoff before the columns separate the diagnosis from the response."), left: 76, top: 160, width: 940, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...adCard(t, 92, 300, 500, 270, t.accent),
    ...adCard(t, 690, 300, 500, 270, colors(t)[2]),
    adText(t, { text: c.subheading ?? "Diagnosis", left: 130, top: 340, width: 420, height: 34, fontSize: 22, fill: t.accent, fontWeight: "850", textAlign: "center" }),
    adText(t, { text: c.quote ?? "Response", left: 730, top: 340, width: 420, height: 34, fontSize: 22, fill: colors(t)[2], fontWeight: "850", textAlign: "center" }),
    ...l.map((p, i) => adBullet(t, p, 145, 400 + i * 48, 370, t.accent, 38)).flat(),
    ...r.map((p, i) => adBullet(t, p, 745, 400 + i * 48, 370, colors(t)[2], 38)).flat(),
  ]);
};

export const adVisualSplit: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["What the scene shows", "Why it matters", "What changes next"], 3);
  return adCanvas(t, [
    ...adHeader(t, c.label, "05 / 12"),
    ...adImageSlot(t, { ...imageContent(c, "real world scene for topic"), x: 72, y: 118, w: 520, h: 430, color: t.accent }),
    adTitle(t, c.heading ?? "Visual Evidence", 670, 105, 470, 80, 42),
    adText(t, { text: body(c, "The image anchors the abstract topic in a concrete scene, while the explanation clarifies what the audience should notice."), left: 675, top: 205, width: 430, height: 140, fontSize: 17, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => adBullet(t, item, 700, 385 + i * 52, 360, colors(t)[i])).flat(),
  ]);
};

export const adEditorialImage: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "05 / 12"),
  adTitle(t, c.heading ?? "Seen in Context", 72, 80, 710, 80, 44),
  adText(t, { text: body(c, "This layout gives visual evidence a magazine-like rhythm, pairing a wide contained image with a concise interpretation."), left: 76, top: 175, width: 850, height: 70, fontSize: 17, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
  ...adImageSlot(t, { ...imageContent(c, "documentary scene related to topic"), x: 130, y: 280, w: 1020, h: 310, color: t.accent }),
]);

export const adBoldStatement: CanvasBuilder = (t, c = {}) => {
  const claim = c.quote ?? c.heading ?? "The main shift is already visible.";
  const fs = claim.length > 120 ? 30 : claim.length > 88 ? 34 : claim.length > 50 ? 38 : 44;
  return adCanvas(t, [
    rct({ left: 0, top: 0, width: W, height: 720, fill: t.dark }),
    rct({ left: 0, top: 0, width: 185, height: 720, fill: t.accent }),
    ...adHeader(t, c.label, "06 / 12", "dark"),
    adText(t, { text: claim, left: 250, top: 120, width: 800, fontSize: fs, fill: t.surface, fontWeight: "900", lineHeight: 1.15, mode: "dark" }),
    adRule(252, 420, 520, t.accent, 5),
    adText(t, { text: body(c, "The supporting paragraph explains why this statement matters and how it changes the way the topic should be understood."), left: 255, top: 455, width: 760, fontSize: 18, fill: "rgba(255,255,255,0.72)", lineHeight: 1.34, mode: "dark" }),
  ], "dark");
};

export const adCards: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["First priority", "Second priority", "Third priority", "Fourth priority"], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, "06 / 12"),
    adTitle(t, c.heading ?? "Priority Map", 72, 80, 720, 70, 42),
    adText(t, { text: body(c, "Use cards when the presentation needs to compare several ideas without turning the slide into a dense list."), left: 76, top: 160, width: 840, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => {
      const x = 100 + (i % 2) * 545;
      const y = 330 + Math.floor(i / 2) * 135;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x + 30, top: y + 34, size: 28, fill: colors(t)[i], opacity: 0.8 }) : null;
      return [
        ...adCard(t, x, y, 440, 100, colors(t)[i]),
        ...(icon ? [icon] : [adText(t, { text: String(i + 1).padStart(2, "0"), left: x + 24, top: y + 31, width: 50, height: 34, fontSize: 24, fill: colors(t)[i], fontWeight: "900" })]),
        adText(t, { text: item, left: x + 88, top: y + 30, width: 310, height: 44, fontSize: 18, fill: t.dark, fontWeight: "800" }),
      ];
    }).flat(),
  ]);
};

export const adProcess: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Frame problem", "Test signal", "Choose path", "Execute review"], 5);
  return adCanvas(t, [
    ...adHeader(t, c.label, "07 / 12"),
    adTitle(t, c.heading ?? "Process Flow", 72, 80, 650, 70, 42),
    adText(t, { text: body(c, "The sequence shows how the work moves from understanding to action while preserving decision checkpoints."), left: 76, top: 165, width: 880, height: 105, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => {
      const x = 105 + i * (1010 / Math.max(1, items.length - 1));
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x - 16, top: 440, size: 32, fill: colors(t)[i], opacity: 0.9 }) : null;
      return [
        cir({ left: x - 36, top: 420, radius: 36, fill: hexToRgba(colors(t)[i], 0.16) }),
        ...(icon ? [icon] : [adText(t, { text: String(i + 1), left: x - 19, top: 442, width: 38, height: 32, fontSize: 24, fill: colors(t)[i], fontWeight: "900", textAlign: "center" })]),
        adText(t, { text: item, left: x - 95, top: 520, width: 190, height: 54, fontSize: 15, fill: t.dark, fontWeight: "780", textAlign: "center" }),
        ...(i < items.length - 1 ? [adArrow(x + 48, 456, x + 148, 456, hexToRgba(t.dark, 0.22))] : []),
      ];
    }).flat(),
  ]);
};

export const adMetrics: CanvasBuilder = (t, c = {}) => {
  const data = stats(c, [{ value: "3x", label: "priority gap" }, { value: "18mo", label: "execution horizon" }, { value: "42%", label: "coverage target" }, { value: "Q3", label: "decision window" }], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, "08 / 12"),
    adTitle(t, c.heading ?? "Signal Dashboard", 72, 80, 650, 70, 42),
    adText(t, { text: body(c, "A small set of numbers should clarify what changed and where the audience should focus."), left: 76, top: 165, width: 840, height: 96, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...data.map((s, i) => {
      const x = 96 + (i % 2) * 545;
      const y = 340 + Math.floor(i / 2) * 145;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x + 380, top: y + 35, size: 28, fill: colors(t)[i], opacity: 0.4 }) : null;
      return [
        ...adCard(t, x, y, 445, 108, colors(t)[i]),
        adText(t, { text: s.value, left: x + 24, top: y + 24, width: 120, height: 45, fontSize: s.value.length > 7 ? 30 : 38, fill: colors(t)[i], fontWeight: "900" }),
        adText(t, { text: s.label, left: x + 155, top: y + 37, width: 250, height: 44, fontSize: 16, fill: hexToRgba(t.dark, 0.72), fontWeight: "750" }),
        ...(icon ? [icon] : []),
      ];
    }).flat(),
  ]);
};

export const adConsoleMetrics: CanvasBuilder = (t, c = {}) => {
  const data = stats(c, [{ value: "4", label: "active signals" }, { value: "2x", label: "rate of change" }, { value: "Q3", label: "decision window" }, { value: "18mo", label: "planning horizon" }], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, "08 / 12", "dark"),
    adTitle(t, c.heading ?? "Signal Console", 72, 80, 650, 70, 42, "dark"),
    adText(t, { text: body(c, "The console mode is useful when the topic needs to feel analytical, technical, or operational."), left: 76, top: 165, width: 820, fontSize: 16, fill: "rgba(255,255,255,0.72)", lineHeight: 1.32, mode: "dark" }),
    ...data.map((s, i) => {
      const x = 92 + (i % 2) * 545;
      const y = 340 + Math.floor(i / 2) * 125;
      return [
        ...adCard(t, x, y, 445, 96, colors(t)[i], "dark"),
        adText(t, { text: s.value, left: x + 24, top: y + 22, width: 120, height: 42, fontSize: s.value.length > 7 ? 29 : 38, fill: colors(t)[i], fontWeight: "900", mode: "dark" }),
        adText(t, { text: s.label, left: x + 155, top: y + 34, width: 250, height: 38, fontSize: 15, fill: "rgba(255,255,255,0.74)", fontWeight: "760", mode: "dark" }),
      ];
    }).flat(),
  ], "dark");
};

export const adCompare: CanvasBuilder = (t, c = {}) => {
  const l = left(c, ["Lower complexity", "Faster rollout", "Uses current assets"]);
  const r = right(c, ["Higher upside", "More control", "Needs investment"]);
  return adCanvas(t, [
    ...adHeader(t, c.label, "09 / 12"),
    adTitle(t, c.heading ?? "Option Comparison", 72, 80, 760, 70, 42),
    ...adCard(t, 90, 230, 500, 350, t.accent),
    ...adCard(t, 690, 230, 500, 350, colors(t)[3]),
    adText(t, { text: c.subheading ?? "Option A", left: 130, top: 276, width: 410, height: 42, fontSize: 27, fill: t.accent, textAlign: "center", fontWeight: "850" }),
    adText(t, { text: c.quote ?? "Option B", left: 730, top: 276, width: 410, height: 42, fontSize: 27, fill: colors(t)[3], textAlign: "center", fontWeight: "850" }),
    ...l.map((p, i) => adBullet(t, p, 145, 370 + i * 54, 370, t.accent, 38)).flat(),
    ...r.map((p, i) => adBullet(t, p, 745, 370 + i * 54, 370, colors(t)[3], 38)).flat(),
  ]);
};

export const adTimeline: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Origin", "Shift", "Acceleration", "Current state", "Next horizon"], 5);
  const spacing = items.length <= 4 ? 260 : 210;
  const startX = (W - (items.length - 1) * spacing) / 2;
  return adCanvas(t, [
    ...adHeader(t, c.label, "10 / 12"),
    adTitle(t, c.heading ?? "Timeline", 72, 80, 650, 70, 42),
    adText(t, { text: body(c, "A timeline works when the audience needs to see how the current situation formed and why the next step matters now."), left: 76, top: 165, width: 1060, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    adRule(startX, 430, (items.length - 1) * spacing, hexToRgba(t.dark, 0.24), 3),
    ...items.map((item, i) => {
      const x = startX + i * spacing;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x - 12, top: 450 + (i % 2) * 36, size: 24, fill: colors(t)[i], opacity: 0.7 }) : null;
      return [
        cir({ left: x - 8, top: 422, radius: 8, fill: colors(t)[i] }),
        ...(icon ? [icon] : [adText(t, { text: String(i + 1).padStart(2, "0"), left: x - 34, top: 460 + (i % 2) * 36, width: 68, height: 32, fontSize: 22, fill: colors(t)[i], fontWeight: "900", textAlign: "center" })]),
        adText(t, { text: item, left: x - 80, top: (icon ? 486 : 496) + (i % 2) * 36, width: 160, height: 48, fontSize: 16, fill: t.dark, fontWeight: "760", textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const adConsoleFlow: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Input signal", "Pattern detected", "Decision point", "Response loop"], 5);
  return adCanvas(t, [
    ...adHeader(t, c.label, "10 / 12", "dark"),
    adTitle(t, c.heading ?? "System Flow", 72, 80, 650, 70, 42, "dark"),
    adText(t, { text: body(c, "This mode frames the topic like a system: inputs, relationships, decisions, and feedback loops."), left: 76, top: 165, width: 820, fontSize: 16, fill: "rgba(255,255,255,0.72)", lineHeight: 1.32, mode: "dark" }),
    ...items.map((item, i) => {
      const x = 112 + i * (1015 / Math.max(1, items.length - 1));
      return [
        rct({ left: x - 48, top: 385, width: 96, height: 80, fill: "rgba(255,255,255,0.08)", rx: 12 }),
        adText(t, { text: String(i + 1).padStart(2, "0"), left: x - 22, top: 407, width: 44, height: 28, fontSize: 22, fill: colors(t)[i], fontWeight: "900", textAlign: "center", mode: "dark" }),
        adText(t, { text: item, left: x - 92, top: 492, width: 184, height: 50, fontSize: 16, fill: t.surface, fontWeight: "760", textAlign: "center", mode: "dark" }),
        ...(i < items.length - 1 ? [adArrow(x + 55, 426, x + 150, 426, "rgba(255,255,255,0.28)")] : []),
      ];
    }).flat(),
  ], "dark");
};

export const adMatrix: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["High urgency", "Strategic fit", "Capability gap", "Low effort"], 4);
  return adCanvas(t, [
    ...adHeader(t, c.label, "11 / 12"),
    adTitle(t, c.heading ?? "Decision Matrix", 72, 80, 600, 70, 42),
    adText(t, { text: body(c, "Use the matrix to locate priorities by comparing urgency against effort, value, or readiness."), left: 76, top: 165, width: 520, fontSize: 16, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    rct({ left: 680, top: 145, width: 410, height: 380, fill: "#FFFFFF", rx: 10 }),
    rct({ left: 710, top: 330, width: 350, height: 1.5, fill: hexToRgba(t.dark, 0.16) }),
    rct({ left: 885, top: 180, width: 1.5, height: 310, fill: hexToRgba(t.dark, 0.16) }),
    ...items.map((item, i) => {
      const x = [735, 925, 735, 925][i] ?? 735;
      const y = [220, 220, 385, 385][i] ?? 220;
      return [
        rct({ left: x, top: y, width: 120, height: 54, fill: hexToRgba(colors(t)[i], 0.16), rx: 5 }),
        adText(t, { text: item, left: x + 10, top: y + 14, width: 100, height: 26, fontSize: 12, fill: t.dark, textAlign: "center", fontWeight: "820" }),
      ];
    }).flat(),
  ]);
};

export const adCase: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Situation", "Action", "Result"], 3);
  return adCanvas(t, [
    ...adHeader(t, c.label, "12 / 12"),
    adTitle(t, c.heading ?? "Example in Practice", 72, 80, 580, 80, 42),
    adText(t, { text: body(c, "A short case gives the strategy a concrete anchor and makes the implications easier to understand."), left: 76, top: 175, width: 580, fontSize: 18, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.38 }),
    ...adCard(t, 700, 100, 420, 500, t.accent),
    ...items.map((item, i) => [
      adText(t, { text: String(i + 1).padStart(2, "0"), left: 740, top: 180 + i * 130, width: 60, height: 40, fontSize: 30, fill: colors(t)[i], fontWeight: "900" }),
      adText(t, { text: item, left: 820, top: 185 + i * 130, width: 260, fontSize: 20, fill: t.dark, fontWeight: "800", lineHeight: 1.3 }),
      rct({ left: 820, top: 240 + i * 130, width: 240, height: 1.5, fill: hexToRgba(t.dark, 0.12) }),
    ]).flat(),
  ]);
};

export const adClosing: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "12 / 12", "dark"),
  adTitle(t, c.heading ?? "Final Takeaway", 105, 170, 860, 120, 64, "dark"),
  adText(t, { text: body(c, "End with the decision, owner, and checkpoint the audience should remember."), left: 110, top: 330, width: 780, height: 155, fontSize: 21, fill: "rgba(255,255,255,0.72)", lineHeight: 1.34, mode: "dark" }),
  adRule(110, 525, 520, t.accent, 5),
  adText(t, { text: c.quote ?? "One clear next move.", left: 110, top: 565, width: 720, height: 48, fontSize: 24, fill: t.surface, fontWeight: "850", mode: "dark" }),
], "dark");

export const adEditorialClosing: CanvasBuilder = (t, c = {}) => adCanvas(t, [
  ...adHeader(t, c.label, "12 / 12"),
  adText(t, { text: "CLOSING NOTE", left: 100, top: 120, width: 180, fontSize: 11, fill: t.accent, fontWeight: "900" }),
  adTitle(t, c.heading ?? "What to Remember", 100, 165, 760, 118, 58),
  adText(t, { text: body(c, "Close with a reflective synthesis that names the main takeaway, the practical meaning, and the question the audience should keep considering."), left: 104, top: 320, width: 760, height: 142, fontSize: 20, fill: hexToRgba(t.dark, 0.68), lineHeight: 1.38 }),
  adRule(104, 520, 430, t.accent, 4),
  adText(t, { text: c.quote ?? "A clearer frame creates a better next move.", left: 104, top: 560, width: 700, height: 48, fontSize: 23, fill: t.dark, fontWeight: "850" }),
]);
