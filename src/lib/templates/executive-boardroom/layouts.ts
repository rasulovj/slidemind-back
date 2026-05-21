import { W, H, hexToRgba, rct } from "../helpers";
import type { CanvasBuilder, SlideContent } from "../types";
import { EB, ebBullet, ebCanvas, ebColors, ebHeader, ebImageSlot, ebLightCanvas, ebLightPanel, ebMetric, ebPanel, ebRule, ebText, ebTitle } from "./helpers";

const generic = new Set(["context", "insight", "observation", "implication", "risk", "decision", "next step", "benefit"]);

function points(c: SlideContent, fallback: string[], max = 4) {
  const provided = (c.points ?? []).filter((p) => !generic.has(p.trim().toLowerCase()));
  return (provided.length ? provided : fallback).slice(0, max);
}

function steps(c: SlideContent, fallback: string[], max = 5) {
  const provided = (c.steps ?? c.points ?? []).filter((p) => !generic.has(p.trim().toLowerCase()));
  return (provided.length ? provided : fallback).slice(0, max);
}

function bodyText(c: SlideContent, fallback: string) {
  return c.body?.trim() || fallback;
}

function imageContent(c: SlideContent, fallback: string): SlideContent {
  return { ...c, imageQuery: c.imageQuery ?? c.imageAlt ?? c.heading ?? fallback };
}

function statItems(c: SlideContent, fallback: Array<{ value: string; label: string }>) {
  return (c.stats?.length ? c.stats : fallback).slice(0, 4);
}

function titleFs(text: string, width: number, base = 60) {
  const charsAtBase = width / (base * 0.56);
  if (text.length > charsAtBase * 1.8) return Math.max(32, base - 20);
  if (text.length > charsAtBase * 1.3) return Math.max(38, base - 12);
  return base;
}

function bodyFs(text: string, max = 23, min = 15) {
  if (text.length > 290) return Math.max(min, max - 8);
  if (text.length > 230) return Math.max(min, max - 6);
  if (text.length > 170) return Math.max(min, max - 4);
  return max;
}

function fitFs(text: string, width: number, base: number, min: number) {
  const charsAtBase = width / (base * 0.55);
  if (text.length <= charsAtBase) return base;
  if (text.length <= charsAtBase * 1.45) return Math.max(min, base - 4);
  return min;
}

function estimateH(text: string, width: number, fontSize: number, lineHeight = 1.28) {
  const charsPerLine = Math.max(1, Math.floor(width / (fontSize * 0.54)));
  return Math.ceil(text.length / charsPerLine) * fontSize * lineHeight;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export const ebCover: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Executive Boardroom";
  const sub = c.subheading ?? bodyText(c, "A decision-ready briefing for leadership discussion.");
  const fs = titleFs(heading, 720, 66);
  return ebCanvas([
    ...ebHeader(c.label, "01 / 12"),
    ebText({ text: "CONFIDENTIAL BRIEF", left: 72, top: 96, width: 280, fontSize: 12, fill: EB.gold, fontWeight: "900" }),
    ebTitle(heading, 72, 145, 720, fs),
    ebRule(76, 330, 480, EB.gold, 5),
    ebText({ text: sub, left: 76, top: 372, width: 600, fontSize: bodyFs(sub, 24, 18), fill: EB.mutedLight, lineHeight: 1.34 }),
    ...ebImageSlot({ ...imageContent(c, "executive strategy boardroom"), x: 790, y: 116, w: 360, h: 405, label: "Strategy visual", color: EB.gold }),
    ebText({ text: c.quote ?? "Prepared for decisions, tradeoffs, and next moves.", left: 76, top: 620, width: 650, fontSize: 18, fill: EB.gold, fontWeight: "750" }),
  ]);
};

export const ebCoverB: CanvasBuilder = (_t, c = {}) => {
  const heading = c.heading ?? "Executive Boardroom";
  const sub = c.subheading ?? bodyText(c, "A decision-ready briefing for leadership discussion.");
  return ebCanvas([
    ...ebImageSlot({ ...imageContent(c, "executive strategy boardroom"), x: 0, y: 0, w: W, h: 330, label: "Boardroom visual", color: EB.gold }),
    rct({ left: 0, top: 298, width: W, height: H - 298, fill: "rgba(17,24,39,0.94)" }),
    ebText({ text: (c.label ?? "Boardroom brief").toUpperCase(), left: 72, top: 360, width: 360, fontSize: 12, fill: EB.gold, fontWeight: "900" }),
    ebTitle(heading, 72, 405, 880, titleFs(heading, 880, 58)),
    ebText({ text: sub, left: 76, top: 548, width: 820, fontSize: bodyFs(sub, 22, 17), fill: EB.mutedLight, lineHeight: 1.32 }),
    ebRule(76, 645, 380, EB.gold, 4),
  ]);
};

