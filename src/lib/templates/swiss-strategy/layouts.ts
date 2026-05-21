import { W, H, hexToRgba, rct, txt } from "../helpers";
import type { CanvasBuilder } from "../types";
import { SW, listRows, matrixCell, metricCard, noteBlock, quadrant, rule, scoreBar, sectionMarker, swissCanvas, swissHeader, swissTitle } from "./helpers";

const fallbackPoints = ["Revenue pressure is increasing", "Customer expectations are shifting", "Operational complexity is rising", "Decision window is narrowing"];
const fallbackSteps = ["Align leadership on the choice", "Resource the recommended path", "Launch focused execution", "Review progress monthly"];

export const ssTitle: CanvasBuilder = (_t, c = {}) => swissCanvas([
  rct({ left: 0, top: 0, width: W, height: 16, fill: SW.red }),
  txt({ text: (c.label ?? "STRATEGY MEMO").toUpperCase(), left: 58, top: 52, width: 360, fontSize: 15, fill: SW.ink, fontWeight: "700" }),
  swissTitle(c.heading ?? "Strategic Decision Memo", 146, 770, 72),
  txt({ text: c.subheading ?? "A structured recommendation for executive decision-making", left: 62, top: 330, width: 650, fontSize: 28, fill: SW.muted, lineHeight: 1.28 }),
  rct({ left: 812, top: 122, width: 330, height: 420, fill: "#ffffff" }),
  rule(812, 122, 330, SW.red, 8),
  txt({ text: "DECISION", left: 842, top: 176, width: 260, fontSize: 18, fill: SW.red, fontWeight: "700" }),
  txt({ text: c.body ?? "Clarify the strategic choice, compare options, and define the next move.", left: 842, top: 230, width: 250, fontSize: 27, fill: SW.ink, lineHeight: 1.18, fontWeight: "700" }),
  rule(62, H - 78, W - 124, SW.ink, 2),
]);

export const ssExecutiveSummary: CanvasBuilder = (_t, c = {}) => {
  const points = (c.points?.length ? c.points : fallbackPoints).slice(0, 4);
  return swissCanvas([
    ...swissHeader(c.label, "02 / 12"),
    swissTitle(c.heading ?? "Executive Summary", 102, 610, 56),
    txt({ text: c.body ?? "The recommendation is based on urgency, strategic fit, execution feasibility, and expected business impact.", left: 62, top: 188, width: 610, fontSize: 24, fill: SW.muted, lineHeight: 1.34 }),
    ...points.map((p, i) => noteBlock(`Signal ${String(i + 1).padStart(2, "0")}`, p, 70 + (i % 2) * 575, 300 + Math.floor(i / 2) * 142, 500, 102, i === 0 ? SW.red : SW.ink)).flat(),
  ]);
};

export const ssCurrentSituation: CanvasBuilder = (_t, c = {}) => {
  const stats = c.stats?.length ? c.stats : [
    { value: "3", label: "forces shaping the decision" },
    { value: "90d", label: "window for action" },
    { value: "2x", label: "execution complexity increase" },
  ];
  return swissCanvas([
    ...swissHeader(c.label, "03 / 12"),
    swissTitle(c.heading ?? "Current Situation", 100, 560, 54),
    txt({ text: c.body ?? "The organization faces a decision point where maintaining the current path creates compounding risk.", left: 62, top: 178, width: 560, fontSize: 23, fill: SW.muted, lineHeight: 1.35 }),
    ...stats.slice(0, 3).map((s, i) => metricCard(s.value, s.label, 70 + i * 370, 315, 300, 150, i === 0 ? SW.red : SW.ink)).flat(),
    ...listRows((c.points?.length ? c.points : fallbackPoints).slice(0, 3), 70, 535, 1080, 54),
  ]);
};

export const ssStrategicQuestion: CanvasBuilder = (_t, c = {}) => swissCanvas([
  ...swissHeader(c.label, "04 / 12"),
  ...sectionMarker("?", 70, 128),
  swissTitle(c.heading ?? "Strategic Question", 142, 780, 62),
  txt({ text: c.body ?? c.subheading ?? "Which strategic path creates the strongest long-term position while remaining executable in the next planning cycle?", left: 150, top: 330, width: 850, fontSize: 38, fill: SW.ink, lineHeight: 1.22, fontWeight: "700" }),
  rule(150, 540, 760, SW.red, 5),
  txt({ text: "The answer must balance impact, speed, risk, and organizational capacity.", left: 150, top: 575, width: 760, fontSize: 22, fill: SW.muted }),
]);

function optionSlide(no: string, title: string, c: Parameters<CanvasBuilder>[1] = {}, accent = SW.ink) {
  const scores = c.steps?.length ? c.steps : ["Strategic fit", "Financial upside", "Execution speed", "Risk exposure"];
  return swissCanvas([
    ...swissHeader(c.label, `${no} / 12`),
    swissTitle(c.heading ?? title, 104, 620, 54),
    txt({ text: c.body ?? "Option summary, strategic logic, and implications for execution.", left: 62, top: 178, width: 560, fontSize: 23, fill: SW.muted, lineHeight: 1.34 }),
    ...noteBlock("Core logic", c.subheading ?? "This option prioritizes a clear strategic posture with explicit tradeoffs.", 720, 112, 420, 180, accent),
    ...scores.slice(0, 4).map((s, i) => scoreBar(s, [8, 7, 6, 5][i], 80, 365 + i * 58, 600, i === 0 ? SW.red : accent)).flat(),
    ...listRows((c.points?.length ? c.points : fallbackPoints).slice(0, 3), 720, 350, 420, 58, accent),
  ]);
}

