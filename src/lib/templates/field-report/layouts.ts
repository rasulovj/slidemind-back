import { W, H, hexToRgba, rct } from "../helpers";
import type { CanvasBuilder, SlideContent } from "../types";
import { FR, frBox, frBullet, frCanvas, frHeader, frImageSlot, frRule, frStamp, frText, frTitle } from "./helpers";

function points(c: SlideContent, fallback: string[], max = 4) {
  const generic = new Set([
    "local detail",
    "pattern",
    "lesson",
    "observation",
    "tension",
    "context",
    "implication",
    "next thought",
  ]);
  const provided = (c.points ?? []).filter((p) => !generic.has(p.trim().toLowerCase()));
  return (provided.length ? provided : fallback).slice(0, max);
}

function steps(c: SlideContent, fallback: string[], max = 5) {
  return (c.steps?.length ? c.steps : c.points?.length ? c.points : fallback).slice(0, max);
}

function bodyText(c: SlideContent, fallback: string) {
  return c.body?.trim() || fallback;
}

function imageContent(c: SlideContent, fallback: string): SlideContent {
  return {
    ...c,
    imageQuery: c.imageQuery ?? c.imageAlt ?? c.heading ?? fallback,
  };
}

function compactTitle(text: string, width: number, base = 54) {
  if (text.length > 54) return Math.max(32, base - 18);
  if (text.length > 38) return Math.max(36, base - 10);
  return base;
}

function bodyFs(text: string, max = 24, min = 18) {
  if (text.length > 320) return Math.max(min, max - 6);
  if (text.length > 240) return Math.max(min, max - 4);
  if (text.length > 160) return Math.max(min, max - 2);
  return max;
}

function adaptFs(texts: string[], widthPx: number, base: number, min: number): number {
  const maxLen = Math.max(...texts.map((t) => t.length), 1);
  const charsAtBase = widthPx / (base * 0.54);
  if (maxLen <= charsAtBase) return base;
  if (maxLen <= charsAtBase * 1.6) return Math.max(min, base - 4);
  return min;
}

function estimateH(text: string, width: number, fontSize: number, lineHeight = 1.25) {
  const charsPerLine = Math.max(1, Math.floor(width / (fontSize * 0.54)));
  return Math.ceil(text.length / charsPerLine) * fontSize * lineHeight;
}

function titleBlockH(text: string, width: number, base: number) {
  const fs = compactTitle(text, width, base);
  return estimateH(text, width, fs, 1.06);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const colors = [FR.rust, FR.navy, FR.olive, FR.ochre, FR.rust];

export const frCover: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Field Report";
  const sub = c.subheading ?? bodyText(c, "A clear evidence-led briefing on the topic.");
  const fs = compactTitle(heading, 650, 68);
  return frCanvas([
    rct({ left: 46, top: 40, width: W - 92, height: H - 80, fill: "transparent", rx: 4 }),
    ...frStamp(c.label ?? "Field report", 72, 72, FR.rust),
    frTitle(heading, 72, 148, 650, fs),
    frRule(76, 320, 470, FR.rust, 5),
    frText({ text: sub, left: 76, top: 358, width: 560, fontSize: bodyFs(sub, 27, 20), fill: FR.muted, lineHeight: 1.32 }),
    ...frImageSlot({ ...imageContent(c, "report cover image"), x: 748, y: 110, w: 430, h: 420, label: "Cover image", color: FR.navy }),
    frText({ text: c.quote ?? "Evidence, context, and implications.", left: 76, top: 620, width: 760, fontSize: 18, fill: FR.rust, fontWeight: "700" }),
  ]);
};

export const frCoverB: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Field Report";
  const sub = c.subheading ?? bodyText(c, "A clear evidence-led briefing on the topic.");
  return frCanvas([
    ...frImageSlot({ ...imageContent(c, "field report image"), x: 0, y: 0, w: W, h: 335, label: "Report image", color: FR.rust }),
    rct({ left: 0, top: 312, width: W, height: H - 312, fill: hexToRgba(FR.paper, 0.96) }),
    ...frStamp(c.label ?? "Field report", 72, 362, FR.navy),
    frTitle(heading, 72, 420, 900, compactTitle(heading, 900, 60)),
    frText({ text: sub, left: 76, top: 548, width: 860, fontSize: bodyFs(sub, 27, 20), fill: FR.muted, lineHeight: 1.32 }),
    frRule(76, 646, 420, FR.rust, 4),
  ]);
};

export const frCoverC: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Field Report";
  const sub = c.subheading ?? bodyText(c, "A clear evidence-led briefing on the topic.");
  return frCanvas([
    ...frImageSlot({ ...imageContent(c, "field report image"), x: 66, y: 86, w: 420, h: 560, label: "Field image", color: FR.rust }),
    ...frStamp(c.label ?? "Field report", 560, 104, FR.olive),
    frTitle(heading, 560, 176, 600, compactTitle(heading, 600, 64)),
    frText({ text: sub, left: 564, top: 392, width: 560, fontSize: bodyFs(sub, 28, 20), fill: FR.muted, lineHeight: 1.34 }),
    frRule(564, 570, 400, FR.rust, 5),
    frText({ text: c.quote ?? "Filed for context and decision-making.", left: 564, top: 606, width: 520, fontSize: 18, fill: FR.rust, fontWeight: "700" }),
  ]);
};

