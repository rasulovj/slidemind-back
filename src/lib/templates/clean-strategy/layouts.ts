import { W, rct, hexToRgba } from "../helpers";
import { iconToFabric } from "../icons";
import type { CanvasBuilder, SlideContent } from "../types";
import { CS, csArrow, csBullet, csCanvas, csCard, csColors, csHeader, csMetric, csPill, csRule, csText, csTitle } from "./helpers";

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

function leftPoints(c: SlideContent, fallback: string[]) {
  return (c.leftPoints?.length ? c.leftPoints : fallback).slice(0, 4);
}

function rightPoints(c: SlideContent, fallback: string[]) {
  return (c.rightPoints?.length ? c.rightPoints : fallback).slice(0, 4);
}

export const csCover: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Clean Strategy Brief";
  const sub = c.subheading ?? body(c, "A concise, structured presentation for decisions, research, and planning.");
  return csCanvas([
    ...csPill(c.label ?? "Strategy Brief", 72, 72, 170, CS.blue),
    csTitle(heading, 72, 150, 720, 140, 64),
    csRule(76, 340, 440, CS.blue, 5),
    csText({ text: sub, left: 76, top: 382, width: 560, height: 88, fontSize: 22, fill: CS.muted, lineHeight: 1.3 }),
    rct({ left: 820, top: 120, width: 310, height: 420, fill: CS.white, rx: 12 }),
    rct({ left: 860, top: 172, width: 230, height: 12, fill: hexToRgba(CS.blue, 0.2), rx: 6 }),
    rct({ left: 860, top: 220, width: 160, height: 160, fill: hexToRgba(CS.teal, 0.14), rx: 80 }),
    rct({ left: 930, top: 290, width: 160, height: 160, fill: hexToRgba(CS.amber, 0.16), rx: 80 }),
    csText({ text: c.quote ?? "Clear enough to present. Structured enough to decide.", left: 860, top: 472, width: 230, height: 44, fontSize: 14, fill: CS.muted, textAlign: "center", fontWeight: "700" }),
  ]);
};

export const csAgenda: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Context", "Signals", "Options", "Recommendation"], 4);
  const gap = 20;
  const totalW = W - 120;
  const cardW = Math.floor((totalW - gap * (items.length - 1)) / items.length);
  const startX = 60;
  return csCanvas([
    ...csHeader(c.label, "02 / 12"),
    csTitle(c.heading ?? "Briefing Route", 72, 105, 680, 92, 52),
    csText({ text: body(c, "This route keeps the discussion focused: what changed, what it means, and what should happen next."), left: 76, top: 205, width: 940, fontSize: 16, fill: CS.muted, lineHeight: 1.38 }),
    ...items.map((item, i) => {
      const x = startX + i * (cardW + gap);
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x + cardW / 2 - 12, top: 415, size: 24, fill: csColors[i], opacity: 0.6 }) : null;
      return [
        ...csCard(x, 400, cardW, 210, csColors[i]),
        ...(icon ? [icon] : [csText({ text: String(i + 1).padStart(2, "0"), left: x + 22, top: 420, width: 60, fontSize: 28, fill: csColors[i], fontWeight: "900" })]),
        csText({ text: item, left: x + 16, top: icon ? 460 : 475, width: cardW - 32, fontSize: 16, fill: CS.ink, textAlign: "center", fontWeight: "700", lineHeight: 1.35 }),
      ];
    }).flat(),
  ]);
};

export const csSummary: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Pressure is rising", "Current model is stretched", "Focused investment is needed"], 3);
  const heading = c.subheading ?? "Key readout";
  const headingSize = heading.length > 20 ? 20 : 24;
  return csCanvas([
    ...csHeader(c.label, "03 / 12"),
    csTitle(c.heading ?? "Executive Summary", 72, 105, 560, 96, 50),
    csText({ text: body(c, "A good summary explains the situation without crowding the slide. It gives leaders enough context to understand the recommendation, the tradeoffs behind it, and the practical consequence of waiting too long."), left: 76, top: 210, width: 545, fontSize: 18, fill: CS.muted, lineHeight: 1.38 }),
    ...csCard(690, 120, 380, 440, CS.blue),
    csText({ text: heading, left: 728, top: 155, width: 310, height: 60, fontSize: headingSize, fill: CS.ink, fontWeight: "850", textAlign: "center", lineHeight: 1.1 }),
    ...items.map((p, i) => csBullet(p, 745, 250 + i * 100, 280, csColors[i], 60, i)).flat(),
  ]);
};

export const csInsight: CanvasBuilder = (_t, c = {}) => {
  const text = c.quote ?? c.heading ?? "The main issue is not a lack of information; it is a lack of focused action.";
  const quoteSize = text.length > 120 ? 32 : text.length > 80 ? 38 : 46;
  return csCanvas([
    ...csHeader(c.label, "04 / 12"),
    csText({ text: "KEY INSIGHT", left: 76, top: 120, width: 170, height: 18, fontSize: 12, fill: CS.blue, fontWeight: "900" }),
    csRule(76, 155, 120, CS.blue, 4),
    csText({ text, left: 120, top: 200, width: 1040, fontSize: quoteSize, fill: CS.ink, textAlign: "center", fontWeight: "850", lineHeight: 1.18 }),
    csRule(360, 420, 560, CS.blue, 4),
    csText({ text: body(c, "Use this slide for a single strategic claim. It should be readable in seconds, but the supporting note can explain what evidence sits behind the claim and why the next decision matters."), left: 160, top: 455, width: 960, fontSize: 20, fill: CS.muted, textAlign: "center", lineHeight: 1.4 }),
  ]);
};

