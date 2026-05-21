import { W, cir, hexToRgba, rct } from "../helpers";
import { iconToFabric } from "../icons";
import type { CanvasBuilder, SlideContent, Theme } from "../types";
import { poBullet, poCanvas, poHeader, poImageSlot, poMetric, poPanel, poRule, poText, poTitle } from "./helpers";

function body(c: SlideContent, fallback: string) {
  return c.body?.trim() || fallback;
}

function points(c: SlideContent, fallback: string[], max = 4) {
  return (c.points?.length ? c.points : fallback).slice(0, max);
}

function steps(c: SlideContent, fallback: string[], max = 5) {
  return (c.steps?.length ? c.steps : c.points?.length ? c.points : fallback).slice(0, max);
}

function left(c: SlideContent, fallback: string[]) {
  return (c.leftPoints?.length ? c.leftPoints : fallback).slice(0, 4);
}

function right(c: SlideContent, fallback: string[]) {
  return (c.rightPoints?.length ? c.rightPoints : fallback).slice(0, 4);
}

function stats(c: SlideContent, fallback: Array<{ value: string; label: string }>, max = 4) {
  return (c.stats?.length ? c.stats : fallback).slice(0, max);
}

function colors(t: Theme) {
  return [t.accent, "#0F766E", "#B7791F", "#BE3455", "#2F5D8C"];
}

function imageContent(c: SlideContent, fallback: string): SlideContent {
  return { ...c, imageQuery: c.imageQuery ?? c.imageAlt ?? c.heading ?? fallback };
}

export const poCover: CanvasBuilder = (t, c = {}) => {
  const icon = c.icon ? iconToFabric({ name: c.icon, left: 76, top: 108, size: 32, fill: t.accent, opacity: 0.7 }) : null;
  return poCanvas(t, [
  ...poHeader(t, c.label, "01 / 12"),
  ...(icon ? [icon, poText(t, { text: "MODERN PRODUCT OS", left: 118, top: 112, width: 300, fontSize: 12, fill: t.accent, fontWeight: "900" })] : [poText(t, { text: "MODERN PRODUCT OS", left: 72, top: 112, width: 300, fontSize: 12, fill: t.accent, fontWeight: "900" })]),
  poTitle(t, c.heading ?? "Product Operating System", 72, 158, 700, 132, 60),
  poText(t, { text: c.subheading ?? body(c, "A product-native deck system for roadmaps, software ideas, AI products, platforms, and launch plans."), left: 76, top: 330, width: 600, height: 115, fontSize: 21, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
  poRule(76, 485, 420, t.accent, 5),
  rct({ left: 800, top: 120, width: 330, height: 390, fill: t.dark, rx: 24 }),
  rct({ left: 828, top: 156, width: 130, height: 12, fill: hexToRgba(t.surface, 0.75), rx: 6 }),
  ...Array.from({ length: 4 }).map((_, i) => rct({ left: 830, top: 205 + i * 58, width: 244 - i * 25, height: 32, fill: hexToRgba(t.surface, 0.10 + i * 0.03), rx: 10 })),
  cir({ left: 1000, top: 336, radius: 54, fill: hexToRgba(t.accent, 0.34) }),
  poText(t, { text: c.quote ?? "Designed from the prompt, not a fixed palette.", left: 815, top: 550, width: 300, height: 38, fontSize: 14, fill: hexToRgba(t.dark, 0.62), textAlign: "center", fontWeight: "760" }),
]);
};

export const poImageCover: CanvasBuilder = (t, c = {}) => poCanvas(t, [
  ...poImageSlot(t, { ...imageContent(c, "software product team workspace"), x: 690, y: 92, w: 500, h: 500, color: t.accent }),
  ...poHeader(t, c.label, "01 / 12"),
  poText(t, { text: "PRODUCT SYSTEM", left: 76, top: 122, width: 260, fontSize: 12, fill: t.accent, fontWeight: "900" }),
  poTitle(t, c.heading ?? "Modern Product OS", 76, 170, 560, 135, 58),
  poText(t, { text: c.subheading ?? body(c, "A visual product story with interface-like structure, controlled image placement, and AI-selected colors."), left: 80, top: 350, width: 520, height: 125, fontSize: 20, fill: hexToRgba(t.dark, 0.67), lineHeight: 1.32 }),
  poRule(80, 520, 330, t.accent, 5),
]);

export const poAgenda: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Problem space", "Product model", "User journey", "Launch path"], 5);
  return poCanvas(t, [
    ...poHeader(t, c.label, "02 / 12"),
    poTitle(t, c.heading ?? "Build Route", 72, 102, 600, 88, 52),
    poText(t, { text: body(c, "This route frames the product story from user need to system design, then turns it into launch priorities and measurable decisions."), left: 76, top: 210, width: 820, height: 105, fontSize: 18, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => {
      const y = 350 + i * 58;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: 160, top: y + 3, size: 28, fill: colors(t)[i], opacity: 0.8 }) : null;
      return [
        ...(icon ? [icon] : [poText(t, { text: String(i + 1).padStart(2, "0"), left: 150, top: y, width: 66, height: 34, fontSize: 26, fill: colors(t)[i], fontWeight: "900", textAlign: "center" })]),
        poRule(235, y + 16, 660, colors(t)[i], 3),
        poText(t, { text: item, left: 930, top: y - 5, width: 240, height: 40, fontSize: 18, fill: t.dark, fontWeight: "820" }),
      ];
    }).flat(),
  ]);
};