export const frAgenda: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Set the scene", "Follow the evidence", "Compare implications", "Decide what matters"], 5);
  const heading = c.heading ?? "Route of Inquiry";
  const body = bodyText(c, "The report moves from context to evidence, then closes with implications and next steps.");
  const headingFs = compactTitle(heading, 760, 52);
  const bodyTop = clamp(112 + titleBlockH(heading, 760, 52) + 28, 196, 250);
  const fs = bodyFs(body, 27, 20);
  const cardTop = clamp(bodyTop + estimateH(body, 940, fs, 1.3) + 70, 382, 455);
  const cardW = items.length <= 4 ? 245 : 210;
  const gap = 24;
  const rowW = items.length * cardW + Math.max(0, items.length - 1) * gap;
  const startX = (W - rowW) / 2;
  return frCanvas([
    ...frHeader(c.label, "02 / 12"),
    frTitle(heading, 70, 112, 760, headingFs),
    frText({ text: body, left: 74, top: bodyTop, width: 940, fontSize: fs, fill: FR.muted, lineHeight: 1.3 }),
    ...items.map((item, i) => {
      const x = startX + i * (cardW + gap);
      return [
        ...frBox(x, cardTop, cardW, 150, colors[i], "rgba(255,255,255,0.36)"),
        frText({ text: String(i + 1).padStart(2, "0"), left: x + 16, top: cardTop + 24, width: 52, fontSize: 28, fill: colors[i], fontWeight: "800" }),
        frText({ text: item, left: x + 22, top: cardTop + 82, width: cardW - 44, fontSize: adaptFs([item], cardW - 44, 22, 14), fill: FR.ink, textAlign: "center", lineHeight: 1.18, fontWeight: "700" }),
        ...(i < items.length - 1 ? [frRule(x + cardW + 4, cardTop + 74, gap - 8, FR.faint, 2)] : []),
      ];
    }).flat(),
  ]);
};

export const frAgendaB: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Context", "Signals", "Cases", "Implications", "Next moves"], 5);
  const heading = c.heading ?? "What We Will Trace";
  const body = bodyText(c, "Use this map to understand the evidence path before the report gets more specific.");
  const headingFs = compactTitle(heading, 660, 52);
  const bodyTop = clamp(104 + titleBlockH(heading, 660, 52) + 28, 192, 260);
  const fs = bodyFs(body, 27, 20);
  return frCanvas([
    ...frHeader(c.label, "02 / 12"),
    frTitle(heading, 72, 104, 660, headingFs),
    frText({ text: body, left: 76, top: bodyTop, width: 560, fontSize: fs, fill: FR.muted, lineHeight: 1.3 }),
    ...items.map((item, i) => [
      frText({ text: String(i + 1).padStart(2, "0"), left: 760, top: 128 + i * 94, width: 58, fontSize: 30, fill: colors[i], fontWeight: "800" }),
      frRule(820, 144 + i * 94, 310, colors[i], 3),
      frText({ text: item, left: 820, top: 168 + i * 94, width: 360, fontSize: 22, fill: FR.ink, fontWeight: "700" }),
    ]).flat(),
  ]);
};

export const frBrief: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "This section gives readers the background they need before the evidence becomes more detailed.");
  const pts = points(c, ["What changed", "Who is affected", "Why it matters"], 3);
  const heading = c.heading ?? "Situation Brief";
  const headingFs = compactTitle(heading, 620, 54);
  const bodyTop = clamp(100 + titleBlockH(heading, 620, 54) + 28, 205, 285);
  const fs = bodyFs(body, bodyTop > 230 ? 27 : 32, 20);
  return frCanvas([
    ...frHeader(c.label, "03 / 12"),
    frTitle(heading, 72, 100, 620, headingFs),
    frText({ text: body, left: 76, top: bodyTop, width: 650, fontSize: fs, fill: FR.ink, lineHeight: 1.32 }),
    ...frBox(800, 140, 330, 430, FR.olive, "rgba(255,255,255,0.32)"),
    frText({ text: c.subheading ?? "Field Notes", left: 830, top: 176, width: 270, fontSize: 28, fill: FR.olive, fontWeight: "800", textAlign: "center" }),
    ...pts.map((p, i) => frBullet(p, 840, 260 + i * 78, 240, colors[i], i)).flat(),
  ]);
};

export const frBriefB: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "This section gives readers the background they need before the evidence becomes more detailed.");
  const heading = c.heading ?? "Context";
  const headingFs = compactTitle(heading, 940, 54);
  const bodyTop = clamp(164 + titleBlockH(heading, 940, 54) + 32, 284, 360);
  const fs = bodyFs(body, bodyTop > 310 ? 28 : 34, 20);
  const ruleTop = clamp(bodyTop + estimateH(body, 900, fs, 1.38) + 44, 520, 590);
  return frCanvas([
    ...frHeader(c.label, "03 / 12"),
    ...frStamp(c.subheading ?? "Briefing note", 76, 105, FR.rust),
    frTitle(heading, 76, 164, 940, headingFs),
    frText({ text: body, left: 120, top: bodyTop, width: 900, fontSize: fs, fill: FR.ink, lineHeight: 1.38 }),
    frRule(120, ruleTop, 660, FR.navy, 3),
    frText({ text: c.quote ?? "The useful question is not only what happened, but why it still matters.", left: 120, top: ruleTop + 34, width: 800, fontSize: 20, fill: FR.rust, fontWeight: "700" }),
  ]);
};