export const ebAgenda: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Executive context", "Market signals", "Strategic options", "Recommended move"], 5);
  const heading = c.heading ?? "Board Agenda";
  const body = bodyText(c, "This briefing moves from the operating context to the decision set, then closes with the recommended executive action.");
  const fs = titleFs(heading, 620, 56);
  const bodyTop = clamp(118 + estimateH(heading, 620, fs, 1.04) + 28, 210, 275);
  const cardW = items.length <= 4 ? 250 : 212;
  const gap = 22;
  const rowW = items.length * cardW + (items.length - 1) * gap;
  const startX = (W - rowW) / 2;
  return ebCanvas([
    ...ebHeader(c.label, "02 / 12"),
    ebTitle(heading, 74, 118, 620, fs),
    ebText({ text: body, left: 76, top: bodyTop, width: 820, fontSize: bodyFs(body, 22, 17), fill: EB.mutedLight, lineHeight: 1.32 }),
    ...items.map((item, i) => {
      const x = startX + i * (cardW + gap);
      return [
        ...ebPanel(x, 455, cardW, 145, ebColors[i], "rgba(255,248,234,0.07)"),
        ebText({ text: String(i + 1).padStart(2, "0"), left: x + 18, top: 486, width: 56, fontSize: 30, fill: ebColors[i], fontWeight: "900" }),
        ebText({ text: item, left: x + 22, top: 548, width: cardW - 44, fontSize: fitFs(item, cardW - 44, 20, 14), fill: EB.paper, textAlign: "center", fontWeight: "800", lineHeight: 1.15 }),
      ];
    }).flat(),
  ]);
};

export const ebAgendaB: CanvasBuilder = (_t, c = {}) => {
  const items = points(c, ["Executive context", "Evidence base", "Decision options", "Implementation path"], 5);
  const body = bodyText(c, "The route gives leaders a compact view of what must be understood before a decision is made.");
  return ebLightCanvas([
    ...ebHeader(c.label, "02 / 12", true),
    ebTitle(c.heading ?? "Decision Route", 68, 112, 520, titleFs(c.heading ?? "Decision Route", 520, 56), true),
    ebText({ text: body, left: 72, top: 265, width: 520, fontSize: bodyFs(body, 23, 17), fill: EB.mutedInk, lineHeight: 1.32 }),
    ...items.map((item, i) => [
      ebText({ text: String(i + 1).padStart(2, "0"), left: 742, top: 128 + i * 92, width: 58, fontSize: 32, fill: ebColors[i], fontWeight: "900" }),
      ebRule(815, 146 + i * 92, 310, ebColors[i], 3),
      ebText({ text: item, left: 815, top: 176 + i * 92, width: 330, fontSize: fitFs(item, 330, 22, 16), fill: EB.ink, fontWeight: "800" }),
    ]).flat(),
  ]);
};

export const ebExecutiveSummary: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "Leadership needs a shared read of the situation before choosing where to invest attention, capital, and operating capacity.");
  const pts = points(c, ["What changed in the market", "Where pressure is rising", "What leadership must decide"], 3);
  return ebCanvas([
    ...ebHeader(c.label, "03 / 12"),
    ebTitle(c.heading ?? "Executive Summary", 70, 105, 580, titleFs(c.heading ?? "Executive Summary", 580, 54)),
    ebText({ text: body, left: 74, top: 250, width: 590, fontSize: bodyFs(body, 24, 18), fill: EB.mutedLight, lineHeight: 1.34 }),
    ...ebPanel(755, 122, 350, 420, EB.gold, "rgba(255,248,234,0.08)"),
    ebText({ text: c.subheading ?? "Leadership readout", left: 790, top: 165, width: 280, fontSize: 28, fill: EB.gold, fontWeight: "900", textAlign: "center" }),
    ...pts.map((p, i) => ebBullet(p, 800, 270 + i * 76, 250, ebColors[i], false, i)).flat(),
  ]);
};