export const poBrief: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["User pressure", "Workflow gap", "Adoption trigger"], 3);
  return poCanvas(t, [
    ...poHeader(t, c.label, "03 / 12"),
    poTitle(t, c.heading ?? "Product Brief", 72, 105, 590, 92, 52),
    poText(t, { text: body(c, "The brief explains the user problem, why current workarounds are breaking down, and what a product must prove before teams should trust it."), left: 76, top: 220, width: 570, height: 220, fontSize: 18, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.34 }),
    ...poPanel(t, 740, 130, 340, 395, t.accent),
    poText(t, { text: c.subheading ?? "Operating readout", left: 780, top: 180, width: 260, height: 42, fontSize: 25, fill: t.dark, fontWeight: "880", textAlign: "center" }),
    ...items.map((item, i) => poBullet(t, item, 800, 285 + i * 72, 210, colors(t)[i])).flat(),
  ]);
};

export const poFeatureGrid: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Core workflow", "Automation layer", "User controls", "Analytics view"], 4);
  return poCanvas(t, [
    ...poHeader(t, c.label, "04 / 12"),
    poTitle(t, c.heading ?? "Feature System", 72, 98, 650, 86, 50),
    poText(t, { text: body(c, "Feature slides should explain how the product works as a system, not just list isolated capabilities."), left: 76, top: 200, width: 840, height: 82, fontSize: 18, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => {
      const x = 110 + (i % 2) * 535;
      const y = 330 + Math.floor(i / 2) * 130;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x + 30, top: y + 34, size: 28, fill: colors(t)[i], opacity: 0.8 }) : null;
      return [
        ...poPanel(t, x, y, 430, 102, colors(t)[i]),
        ...(icon ? [icon] : [poText(t, { text: String(i + 1).padStart(2, "0"), left: x + 24, top: y + 32, width: 55, height: 34, fontSize: 25, fill: colors(t)[i], fontWeight: "900" })]),
        poText(t, { text: item, left: x + 96, top: y + 31, width: 292, height: 42, fontSize: 18, fill: t.dark, fontWeight: "820" }),
      ];
    }).flat(),
  ]);
};

export const poImageSplit: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["User context", "Product response", "Adoption signal"], 3);
  return poCanvas(t, [
    ...poHeader(t, c.label, "05 / 12"),
    ...poImageSlot(t, { ...imageContent(c, "software product user workflow"), x: 72, y: 120, w: 520, h: 420, color: t.accent }),
    poTitle(t, c.heading ?? "User Workflow", 672, 115, 470, 88, 48),
    poText(t, { text: body(c, "Use the image to anchor the product in a real workflow, then explain what changes for the user and why the product experience matters."), left: 676, top: 220, width: 430, height: 135, fontSize: 17, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => poBullet(t, item, 700, 395 + i * 48, 360, colors(t)[i])).flat(),
  ]);
};

