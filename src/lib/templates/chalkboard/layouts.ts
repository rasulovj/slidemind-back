import { W, H, hexToRgba, rct } from "../helpers";
import type { CanvasBuilder, SlideContent } from "../types";
import {
  CB,
  arrow,
  arrowBetweenBoxes,
  boardFrame,
  chalkBullet,
  chalkCanvas,
  chalkImageSlot,
  chalkLine,
  chalkText,
  conceptNode,
  coordinatePlane,
  formulaBox,
  lessonHeader,
  miniBars,
  roughBox,
} from "./helpers";

const fallbackPoints = ["Understand the core idea", "Connect it to prior knowledge", "Apply it in a worked example", "Explain the result clearly"];
const fallbackSteps = ["Identify what is given", "Choose the right rule", "Substitute carefully", "Interpret the answer"];

// Returns a clamped font size based on the longest text vs available width.
// Comic Sans character width ≈ fontSize * 0.56
function adaptFs(texts: string[], widthPx: number, base: number, min: number): number {
  const maxLen = Math.max(...texts.map(t => t.length), 1);
  const charsAtBase = (widthPx / base) / 0.56;
  if (maxLen <= charsAtBase) return base;
  if (maxLen <= charsAtBase * 1.7) return Math.max(min, base - 4);
  return min;
}

// Vertical space per bullet item given font size (assumes up to ~2 wrapped lines).
function bulletRowH(fontSize: number): number {
  return Math.ceil(fontSize * 1.32 * 2) + 6;
}

function title(text: string, y = 82, size = 52) {
  return chalkText({
    text,
    left: 58,
    top: y,
    width: W - 116,
    fontSize: size,
    fill: CB.chalk,
    fontWeight: "700",
    lineHeight: 1.08,
  });
}

function bodyText(c: SlideContent, fallback: string) {
  return c.body ?? c.subheading ?? fallback;
}

function hasImage(c: SlideContent) {
  return Boolean(c.imageUrl || c.imageQuery);
}

export const cbTitle: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Technical Classroom";
  const subtitle = c.subheading ?? "A guided lesson from first idea to conclusion";
  const keySymbol = c.quote ?? "";
  const decorStrip = c.body ?? "";
  return chalkCanvas([
    ...boardFrame(),
    chalkText({ text: "LESSON", left: 78, top: 70, width: 160, fontSize: 18, fill: CB.yellow, fontWeight: "700" }),
    chalkText({ text: heading, left: 78, top: 144, width: 780, fontSize: heading.length > 34 ? 58 : 72, fill: CB.chalk, fontWeight: "700", lineHeight: 1.05 }),
    chalkLine(82, 330, 760, 326, hexToRgba(CB.yellow, 0.72), 5),
    chalkText({ text: subtitle, left: 82, top: 364, width: 620, fontSize: 28, fill: CB.muted, lineHeight: 1.36 }),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 900, y: 118, w: 250, h: 250, color: CB.cyan, label: "Visual cue" })
      : [
          ...roughBox(900, 118, 250, 250, CB.cyan, "rgba(0,0,0,0.08)"),
          ...(keySymbol ? [chalkText({ text: keySymbol, left: 916, top: 200, width: 220, fontSize: keySymbol.length > 16 ? 22 : 30, fill: CB.yellow, textAlign: "center", fontWeight: "700", lineHeight: 1.2 })] : []),
        ]),
    ...(hasImage(c) && keySymbol ? [chalkText({ text: keySymbol, left: 916, top: 392, width: 220, fontSize: keySymbol.length > 16 ? 18 : 22, fill: CB.yellow, textAlign: "center", fontWeight: "700", lineHeight: 1.2 })] : []),
    chalkText({ text: c.label ?? "", left: 84, top: 620, width: 480, fontSize: 20, fill: CB.green, fontWeight: "700" }),
    ...(decorStrip ? [chalkText({ text: decorStrip, left: 690, top: 612, width: 500, fontSize: 20, fill: "rgba(244,240,220,0.22)", textAlign: "right" })] : []),
  ]);
};

export const cbObjectives: CanvasBuilder = (_t, c = {}) => {
  const points = (c.points?.length ? c.points : fallbackPoints).slice(0, 4);
  const fs = adaptFs(points, 340, 25, 16);
  const cardH = Math.max(118, bulletRowH(fs) + 28);
  const rowGap = Math.min(170, cardH + 20);
  return chalkCanvas([
    ...lessonHeader(c.label, "02 / 12"),
    title(c.heading ?? "Learning Objectives"),
    chalkText({ text: bodyText(c, "By the end, students should be able to reason from the idea to a correct solution."), left: 62, top: 154, width: 610, fontSize: 24, fill: CB.muted, lineHeight: 1.34 }),
    ...points.map((pt, i) => {
      const x = 76 + (i % 2) * 550;
      const y = 258 + Math.floor(i / 2) * rowGap;
      return [
        ...roughBox(x, y, 470, cardH, i % 2 ? CB.green : CB.yellow, "rgba(244,240,220,0.035)"),
        chalkText({ text: `0${i + 1}`, left: x + 18, top: y + cardH / 2 - 22, width: 58, fontSize: 34, fill: i % 2 ? CB.green : CB.yellow, fontWeight: "700" }),
        chalkText({ text: pt, left: x + 90, top: y + cardH / 2 - fs * 0.7, width: 340, fontSize: fs, fill: CB.chalk, lineHeight: 1.28 }),
      ];
    }).flat(),
    chalkLine(70, 642, 1190, 642, hexToRgba(CB.chalk, 0.14), 2),
  ]);
};

export const cbConceptMap: CanvasBuilder = (_t, c = {}) => {
  const nodes = (c.points?.length ? c.points : ["Core idea", "Inputs", "Rule", "Output", "Checks", "Meaning"]).slice(0, 6);
  // Center node geometry
  const CN = { x: 500, y: 172, w: 280, h: 58 };
  // Satellite node geometry (all same size)
  const SW = 250, SH = 58;
  const positions = [[160, 170], [900, 170], [142, 390], [900, 390], [500, 505]];
  return chalkCanvas([
    ...lessonHeader(c.label, "03 / 12"),
    title(c.heading ?? "Concept Map", 78, 50),
    ...conceptNode(c.subheading ?? nodes[0], CN.x, CN.y, CN.w, CB.yellow),
    ...nodes.slice(1).map((node, i) => {
      const [x, y] = positions[i] ?? [160, 170];
      return [
        ...arrowBetweenBoxes(CN.x, CN.y, CN.w, CN.h, x, y, SW, SH, i % 2 ? CB.green : CB.cyan),
        ...conceptNode(node, x, y, SW, i % 2 ? CB.green : CB.cyan),
      ];
    }).flat(),
    chalkText({ text: bodyText(c, "Use this map to show how the terms, rules, and checks connect before solving."), left: 352, top: 635, width: 580, fontSize: 20, fill: CB.muted, textAlign: "center" }),
  ]);
};

export const cbDefinition: CanvasBuilder = (_t, c = {}) => {
  const term = c.heading ?? "Key Definition";
  const parts = (c.points?.length ? c.points : ["What the term means", "Why it matters", "How we recognize it"]).slice(0, 3);
  const CARD_W = Math.floor((W - 140) / 3) - 10;
  const CARD_H = 188;
  const CARD_Y = 462;
  return chalkCanvas([
    ...lessonHeader(c.label, "04 / 12"),
    title(term, 78, 50),
    // Main definition box
    ...roughBox(70, 162, 662, 240, CB.yellow, "rgba(244,240,220,0.035)"),
    chalkText({ text: bodyText(c, "Explain the main idea in plain classroom language, then connect it to the formal version."),
      left: 106, top: 188, width: 594, fontSize: 28, fill: CB.chalk, lineHeight: 1.42 }),
    // Visual model box — show quote/key concept if provided, else coordinate plane
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 792, y: 158, w: 368, h: 244, color: CB.cyan, label: "Real-world visual" })
      : c.quote
      ? [...formulaBox(c.quote, 792, 158, 368, 244, CB.cyan)]
      : [...coordinatePlane(792, 158, 368, 244, CB.cyan),
         chalkText({ text: "Visual model", left: 818, top: 164, width: 300, fontSize: 17, fill: CB.cyan, fontWeight: "700" })]),
    // Bottom part cards — roughBox with vertically centered text
    ...parts.map((pt, i) => {
      const color = [CB.yellow, CB.green, CB.cyan][i];
      const cx = 70 + i * (CARD_W + 10);
      return [
        ...roughBox(cx, CARD_Y, CARD_W, CARD_H, color, "rgba(244,240,220,0.028)"),
        chalkText({ text: String(i + 1), left: cx + 14, top: CARD_Y + 14, width: 32, fontSize: 26, fill: color, fontWeight: "700" }),
        chalkText({ text: pt, left: cx + 14, top: CARD_Y + CARD_H / 2 - 16,
          width: CARD_W - 28, fontSize: 22, fill: CB.chalk, textAlign: "center", lineHeight: 1.3 }),
      ];
    }).flat(),
  ]);
};