export const ebExecutiveSummaryB: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "The current moment creates both pressure and optionality. The executive question is where to focus the next wave of resources.");
  const pts = points(c, ["External pressure", "Internal constraint", "Decision window", "Expected outcome"], 4);
  return ebLightCanvas([
    ...ebHeader(c.label, "03 / 12", true),
    ebTitle(c.heading ?? "Executive Readout", 66, 110, 900, titleFs(c.heading ?? "Executive Readout", 900, 54), true),
    ebText({ text: body, left: 70, top: 235, width: 840, fontSize: bodyFs(body, 24, 18), fill: EB.mutedInk, lineHeight: 1.32 }),
    ...pts.map((p, i) => {
      const x = 80 + (i % 2) * 560;
      const y = 405 + Math.floor(i / 2) * 116;
      return [
        ...ebLightPanel(x, y, 465, 86, ebColors[i]),
        ebText({ text: String(i + 1).padStart(2, "0"), left: x + 20, top: y + 28, width: 52, fontSize: 28, fill: ebColors[i], fontWeight: "900" }),
        ebText({ text: p, left: x + 82, top: y + 28, width: 350, fontSize: fitFs(p, 350, 20, 15), fill: EB.ink, fontWeight: "800" }),
      ];
    }).flat(),
  ]);
};

export const ebDecisionMemo: CanvasBuilder = (_t, c = {}) => {
  const body = bodyText(c, "The decision depends on balancing near-term execution risk with the longer-term strategic position the organization wants to hold.");
  const left = c.leftPoints?.length ? c.leftPoints : ["Upside", "Speed", "Strategic fit"];
  const right = c.rightPoints?.length ? c.rightPoints : ["Cost", "Risk", "Operating load"];
  return ebCanvas([
    ...ebHeader(c.label, "04 / 12"),
    ebTitle(c.heading ?? "Decision Memo", 70, 100, 520, titleFs(c.heading ?? "Decision Memo", 520, 52)),
    ebText({ text: body, left: 74, top: 235, width: 500, fontSize: bodyFs(body, 22, 17), fill: EB.mutedLight, lineHeight: 1.34 }),
    rct({ left: 640, top: 116, width: 520, height: 430, fill: EB.paper, rx: 3 }),
    rct({ left: 640, top: 116, width: 520, height: 5, fill: EB.gold, rx: 2 }),
    ebText({ text: "BOARD DECISION TABLE", left: 670, top: 150, width: 300, fontSize: 12, fill: EB.mutedInk, fontWeight: "900" }),
    ebText({ text: c.subheading ?? "Reasons to move", left: 686, top: 205, width: 180, fontSize: 19, fill: EB.green, fontWeight: "900" }),
    ebText({ text: c.quote ?? "Reasons to pause", left: 922, top: 205, width: 180, fontSize: 19, fill: EB.rust, fontWeight: "900" }),
    rct({ left: 900, top: 190, width: 1, height: 300, fill: "rgba(31,41,51,0.12)" }),
    ...left.slice(0, 3).map((p, i) => [
      rct({ left: 680, top: 255 + i * 72, width: 185, height: 44, fill: hexToRgba(EB.green, 0.1), rx: 2 }),
      ebText({ text: p, left: 696, top: 267 + i * 72, width: 152, fontSize: fitFs(p, 152, 16, 12), fill: EB.ink, fontWeight: "750" }),
    ]).flat(),
    ...right.slice(0, 3).map((p, i) => [
      rct({ left: 916, top: 255 + i * 72, width: 185, height: 44, fill: hexToRgba(EB.rust, 0.1), rx: 2 }),
      ebText({ text: p, left: 932, top: 267 + i * 72, width: 152, fontSize: fitFs(p, 152, 16, 12), fill: EB.ink, fontWeight: "750" }),
    ]).flat(),
  ]);
};

export const ebKpi: CanvasBuilder = (_t, c = {}) => {
  const stats = statItems(c, [
    { value: "3x", label: "priority gap" },
    { value: "18mo", label: "execution horizon" },
    { value: "12%", label: "margin exposure" },
  ]);
  const body = bodyText(c, "These indicators are the fastest way to see whether the strategy is gaining traction or creating new operating strain.");
  return ebCanvas([
    ...ebHeader(c.label, "05 / 12"),
    ebTitle(c.heading ?? "Board Metrics", 70, 105, 680, titleFs(c.heading ?? "Board Metrics", 680, 54)),
    ebText({ text: body, left: 74, top: 235, width: 680, fontSize: bodyFs(body, 23, 17), fill: EB.mutedLight, lineHeight: 1.32 }),
    ...stats.slice(0, 3).map((s, i) => ebMetric(90 + i * 370, 455, 310, s.value, s.label, ebColors[i])).flat(),
  ]);
};