export const csTwoColumn: CanvasBuilder = (_t, c = {}) => {
  const left = leftPoints(c, ["What changed", "Who is affected", "Why it matters"]);
  const right = rightPoints(c, ["Likely response", "Required capability", "Decision needed"]);
  return csCanvas([
    ...csHeader(c.label, "05 / 12"),
    csTitle(c.heading ?? "Analysis", 72, 100, 620, 80, 48),
    csText({ text: body(c, "Separate the diagnosis from the response so readers can follow the logic without extra narration. The paragraph frames the tradeoff, while the columns keep the supporting evidence scannable."), left: 76, top: 180, width: 980, fontSize: 16, fill: CS.muted, lineHeight: 1.36 }),
    ...csCard(92, 320, 500, 260, CS.teal),
    ...csCard(690, 320, 500, 260, CS.amber),
    csText({ text: c.subheading ?? "Diagnosis", left: 125, top: 356, width: 420, height: 34, fontSize: 24, fill: CS.teal, fontWeight: "850", textAlign: "center" }),
    csText({ text: c.quote ?? "Response", left: 725, top: 356, width: 420, height: 34, fontSize: 24, fill: CS.amber, fontWeight: "850", textAlign: "center" }),
    ...left.map((p, i) => csBullet(p, 138, 430 + i * 48, 390, CS.teal, 36)).flat(),
    ...right.map((p, i) => csBullet(p, 738, 430 + i * 48, 390, CS.amber, 36)).flat(),
  ]);
};

export const csProcess: CanvasBuilder = (_t, c = {}) => {
  const items = steps(c, ["Frame the problem", "Test the signal", "Choose the path", "Execute and review"], 5);
  return csCanvas([
    ...csHeader(c.label, "06 / 12"),
    csTitle(c.heading ?? "Process", 72, 105, 640, 86, 50),
    csText({ text: body(c, "The sequence turns analysis into action while keeping checkpoints visible. Each step should produce a clear artifact or decision so the work does not drift into vague activity."), left: 76, top: 205, width: 940, fontSize: 16, fill: CS.muted, lineHeight: 1.36 }),
    ...items.map((item, i) => {
      const x = 100 + i * (1020 / Math.max(1, items.length - 1));
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x - 14, top: 414, size: 28, fill: csColors[i], opacity: 0.8 }) : null;
      return [
        rct({ left: x - 38, top: 390, width: 76, height: 76, fill: hexToRgba(csColors[i], 0.13), rx: 38 }),
        ...(icon ? [icon] : [csText({ text: String(i + 1), left: x - 20, top: 410, width: 40, height: 36, fontSize: 26, fill: csColors[i], textAlign: "center", fontWeight: "900" })]),
        csText({ text: item, left: x - 96, top: 492, width: 192, fontSize: 16, fill: CS.ink, textAlign: "center", fontWeight: "750", lineHeight: 1.3 }),
        ...(i < items.length - 1 ? [csArrow(x + 48, 428, x + 150, 428, CS.faint)] : []),
      ];
    }).flat(),
  ]);
};

export const csMetrics: CanvasBuilder = (_t, c = {}) => {
  const data = stats(c, [
    { value: "3x", label: "priority gap" },
    { value: "18mo", label: "execution horizon" },
    { value: "42%", label: "process coverage" },
    { value: "Q3", label: "decision window" },
  ], 4);
  return csCanvas([
    ...csHeader(c.label, "07 / 12"),
    csTitle(c.heading ?? "Metrics Snapshot", 72, 105, 620, 86, 50),
    csText({ text: body(c, "A small metric set keeps the story measurable without turning the slide into a spreadsheet. The text should explain what the numbers imply, not simply repeat what the labels already say."), left: 76, top: 205, width: 940, fontSize: 16, fill: CS.muted, lineHeight: 1.36 }),
    ...data.map((s, i) => csMetric(96 + (i % 2) * 545, 330 + Math.floor(i / 2) * 145, 445, 108, s.value, s.label, csColors[i])).flat(),
  ]);
};