export const cbFormula: CanvasBuilder = (_t, c = {}) => {
  const formula = c.quote ?? c.heading ?? "Core formula / principle";
  const vars = (c.points?.length ? c.points : ["Variable A: known quantity", "Variable B: changing quantity", "Result: what we solve for"]).slice(0, 4);
  return chalkCanvas([
    ...lessonHeader(c.label, "05 / 12"),
    title(c.subheading ?? "Formula / Principle", 78, 48),
    ...formulaBox(formula, 90, 175, 700, 150, CB.yellow),
    chalkText({ text: bodyText(c, "Use this rule when the quantities have the relationship shown in the model."), left: 110, top: 360, width: 660, fontSize: 25, fill: CB.muted, lineHeight: 1.36 }),
    ...roughBox(850, 150, 330, 430, CB.green, "rgba(0,0,0,0.1)"),
    chalkText({ text: "Variable legend", left: 882, top: 186, width: 260, fontSize: 25, fill: CB.green, fontWeight: "700" }),
    ...vars.map((v, i) => chalkBullet(v, 886, 248 + i * 72, 245, [CB.yellow, CB.cyan, CB.green, CB.red][i])).flat(),
  ]);
};

export const cbExampleSetup: CanvasBuilder = (_t, c = {}) => {
  const givens = (c.points?.length ? c.points : ["Given value or condition", "Constraint to respect", "Unknown we need to find"]).slice(0, 3);
  return chalkCanvas([
    ...lessonHeader(c.label, "06 / 12"),
    title(c.heading ?? "Worked Example 1", 78, 48),
    ...roughBox(70, 154, 640, 170, CB.yellow, "rgba(244,240,220,0.035)"),
    chalkText({ text: bodyText(c, "Set up the problem carefully before doing any calculation or transformation."), left: 100, top: 195, width: 580, fontSize: 27, fill: CB.chalk, lineHeight: 1.34 }),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 760, y: 132, w: 390, h: 300, color: CB.cyan, label: "Example context" })
      : c.quote
      ? [...formulaBox(c.quote, 760, 132, 390, 300, CB.cyan)]
      : [...coordinatePlane(760, 132, 390, 300, CB.cyan)]),
    chalkText({ text: "Givens and unknowns", left: 90, top: 380, width: 390, fontSize: 25, fill: CB.green, fontWeight: "700" }),
    ...(() => { const fs = adaptFs(givens, 520, 22, 14); const rh = bulletRowH(fs); return givens.map((g, i) => chalkBullet(g, 98, 432 + i * rh, 520, [CB.green, CB.yellow, CB.cyan][i])).flat(); })(),
  ]);
};

export const cbSolutionSteps: CanvasBuilder = (_t, c = {}) => {
  const steps = (c.steps?.length ? c.steps : c.points?.length ? c.points : fallbackSteps).slice(0, 5);
  const fs = adaptFs(steps, 820, 24, 14);
  const rowH = Math.max(68, bulletRowH(fs));
  return chalkCanvas([
    ...lessonHeader(c.label, "07 / 12"),
    title(c.heading ?? "Step-by-Step Solution", 78, 46),
    ...steps.map((step, i) => {
      const y = 165 + i * rowH;
      return [
        chalkText({ text: `${i + 1}`, left: 84, top: y + rowH / 2 - 18, width: 44, fontSize: 34, fill: CB.yellow, fontWeight: "700", textAlign: "center" }),
        chalkLine(124, y + rowH / 2, 206, y + rowH / 2, CB.yellow, 3),
        ...roughBox(220, y, 890, rowH, i % 2 ? CB.cyan : CB.green, "rgba(244,240,220,0.025)"),
        chalkText({ text: step, left: 248, top: y + rowH / 2 - fs * 0.72, width: 820, fontSize: fs, fill: CB.chalk }),
      ];
    }).flat(),
  ]);
};

export const cbMistakes: CanvasBuilder = (_t, c = {}) => {
  const wrong = (c.leftPoints?.length ? c.leftPoints : c.points?.slice(0, 3).length ? c.points!.slice(0, 3) : ["Skipping the setup", "Mixing units", "Using the rule outside its conditions"]).slice(0, 3);
  const right = (c.rightPoints?.length ? c.rightPoints : c.steps?.length ? c.steps : ["Write givens first", "Convert units before solving", "Check assumptions before applying"]).slice(0, 3);
  return chalkCanvas([
    ...lessonHeader(c.label, "08 / 12"),
    title(c.heading ?? "Common Mistakes", 78, 48),
    ...roughBox(74, 162, 520, 420, CB.red, "rgba(217,107,95,0.045)"),
    ...roughBox(686, 162, 520, 420, CB.green, "rgba(155,209,139,0.04)"),
    chalkText({ text: "Watch for", left: 112, top: 196, width: 340, fontSize: 30, fill: CB.red, fontWeight: "700" }),
    chalkText({ text: "Correct move", left: 724, top: 196, width: 340, fontSize: 30, fill: CB.green, fontWeight: "700" }),
    chalkLine(116, 248, 174, 206, CB.red, 5),
    chalkLine(116, 206, 174, 248, CB.red, 5),
    chalkLine(734, 226, 762, 252, CB.green, 5),
    chalkLine(762, 252, 820, 196, CB.green, 5),
    ...(() => { const fs = adaptFs([...wrong, ...right], 390, 22, 14); const rh = bulletRowH(fs); return [...wrong.map((pt, i) => chalkBullet(pt, 112, 304 + i * rh, 390, CB.red)).flat(), ...right.map((pt, i) => chalkBullet(pt, 724, 304 + i * rh, 390, CB.green)).flat()]; })(),
  ]);
};

export const cbSecondExample: CanvasBuilder = (_t, c = {}) => {
  const checkpoints = (c.steps?.length ? c.steps : ["Start from the known relationship", "Use the earlier definition", "Compare with the first example"]).slice(0, 3);
  const fs = adaptFs(checkpoints, 560, 22, 14);
  const rh = bulletRowH(fs);
  const boxH = Math.max(160, 68 + checkpoints.length * rh);
  const BOX_Y = Math.min(415, H - boxH - 36);
  return chalkCanvas([
    ...lessonHeader(c.label, "09 / 12"),
    title(c.heading ?? "Worked Example 2", 78, 48),
    chalkText({ text: bodyText(c, "Now apply the same principle in a slightly different situation."), left: 72, top: 150, width: 620, fontSize: 25, fill: CB.muted }),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 760, y: 126, w: 390, h: 270, color: CB.yellow, label: "Second context" })
      : miniBars(760, 126, 390, 270, ["A", "B", "C", "D"], CB.yellow)),
    ...formulaBox(c.quote ?? "Compare -> choose -> solve", 82, 245, 560, 112, CB.cyan),
    ...roughBox(82, BOX_Y, 660, boxH, CB.green, "rgba(0,0,0,0.08)"),
    chalkText({ text: "Guided checkpoints", left: 116, top: BOX_Y + 22, width: 360, fontSize: 22, fill: CB.green, fontWeight: "700" }),
    ...checkpoints.map((pt, i) => chalkBullet(pt, 122, BOX_Y + 58 + i * rh, 560, CB.green, i)).flat(),
  ]);
};

export const cbPractice: CanvasBuilder = (_t, c = {}) => {
  const hints = (c.points?.length ? c.points : ["Identify the known values", "Choose the matching principle", "Check the final units or meaning"]).slice(0, 3);
  return chalkCanvas([
    ...lessonHeader(c.label, "10 / 12"),
    title(c.heading ?? "Practice Prompt", 78, 48),
    ...roughBox(70, 158, 580, 170, CB.yellow, "rgba(244,240,220,0.035)"),
    chalkText({ text: bodyText(c, "Try this one before looking at the solution. Write down your setup first."), left: 102, top: 196, width: 520, fontSize: 27, fill: CB.chalk, lineHeight: 1.32 }),
    ...roughBox(706, 138, 460, 450, CB.cyan, "rgba(0,0,0,0.08)"),
    ...Array.from({ length: 8 }).map((_, i) => chalkLine(730, 190 + i * 44, 1138, 190 + i * 44, hexToRgba(CB.chalk, 0.11), 1)),
    ...Array.from({ length: 6 }).map((_, i) => chalkLine(746 + i * 72, 166, 746 + i * 72, 548, hexToRgba(CB.chalk, 0.08), 1)),
    chalkText({ text: "Workspace", left: 846, top: 154, width: 210, fontSize: 22, fill: CB.cyan, textAlign: "center", fontWeight: "700" }),
    chalkText({ text: "Hints", left: 98, top: 400, width: 200, fontSize: 26, fill: CB.green, fontWeight: "700" }),
    ...(() => { const fs = adaptFs(hints, 520, 22, 14); const rh = bulletRowH(fs); return hints.map((h, i) => chalkBullet(h, 104, 452 + i * rh, 520, CB.green, i)).flat(); })(),
  ]);
};