export const ebKpiB: CanvasBuilder = (_t, c = {}) => {
  const stats = statItems(c, [
    { value: "42%", label: "process digitized" },
    { value: "$8M", label: "addressable savings" },
    { value: "Q3", label: "decision window" },
    { value: "4", label: "critical risks" },
  ]);
  const body = bodyText(c, "A tight metric set keeps the conversation focused on business outcomes instead of activity volume.");
  return ebLightCanvas([
    ...ebHeader(c.label, "05 / 12", true),
    ebTitle(c.heading ?? "KPI Dashboard", 70, 108, 540, titleFs(c.heading ?? "KPI Dashboard", 540, 54), true),
    ebText({ text: body, left: 74, top: 250, width: 500, fontSize: bodyFs(body, 22, 17), fill: EB.mutedInk, lineHeight: 1.32 }),
    ...stats.map((s, i) => ebMetric(650 + (i % 2) * 250, 130 + Math.floor(i / 2) * 180, 205, s.value, s.label, ebColors[i], true)).flat(),
  ]);
};

export const ebMarketMap: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, ["Customer demand", "Competitive pressure", "Regulatory shift", "Technology curve"], 4);
  return ebCanvas([
    ...ebHeader(c.label, "06 / 12"),
    ebTitle(c.heading ?? "Market Map", 72, 105, 500, titleFs(c.heading ?? "Market Map", 500, 54)),
    ebText({ text: bodyText(c, "The market is best understood as a set of forces that either expand the opportunity or raise the cost of execution."), left: 76, top: 242, width: 480, fontSize: 21, fill: EB.mutedLight, lineHeight: 1.32 }),
    rct({ left: 650, top: 125, width: 470, height: 430, fill: "rgba(255,248,234,0.07)", rx: 3 }),
    ebText({ text: "EXECUTION READINESS", left: 765, top: 512, width: 250, fontSize: 11, fill: EB.mutedLight, textAlign: "center", fontWeight: "900" }),
    ebText({ text: "MARKET PULL", left: 628, top: 300, width: 120, fontSize: 11, fill: EB.mutedLight, textAlign: "center", fontWeight: "900" }),
    rct({ left: 690, top: 170, width: 1, height: 300, fill: "rgba(255,248,234,0.18)" }),
    rct({ left: 690, top: 470, width: 370, height: 1, fill: "rgba(255,248,234,0.18)" }),
    rct({ left: 875, top: 170, width: 1, height: 300, fill: "rgba(255,248,234,0.12)" }),
    rct({ left: 690, top: 320, width: 370, height: 1, fill: "rgba(255,248,234,0.12)" }),
    ...pts.map((p, i) => {
      const x = [725, 920, 720, 920][i] ?? 740;
      const y = [215, 210, 370, 365][i] ?? 260;
      return [
        rct({ left: x, top: y, width: 120, height: 54, fill: hexToRgba(ebColors[i], 0.18), rx: 3 }),
        ebText({ text: p, left: x + 10, top: y + 14, width: 100, fontSize: fitFs(p, 100, 14, 10), fill: EB.paper, textAlign: "center", fontWeight: "850", lineHeight: 1.1 }),
      ];
    }).flat(),
  ]);
};