export const frFinding: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, ["Main signal", "Human impact", "Strategic implication"], 3);
  const body = bodyText(c, "A core finding should connect evidence to meaning, so the slide is readable without narration.");
  const heading = c.heading ?? "Primary Finding";
  const headingFs = compactTitle(heading, 800, 62);
  const bodyTop = clamp(150 + titleBlockH(heading, 800, 62) + 26, 300, 355);
  const fs = bodyFs(body, bodyTop > 315 ? 25 : 28, 19);
  const cardTop = clamp(bodyTop + estimateH(body, 720, fs, 1.32) + 58, 510, 575);
  return frCanvas([
    ...frHeader(c.label, "04 / 12"),
    frText({ text: "FINDING", left: 74, top: 112, width: 150, fontSize: 14, fill: FR.rust, fontWeight: "900" }),
    frTitle(heading, 72, 150, 800, headingFs),
    frText({ text: body, left: 76, top: bodyTop, width: 720, fontSize: fs, fill: FR.muted, lineHeight: 1.32 }),
    ...pts.map((p, i) => [
      ...frBox(88 + i * 375, cardTop, 310, 95, colors[i], "rgba(255,255,255,0.36)"),
      frText({ text: p, left: 112 + i * 375, top: cardTop + 34, width: 262, fontSize: adaptFs([p], 262, 21, 14), fill: FR.ink, textAlign: "center", fontWeight: "800" }),
    ]).flat(),
  ]);
};

export const frFindingB: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, ["Signal", "Cause", "Effect"], 3);
  const body = bodyText(c, "A core finding should connect evidence to meaning, so the slide is readable without narration.");
  return frCanvas([
    ...frHeader(c.label, "04 / 12"),
    ...frBox(70, 120, 420, 470, FR.rust, "rgba(255,255,255,0.35)"),
    frText({ text: "KEY FINDING", left: 104, top: 160, width: 340, fontSize: 14, fill: FR.rust, fontWeight: "900", textAlign: "center" }),
    frTitle(c.heading ?? "Primary Finding", 100, 214, 350, compactTitle(c.heading ?? "Primary Finding", 350, 44)),
    frText({ text: body, left: 565, top: 145, width: 580, fontSize: bodyFs(body, 27, 19), fill: FR.ink, lineHeight: 1.38 }),
    ...pts.map((p, i) => frBullet(p, 580, 420 + i * 62, 500, colors[i], i)).flat(),
  ]);
};

export const frPhotoEvidence: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "The visual evidence grounds the report in a concrete scene, place, artifact, or real-world example.");
  const heading = c.heading ?? "Evidence From the Field";
  const headingFs = compactTitle(heading, 720, 46);
  const contentTop = clamp(92 + titleBlockH(heading, 720, 46) + 34, 170, 245);
  const imageH = Math.max(310, 600 - contentTop);
  const panelH = imageH;
  return frCanvas([
    ...frHeader(c.label, "05 / 12"),
    frTitle(heading, 72, 92, 720, headingFs),
    ...frImageSlot({ ...imageContent(c, "field evidence image"), x: 82, y: contentTop, w: 690, h: imageH, label: "Evidence", color: FR.navy }),
    ...frBox(825, contentTop, 330, panelH, FR.rust, "rgba(255,255,255,0.36)"),
    frText({ text: c.subheading ?? "Interpretation", left: 852, top: contentTop + 40, width: 278, fontSize: 25, fill: FR.rust, fontWeight: "800", textAlign: "center" }),
    frText({ text: body, left: 852, top: contentTop + 122, width: 276, fontSize: bodyFs(body, panelH < 370 ? 16 : 18, 14), fill: FR.ink, lineHeight: 1.24, textAlign: "center" }),
  ]);
};

export const frPhotoEvidenceB: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "The visual evidence grounds the report in a concrete scene, place, artifact, or real-world example.");
  const heading = c.heading ?? "What the Evidence Shows";
  const headingFs = compactTitle(heading, 520, 38);
  return frCanvas([
    ...frHeader(c.label, "05 / 12"),
    ...frImageSlot({ ...imageContent(c, "field evidence image"), x: 60, y: 96, w: W - 120, h: 350, label: "Evidence", color: FR.rust }),
    frTitle(heading, 82, 486, 520, headingFs),
    frText({ text: body, left: 640, top: 492, width: 520, fontSize: bodyFs(body, 26, 20), fill: FR.ink, lineHeight: 1.34 }),
  ]);
};