export const cbTakeaways: CanvasBuilder = (_t, c = {}) => {
  const points = (c.points?.length ? c.points : ["Name the idea precisely", "Use the rule only when conditions fit", "Check the answer against the original question"]).slice(0, 4);
  return chalkCanvas([
    ...lessonHeader(c.label, "11 / 12"),
    title(c.heading ?? "Key Takeaways", 78, 48),
    ...points.map((pt, i) => {
      const x = 80 + i * 292;
      return [
        ...roughBox(x, 180, 240, 255, [CB.yellow, CB.cyan, CB.green, CB.red][i], "rgba(244,240,220,0.03)"),
        chalkText({ text: String(i + 1), left: x + 74, top: 198, width: 92, fontSize: 70, fill: [CB.yellow, CB.cyan, CB.green, CB.red][i], textAlign: "center", fontWeight: "700" }),
        chalkText({ text: pt, left: x + 12, top: 310, width: 216, fontSize: adaptFs(points, 216, 23, 14), fill: CB.chalk, textAlign: "center", lineHeight: 1.28 }),
      ];
    }).flat(),
    ...formulaBox(c.quote ?? c.subheading ?? "Remember: setup -> rule -> solve -> check", 210, 520, 860, 86, CB.yellow),
  ]);
};

export const cbConclusion: CanvasBuilder = (_t, c = {}) => {
  return chalkCanvas([
    ...boardFrame(),
    chalkText({ text: "CONCLUSION", left: 82, top: 76, width: 300, fontSize: 19, fill: CB.yellow, fontWeight: "700" }),
    chalkText({ text: c.heading ?? "Lesson Complete", left: 82, top: 150, width: 800, fontSize: 68, fill: CB.chalk, fontWeight: "700", lineHeight: 1.04 }),
    chalkLine(86, 310, 720, 306, CB.yellow, 5),
    chalkText({ text: bodyText(c, "Today we built the idea, applied it step by step, and checked the reasoning behind the result."), left: 86, top: 350, width: 690, fontSize: 30, fill: CB.muted, lineHeight: 1.36 }),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 865, y: 160, w: 275, h: 275, color: CB.green, label: "Next" })
      : [
          ...roughBox(865, 160, 275, 275, CB.green, "rgba(0,0,0,0.08)"),
          chalkText({ text: "Next", left: 910, top: 205, width: 180, fontSize: 30, fill: CB.green, textAlign: "center", fontWeight: "700" }),
          chalkText({ text: c.subheading ?? "Connect this lesson to the next concept.", left: 900, top: 275, width: 210, fontSize: 24, fill: CB.chalk, textAlign: "center", lineHeight: 1.35 }),
        ]),
    ...(hasImage(c) ? [chalkText({ text: c.subheading ?? "Connect this lesson to the next concept.", left: 852, top: 468, width: 300, fontSize: 20, fill: CB.chalk, textAlign: "center", lineHeight: 1.3 })] : []),
  ]);
};

// ── Flexible chalkboard presentation layouts ───────────────────────────

function points(c: SlideContent, fallback: string[], max = 4) {
  return (c.points?.length ? c.points : fallback).slice(0, max);
}

function steps(c: SlideContent, fallback: string[], max = 5) {
  return (c.steps?.length ? c.steps : c.points?.length ? c.points : fallback).slice(0, max);
}

function compactTitle(text: string, x: number, y: number, w: number, base = 54) {
  return chalkText({
    text,
    left: x,
    top: y,
    width: w,
    fontSize: text.length > 42 ? Math.max(36, base - 14) : text.length > 28 ? base - 8 : base,
    fill: CB.chalk,
    fontWeight: "700",
    lineHeight: 1.08,
  });
}

// Estimates pixel height of a compactTitle so body text can be placed below it.
// Comic Sans character width ≈ fontSize * 0.56
function compactTitleHeight(text: string, width: number, base: number): number {
  const fs = text.length > 42 ? Math.max(36, base - 14) : text.length > 28 ? base - 8 : base;
  const charsPerLine = Math.max(1, Math.floor(width / (fs * 0.56)));
  const lines = Math.ceil(text.length / charsPerLine);
  return Math.ceil(lines * fs * 1.12) + 8;
}

function textBlockHeight(text: string, width: number, fontSize: number, lineHeight = 1.3): number {
  const charsPerLine = Math.max(1, Math.floor(width / (fontSize * 0.56)));
  return Math.ceil(text.length / charsPerLine) * fontSize * lineHeight;
}

function paragraphFontSize(text: string, width: number, max = 24, min = 17): number {
  if (text.length > 185) return Math.max(min, max - 6);
  if (text.length > 140) return Math.max(min, max - 4);
  if (text.length > 95) return Math.max(min, max - 2);
  return max;
}

function clampY(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export const cbFlexCover: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Chalkboard Presentation";
  const subtitle = c.subheading ?? bodyText(c, "A clear, visual story built around the topic.");
  const titleH = compactTitleHeight(heading, 650, 72);
  const lineY = clampY(145 + titleH + 32, 280, 350);
  const subtitleTop = lineY + 38;
  const subtitleFs = paragraphFontSize(subtitle, 610, 28, 20);
  return chalkCanvas([
    ...boardFrame(),
    chalkText({ text: (c.label ?? "Presentation").toUpperCase(), left: 76, top: 66, width: 360, fontSize: 16, fill: CB.green, fontWeight: "700" }),
    compactTitle(heading, 76, 145, 650, 72),
    chalkLine(80, lineY, 650, lineY - 4, CB.yellow, 5),
    chalkText({ text: subtitle, left: 80, top: subtitleTop, width: 610, fontSize: subtitleFs, fill: CB.muted, lineHeight: 1.3 }),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 760, y: 135, w: 440, h: 330, color: CB.cyan, label: "Visual" })
      : [
          ...roughBox(790, 110, 390, 420, CB.cyan, "rgba(0,0,0,0.08)"),
          chalkText({ text: c.quote ?? "Big picture", left: 826, top: 280, width: 318, fontSize: 34, fill: CB.yellow, textAlign: "center", fontWeight: "700" }),
        ]),
    chalkText({ text: c.quote ?? "", left: 80, top: 610, width: 760, fontSize: 22, fill: CB.yellow, fontWeight: "700" }),
  ]);
};

export const cbFlexAgenda: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Context", "Key idea", "Evidence", "Next move"], 5);
  const rowH = Math.min(84, (H - 210) / items.length);
  const agendaHeading = c.heading ?? "What We Will Cover";
  const agendaBodyTop = 92 + compactTitleHeight(agendaHeading, 720, 52) + 8;
  return chalkCanvas([
    ...lessonHeader(c.label, "02 / 12"),
    compactTitle(agendaHeading, 70, 92, 720, 52),
    chalkText({ text: bodyText(c, "A quick map of the story before we go deeper."), left: 74, top: agendaBodyTop, width: 660, fontSize: 23, fill: CB.muted, lineHeight: 1.3 }),
    ...roughBox(800, 110, 330, 430, CB.cyan, "rgba(0,0,0,0.08)"),
    chalkText({ text: c.subheading ?? "Flow", left: 830, top: 145, width: 270, fontSize: 30, fill: CB.cyan, textAlign: "center", fontWeight: "700" }),
    ...items.map((item, i) => {
      const y = 232 + i * rowH;
      return [
        chalkText({ text: String(i + 1).padStart(2, "0"), left: 92, top: y, width: 64, fontSize: 34, fill: [CB.yellow, CB.green, CB.cyan, CB.red, CB.yellow][i], fontWeight: "700" }),
        chalkLine(160, y + 24, 250, y + 24, [CB.yellow, CB.green, CB.cyan, CB.red, CB.yellow][i], 3),
        chalkText({ text: item, left: 270, top: y + 2, width: 430, fontSize: 27, fill: CB.chalk, lineHeight: 1.25 }),
        ...(i < items.length - 1 ? arrow(965, 222 + i * 62, 965, 258 + i * 62, hexToRgba(CB.chalk, 0.35)) : []),
      ];
    }).flat(),
    ...items.slice(0, 4).map((item, i) => conceptNode(item, 850, 200 + i * 72, 230, [CB.yellow, CB.green, CB.cyan, CB.red][i])).flat(),
  ]);
};