export const poShowcase: CanvasBuilder = (t, c = {}) => poCanvas(t, [
  ...poHeader(t, c.label, "06 / 12"),
  poTitle(t, c.heading ?? "Product Moment", 72, 98, 650, 82, 50),
  poText(t, { text: body(c, "This slide gives a visual moment enough space while keeping a short interpretation below it."), left: 76, top: 195, width: 820, height: 70, fontSize: 17, fill: hexToRgba(t.dark, 0.64), lineHeight: 1.3 }),
  ...poImageSlot(t, { ...imageContent(c, "product interface dashboard screen"), x: 145, y: 300, w: 990, h: 290, color: t.accent }),
]);

export const poWorkflow: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Capture demand", "Route work", "Automate tasks", "Measure outcome"], 5);
  return poCanvas(t, [
    ...poHeader(t, c.label, "07 / 12"),
    poTitle(t, c.heading ?? "Workflow Engine", 72, 105, 620, 88, 50),
    poText(t, { text: body(c, "The workflow slide shows how the product converts user input into a repeatable operating process."), left: 76, top: 210, width: 860, height: 90, fontSize: 17, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    ...items.map((item, i) => {
      const x = 118 + i * (1010 / Math.max(1, items.length - 1));
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x - 16, top: 410, size: 32, fill: colors(t)[i], opacity: 0.85 }) : null;
      return [
        rct({ left: x - 42, top: 385, width: 84, height: 84, fill: hexToRgba(colors(t)[i], 0.14), rx: 20 }),
        ...(icon ? [icon] : [poText(t, { text: String(i + 1), left: x - 16, top: 410, width: 32, height: 30, fontSize: 24, fill: colors(t)[i], textAlign: "center", fontWeight: "900" })]),
        poText(t, { text: item, left: x - 90, top: 495, width: 180, height: 52, fontSize: 16, fill: t.dark, textAlign: "center", fontWeight: "760" }),
        ...(i < items.length - 1 ? [poRule(x + 56, 426, 105, hexToRgba(t.dark, 0.18), 2)] : []),
      ];
    }).flat(),
  ]);
};

export const poMetrics: CanvasBuilder = (t, c = {}) => {
  const data = stats(c, [{ value: "42%", label: "activation lift" }, { value: "3x", label: "faster review" }, { value: "12mo", label: "build horizon" }, { value: "Q3", label: "launch window" }], 4);
  return poCanvas(t, [
    ...poHeader(t, c.label, "08 / 12", "dark"),
    poTitle(t, c.heading ?? "Product Signals", 72, 105, 650, 90, 52, "dark"),
    poText(t, { text: body(c, "Metrics should clarify whether the product is solving the right workflow problem and where the next experiment should focus."), left: 76, top: 215, width: 760, height: 90, fontSize: 18, fill: "rgba(255,255,255,0.72)", lineHeight: 1.32, mode: "dark" }),
    ...data.map((s, i) => {
      const x = 105 + (i % 2) * 540;
      const y = 350 + Math.floor(i / 2) * 125;
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x + 380, top: y + 35, size: 26, fill: colors(t)[i], opacity: 0.45 }) : null;
      return [...poMetric(t, x, y, 435, s.value, s.label, colors(t)[i], "dark"), ...(icon ? [icon] : [])];
    }).flat(),
  ], "dark");
};

export const poCompare: CanvasBuilder = (t, c = {}) => {
  const l = left(c, ["Existing workflow", "Manual handoffs", "Limited visibility"]);
  const r = right(c, ["Product workflow", "Automated routing", "Live operating data"]);
  return poCanvas(t, [
    ...poHeader(t, c.label, "09 / 12"),
    poTitle(t, c.heading ?? "Before and After", 72, 98, 680, 84, 50),
    ...poPanel(t, 85, 230, 500, 350, t.accent),
    ...poPanel(t, 695, 230, 500, 350, colors(t)[1]),
    poText(t, { text: c.subheading ?? "Before", left: 125, top: 275, width: 420, height: 38, fontSize: 26, fill: t.accent, fontWeight: "880", textAlign: "center" }),
    poText(t, { text: c.quote ?? "After", left: 735, top: 275, width: 420, height: 38, fontSize: 26, fill: colors(t)[1], fontWeight: "880", textAlign: "center" }),
    ...l.map((item, i) => poBullet(t, item, 140, 370 + i * 58, 380, t.accent)).flat(),
    ...r.map((item, i) => poBullet(t, item, 750, 370 + i * 58, 380, colors(t)[1])).flat(),
  ]);
};