export const frTimeline: CanvasBuilder = (_t, c = {}) => {
  const flow = steps(c, ["Origin", "Turning point", "Acceleration", "Current state", "Next horizon"], 5);
  const heading = c.heading ?? "Sequence of Events";
  const headingFs = compactTitle(heading, 760, 52);
  const body = bodyText(c, "The timeline shows how the current situation formed and where the next pressure point may appear.");
  const textTop = clamp(104 + titleBlockH(heading, 760, 52) + 28, 196, 270);
  const fs = bodyFs(body, 26, 20);
  const y = clamp(textTop + estimateH(body, 880, fs, 1.3) + 120, 430, 470);
  const startX = 140;
  const gap = (W - 280) / Math.max(1, flow.length - 1);
  return frCanvas([
    ...frHeader(c.label, "06 / 12"),
    frTitle(heading, 72, 104, 760, headingFs),
    frText({ text: body, left: 76, top: textTop, width: 880, fontSize: fs, fill: FR.muted, lineHeight: 1.3 }),
    frRule(startX, y, W - 280, FR.navy, 3),
    ...flow.map((step, i) => {
      const x = startX + i * gap;
      const top = i % 2 ? y + 42 : y - 118;
      const labelX = clamp(x - 95, 54, W - 244);
      return [
        rct({ left: x - 8, top: y - 8, width: 16, height: 16, fill: colors[i], rx: 8 }),
        frText({ text: String(i + 1).padStart(2, "0"), left: labelX + 50, top: top, width: 90, fontSize: 25, fill: colors[i], fontWeight: "900", textAlign: "center" }),
        frText({ text: step, left: labelX, top: top + 44, width: 190, fontSize: adaptFs([step], 190, 18, 12), fill: FR.ink, textAlign: "center", lineHeight: 1.18, fontWeight: "700" }),
      ];
    }).flat(),
  ]);
};

export const frTimelineB: CanvasBuilder = (_t, c = {}) => {
  const flow = steps(c, ["Origin", "Turning point", "Acceleration", "Current state"], 4);
  return frCanvas([
    ...frHeader(c.label, "06 / 12"),
    frTitle(c.heading ?? "How It Developed", 72, 96, 620, 52),
    frText({ text: bodyText(c, "Each stage adds context, showing how decisions, events, or conditions compound over time."), left: 76, top: 184, width: 560, fontSize: 22, fill: FR.muted, lineHeight: 1.3 }),
    ...flow.map((step, i) => [
      frText({ text: String(i + 1).padStart(2, "0"), left: 760, top: 125 + i * 106, width: 60, fontSize: 30, fill: colors[i], fontWeight: "900" }),
      ...frBox(830, 116 + i * 106, 320, 74, colors[i], "rgba(255,255,255,0.36)"),
      frText({ text: step, left: 850, top: 140 + i * 106, width: 280, fontSize: adaptFs([step], 280, 20, 13), fill: FR.ink, fontWeight: "800" }),
    ]).flat(),
  ]);
};

export const frMapProcess: CanvasBuilder = (_t, c = {}) => {
  const flow = steps(c, ["Input", "Movement", "Pressure", "Outcome"], 4);
  return frCanvas([
    ...frHeader(c.label, "06 / 12"),
    frTitle(c.heading ?? "Route Through the System", 72, 96, 760, 50),
    frText({ text: bodyText(c, "This process view turns a complex topic into a route readers can follow from cause to consequence."), left: 76, top: 184, width: 820, fontSize: 21, fill: FR.muted, lineHeight: 1.3 }),
    ...flow.map((step, i) => {
      const x = 140 + i * 270;
      const y = i % 2 ? 480 : 350;
      return [
        ...frBox(x, y, 210, 92, colors[i], "rgba(255,255,255,0.34)"),
        frText({ text: step, left: x + 18, top: y + 34, width: 174, fontSize: adaptFs([step], 174, 19, 13), fill: FR.ink, textAlign: "center", fontWeight: "800" }),
      ];
    }).flat(),
  ]);
};

export const frCompare: CanvasBuilder = (_t, c = {}) => {
  const left = (c.leftPoints?.length ? c.leftPoints : points(c, ["Earlier condition", "Constraint", "Local effect"], 3)).slice(0, 4);
  const right = (c.rightPoints?.length ? c.rightPoints : steps(c, ["Current condition", "Opportunity", "Wider effect"], 3)).slice(0, 4);
  return frCanvas([
    ...frHeader(c.label, "07 / 12"),
    frTitle(c.heading ?? "Before and After", 72, 94, 760, 50),
    ...frBox(80, 185, 520, 430, FR.rust, "rgba(255,255,255,0.36)"),
    ...frBox(680, 185, 520, 430, FR.navy, "rgba(255,255,255,0.36)"),
    frText({ text: c.subheading ?? "Before", left: 112, top: 232, width: 420, fontSize: 30, fill: FR.rust, fontWeight: "900" }),
    frText({ text: c.quote ?? "After", left: 712, top: 232, width: 420, fontSize: 30, fill: FR.navy, fontWeight: "900" }),
    ...left.map((p, i) => frBullet(p, 116, 320 + i * 58, 410, FR.rust)).flat(),
    ...right.map((p, i) => frBullet(p, 716, 320 + i * 58, 410, FR.navy)).flat(),
  ]);
};