export const cbFlexBigIdea: CanvasBuilder = (_t, c = {}) => {
  const ideas = points(c, ["Why it matters", "What changes", "What to do next"], 3);
  const body = bodyText(c, "Use this slide for the central message, thesis, or strategic takeaway.");
  const heading = c.heading ?? "The Big Idea";
  const headingFs = heading.length > 48 ? 48 : heading.length > 34 ? 56 : 64;
  const headingH = textBlockHeight(heading, 1080, headingFs, 1.08);
  const lineY = clampY(110 + headingH + 30, 240, 300);
  const bodyFs = paragraphFontSize(body, 900, 28, 20);
  const bodyTop = lineY + 34;
  const cardY = clampY(bodyTop + textBlockHeight(body, 900, bodyFs, 1.34) + 44, 500, 560);
  return chalkCanvas([
    ...lessonHeader(c.label, "03 / 12"),
    chalkText({ text: heading, left: 90, top: 110, width: 1080, fontSize: headingFs, fill: CB.chalk, fontWeight: "700", textAlign: "center", lineHeight: 1.08 }),
    chalkLine(270, lineY, 1010, lineY - 4, CB.yellow, 5),
    chalkText({ text: body, left: 190, top: bodyTop, width: 900, fontSize: bodyFs, fill: CB.muted, textAlign: "center", lineHeight: 1.34 }),
    ...ideas.map((idea, i) => {
      const x = 115 + i * 370;
      return [
        ...roughBox(x, cardY, 310, 95, [CB.yellow, CB.green, CB.cyan][i], "rgba(244,240,220,0.025)"),
        chalkText({ text: idea, left: x + 18, top: cardY + 28, width: 274, fontSize: adaptFs([idea], 274, 24, 16), fill: CB.chalk, textAlign: "center", fontWeight: "700" }),
      ];
    }).flat(),
  ]);
};

export const cbFlexSplitLeft: CanvasBuilder = (_t, c = {}) => {
  const bullets = points(c, ["A concrete signal", "A useful implication", "A next decision"], 3);
  const body = bodyText(c, "Explain what the visual means and why it matters.");
  const splitLeftHeading = c.heading ?? "Context";
  const splitLeftBodyTop = 118 + compactTitleHeight(splitLeftHeading, 560, 50) + 10;
  const bodyFs = paragraphFontSize(body, 520, 23, 18);
  const bulletTop = clampY(splitLeftBodyTop + textBlockHeight(body, 520, bodyFs, 1.32) + 28, 360, 440);
  return chalkCanvas([
    ...lessonHeader(c.label, "04 / 12"),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 66, y: 145, w: 500, h: 335, color: CB.cyan, label: "Scene" })
      : [...roughBox(66, 118, 500, 420, CB.cyan, "rgba(0,0,0,0.08)")]),
    compactTitle(splitLeftHeading, 625, 118, 560, 50),
    chalkText({ text: body, left: 628, top: splitLeftBodyTop, width: 520, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.32 }),
    ...bullets.map((b, i) => chalkBullet(b, 642, bulletTop + i * 56, 470, [CB.yellow, CB.green, CB.cyan][i])).flat(),
  ]);
};

export const cbFlexSplitRight: CanvasBuilder = (_t, c = {}) => {
  const bullets = points(c, ["Core detail", "Customer impact", "Operational effect"], 3);
  const body = bodyText(c, "Use this layout for a concise explanation beside a strong image.");
  const splitRightHeading = c.heading ?? "Key Detail";
  const splitRightBodyTop = 112 + compactTitleHeight(splitRightHeading, 560, 50) + 10;
  const bodyFs = paragraphFontSize(body, 520, 23, 18);
  const bulletTop = clampY(splitRightBodyTop + textBlockHeight(body, 520, bodyFs, 1.32) + 28, 360, 440);
  return chalkCanvas([
    ...lessonHeader(c.label, "05 / 12"),
    compactTitle(splitRightHeading, 72, 112, 560, 50),
    chalkText({ text: body, left: 76, top: splitRightBodyTop, width: 520, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.32 }),
    ...bullets.map((b, i) => chalkBullet(b, 92, bulletTop + i * 56, 470, [CB.yellow, CB.green, CB.cyan][i])).flat(),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 700, y: 125, w: 500, h: 380, color: CB.yellow, label: "Visual evidence" })
      : [...roughBox(700, 125, 500, 380, CB.yellow, "rgba(0,0,0,0.08)")]),
    chalkText({ text: c.quote ?? "", left: 718, top: 544, width: 464, fontSize: 20, fill: CB.yellow, textAlign: "center", fontWeight: "700" }),
  ]);
};

export const cbFlexCompare: CanvasBuilder = (_t, c = {}) => {
  const left = (c.leftPoints?.length ? c.leftPoints : c.points?.slice(0, 3).length ? c.points!.slice(0, 3) : ["Current state", "Constraint", "Tradeoff"]).slice(0, 4);
  const right = (c.rightPoints?.length ? c.rightPoints : c.steps?.length ? c.steps : ["Better state", "Opportunity", "Decision"]).slice(0, 4);
  const leftLabel = c.subheading ?? "Option A";
  const rightLabel = c.quote ?? "Option B";
  // Adapt label font size so long AI-generated labels don't overflow into bullets
  const labelFs = (t: string) => t.length > 40 ? 18 : t.length > 24 ? 24 : 32;
  const leftLabelFs = labelFs(leftLabel);
  const rightLabelFs = labelFs(rightLabel);
  const labelRenderedH = (t: string, fs: number) => {
    const cpl = Math.max(1, Math.floor(420 / (fs * 0.56)));
    return Math.ceil(t.length / cpl) * fs * 1.12 + 10;
  };
  const bulletTop = 215 + Math.max(labelRenderedH(leftLabel, leftLabelFs), labelRenderedH(rightLabel, rightLabelFs)) + 14;
  const vsTop = bulletTop + Math.max(left.length, right.length) * 33;
  return chalkCanvas([
    ...lessonHeader(c.label, "06 / 12"),
    compactTitle(c.heading ?? "Compare the Options", 70, 88, 900, 50),
    ...roughBox(78, 180, 520, 420, CB.yellow, "rgba(244,240,220,0.025)"),
    ...roughBox(682, 180, 520, 420, CB.green, "rgba(244,240,220,0.025)"),
    chalkText({ text: leftLabel, left: 112, top: 215, width: 420, fontSize: leftLabelFs, fill: CB.yellow, fontWeight: "700", lineHeight: 1.12 }),
    chalkText({ text: rightLabel, left: 716, top: 215, width: 420, fontSize: rightLabelFs, fill: CB.green, fontWeight: "700", lineHeight: 1.12 }),
    ...left.map((pt, i) => chalkBullet(pt, 116, bulletTop + i * 62, 405, CB.yellow)).flat(),
    ...right.map((pt, i) => chalkBullet(pt, 720, bulletTop + i * 62, 405, CB.green)).flat(),
    chalkText({ text: "vs", left: 604, top: Math.max(340, vsTop - 30), width: 72, fontSize: 48, fill: CB.cyan, textAlign: "center", fontWeight: "700" }),
  ]);
};