export const ssOptionA: CanvasBuilder = (_t, c = {}) => optionSlide("05", "Option A", c, SW.red);
export const ssOptionB: CanvasBuilder = (_t, c = {}) => optionSlide("06", "Option B", c, SW.ink);
export const ssOptionC: CanvasBuilder = (_t, c = {}) => optionSlide("07", "Option C", c, "#666666");

export const ssTradeoffMatrix: CanvasBuilder = (_t, c = {}) => {
  const rows = c.points?.length ? c.points : ["Impact", "Speed", "Cost", "Risk", "Strategic fit"];
  const cols = c.steps?.length ? c.steps : ["Option A", "Option B", "Option C"];
  return swissCanvas([
    ...swissHeader(c.label, "08 / 12"),
    swissTitle(c.heading ?? "Tradeoff Matrix", 96, 560, 54),
    ...cols.slice(0, 3).map((col, i) => txt({ text: col.toUpperCase(), left: 330 + i * 250, top: 206, width: 210, fontSize: 15, fill: i === 0 ? SW.red : SW.ink, fontWeight: "700" })),
    ...rows.slice(0, 5).map((row, r) => [
      txt({ text: row, left: 84, top: 264 + r * 66, width: 190, fontSize: 19, fill: SW.ink, fontWeight: "700" }),
      ...cols.slice(0, 3).map((_, i) => matrixCell(["Strong", "Moderate", "Weak", "High", "Best"][Math.abs(r - i) % 5], 310 + i * 250, 248 + r * 66, 210, 48, i === 0 && r < 3)).flat(),
    ]).flat(),
    txt({ text: c.body ?? "The recommended path should maximize strategic fit without creating avoidable execution drag.", left: 82, top: 628, width: 900, fontSize: 21, fill: SW.muted }),
  ]);
};

export const ssRecommendation: CanvasBuilder = (_t, c = {}) => swissCanvas([
  ...swissHeader(c.label, "09 / 12"),
  rct({ left: 62, top: 122, width: 210, height: 420, fill: SW.red }),
  txt({ text: "RECOMMEND", left: 84, top: 156, width: 160, fontSize: 16, fill: "#ffffff", fontWeight: "700" }),
  txt({ text: "01", left: 78, top: 312, width: 150, fontSize: 112, fill: "#ffffff", fontWeight: "700" }),
  swissTitle(c.heading ?? "Recommendation", 130, 760, 60),
  txt({ text: c.body ?? c.subheading ?? "Move forward with the option that provides the strongest strategic position and a focused execution path.", left: 330, top: 255, width: 720, fontSize: 34, fill: SW.ink, lineHeight: 1.24, fontWeight: "700" }),
  ...listRows((c.points?.length ? c.points : ["Clear strategic fit", "Manageable implementation risk", "Fastest route to measurable impact"]).slice(0, 3), 330, 492, 760, 54),
]);

export const ssRisks: CanvasBuilder = (_t, c = {}) => {
  const risks = c.leftPoints?.length ? c.leftPoints : ["Execution capacity", "Stakeholder alignment", "Market response"];
  const mitigations = c.rightPoints?.length ? c.rightPoints : ["Sequence work in phases", "Create decision checkpoints", "Monitor early signals"];
  return swissCanvas([
    ...swissHeader(c.label, "10 / 12"),
    swissTitle(c.heading ?? "Risks & Mitigations", 96, 680, 54),
    txt({ text: "Risk", left: 86, top: 210, width: 200, fontSize: 16, fill: SW.red, fontWeight: "700" }),
    txt({ text: "Mitigation", left: 664, top: 210, width: 220, fontSize: 16, fill: SW.ink, fontWeight: "700" }),
    ...risks.slice(0, 4).map((risk, i) => [
      ...matrixCell(risk, 80, 250 + i * 82, 470, 58, true),
      ...matrixCell(mitigations[i] ?? "Define an owner and review cadence", 640, 250 + i * 82, 470, 58, false),
    ]).flat(),
  ]);
};

export const ssRoadmap: CanvasBuilder = (_t, c = {}) => {
  const steps = (c.steps?.length ? c.steps : fallbackSteps).slice(0, 4);
  return swissCanvas([
    ...swissHeader(c.label, "11 / 12"),
    swissTitle(c.heading ?? "Execution Roadmap", 96, 620, 54),
    rule(112, 360, 980, SW.ink, 3),
    ...steps.map((step, i) => {
      const x = 116 + i * 250;
      return [
        rct({ left: x, top: 316, width: 22, height: 90, fill: i === 0 ? SW.red : SW.ink }),
        txt({ text: `Q${i + 1}`, left: x - 10, top: 256, width: 70, fontSize: 28, fill: i === 0 ? SW.red : SW.ink, fontWeight: "700" }),
        txt({ text: step, left: x - 6, top: 430, width: 210, fontSize: 20, fill: SW.ink, lineHeight: 1.25, fontWeight: "600" }),
      ];
    }).flat(),
  ]);
};

export const ssDecisionNext: CanvasBuilder = (_t, c = {}) => swissCanvas([
  ...swissHeader(c.label, "12 / 12"),
  swissTitle(c.heading ?? "Decision & Next Steps", 104, 720, 58),
  ...quadrant(720, 138, 420, 330, c.points ?? ["Approve", "Clarify", "Monitor", "Defer"]),
  txt({ text: c.body ?? "The leadership decision should confirm the recommended path, assign owners, and set the first review date.", left: 70, top: 230, width: 560, fontSize: 34, fill: SW.ink, lineHeight: 1.24, fontWeight: "700" }),
  ...listRows((c.steps?.length ? c.steps : ["Confirm decision owner", "Lock execution milestones", "Set KPI review cadence"]).slice(0, 3), 70, 492, 570, 58),
]);