export const frCompareB: CanvasBuilder = (_t, c = {}) => {
  const left = (c.leftPoints?.length ? c.leftPoints : points(c, ["Pressure", "Friction", "Risk"], 3)).slice(0, 3);
  const right = (c.rightPoints?.length ? c.rightPoints : steps(c, ["Response", "Benefit", "Decision"], 3)).slice(0, 3);
  const heading = c.heading ?? "Tradeoffs";
  const headingFs = compactTitle(heading, 560, 48);
  const body = bodyText(c, "A useful report makes the tradeoff visible, not just the preferred answer.");
  const bodyTop = clamp(104 + titleBlockH(heading, 560, 48) + 26, 205, 300);
  const fs = bodyFs(body, bodyTop > 230 ? 24 : 27, 19);
  const listTop = clamp(bodyTop + estimateH(body, 520, fs, 1.28) + 56, 230, 330);
  const rowGap = listTop > 285 ? 72 : 82;
  return frCanvas([
    ...frHeader(c.label, "07 / 12"),
    frTitle(heading, 72, 104, 560, headingFs),
    frText({ text: body, left: 76, top: bodyTop, width: 520, fontSize: fs, fill: FR.muted, lineHeight: 1.28 }),
    ...left.map((p, i) => frBullet(p, 650, listTop + i * rowGap, 250, FR.rust, i)).flat(),
    rct({ left: W / 2 + 225, top: 150, width: 2, height: 390, fill: FR.faint }),
    ...right.map((p, i) => frBullet(p, 960, listTop + i * rowGap, 230, FR.navy, i)).flat(),
  ]);
};

export const frStats: CanvasBuilder = (_t, c = {}) => {
  const stats = (c.stats?.length ? c.stats : [
    { value: "3x", label: "Measured signal" },
    { value: "42%", label: "Affected segment" },
    { value: "12", label: "Observed cases" },
  ]).slice(0, 3);
  const body = bodyText(c, "Numbers should clarify the story, not replace it. This slide adds interpretation beside the metrics.");
  return frCanvas([
    ...frHeader(c.label, "08 / 12"),
    frTitle(c.heading ?? "Evidence in Numbers", 72, 96, 690, 50),
    frText({ text: body, left: 76, top: 188, width: 760, fontSize: bodyFs(body, 26, 20), fill: FR.muted, lineHeight: 1.32 }),
    ...stats.map((s, i) => [
      ...frBox(92 + i * 385, 405, 315, 150, colors[i], "rgba(255,255,255,0.38)"),
      frText({ text: s.value, left: 116 + i * 385, top: 448, width: 267, fontSize: adaptFs([s.value], 267, 46, 30), fill: colors[i], fontWeight: "900", textAlign: "center" }),
      frText({ text: s.label, left: 126 + i * 385, top: 510, width: 247, fontSize: adaptFs([s.label], 247, 17, 12), fill: FR.ink, textAlign: "center", lineHeight: 1.16 }),
    ]).flat(),
  ]);
};