export const cbFlexProcess: CanvasBuilder = (_t, c = {}) => {
  const flow = steps(c, ["Start", "Build", "Test", "Launch", "Learn"], 5);
  const body = bodyText(c, "A simple path from starting point to result.");
  const processHeading = c.heading ?? "How It Works";
  const processBodyTop = 88 + compactTitleHeight(processHeading, 760, 50) + 8;
  const bodyFs = paragraphFontSize(body, 900, 22, 17);
  const flowTop = clampY(processBodyTop + textBlockHeight(body, 900, bodyFs, 1.3) + 40, 260, 315);
  const cardW = flow.length <= 3 ? 210 : 170;
  const cardH = flow.length <= 3 ? 126 : 112;
  const cardGap = flow.length <= 3 ? 72 : 56;
  const rowW = flow.length * cardW + Math.max(0, flow.length - 1) * cardGap;
  const startX = Math.max(70, (W - rowW) / 2);
  const rowGap = Math.max(92, Math.min(118, (650 - flowTop) / Math.max(1, Math.ceil(flow.length / 2))));
  return chalkCanvas([
    ...lessonHeader(c.label, "07 / 12"),
    compactTitle(processHeading, 70, 88, 760, 50),
    chalkText({ text: body, left: 74, top: processBodyTop, width: 900, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.3 }),
    ...flow.map((step, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = i % 2 ? flowTop + rowGap : flowTop;
      return [
        ...roughBox(x, y, cardW, cardH, [CB.yellow, CB.green, CB.cyan, CB.red, CB.yellow][i], "rgba(244,240,220,0.025)"),
        chalkText({ text: String(i + 1), left: x + 14, top: y + 12, width: 36, fontSize: 30, fill: [CB.yellow, CB.green, CB.cyan, CB.red, CB.yellow][i], fontWeight: "700" }),
        chalkText({ text: step, left: x + 20, top: y + (flow.length <= 3 ? 62 : 58), width: cardW - 40, fontSize: adaptFs([step], cardW - 40, flow.length <= 3 ? 22 : 20, 13), fill: CB.chalk, textAlign: "center", lineHeight: 1.2 }),
        ...(i < flow.length - 1 ? arrow(x + cardW, y + cardH / 2, x + cardW + cardGap, (i % 2 ? flowTop : flowTop + rowGap) + cardH / 2, CB.muted) : []),
      ];
    }).flat(),
  ]);
};

export const cbFlexEvidence: CanvasBuilder = (_t, c = {}) => {
  const stats = (c.stats?.length ? c.stats : [
    { value: "3x", label: "Signal strength" },
    { value: "42%", label: "Measured change" },
    { value: "12", label: "Key segments" },
  ]).slice(0, 3);
  const body = bodyText(c, "Use a few strong signals instead of a crowded chart.");
  const evidenceHeading = c.heading ?? "Evidence";
  const evidenceBodyTop = 90 + compactTitleHeight(evidenceHeading, 760, 50) + 8;
  const bodyFs = paragraphFontSize(body, 900, 22, 17);
  const statsTop = clampY(evidenceBodyTop + textBlockHeight(body, 900, bodyFs, 1.3) + 38, 240, 300);
  return chalkCanvas([
    ...lessonHeader(c.label, "08 / 12"),
    compactTitle(evidenceHeading, 70, 90, 760, 50),
    chalkText({ text: body, left: 74, top: evidenceBodyTop, width: 900, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.3 }),
    ...stats.map((stat, i) => {
      const x = 92 + i * 385;
      return [
        ...roughBox(x, statsTop, 315, 250, [CB.yellow, CB.green, CB.cyan][i], "rgba(0,0,0,0.08)"),
        chalkText({ text: stat.value, left: x + 20, top: statsTop + 45, width: 275, fontSize: 62, fill: [CB.yellow, CB.green, CB.cyan][i], textAlign: "center", fontWeight: "700" }),
        chalkText({ text: stat.label, left: x + 28, top: statsTop + 140, width: 260, fontSize: 24, fill: CB.chalk, textAlign: "center", lineHeight: 1.25 }),
      ];
    }).flat(),
    chalkText({ text: c.quote ?? "", left: 180, top: 590, width: 920, fontSize: 22, fill: CB.yellow, textAlign: "center", fontWeight: "700" }),
  ]);
};

export const cbFlexWideImage: CanvasBuilder = (_t, c = {}) => {
  const quoteText = c.quote ?? "What it means";
  const body = bodyText(c, "Let the image carry the context, then add one sharp explanation.");
  const quoteFs = quoteText.length > 40 ? 19 : quoteText.length > 20 ? 23 : 27;
  const quoteCpl = Math.max(1, Math.floor(270 / (quoteFs * 0.56)));
  const quoteLines = Math.ceil(quoteText.length / quoteCpl);
  const quoteH = quoteLines * quoteFs * 1.25 + 8;
  const bodyTop = 215 + quoteH + 20;
  const bodyFs = body.length > 120 ? 17 : body.length > 70 ? 19 : 22;
  return chalkCanvas([
    ...lessonHeader(c.label, "09 / 12"),
    compactTitle(c.heading ?? "Visual Story", 70, 84, 760, 48),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 112, y: 155, w: 650, h: 510, color: CB.cyan, label: "Scene" })
      : [...roughBox(112, 155, 650, 510, CB.cyan, "rgba(0,0,0,0.08)")]),
    ...roughBox(820, 155, 340, 510, CB.yellow, "rgba(244,240,220,0.025)"),
    chalkText({ text: quoteText, left: 848, top: 215, width: 276, fontSize: quoteFs, fill: CB.yellow, textAlign: "center", fontWeight: "700", lineHeight: 1.25 }),
    chalkText({ text: body, left: 848, top: bodyTop, width: 276, fontSize: bodyFs, fill: CB.chalk, textAlign: "center", lineHeight: 1.3 }),
  ]);
};

export const cbFlexPinnedPhoto: CanvasBuilder = (_t, c = {}) => {
  const notes = points(c, ["Observation", "Pattern", "Implication"], 3);
  const body = bodyText(c, "A looser chalkboard layout for observations, examples, or narrative moments.");
  const pinnedHeading = c.heading ?? "Field Notes";
  const pinnedBodyTop = 92 + compactTitleHeight(pinnedHeading, 660, 50) + 8;
  return chalkCanvas([
    ...lessonHeader(c.label, "10 / 12"),
    compactTitle(pinnedHeading, 72, 92, 660, 50),
    chalkText({ text: body, left: 76, top: pinnedBodyTop, width: 590, fontSize: body.length > 150 ? 19 : 22, fill: CB.muted, lineHeight: 1.3 }),
    ...notes.map((note, i) => [
      chalkLine(92, 294 + i * 90, 520, 292 + i * 90, hexToRgba([CB.yellow, CB.green, CB.cyan][i], 0.8), 3),
      chalkText({ text: note, left: 108, top: 310 + i * 90, width: 500, fontSize: 27, fill: CB.chalk, lineHeight: 1.25 }),
    ]).flat(),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 730, y: 140, w: 410, h: 250, color: CB.yellow, label: "Pinned photo" })
      : [...roughBox(760, 130, 330, 260, CB.yellow, "rgba(0,0,0,0.08)")]),
    chalkLine(742, 116, 796, 88, CB.red, 5),
    chalkLine(1078, 110, 1125, 83, CB.red, 5),
    ...roughBox(720, 450, 420, 116, CB.green, "rgba(244,240,220,0.025)"),
    chalkText({ text: c.quote ?? c.subheading ?? "What this tells us", left: 750, top: 485, width: 360, fontSize: 25, fill: CB.green, textAlign: "center", fontWeight: "700" }),
  ]);
};

export const cbFlexQuote: CanvasBuilder = (_t, c = {}) => {
  const quote = c.quote ?? bodyText(c, "A memorable line that captures the point.");
  const body = bodyText(c, c.author ?? c.subheading ?? "This callout turns the previous slides into a practical takeaway.");
  const context = points(c, ["What it means", "Why it matters", "What to do"], 3);
  const quoteFs = quote.length > 105 ? 30 : quote.length > 80 ? 36 : quote.length > 48 ? 42 : 48;
  const bodyFs = paragraphFontSize(body, 760, 22, 17);
  return chalkCanvas([
    ...lessonHeader(c.label, "11 / 12"),
    chalkText({ text: "“", left: 112, top: 110, width: 130, fontSize: 130, fill: hexToRgba(CB.yellow, 0.7), fontWeight: "700" }),
    chalkText({ text: quote, left: 210, top: 160, width: 850, fontSize: quoteFs, fill: CB.chalk, textAlign: "center", lineHeight: 1.2, fontWeight: "700" }),
    chalkLine(310, 380, 970, 376, CB.cyan, 4),
    chalkText({ text: c.heading ?? c.author ?? c.subheading ?? "Key takeaway", left: 320, top: 406, width: 640, fontSize: 24, fill: CB.yellow, textAlign: "center", fontWeight: "700" }),
    chalkText({ text: body, left: 260, top: 455, width: 760, fontSize: bodyFs, fill: CB.muted, textAlign: "center", lineHeight: 1.3 }),
    ...context.map((item, i) => {
      const x = 128 + i * 348;
      const color = [CB.yellow, CB.green, CB.cyan][i];
      return [
        ...roughBox(x, 586, 300, 84, color, "rgba(244,240,220,0.025)"),
        chalkText({ text: item, left: x + 18, top: 612, width: 264, fontSize: adaptFs([item], 264, 20, 14), fill: CB.chalk, textAlign: "center", fontWeight: "700" }),
      ];
    }).flat(),
  ]);
};