export const ebCompare: CanvasBuilder = (_t, c = {}) => {
  const left = (c.leftPoints?.length ? c.leftPoints : ["Lower execution risk", "Faster time to value", "Uses current capabilities"]).slice(0, 3);
  const right = (c.rightPoints?.length ? c.rightPoints : ["Higher upside", "More strategic control", "Requires focused investment"]).slice(0, 3);
  return ebLightCanvas([
    ...ebHeader(c.label, "07 / 12", true),
    ebTitle(c.heading ?? "Strategic Options", 70, 105, 720, titleFs(c.heading ?? "Strategic Options", 720, 54), true),
    ...ebLightPanel(92, 250, 490, 320, EB.blue),
    ...ebLightPanel(700, 250, 490, 320, EB.gold),
    ebText({ text: c.subheading ?? "Option A", left: 125, top: 298, width: 420, fontSize: 28, fill: EB.blue, fontWeight: "900", textAlign: "center" }),
    ebText({ text: c.quote ?? "Option B", left: 735, top: 298, width: 420, fontSize: 28, fill: EB.gold, fontWeight: "900", textAlign: "center" }),
    ...left.map((p, i) => ebBullet(p, 140, 380 + i * 55, 380, EB.blue, true)).flat(),
    ...right.map((p, i) => ebBullet(p, 748, 380 + i * 55, 380, EB.gold, true)).flat(),
  ]);
};

export const ebRiskGrid: CanvasBuilder = (_t, c = {}) => {
  const risks = points(c, ["Adoption resistance", "Budget pressure", "Execution overload", "Governance exposure"], 4);
  return ebCanvas([
    ...ebHeader(c.label, "08 / 12"),
    ebTitle(c.heading ?? "Risk Heatmap", 70, 105, 560, titleFs(c.heading ?? "Risk Heatmap", 560, 54)),
    ebText({ text: bodyText(c, "The board should separate manageable operating risks from risks that change the economics or timing of the decision."), left: 74, top: 240, width: 520, fontSize: 21, fill: EB.mutedLight, lineHeight: 1.32 }),
    rct({ left: 665, top: 132, width: 430, height: 390, fill: EB.paper, rx: 3 }),
    ebText({ text: "IMPACT", left: 622, top: 300, width: 90, fontSize: 11, fill: EB.mutedLight, fontWeight: "900", textAlign: "center" }),
    ebText({ text: "LIKELIHOOD", left: 800, top: 540, width: 180, fontSize: 11, fill: EB.mutedLight, fontWeight: "900", textAlign: "center" }),
    ...[0, 1, 2].map((row) => [0, 1, 2].map((col) => {
      const intensity = row + col;
      const fill = intensity > 3 ? EB.rust : intensity > 1 ? EB.gold : EB.green;
      return rct({ left: 720 + col * 105, top: 185 + row * 85, width: 92, height: 68, fill: hexToRgba(fill, 0.16 + intensity * 0.05), rx: 2 });
    })).flat(),
    ...risks.map((r, i) => {
      const x = [840, 735, 945, 840][i] ?? 735;
      const y = [196, 282, 282, 368][i] ?? 196;
      return [
        rct({ left: x, top: y, width: 82, height: 42, fill: EB.charcoal, rx: 2 }),
        ebText({ text: r, left: x + 6, top: y + 10, width: 70, fontSize: fitFs(r, 70, 10, 8), fill: EB.paper, textAlign: "center", fontWeight: "850", lineHeight: 1.05 }),
      ];
    }).flat(),
  ]);
};