export const csCompare: CanvasBuilder = (_t, c = {}) => {
  const left = leftPoints(c, ["Lower risk", "Faster launch", "Uses current team"]);
  const right = rightPoints(c, ["Higher upside", "More control", "Requires investment"]);
  return csCanvas([
    ...csHeader(c.label, "08 / 12"),
    csTitle(c.heading ?? "Option Comparison", 72, 95, 760, 86, 48),
    ...csCard(90, 230, 500, 350, CS.blue),
    ...csCard(690, 230, 500, 350, CS.rose),
    csText({ text: c.subheading ?? "Option A", left: 130, top: 276, width: 410, height: 42, fontSize: 28, fill: CS.blue, textAlign: "center", fontWeight: "850" }),
    csText({ text: c.quote ?? "Option B", left: 730, top: 276, width: 410, height: 42, fontSize: 28, fill: CS.rose, textAlign: "center", fontWeight: "850" }),
    ...left.map((p, i) => csBullet(p, 145, 370 + i * 54, 370, CS.blue, 38)).flat(),
    ...right.map((p, i) => csBullet(p, 745, 370 + i * 54, 370, CS.rose, 38)).flat(),
  ]);
};

export const csCase: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Situation", "Action", "Result"], 3);
  return csCanvas([
    ...csHeader(c.label, "09 / 12"),
    csTitle(c.heading ?? "Example in Practice", 72, 105, 600, 88, 48),
    csText({ text: body(c, "Use a concrete case to make the strategy easier to understand. A short narrative can show the situation, the action taken, and why the example changes how the audience should think about the decision."), left: 76, top: 205, width: 590, fontSize: 16, fill: CS.muted, lineHeight: 1.36 }),
    ...csCard(715, 122, 360, 430, CS.teal),
    ...items.map((item, i) => [
      csText({ text: String(i + 1).padStart(2, "0"), left: 755, top: 195 + i * 98, width: 55, height: 36, fontSize: 26, fill: csColors[i], fontWeight: "900" }),
      csText({ text: item, left: 825, top: 200 + i * 98, width: 210, fontSize: 16, fill: CS.ink, fontWeight: "800", lineHeight: 1.3 }),
      rct({ left: 825, top: 246 + i * 98, width: 180, height: 1.5, fill: CS.faint }),
    ]).flat(),
  ]);
};

export const csRisk: CanvasBuilder = (_t, c = {}) => {
  const risks = points(c, ["Adoption delay", "Budget pressure", "Data quality", "Ownership gaps"], 4);
  return csCanvas([
    ...csHeader(c.label, "10 / 12"),
    csTitle(c.heading ?? "Risks and Mitigations", 72, 100, 760, 86, 48),
    csText({ text: body(c, "The goal is not to remove every risk. It is to make the major risks visible, owned, and manageable before they slow execution or weaken trust in the recommendation."), left: 76, top: 190, width: 960, fontSize: 16, fill: CS.muted, lineHeight: 1.36 }),
    ...risks.map((risk, i) => {
      const y = 315 + i * 72;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: 130, top: y + 12, size: 24, fill: csColors[i], opacity: 0.7 }) : null;
      return [
        rct({ left: 110, top: y, width: 1040, height: 52, fill: CS.white, rx: 6 }),
        ...(icon ? [icon] : [csText({ text: `R${i + 1}`, left: 136, top: y + 16, width: 40, height: 20, fontSize: 14, fill: csColors[i], fontWeight: "900" })]),
        csText({ text: risk, left: 210, top: y + 15, width: 340, fontSize: 15, fill: CS.ink, fontWeight: "750" }),
        csText({ text: "Owner + checkpoint", left: 720, top: y + 15, width: 230, height: 24, fontSize: 15, fill: CS.muted, fontWeight: "700" }),
        csRule(1010, y + 25, 84, csColors[i], 4),
      ];
    }).flat(),
  ]);
};

export const csRecommendation: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Approve focused path", "Assign owner", "Review progress monthly"], 3);
  return csCanvas([
    ...csHeader(c.label, "11 / 12"),
    csText({ text: "RECOMMENDATION", left: 76, top: 120, width: 180, height: 18, fontSize: 12, fill: CS.blue, fontWeight: "900" }),
    csTitle(c.heading ?? "Recommended Move", 72, 160, 760, 110, 56),
    csText({ text: body(c, "A good recommendation names the action, the reason to act now, and the practical checkpoint that keeps the work accountable. It should also make clear what changes if the audience approves the path today."), left: 76, top: 292, width: 660, fontSize: 16, fill: CS.muted, lineHeight: 1.36 }),
    ...csCard(830, 150, 300, 330, CS.blue),
    ...items.map((p, i) => csBullet(p, 870, 235 + i * 72, 220, csColors[i], 44, i)).flat(),
  ]);
};

export const csClosing: CanvasBuilder = (_t, c = {}) => (
  csCanvas([
    ...csHeader(c.label, "12 / 12"),
    csTitle(c.heading ?? "Clear Next Step", 120, 170, 820, 110, 62),
    csText({ text: body(c, "End with a focused next step, not a broad recap. The audience should know what decision, owner, and checkpoint come next, plus why that action is the right one now."), left: 125, top: 310, width: 820, fontSize: 18, fill: CS.muted, lineHeight: 1.36 }),
    csRule(125, 515, 520, CS.blue, 5),
    csText({ text: c.quote ?? "One decision. One owner. One review rhythm.", left: 125, top: 555, width: 720, height: 54, fontSize: 24, fill: CS.ink, fontWeight: "850" }),
  ])
);