export const cbFlexClosing: CanvasBuilder = (_t, c = {}) => {
  const closing = points(c, ["Main takeaway", "Best next step", "Decision to make"], 3);
  const body = bodyText(c, "Close with a practical summary and a clear next move.");
  return chalkCanvas([
    ...boardFrame(),
    chalkText({ text: (c.label ?? "Closing").toUpperCase(), left: 82, top: 76, width: 300, fontSize: 18, fill: CB.green, fontWeight: "700" }),
    compactTitle(c.heading ?? "Where This Leads", 82, 150, 760, 64),
    chalkLine(86, 308, 720, 304, CB.yellow, 5),
    chalkText({ text: body, left: 86, top: 342, width: 680, fontSize: body.length > 150 ? 22 : 26, fill: CB.muted, lineHeight: 1.32 }),
    ...closing.map((pt, i) => chalkBullet(pt, 102, 508 + i * 46, 560, [CB.yellow, CB.green, CB.cyan][i], i)).flat(),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 815, y: 165, w: 355, h: 245, color: CB.cyan, label: "Closing visual" })
      : [...roughBox(815, 165, 355, 245, CB.cyan, "rgba(0,0,0,0.08)")]),
    chalkText({ text: c.subheading ?? "Thank you", left: 800, top: 480, width: 390, fontSize: 30, fill: CB.yellow, textAlign: "center", fontWeight: "700" }),
  ]);
};

// ── Variant layouts ────────────────────────────────────────────────────────

export const cbFlexCoverB: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Chalkboard Presentation";
  const subtitle = c.subheading ?? bodyText(c, "A clear, visual story built around the topic.");
  const headingFs = heading.length > 42 ? 58 : heading.length > 28 ? 66 : 76;
  return chalkCanvas([
    ...boardFrame(),
    ...roughBox(60, 52, 58, 58, CB.yellow, "rgba(0,0,0,0)"),
    ...roughBox(W - 118, 52, 58, 58, CB.yellow, "rgba(0,0,0,0)"),
    chalkText({ text: (c.label ?? "Presentation").toUpperCase(), left: 0, top: 68, width: W, fontSize: 16, fill: CB.yellow, fontWeight: "700", textAlign: "center" }),
    chalkText({ text: heading, left: 100, top: 155, width: W - 200, fontSize: headingFs, fill: CB.chalk, fontWeight: "700", lineHeight: 1.08, textAlign: "center" }),
    chalkLine(W / 2 - 200, 365, W / 2 + 200, 361, CB.yellow, 4),
    chalkText({ text: subtitle, left: 100, top: 395, width: W - 200, fontSize: 26, fill: CB.muted, textAlign: "center", lineHeight: 1.3 }),
    chalkText({ text: c.quote ?? "", left: 100, top: 600, width: W - 200, fontSize: 20, fill: CB.yellow, fontWeight: "700", textAlign: "center" }),
  ]);
};

export const cbFlexCoverC: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Chalkboard Presentation";
  const subtitle = c.subheading ?? bodyText(c, "A clear, visual story built around the topic.");
  const headingFs = heading.length > 42 ? 44 : heading.length > 28 ? 54 : 54;
  return chalkCanvas([
    ...boardFrame(),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 0, y: 0, w: 726, h: H, color: CB.cyan, label: "Visual" })
      : [...roughBox(0, 0, 726, H, CB.cyan, "rgba(0,0,0,0.1)")]),
    rct({ left: 726, top: 0, width: 6, height: H, fill: CB.yellow }),
    chalkText({ text: (c.label ?? "Presentation").toUpperCase(), left: 780, top: 120, width: 430, fontSize: 15, fill: CB.green, fontWeight: "700" }),
    chalkText({ text: heading, left: 780, top: 170, width: 430, fontSize: headingFs, fill: CB.chalk, fontWeight: "700", lineHeight: 1.08 }),
    chalkLine(780, 360, 1220, 356, CB.yellow, 4),
    chalkText({ text: subtitle, left: 780, top: 390, width: 430, fontSize: 24, fill: CB.muted, lineHeight: 1.3 }),
    chalkText({ text: c.quote ?? "", left: 780, top: 590, width: 430, fontSize: 19, fill: CB.yellow, fontWeight: "700" }),
  ]);
};

export const cbFlexAgendaB: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Context", "Key idea", "Evidence", "Next move", "Closing"], 5);
  const agendaHeading = c.heading ?? "What We Will Cover";
  const agendaBodyTop = 92 + compactTitleHeight(agendaHeading, W - 140, 52) + 8;
  const body = bodyText(c, "A quick map of the story before we go deeper.");
  const bodyFs = paragraphFontSize(body, W - 160, 23, 18);
  const bodyH = textBlockHeight(body, W - 160, bodyFs, 1.3);
  const cardW = 210;
  const cardGap = 24;
  const rowW = items.length * cardW + Math.max(0, items.length - 1) * cardGap;
  const startX = (W - rowW) / 2;
  const cardY = clampY(agendaBodyTop + bodyH + 78, 355, 430);
  const colors = [CB.yellow, CB.green, CB.cyan, CB.red, CB.yellow];
  return chalkCanvas([
    ...lessonHeader(c.label, "02 / 12"),
    compactTitle(agendaHeading, 70, 92, W - 140, 52),
    chalkText({ text: body, left: 74, top: agendaBodyTop, width: W - 160, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.3 }),
    ...items.map((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = cardY;
      return [
        ...roughBox(x, y, cardW, 148, colors[i], "rgba(244,240,220,0.025)"),
        chalkText({ text: String(i + 1).padStart(2, "0"), left: x + 14, top: y + 14, width: 60, fontSize: 24, fill: colors[i], fontWeight: "700" }),
        chalkLine(x + 14, y + 52, x + cardW - 14, y + 52, colors[i], 2),
        chalkText({ text: item, left: x + 14, top: y + 66, width: cardW - 28, fontSize: adaptFs([item], cardW - 28, 20, 13), fill: CB.chalk, lineHeight: 1.25, textAlign: "center" }),
        ...(i < items.length - 1 ? arrow(x + cardW, y + 74, x + cardW + cardGap, y + 74, hexToRgba(CB.chalk, 0.35)) : []),
      ];
    }).flat(),
  ]);
};

export const cbFlexBigIdeaB: CanvasBuilder = (_t, c = {}) => {
  const ideas = points(c, ["Why it matters", "What changes", "What to do next"], 3);
  const heading = c.heading ?? "The Big Idea";
  const body = bodyText(c, "Use this slide for the central message or strategic takeaway.");
  const headingFs = heading.length > 42 ? 44 : heading.length > 28 ? 52 : 62;
  const bodyFs = body.length > 150 ? 20 : 23;
  return chalkCanvas([
    ...lessonHeader(c.label, "03 / 12"),
    chalkText({ text: heading, left: 90, top: 110, width: 600, fontSize: headingFs, fill: CB.chalk, fontWeight: "700", lineHeight: 1.08 }),
    chalkLine(74, 310, 654, 306, CB.yellow, 4),
    chalkText({ text: body, left: 74, top: 335, width: 580, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.32 }),
    ...ideas.map((idea, i) => {
      const y = 130 + i * 152;
      return [
        ...roughBox(726, y, 484, 130, [CB.yellow, CB.green, CB.cyan][i], "rgba(244,240,220,0.025)"),
        chalkText({ text: String(i + 1), left: 744, top: y + 44, width: 44, fontSize: 36, fill: [CB.yellow, CB.green, CB.cyan][i], fontWeight: "700" }),
        chalkText({ text: idea, left: 800, top: y + 34, width: 394, fontSize: adaptFs([idea], 394, 24, 16), fill: CB.chalk, lineHeight: 1.28, fontWeight: "700" }),
      ];
    }).flat(),
  ]);
};

export const cbFlexSplitLeftB: CanvasBuilder = (_t, c = {}) => {
  const bullets = points(c, ["A concrete signal", "A useful implication", "A next decision"], 3);
  const body = bodyText(c, "Explain what the visual means and why it matters.");
  const heading = c.heading ?? "Context";
  const bodyTop = 152 + compactTitleHeight(heading, 510, 46) + 10;
  const bodyFs = body.length > 150 ? 20 : 23;
  return chalkCanvas([
    ...lessonHeader(c.label, "04 / 12"),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 56, y: 120, w: 540, h: 490, color: CB.cyan, label: "Scene" })
      : [...roughBox(56, 120, 540, 490, CB.cyan, "rgba(0,0,0,0.08)")]),
    rct({ left: 616, top: 110, width: 5, height: 500, fill: hexToRgba(CB.yellow, 0.6) }),
    ...roughBox(638, 120, 570, 490, CB.yellow, "rgba(244,240,220,0.025)"),
    compactTitle(heading, 662, 152, 510, 46),
    chalkText({ text: body, left: 662, top: bodyTop, width: 510, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.32 }),
    chalkBullet(bullets[0] ?? "", 674, 438, 490, CB.yellow),
    chalkBullet(bullets[1] ?? "", 674, 490, 490, CB.green),
    chalkBullet(bullets[2] ?? "", 674, 542, 490, CB.cyan),
  ]);
};