export const frStatsB: CanvasBuilder = (_t, c = {}) => {
  const stats = (c.stats?.length ? c.stats : [
    { value: "3x", label: "Measured signal" },
    { value: "42%", label: "Affected segment" },
    { value: "12", label: "Observed cases" },
  ]).slice(0, 4);
  const body = bodyText(c, "The report should explain what the numbers mean and what they do not prove on their own.");
  return frCanvas([
    ...frHeader(c.label, "08 / 12"),
    frTitle(c.heading ?? "Measured Signals", 72, 96, 560, 52),
    frText({ text: body, left: 76, top: 196, width: 520, fontSize: bodyFs(body, 23, 17), fill: FR.muted, lineHeight: 1.32 }),
    ...stats.map((s, i) => {
      const x = 690 + (i % 2) * 245;
      const y = 140 + Math.floor(i / 2) * 220;
      return [
        ...frBox(x, y, 210, 155, colors[i], "rgba(255,255,255,0.38)"),
        frText({ text: s.value, left: x + 18, top: y + 44, width: 174, fontSize: adaptFs([s.value], 174, 42, 28), fill: colors[i], fontWeight: "900", textAlign: "center" }),
        frText({ text: s.label, left: x + 20, top: y + 104, width: 170, fontSize: adaptFs([s.label], 170, 15, 11), fill: FR.ink, textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const frCaseStudy: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, [
    c.subheading ?? "The local example shows the wider pattern",
    c.quote ?? "The case connects lived effects to system pressure",
    "The lesson is to read the example as evidence, not an exception",
  ], 3);
  const body = bodyText(c, "A case study makes the broader argument tangible by showing how it appears in one place, group, or moment.");
  const heading = c.heading ?? "Case Study";
  const headingFs = compactTitle(heading, 650, 48);
  const bodyTop = clamp(92 + titleBlockH(heading, 650, 48) + 26, 174, 250);
  const fs = bodyFs(body, 28, 20);
  const imageTop = 118;
  const imageH = 300;
  const notesTop = clamp(imageTop + imageH + 40, 458, 500);
  return frCanvas([
    ...frHeader(c.label, "09 / 12"),
    frTitle(heading, 72, 92, 650, headingFs),
    frText({ text: body, left: 76, top: bodyTop, width: 560, fontSize: fs, fill: FR.muted, lineHeight: 1.32 }),
    ...frImageSlot({ ...imageContent(c, "case study image"), x: 704, y: imageTop, w: 450, h: imageH, label: "Case image", color: FR.rust }),
    ...pts.map((p, i) => frBullet(p, 720, notesTop + i * 58, 390, colors[i], i)).flat(),
  ]);
};

export const frCaseStudyB: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, [
    c.subheading ?? "The case gives the report a concrete place to stand",
    c.quote ?? "The tension shows where policy, behavior, or environment collide",
    "The lesson is specific enough to guide the broader conclusion",
  ], 3);
  const body = bodyText(c, "A case study makes the broader argument tangible by showing how it appears in one place, group, or moment.");
  const heading = c.heading ?? "Case Study";
  const headingFs = compactTitle(heading, 540, 48);
  const bodyTop = clamp(130 + titleBlockH(heading, 540, 48) + 24, 220, 300);
  const fs = bodyFs(body, 27, 20);
  const notesTop = clamp(bodyTop + estimateH(body, 500, fs, 1.32) + 34, 430, 500);
  return frCanvas([
    ...frHeader(c.label, "09 / 12"),
    ...frImageSlot({ ...imageContent(c, "case study image"), x: 66, y: 120, w: 480, h: 450, label: "Case image", color: FR.navy }),
    frTitle(heading, 610, 130, 540, headingFs),
    frText({ text: body, left: 614, top: bodyTop, width: 500, fontSize: fs, fill: FR.ink, lineHeight: 1.32 }),
    ...pts.map((p, i) => frBullet(p, 630, notesTop + i * 54, 460, colors[i])).flat(),
  ]);
};

export const frQuote: CanvasBuilder = (_t, c = {}) => {
  const quote = c.quote ?? "The evidence changes the question we should be asking.";
  const body = bodyText(c, "A good quote slide should add context, not only decoration. Use this space to explain the implication.");
  const pts = points(c, ["What it clarifies", "Why it matters", "What follows"], 3);
  return frCanvas([
    ...frHeader(c.label, "10 / 12"),
    frText({ text: "“", left: 102, top: 104, width: 100, fontSize: 130, fill: hexToRgba(FR.rust, 0.35), fontWeight: "900" }),
    frTitle(quote, 186, 170, 820, compactTitle(quote, 820, 48)),
    frRule(250, 382, 640, FR.navy, 3),
    frText({ text: c.author ?? c.heading ?? "Source context", left: 290, top: 410, width: 560, fontSize: 18, fill: FR.muted, textAlign: "center", fontWeight: "700" }),
    frText({ text: body, left: 230, top: 470, width: 680, fontSize: bodyFs(body, 24, 19), fill: FR.ink, textAlign: "center", lineHeight: 1.32 }),
    ...pts.map((p, i) => [
      ...frBox(112 + i * 350, 610, 300, 70, colors[i], "rgba(255,255,255,0.34)"),
      frText({ text: p, left: 132 + i * 350, top: 632, width: 260, fontSize: adaptFs([p], 260, 17, 12), fill: FR.ink, textAlign: "center", fontWeight: "800" }),
    ]).flat(),
  ]);
};

export const frQuoteB: CanvasBuilder = (_t, c = {}) => {
  const quote = c.quote ?? "The evidence changes the question we should be asking.";
  const body = bodyText(c, "A good quote slide should add context, not only decoration. Use this space to explain the implication.");
  return frCanvas([
    ...frHeader(c.label, "10 / 12"),
    ...frBox(76, 126, 760, 430, FR.navy, "rgba(255,255,255,0.34)"),
    frText({ text: "“", left: 112, top: 150, width: 90, fontSize: 106, fill: hexToRgba(FR.navy, 0.28), fontWeight: "900" }),
    frTitle(quote, 170, 240, 590, compactTitle(quote, 590, 42)),
    ...frBox(902, 170, 250, 330, FR.rust, "rgba(255,255,255,0.34)"),
    frText({ text: c.heading ?? "Interpretation", left: 926, top: 210, width: 202, fontSize: 24, fill: FR.rust, fontWeight: "900", textAlign: "center" }),
    frText({ text: body, left: 928, top: 296, width: 198, fontSize: bodyFs(body, 18, 14), fill: FR.ink, textAlign: "center", lineHeight: 1.3 }),
    frText({ text: c.author ?? "", left: 170, top: 494, width: 590, fontSize: 17, fill: FR.muted, textAlign: "center", fontWeight: "700" }),
  ]);
};

export const frClosing: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, ["Main takeaway", "Open question", "Next step"], 3);
  const body = bodyText(c, "Close the report with a practical synthesis: what matters now, what remains uncertain, and what to do next.");
  return frCanvas([
    ...frHeader(c.label, "12 / 12"),
    ...frStamp(c.subheading ?? "Conclusion", 76, 102, FR.rust),
    frTitle(c.heading ?? "What This Means", 72, 164, 760, 58),
    frText({ text: body, left: 76, top: 284, width: 740, fontSize: bodyFs(body, 25, 18), fill: FR.ink, lineHeight: 1.36 }),
    ...pts.map((p, i) => frBullet(p, 92, 500 + i * 50, 620, colors[i], i)).flat(),
    frRule(850, 170, 260, FR.navy, 5),
    frText({ text: c.quote ?? "End of field report", left: 820, top: 222, width: 340, fontSize: 28, fill: FR.navy, fontWeight: "900", textAlign: "center", lineHeight: 1.14 }),
  ]);
};

export const frClosingB: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, ["Main takeaway", "Open question", "Next step"], 3);
  const body = bodyText(c, "Close the report with a practical synthesis: what matters now, what remains uncertain, and what to do next.");
  return frCanvas([
    frText({ text: (c.label ?? "FIELD REPORT").toUpperCase(), left: 0, top: 76, width: W, fontSize: 14, fill: FR.rust, fontWeight: "900", textAlign: "center" }),
    frTitle(c.heading ?? "Final Notes", 140, 160, W - 280, compactTitle(c.heading ?? "Final Notes", W - 280, 64)),
    frText({ text: body, left: 230, top: 318, width: 820, fontSize: bodyFs(body, 24, 18), fill: FR.muted, textAlign: "center", lineHeight: 1.36 }),
    ...pts.map((p, i) => [
      ...frBox(130 + i * 350, 520, 300, 90, colors[i], "rgba(255,255,255,0.36)"),
      frText({ text: p, left: 154 + i * 350, top: 550, width: 252, fontSize: adaptFs([p], 252, 19, 13), fill: FR.ink, textAlign: "center", fontWeight: "800" }),
    ]).flat(),
  ]);
};