export const poRoadmap: CanvasBuilder = (t, c = {}) => {
  const items = steps(c, ["Prototype", "Pilot", "Launch", "Scale"], 5);
  return poCanvas(t, [
    ...poHeader(t, c.label, "10 / 12"),
    poTitle(t, c.heading ?? "Product Roadmap", 72, 105, 650, 86, 50),
    poText(t, { text: body(c, "Roadmaps should show what gets proved at each stage, not just when work happens."), left: 76, top: 210, width: 840, height: 90, fontSize: 17, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.32 }),
    poRule(135, 420, 980, hexToRgba(t.dark, 0.22), 3),
    ...items.map((item, i) => {
      const x = 145 + i * (960 / Math.max(1, items.length - 1));
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: x - 12, top: 450 + (i % 2) * 44, size: 24, fill: colors(t)[i], opacity: 0.75 }) : null;
      return [
        cir({ left: x - 10, top: 411, radius: 10, fill: colors(t)[i] }),
        ...(icon ? [icon] : [poText(t, { text: String(i + 1).padStart(2, "0"), left: x - 32, top: 460 + (i % 2) * 44, width: 64, height: 30, fontSize: 24, fill: colors(t)[i], fontWeight: "900", textAlign: "center" })]),
        poText(t, { text: item, left: x - 90, top: (icon ? 486 : 500) + (i % 2) * 44, width: 180, height: 44, fontSize: 16, fill: t.dark, fontWeight: "780", textAlign: "center" }),
      ];
    }).flat(),
  ]);
};

export const poDecision: CanvasBuilder = (t, c = {}) => {
  const items = points(c, ["Build first workflow", "Validate with target users", "Measure adoption weekly"], 3);
  return poCanvas(t, [
    ...poHeader(t, c.label, "11 / 12"),
    poTitle(t, c.heading ?? "Decision Stack", 72, 105, 600, 90, 50),
    poText(t, { text: body(c, "The decision slide turns the product story into a concrete action set with owners, evidence, and next checkpoints."), left: 76, top: 215, width: 560, height: 180, fontSize: 18, fill: hexToRgba(t.dark, 0.66), lineHeight: 1.34 }),
    ...poPanel(t, 720, 140, 365, 405, t.accent),
    ...items.map((item, i) => {
      const iconName = c.icons?.[i];
      const icon = iconName ? iconToFabric({ name: iconName, left: 773, top: 210 + i * 98, size: 26, fill: colors(t)[i], opacity: 0.8 }) : null;
      return [
        ...(icon ? [icon] : [poText(t, { text: String(i + 1).padStart(2, "0"), left: 765, top: 205 + i * 98, width: 56, height: 34, fontSize: 26, fill: colors(t)[i], fontWeight: "900" })]),
        poText(t, { text: item, left: 835, top: 207 + i * 98, width: 210, height: 42, fontSize: 17, fill: t.dark, fontWeight: "800" }),
        rct({ left: 835, top: 254 + i * 98, width: 175, height: 1.5, fill: hexToRgba(t.dark, 0.12) }),
      ];
    }).flat(),
  ]);
};

export const poClosing: CanvasBuilder = (t, c = {}) => poCanvas(t, [
  ...poHeader(t, c.label, "12 / 12", "dark"),
  poTitle(t, c.heading ?? "Ship the System", 110, 170, 830, 122, 64, "dark"),
  poText(t, { text: body(c, "Close with the product move, the user value it creates, and the first checkpoint that will prove whether the direction is working."), left: 114, top: 330, width: 760, height: 135, fontSize: 21, fill: "rgba(255,255,255,0.74)", lineHeight: 1.34, mode: "dark" }),
  poRule(114, 515, 520, t.accent, 5),
  poText(t, { text: c.quote ?? "One product story. One next release.", left: 114, top: 558, width: 680, height: 46, fontSize: 24, fill: t.surface, fontWeight: "860", mode: "dark" }),
], "dark");