export const cbFlexSplitRightB: CanvasBuilder = (_t, c = {}) => {
  const bullets = points(c, ["Core detail", "Customer impact", "Operational effect"], 3);
  const body = bodyText(c, "Use this layout for a concise explanation beside a strong image.");
  const heading = c.heading ?? "Key Detail";
  const bodyTop = 152 + compactTitleHeight(heading, 510, 46) + 10;
  const bodyFs = body.length > 150 ? 20 : 23;
  return chalkCanvas([
    ...lessonHeader(c.label, "05 / 12"),
    ...roughBox(56, 120, 570, 490, CB.green, "rgba(244,240,220,0.025)"),
    compactTitle(heading, 80, 152, 510, 46),
    chalkText({ text: body, left: 80, top: bodyTop, width: 510, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.32 }),
    chalkBullet(bullets[0] ?? "", 92, 438, 490, CB.yellow),
    chalkBullet(bullets[1] ?? "", 92, 490, 490, CB.green),
    chalkBullet(bullets[2] ?? "", 92, 542, 490, CB.cyan),
    rct({ left: 640, top: 110, width: 5, height: 500, fill: hexToRgba(CB.green, 0.6) }),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 656, y: 120, w: 570, h: 490, color: CB.yellow, label: "Visual evidence" })
      : [...roughBox(656, 120, 570, 490, CB.yellow, "rgba(0,0,0,0.08)")]),
    chalkText({ text: c.quote ?? "", left: 656, top: 634, width: 570, fontSize: 19, fill: CB.yellow, textAlign: "center", fontWeight: "700" }),
  ]);
};

export const cbFlexCompareB: CanvasBuilder = (_t, c = {}) => {
  const left = (c.leftPoints?.length ? c.leftPoints : c.points?.slice(0, 3).length ? c.points!.slice(0, 3) : ["Current state", "Constraint", "Tradeoff"]).slice(0, 4);
  const right = (c.rightPoints?.length ? c.rightPoints : c.steps?.length ? c.steps : ["Better state", "Opportunity", "Decision"]).slice(0, 4);
  const leftLabel = c.subheading ?? "Option A";
  const rightLabel = c.quote ?? "Option B";
  const labelFs = (t: string) => t.length > 40 ? 18 : t.length > 24 ? 24 : 32;
  const compareHeading = c.heading ?? "Compare the Options";
  return chalkCanvas([
    ...lessonHeader(c.label, "06 / 12"),
    compactTitle(compareHeading, 70, 88, 900, 50),
    chalkLine(W / 2, 175, W / 2, 660, hexToRgba(CB.chalk, 0.25), 2),
    rct({ left: W / 2 - 30, top: 378, width: 60, height: 44, fill: CB.boardDeep, rx: 22 }),
    chalkText({ text: "vs", left: W / 2 - 30, top: 385, width: 60, fontSize: 26, fill: CB.cyan, fontWeight: "700", textAlign: "center" }),
    chalkLine(80, 195, W / 2 - 35, 195, hexToRgba(CB.yellow, 0.7), 3),
    chalkText({ text: leftLabel, left: 80, top: 212, width: W / 2 - 120, fontSize: labelFs(leftLabel), fill: CB.yellow, fontWeight: "700", lineHeight: 1.12 }),
    ...left.map((pt, i) => chalkBullet(pt, 96, 320 + i * 68, W / 2 - 140, CB.yellow)).flat(),
    chalkLine(W / 2 + 35, 195, W - 80, 195, hexToRgba(CB.green, 0.7), 3),
    chalkText({ text: rightLabel, left: W / 2 + 40, top: 212, width: W / 2 - 120, fontSize: labelFs(rightLabel), fill: CB.green, fontWeight: "700", lineHeight: 1.12 }),
    ...right.map((pt, i) => chalkBullet(pt, W / 2 + 56, 320 + i * 68, W / 2 - 140, CB.green)).flat(),
  ]);
};

export const cbFlexProcessB: CanvasBuilder = (_t, c = {}) => {
  const flow = steps(c, ["Start", "Build", "Test", "Launch", "Learn"], 5);
  const body = bodyText(c, "A simple path from starting point to result.");
  const heading = c.heading ?? "How It Works";
  const bodyTop = 88 + compactTitleHeight(heading, 520, 50) + 8;
  const bodyFs = body.length > 150 ? 19 : 22;
  const rowH = Math.min(98, Math.floor(545 / flow.length));
  const colors = [CB.yellow, CB.green, CB.cyan, CB.red, CB.yellow];
  return chalkCanvas([
    ...lessonHeader(c.label, "07 / 12"),
    compactTitle(heading, 70, 88, 520, 50),
    chalkText({ text: body, left: 74, top: bodyTop, width: 500, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.3 }),
    ...flow.map((step, i) => {
      const y = 175 + i * rowH;
      const color = colors[i % colors.length];
      return [
        rct({ left: 650, top: y, width: 52, height: rowH - 10, fill: hexToRgba(color, 0.12), rx: 26 }),
        chalkText({ text: String(i + 1), left: 650, top: y + (rowH - 10) / 2 - 18, width: 52, fontSize: 28, fill: color, fontWeight: "700", textAlign: "center" }),
        ...(i < flow.length - 1 ? [chalkLine(676, y + rowH - 10, 676, y + rowH, hexToRgba(color, 0.4), 2)] : []),
        ...roughBox(716, y + 4, 494, rowH - 12, color, "rgba(244,240,220,0.025)"),
        chalkText({ text: step, left: 730, top: y + (rowH - 12) / 2 - 16, width: 462, fontSize: adaptFs([step], 462, 24, 14), fill: CB.chalk, fontWeight: "700" }),
      ];
    }).flat(),
  ]);
};

export const cbFlexEvidenceB: CanvasBuilder = (_t, c = {}) => {
  const stats = (c.stats?.length ? c.stats : [
    { value: "3x", label: "Signal strength" },
    { value: "42%", label: "Measured change" },
    { value: "12", label: "Key segments" },
  ]).slice(0, 3);
  const body = bodyText(c, "Use a few strong signals instead of a crowded chart.");
  const heading = c.heading ?? "Evidence";
  const bodyTop = 90 + compactTitleHeight(heading, 560, 50) + 8;
  const bodyFs = paragraphFontSize(body, 500, 20, 16);
  const bodyH = textBlockHeight(body, 500, bodyFs, 1.28);
  const statTop = clampY(bodyTop + bodyH + 34, 330, 360);
  const statH = 92;
  const statGap = 24;
  const quote = c.quote ?? "";
  const quoteFs = quote.length > 60 ? 26 : quote.length > 30 ? 32 : 38;
  return chalkCanvas([
    ...lessonHeader(c.label, "08 / 12"),
    compactTitle(heading, 70, 90, 560, 50),
    chalkText({ text: body, left: 74, top: bodyTop, width: 500, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.28 }),
    ...stats.map((stat, i) => {
      const y = statTop + i * (statH + statGap);
      const color = [CB.yellow, CB.green, CB.cyan][i];
      const valueFs = adaptFs([stat.value], 170, 44, 30);
      const labelFs = adaptFs([stat.label], 230, 20, 14);
      return [
        ...roughBox(80, y, 500, statH, color, "rgba(0,0,0,0.08)"),
        chalkText({ text: stat.value, left: 104, top: y + 24, width: 170, fontSize: valueFs, fill: color, fontWeight: "700" }),
        chalkText({ text: stat.label, left: 300, top: y + 27, width: 230, fontSize: labelFs, fill: CB.chalk, lineHeight: 1.18 }),
      ];
    }).flat(),
    ...roughBox(672, 170, 520, 476, CB.cyan, "rgba(0,0,0,0.08)"),
    chalkText({ text: "“", left: 700, top: 195, width: 80, fontSize: 100, fill: hexToRgba(CB.cyan, 0.5), fontWeight: "700" }),
    chalkText({ text: quote || "Key insight from the data", left: 700, top: 280, width: 460, fontSize: quoteFs, fill: CB.chalk, fontWeight: "700", textAlign: "center", lineHeight: 1.25 }),
    chalkLine(700, 490, 1162, 490, hexToRgba(CB.chalk, 0.3), 2),
    chalkText({ text: c.author ?? c.subheading ?? "", left: 700, top: 508, width: 460, fontSize: 19, fill: CB.muted, textAlign: "center" }),
  ]);
};