// ── NEW NARRATIVE-FOCUSED LAYOUTS ──────────────────────────────────────

export const frWitnessAccount: CanvasBuilder = (_t, c = {}) => {
  const quote = c.quote ?? "This is what happened on the ground, told by someone who was there.";
  const body = bodyText(c, "First-hand accounts add human dimension to abstract evidence. They show how policy, systems, or events affect real people in specific places.");
  const heading = c.heading ?? "Witness Account";
  const headingFs = compactTitle(heading, 520, 48);
  return frCanvas([
    ...frHeader(c.label, "06 / 12"),
    ...frBox(72, 110, 480, 480, FR.rust, "rgba(169,71,43,0.08)"),
    ...frStamp(c.subheading ?? "First-hand testimony", 100, 144, FR.rust),
    frText({ text: "“", left: 108, top: 196, width: 90, fontSize: 110, fill: hexToRgba(FR.rust, 0.26), fontWeight: "900" }),
    frTitle(quote, 180, 250, 340, compactTitle(quote, 340, 34)),
    frText({ text: c.author ?? "Local source", left: 180, top: 490, width: 310, fontSize: 16, fill: FR.muted, fontWeight: "700", textAlign: "center" }),
    frTitle(heading, 630, 130, 520, headingFs),
    frText({ text: body, left: 634, top: 230, width: 500, fontSize: bodyFs(body, 23, 17), fill: FR.ink, lineHeight: 1.34 }),
  ]);
};

export const frMethodology: CanvasBuilder = (_t, c = {}) => {
  const methods = points(c, ["Field interviews", "Document analysis", "Site observation", "Data collection"], 4);
  const body = bodyText(c, "Credible research shows how evidence was gathered, who was consulted, and what sources informed the conclusions.");
  return frCanvas([
    ...frHeader(c.label, "03 / 12"),
    ...frStamp(c.subheading ?? "Research approach", 72, 108, FR.navy),
    frTitle(c.heading ?? "How This Report Was Built", 72, 170, 760, compactTitle(c.heading ?? "How This Report Was Built", 760, 48)),
    frText({ text: body, left: 76, top: 290, width: 680, fontSize: bodyFs(body, 24, 18), fill: FR.ink, lineHeight: 1.34 }),
    ...methods.map((m, i) => {
      const x = 90 + (i % 2) * 540;
      const y = 440 + Math.floor(i / 2) * 105;
      return [
        ...frBox(x, y, 460, 76, colors[i], "rgba(255,255,255,0.36)"),
        frText({ text: String(i + 1).padStart(2, "0"), left: x + 20, top: y + 26, width: 50, fontSize: 26, fill: colors[i], fontWeight: "900" }),
        frText({ text: m, left: x + 80, top: y + 28, width: 350, fontSize: adaptFs([m], 350, 20, 15), fill: FR.ink, fontWeight: "800" }),
      ];
    }).flat(),
  ]);
};