export const ebRoadmap: CanvasBuilder = (_t, c = {}) => {
  const items = steps(c, ["Align decision owners", "Pilot critical workstream", "Scale operating model", "Review board metrics"], 5);
  const body = bodyText(c, "Execution should be staged so leadership can learn quickly, contain downside, and scale only after the economics are visible.");
  return ebLightCanvas([
    ...ebHeader(c.label, "09 / 12", true),
    ebTitle(c.heading ?? "Execution Roadmap", 86, 125, 650, titleFs(c.heading ?? "Execution Roadmap", 650, 50), true),
    ebText({ text: body, left: 90, top: 240, width: 620, fontSize: bodyFs(body, 21, 16), fill: EB.mutedInk, lineHeight: 1.32 }),
    ebText({ text: "0-30", left: 750, top: 150, width: 90, fontSize: 14, fill: EB.mutedInk, fontWeight: "900" }),
    ebText({ text: "31-60", left: 895, top: 150, width: 90, fontSize: 14, fill: EB.mutedInk, fontWeight: "900" }),
    ebText({ text: "61-90", left: 1040, top: 150, width: 90, fontSize: 14, fill: EB.mutedInk, fontWeight: "900" }),
    ...items.slice(0, 4).map((item, i) => {
      const y = 215 + i * 82;
      const w = [180, 250, 225, 305][i] ?? 210;
      const x = [760, 820, 900, 790][i] ?? 780;
      return [
        ebText({ text: String(i + 1).padStart(2, "0"), left: 690, top: y + 10, width: 42, fontSize: 22, fill: ebColors[i], fontWeight: "900" }),
        rct({ left: 750, top: y, width: 380, height: 44, fill: "rgba(31,41,51,0.06)", rx: 2 }),
        rct({ left: x, top: y + 8, width: w, height: 28, fill: hexToRgba(ebColors[i], 0.78), rx: 2 }),
        ebText({ text: item, left: x + 12, top: y + 15, width: w - 24, fontSize: fitFs(item, w - 24, 12, 9), fill: EB.paper, fontWeight: "850", textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const ebQuote: CanvasBuilder = (_t, c = {}) => {
  const quote = c.quote ?? c.heading ?? "The strategy is only useful if it changes what leaders choose next.";
  return ebCanvas([
    ...ebHeader(c.label, "10 / 12"),
    ebText({ text: "''", left: 90, top: 115, width: 130, fontSize: 110, fill: hexToRgba(EB.gold, 0.82), fontWeight: "900" }),
    ebTitle(quote, 185, 180, 860, titleFs(quote, 860, 50)),
    ebRule(250, 480, 570, EB.gold, 3),
    ebText({ text: c.author ?? c.subheading ?? "Boardroom takeaway", left: 250, top: 515, width: 570, fontSize: 20, fill: EB.mutedLight, textAlign: "center", fontWeight: "800" }),
    ebText({ text: bodyText(c, "The line should turn the discussion from analysis into a concrete decision about focus, ownership, and timing."), left: 290, top: 575, width: 490, fontSize: 18, fill: EB.mutedLight, textAlign: "center", lineHeight: 1.28 }),
  ]);
};

export const ebRecommendation: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, ["Approve the focused path", "Assign executive owner", "Review metrics monthly"], 3);
  const body = bodyText(c, "The recommendation should be narrow enough to execute, but large enough to change the trajectory of the business.");
  return ebCanvas([
    ...ebHeader(c.label, "11 / 12"),
    ebText({ text: "RECOMMENDATION", left: 72, top: 106, width: 220, fontSize: 12, fill: EB.gold, fontWeight: "900" }),
    ebTitle(c.heading ?? "Recommended Move", 72, 145, 720, titleFs(c.heading ?? "Recommended Move", 720, 58)),
    ebText({ text: body, left: 76, top: 330, width: 650, fontSize: bodyFs(body, 23, 17), fill: EB.mutedLight, lineHeight: 1.32 }),
    ...ebPanel(830, 150, 300, 390, EB.gold, "rgba(255,248,234,0.08)"),
    ...pts.map((p, i) => ebBullet(p, 870, 245 + i * 82, 220, ebColors[i], false, i)).flat(),
  ]);
};

export const ebClosing: CanvasBuilder = (_t, c = {}) => {
  const pts = points(c, ["Decision owner", "First milestone", "Review cadence"], 3);
  return ebCanvas([
    ...ebHeader(c.label, "12 / 12"),
    ebTitle(c.heading ?? "Decision Ready", 100, 145, 900, titleFs(c.heading ?? "Decision Ready", 900, 66)),
    ebText({ text: bodyText(c, "Close with the decision the room needs to make, the owner who will carry it, and the next checkpoint."), left: 106, top: 315, width: 760, fontSize: 24, fill: EB.mutedLight, lineHeight: 1.32 }),
    ebRule(106, 455, 640, EB.gold, 5),
    ...pts.map((p, i) => ebBullet(p, 130 + i * 330, 555, 240, ebColors[i], false, i)).flat(),
  ]);
};

export const ebClosingB: CanvasBuilder = (_t, c = {}) => (
  ebLightCanvas([
    ...ebHeader(c.label, "12 / 12", true),
    ebTitle(c.heading ?? "Final Decision", 96, 170, 920, titleFs(c.heading ?? "Final Decision", 920, 64), true),
    ebText({ text: bodyText(c, "The next step is to translate the strategic choice into ownership, timing, budget, and review rhythm."), left: 100, top: 335, width: 760, fontSize: 24, fill: EB.mutedInk, lineHeight: 1.32 }),
    ebRule(100, 485, 620, EB.gold, 5),
    ebText({ text: c.quote ?? "Leave the room with one decision, not ten open questions.", left: 100, top: 535, width: 730, fontSize: 22, fill: EB.rust, fontWeight: "800" }),
  ])
);