export const cbFlexWideImageB: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Visual Story";
  const body = bodyText(c, "Let the image carry the context, then add one sharp explanation.");
  const bodyTop = 108 + compactTitleHeight(heading, 580, 46) + 10;
  const bodyFs = body.length > 120 ? 17 : body.length > 70 ? 19 : 22;
  const quote = c.quote ?? "What it means";
  return chalkCanvas([
    ...lessonHeader(c.label, "09 / 12"),
    compactTitle(heading, 70, 108, 580, 46),
    chalkText({ text: body, left: 74, top: bodyTop, width: 560, fontSize: bodyFs, fill: CB.muted, lineHeight: 1.3 }),
    ...roughBox(70, 540, 548, 130, CB.yellow, "rgba(244,240,220,0.025)"),
    chalkText({ text: quote, left: 84, top: 568, width: 496, fontSize: 24, fill: CB.yellow, fontWeight: "700", lineHeight: 1.2 }),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 650, y: 58, w: 596, h: 636, color: CB.cyan, label: "Scene" })
      : [...roughBox(650, 58, 596, 636, CB.cyan, "rgba(0,0,0,0.08)")]),
  ]);
};

export const cbFlexPinnedPhotoB: CanvasBuilder = (_t, c = {}) => {
  const notes = points(c, ["Observation", "Pattern", "Implication"], 3);
  const heading = c.heading ?? "Field Notes";
  const quote = c.quote ?? c.subheading ?? "What this tells us";
  return chalkCanvas([
    ...lessonHeader(c.label, "10 / 12"),
    compactTitle(heading, 70, 82, W - 140, 46),
    ...(hasImage(c)
      ? chalkImageSlot({ ...c, x: 60, y: 148, w: W - 120, h: 330, color: CB.yellow, label: "Pinned photo" })
      : [...roughBox(60, 148, W - 120, 330, CB.yellow, "rgba(0,0,0,0.08)")]),
    ...notes.map((note, i) => {
      const x = 60 + i * 386;
      const color = [CB.yellow, CB.cyan, CB.green][i];
      return [
        ...roughBox(x, 500, 372, 184, color, "rgba(244,240,220,0.025)"),
        chalkText({ text: String(i + 1), left: x + 18, top: 514, width: 42, fontSize: 26, fill: color, fontWeight: "700" }),
        chalkText({ text: note, left: x + 60, top: 514, width: 290, fontSize: adaptFs([note], 290, 21, 14), fill: CB.chalk, lineHeight: 1.25 }),
      ];
    }).flat(),
    chalkText({ text: quote, left: 0, top: 658, width: W, fontSize: 18, fill: CB.yellow, fontWeight: "700", textAlign: "center" }),
  ]);
};

export const cbFlexQuoteB: CanvasBuilder = (_t, c = {}) => {
  const quote = c.quote ?? bodyText(c, "A memorable line that captures the point.");
  const body = bodyText(c, c.author ?? c.subheading ?? "This note explains how the quote connects back to the topic.");
  const details = points(c, ["Context", "Implication", "Next thought"], 3);
  const quoteFs = quote.length > 100 ? 27 : quote.length > 65 ? 32 : 38;
  const bodyFs = paragraphFontSize(body, 238, 18, 14);
  return chalkCanvas([
    ...lessonHeader(c.label, "11 / 12"),
    ...roughBox(72, 145, 790, 350, CB.cyan, "rgba(0,0,0,0.08)"),
    chalkText({ text: "“", left: 104, top: 160, width: 100, fontSize: 96, fill: hexToRgba(CB.cyan, 0.5), fontWeight: "700" }),
    chalkText({ text: quote, left: 150, top: 250, width: 650, fontSize: quoteFs, fill: CB.chalk, fontWeight: "700", textAlign: "center", lineHeight: 1.22 }),
    chalkLine(180, 434, 754, 434, hexToRgba(CB.chalk, 0.25), 2),
    chalkText({ text: c.author ?? c.subheading ?? "Source context", left: 180, top: 454, width: 574, fontSize: 19, fill: CB.muted, textAlign: "center" }),
    ...details.map((item, i) => {
      const x = 84 + i * 264;
      const color = [CB.yellow, CB.green, CB.cyan][i];
      return [
        ...roughBox(x, 542, 238, 94, color, "rgba(244,240,220,0.025)"),
        chalkText({ text: item, left: x + 18, top: 572, width: 202, fontSize: adaptFs([item], 202, 19, 13), fill: CB.chalk, textAlign: "center", fontWeight: "700" }),
      ];
    }).flat(),
    ...roughBox(922, 168, 288, 468, CB.yellow, "rgba(244,240,220,0.025)"),
    chalkText({ text: c.heading ?? "Why it matters", left: 946, top: 200, width: 240, fontSize: 24, fill: CB.yellow, fontWeight: "700", textAlign: "center", lineHeight: 1.18 }),
    chalkLine(944, 276, 1188, 276, hexToRgba(CB.chalk, 0.3), 2),
    chalkText({ text: body, left: 948, top: 312, width: 238, fontSize: bodyFs, fill: CB.muted, textAlign: "center", lineHeight: 1.32 }),
  ]);
};

export const cbFlexClosingB: CanvasBuilder = (_t, c = {}) => {
  const takeaways = points(c, ["Main takeaway", "Best next step", "Decision to make"], 3);
  const heading = c.heading ?? "Where This Leads";
  const body = bodyText(c, "Close with a practical summary and a clear next move.");
  const headingFs = heading.length > 42 ? 56 : heading.length > 28 ? 66 : 76;
  const bodyFs = body.length > 150 ? 20 : 24;
  return chalkCanvas([
    ...boardFrame(),
    chalkText({ text: (c.label ?? "Closing").toUpperCase(), left: 0, top: 76, width: W, fontSize: 18, fill: CB.green, fontWeight: "700", textAlign: "center" }),
    chalkText({ text: heading, left: 100, top: 138, width: W - 200, fontSize: headingFs, fill: CB.chalk, fontWeight: "700", lineHeight: 1.04, textAlign: "center" }),
    chalkLine(W / 2 - 280, 300, W / 2 + 280, 296, CB.yellow, 4),
    chalkText({ text: body, left: (W - (W - 400)) / 2, top: 330, width: W - 400, fontSize: bodyFs, fill: CB.muted, textAlign: "center", lineHeight: 1.32 }),
    ...takeaways.map((pt, i) => {
      const x = 80 + i * 390;
      const color = [CB.yellow, CB.green, CB.cyan][i];
      return [
        ...roughBox(x, 496, 348, 168, color, "rgba(244,240,220,0.025)"),
        chalkText({ text: String(i + 1), left: x + 18, top: 512, width: 44, fontSize: 30, fill: color, fontWeight: "700" }),
        chalkText({ text: pt, left: x + 62, top: 512, width: 262, fontSize: adaptFs([pt], 262, 21, 17), fill: CB.chalk, lineHeight: 1.25 }),
      ];
    }).flat(),
  ]);
};

export const cbFlexClosingC: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Where This Leads";
  const body = bodyText(c, "Close with a practical summary and a clear next move.");
  const headingFs = heading.length > 42 ? 56 : heading.length > 28 ? 68 : 80;
  const bodyFs = body.length > 150 ? 20 : 24;
  return chalkCanvas([
    ...boardFrame(),
    chalkText({ text: (c.label ?? "Closing").toUpperCase(), left: 82, top: 76, width: 400, fontSize: 18, fill: CB.yellow, fontWeight: "700" }),
    chalkText({ text: heading, left: 80, top: 176, width: W - 160, fontSize: headingFs, fill: CB.chalk, fontWeight: "700", textAlign: "center", lineHeight: 1.05 }),
    chalkLine(80, 396, W - 80, 392, CB.yellow, 6),
    chalkText({ text: body, left: (W - (W - 320)) / 2, top: 432, width: W - 320, fontSize: bodyFs, fill: CB.muted, textAlign: "center", lineHeight: 1.38 }),
    chalkText({ text: c.subheading ?? "Thank you", left: 0, top: 612, width: W, fontSize: 32, fill: CB.yellow, fontWeight: "700", textAlign: "center" }),
  ]);
};