export const frFieldNotes: CanvasBuilder = (_t, c = {}) => {
  const notes = points(c, ["Observation from the scene", "Contextual detail", "Unexpected pattern", "Follow-up question"], 4);
  const body = bodyText(c, "Field notes capture what cannot be pre-planned: the texture, contradictions, and surprises that emerge when evidence meets reality.");
  const heading = c.heading ?? "Notes from the Field";
  const headingFs = compactTitle(heading, 580, 52);
  return frCanvas([
    ...frHeader(c.label, "07 / 12"),
    frTitle(heading, 72, 105, 580, headingFs),
    frText({ text: body, left: 76, top: 225, width: 540, fontSize: bodyFs(body, 23, 17), fill: FR.muted, lineHeight: 1.32 }),
    ...frBox(720, 130, 450, 470, FR.olive, hexToRgba(FR.olive, 0.06)),
    frText({ text: (c.subheading ?? "FIELD JOURNAL").toUpperCase(), left: 752, top: 168, width: 386, fontSize: 12, fill: FR.olive, fontWeight: "900" }),
    ...notes.map((n, i) => [
      rct({ left: 760, top: 225 + i * 98, width: 370, height: 72, fill: "rgba(255,255,255,0.4)", rx: 2 }),
      frText({ text: `• ${n}`, left: 780, top: 242 + i * 98, width: 330, fontSize: adaptFs([n], 330, 17, 13), fill: FR.ink, lineHeight: 1.24, fontWeight: "700" }),
    ]).flat(),
  ]);
};

export const frInvestigationSequence: CanvasBuilder = (_t, c = {}) => {
  const sequence = steps(c, ["Initial signal", "Pattern recognition", "Evidence collection", "Analysis", "Conclusion"], 5);
  const body = bodyText(c, "Investigative work follows a sequence: notice, verify, trace connections, test explanations, then draw conclusions.");
  return frCanvas([
    ...frHeader(c.label, "05 / 12"),
    frTitle(c.heading ?? "Investigation Path", 72, 100, 680, 50),
    frText({ text: body, left: 76, top: 196, width: 760, fontSize: bodyFs(body, 26, 20), fill: FR.muted, lineHeight: 1.32 }),
    ...sequence.map((step, i) => {
      const x = 110 + i * 220;
      const y = i % 2 ? 480 : 350;
      const arrowY = i % 2 ? 455 : 405;
      return [
        ...frBox(x, y, 180, 90, colors[i], "rgba(255,255,255,0.36)"),
        frText({ text: String(i + 1), left: x + 20, top: y + 18, width: 40, fontSize: 24, fill: colors[i], fontWeight: "900" }),
        frText({ text: step, left: x + 20, top: y + 50, width: 140, fontSize: adaptFs([step], 140, 16, 12), fill: FR.ink, textAlign: "center", fontWeight: "800" }),
        ...(i < sequence.length - 1 ? [
          rct({ left: x + 180, top: arrowY, width: 40, height: 2, fill: FR.faint }),
          rct({ left: x + 212, top: arrowY - 4, width: 8, height: 2, fill: FR.faint }),
          rct({ left: x + 212, top: arrowY + 2, width: 8, height: 2, fill: FR.faint }),
        ] : []),
      ];
    }).flat(),
  ]);
};

export const frPhotographicEssay: CanvasBuilder = (_t, c = {}) => {
  const caption = bodyText(c, "Visual documentation shows what words cannot fully capture: the physical environment, human faces, material conditions.");
  return frCanvas([
    ...frHeader(c.label, "08 / 12"),
    ...frImageSlot({ ...imageContent(c, "documentary photograph"), x: 72, y: 96, w: 540, h: 360, label: "Primary evidence", color: FR.rust }),
    ...frImageSlot({ ...imageContent(c, "supporting image"), x: 660, y: 96, w: 260, h: 170, label: "Detail view", color: FR.navy }),
    ...frImageSlot({ ...imageContent(c, "context image"), x: 660, y: 286, w: 260, h: 170, label: "Context", color: FR.olive }),
    frTitle(c.heading ?? "Visual Evidence", 76, 490, 620, compactTitle(c.heading ?? "Visual Evidence", 620, 44)),
    frText({ text: caption, left: 80, top: 580, width: 1000, fontSize: bodyFs(caption, 21, 16), fill: FR.ink, lineHeight: 1.32 }),
  ]);
};

export const frVoicesFromField: CanvasBuilder = (_t, c = {}) => {
  const voices = points(c, [
    c.subheading ?? "What one group experienced",
    c.quote ?? "What another group observed",
    "What a third perspective revealed",
  ], 3);
  const body = bodyText(c, "Multiple voices show the range of experience: what is shared, what differs, and whose perspective has been left out.");
  return frCanvas([
    ...frHeader(c.label, "09 / 12"),
    frTitle(c.heading ?? "Multiple Perspectives", 72, 100, 740, 52),
    frText({ text: body, left: 76, top: 210, width: 840, fontSize: bodyFs(body, 23, 17), fill: FR.ink, lineHeight: 1.32 }),
    ...voices.map((v, i) => [
      ...frBox(90, 360 + i * 92, 1100, 72, colors[i], "rgba(255,255,255,0.36)"),
      frText({ text: String(i + 1).padStart(2, "0"), left: 118, top: 384 + i * 92, width: 50, fontSize: 24, fill: colors[i], fontWeight: "900" }),
      frText({ text: v, left: 190, top: 384 + i * 92, width: 960, fontSize: adaptFs([v], 960, 19, 14), fill: FR.ink, lineHeight: 1.22, fontWeight: "700" }),
    ]).flat(),
  ]);
};
