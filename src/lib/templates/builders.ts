import {
  W, H, hexToRgba, sanitize,
  txt, rct, cir, canvas,
  darkOrbs, accentBar, leftStripe, divider, badge, watermarkNum, placeholder,
} from "./helpers";
import { iconToFabric } from "./icons";
import type { Theme, SlideContent, CanvasBuilder } from "./types";

const PH = {
  heading: "Your Heading Here",
  sub: "Supporting subtitle text goes here",
  point: (i: number) => `Key point number ${i + 1}`,
  stat: (i: number) => ({ value: ["84%", "2.4x", "$1.2M", "99.9%"][i] ?? "—", label: ["Metric A", "Metric B", "Metric C", "Metric D"][i] ?? "Metric" }),
  quote: "The best way to predict the future is to create it.",
  step: (i: number) => `Step ${i + 1}`,
};

// ── INTRO / TITLE ──────────────────────────────────────────────────────

export const heroCentered: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const heading = c.heading ?? PH.heading;
  const sub = c.subheading;
  const headSize = heading.length > 30 ? 68 : heading.length > 20 ? 76 : 88;
  const headY = sub ? 210 : 270;
  const objs: unknown[] = [
    ...darkOrbs(ac),
    accentBar(ac),
    rct({ left: 0, top: 0, width: 320, height: 3, fill: hexToRgba(ac, 0.5) }),
    ...(c.label ? badge(c.label, 60, 52, ac, true) : []),
    txt({ text: heading, left: 80, top: headY, width: W - 160, fontSize: headSize,
          fill: "#ffffff", fontWeight: "bold", textAlign: "center", lineHeight: 1.1 }),
  ];
  if (sub) objs.push(txt({ text: sub, left: 140, top: headY + headSize * 1.2 + 16,
    width: W - 280, fontSize: 28, fill: hexToRgba("#fff", 0.6), textAlign: "center", lineHeight: 1.4 }));
  if (c.icon) {
    const icon = iconToFabric({ name: c.icon, left: W / 2 - 24, top: headY - 70, size: 48, fill: ac, opacity: 0.7 });
    if (icon) objs.push(icon);
  }
  return canvas(dk, objs);
};

export const heroSplit: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const heading = c.heading ?? PH.heading;
  const objs: unknown[] = [
    rct({ left: 0, top: 0, width: W * 0.52, height: H, fill: dk }),
    cir({ left: W * 0.52 - 180, top: H / 2 - 180, radius: 200, fill: hexToRgba(ac, 0.1) }),
    rct({ left: W * 0.52, top: 0, width: W * 0.48, height: H, fill: hexToRgba(ac, 0.04) }),
    rct({ left: W * 0.52 - 3, top: 0, width: 6, height: H, fill: ac }),
    txt({ text: heading, left: 60, top: H / 2 - 80, width: W * 0.44,
          fontSize: 56, fill: "#ffffff", fontWeight: "bold", lineHeight: 1.2 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 60, top: H / 2 + 80,
          width: W * 0.44, fontSize: 24, fill: hexToRgba("#fff", 0.6), lineHeight: 1.4 })] : []),
    txt({ text: c.body ?? "Your content area", left: W * 0.56, top: H / 2 - 50,
          width: W * 0.36, fontSize: 28, fill: hexToRgba("#000", 0.4), textAlign: "center" }),
  ];
  return canvas(sanitize(t.surface), objs);
};

export const titleClean: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const heading = c.heading ?? PH.heading;
  const objs: unknown[] = [
    rct({ left: 0, top: 0, width: 8, height: H, fill: ac }),
    rct({ left: 0, top: H - 80, width: W, height: 80, fill: hexToRgba(ac, 0.04) }),
    ...(c.label ? badge(c.label, 36, 40, ac) : []),
    txt({ text: heading, left: 60, top: c.label ? 90 : 60, width: W - 120,
          fontSize: heading.length > 40 ? 56 : 68, fill: "#0f172a", fontWeight: "bold", lineHeight: 1.15 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 60, top: 260, width: W * 0.65,
          fontSize: 28, fill: hexToRgba("#000", 0.45), lineHeight: 1.5 })] : []),
    txt({ text: "—", left: 60, top: H - 56, width: 40, fontSize: 20, fill: ac, fontWeight: "bold" }),
  ];
  return canvas(sf, objs);
};

export const coverAccent: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const heading = c.heading ?? PH.heading;
  const objs: unknown[] = [
    rct({ left: 0, top: 0, width: W, height: H * 0.72, fill: dk }),
    rct({ left: 0, top: H * 0.72, width: W, height: H * 0.28, fill: ac }),
    cir({ left: W - 120, top: -120, radius: 280, fill: hexToRgba(ac, 0.15) }),
    txt({ text: heading, left: 80, top: H * 0.22, width: W - 160,
          fontSize: heading.length > 30 ? 64 : 80, fill: "#ffffff",
          fontWeight: "bold", textAlign: "center", lineHeight: 1.15 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 80, top: H * 0.74 + 24,
          width: W - 160, fontSize: 26, fill: hexToRgba("#fff", 0.85), textAlign: "center" })] : []),
  ];
  return canvas(dk, objs);
};

export const chapterDivider: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const num = c.label ?? "01";
  const objs: unknown[] = [
    cir({ left: -80, top: -80, radius: 340, fill: hexToRgba(ac, 0.06) }),
    txt({ text: num, left: W * 0.52, top: -60, width: W * 0.52,
          fontSize: 380, fill: hexToRgba(ac, 0.08), fontWeight: "bold", lineHeight: 1 }),
    rct({ left: 80, top: H / 2 - 4, width: 120, height: 6, fill: ac, rx: 3 }),
    txt({ text: c.heading ?? "Chapter Title", left: 80, top: H / 2 + 24,
          width: W * 0.6, fontSize: 72, fill: "#ffffff", fontWeight: "bold", lineHeight: 1.1 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 80, top: H / 2 + 130,
          width: W * 0.55, fontSize: 26, fill: hexToRgba("#fff", 0.5) })] : []),
  ];
  return canvas(dk, objs);
};

// ── AGENDA / STRUCTURE ─────────────────────────────────────────────────

export const agendaNumbered: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const items = c.points ?? [PH.point(0), PH.point(1), PH.point(2), PH.point(3)];
  const objs: unknown[] = [
    leftStripe(ac),
    watermarkNum(1, ac),
    ...(c.label ? badge(c.label, 32, 36, ac) : []),
    txt({ text: c.heading ?? "Agenda", left: 32, top: c.label ? 78 : 44,
          width: W - 260, fontSize: 52, fill: "#0f172a", fontWeight: "bold" }),
    divider(c.label ? 150 : 118),
  ];
  const startY = c.label ? 172 : 138;
  const lineH = Math.min(96, (H - startY - 32) / items.length);
  const hasIcons = c.icons && c.icons.length >= items.length;
  items.forEach((item, i) => {
    const y = startY + i * lineH;
    if (hasIcons) {
      const icon = iconToFabric({ name: c.icons![i], left: 34, top: y + lineH * 0.22, size: 30, fill: ac });
      if (icon) { objs.push(icon); }
      else {
        objs.push(rct({ left: 32, top: y + lineH * 0.22, width: 36, height: 36, fill: ac, rx: 18 }));
        objs.push(txt({ text: String(i + 1), left: 36, top: y + lineH * 0.28, width: 28, fontSize: 16, fill: "#fff", fontWeight: "700", textAlign: "center" }));
      }
    } else {
      objs.push(rct({ left: 32, top: y + lineH * 0.22, width: 36, height: 36, fill: ac, rx: 18 }));
      objs.push(txt({ text: String(i + 1), left: 36, top: y + lineH * 0.28, width: 28, fontSize: 16, fill: "#fff", fontWeight: "700", textAlign: "center" }));
    }
    objs.push(txt({ text: item, left: 88, top: y + lineH * 0.18,
          width: W - 160, fontSize: lineH > 84 ? 28 : 26, fill: "#1e293b", lineHeight: 1.3 }));
  });
  return canvas(sf, objs);
};

export const agendaPills: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const items = c.points ?? [PH.point(0), PH.point(1), PH.point(2), PH.point(3), PH.point(4)];
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? "What We'll Cover", left: 32, top: 44,
          width: W - 60, fontSize: 52, fill: "#0f172a", fontWeight: "bold" }),
    divider(118),
  ];
  const cols = items.length <= 3 ? 1 : 2;
  const perCol = Math.ceil(items.length / cols);
  const colW = cols === 1 ? W - 100 : (W - 120) / 2 - 16;
  items.forEach((item, i) => {
    const col = Math.floor(i / perCol);
    const row = i % perCol;
    const x = 36 + col * (colW + 32);
    const y = 148 + row * 84;
    objs.push(rct({ left: x, top: y, width: colW, height: 64, fill: hexToRgba(ac, 0.08), rx: 12 }));
    objs.push(rct({ left: x, top: y, width: 5, height: 64, fill: ac, rx: 2 }));
    objs.push(txt({ text: `${String(i + 1).padStart(2, "0")}  ${item}`, left: x + 18, top: y + 18,
          width: colW - 28, fontSize: 22, fill: "#1e293b", fontWeight: "500" }));
  });
  return canvas(sf, objs);
};

export const sectionBreak: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const objs: unknown[] = [
    rct({ left: 0, top: H / 2 - 2, width: W, height: 4, fill: hexToRgba(ac, 0.3) }),
    rct({ left: W / 2 - 80, top: H / 2 - 2, width: 160, height: 4, fill: ac }),
    cir({ left: W / 2 - 6, top: H / 2 - 8, radius: 10, fill: ac }),
    txt({ text: c.heading ?? "Section Title", left: 80, top: H / 2 + 32,
          width: W - 160, fontSize: 64, fill: "#ffffff", fontWeight: "bold", textAlign: "center" }),
    ...(c.label ? [txt({ text: c.label.toUpperCase(), left: 80, top: H / 2 - 80,
          width: W - 160, fontSize: 14, fill: hexToRgba("#fff", 0.4), textAlign: "center",
          fontWeight: "600" })] : []),
  ];
  return canvas(dk, objs);
};

// ── CONTENT / TEXT ─────────────────────────────────────────────────────

export const bulletsClassic: CanvasBuilder = (t, c = {}, slideNum = 1) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const points = c.points ?? [PH.point(0), PH.point(1), PH.point(2), PH.point(3)];
  const heading = c.heading ?? PH.heading;
  const objs: unknown[] = [
    leftStripe(ac),
    watermarkNum(slideNum, ac),
    ...(c.label ? badge(c.label, 32, 36, ac) : []),
    txt({ text: heading, left: 32, top: c.label ? 78 : 48, width: W - 240,
          fontSize: heading.length > 35 ? 42 : 50, fill: "#0f172a", fontWeight: "bold", lineHeight: 1.15 }),
    divider(c.label ? 150 : 120),
  ];
  const startY = c.label ? 172 : 140;
  const maxP = Math.min(points.length, 5);
  const lineH = Math.min(96, (H - startY - 40) / maxP);
  const hasIcons = c.icons && c.icons.length >= maxP;
  for (let i = 0; i < maxP; i++) {
    const y = startY + i * lineH;
    if (hasIcons) {
      const icon = iconToFabric({ name: c.icons![i], left: 30, top: y + lineH * 0.2, size: 28, fill: ac });
      if (icon) {
        objs.push(icon);
      } else {
        objs.push(rct({ left: 30, top: y + lineH * 0.28, width: 22, height: 22, fill: hexToRgba(ac, 0.12), rx: 11 }));
        objs.push(txt({ text: String(i + 1), left: 34, top: y + lineH * 0.3, width: 14, fontSize: 12, fill: ac, fontWeight: "700", textAlign: "center" }));
      }
    } else {
      objs.push(rct({ left: 30, top: y + lineH * 0.28, width: 22, height: 22, fill: hexToRgba(ac, 0.12), rx: 11 }));
      objs.push(txt({ text: String(i + 1), left: 34, top: y + lineH * 0.3, width: 14, fontSize: 12, fill: ac, fontWeight: "700", textAlign: "center" }));
    }
    objs.push(txt({ text: points[i], left: 68, top: y + lineH * 0.18,
          width: W - 140, fontSize: lineH > 80 ? 28 : 26, fill: "#1e293b", lineHeight: 1.35 }));
  }
  return canvas(sf, objs);
};

export const bulletsCards: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const points = c.points ?? [PH.point(0), PH.point(1), PH.point(2), PH.point(3)];
  const heading = c.heading ?? PH.heading;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: heading, left: 32, top: 48, width: W - 60,
          fontSize: 50, fill: "#0f172a", fontWeight: "bold" }),
    divider(116),
  ];
  const cols = points.length <= 2 ? 1 : points.length <= 4 ? 2 : 3;
  const rows = Math.ceil(points.length / cols);
  const cardW = (W - 64 - (cols - 1) * 16) / cols;
  const cardH = Math.min(160, (H - 148 - (rows - 1) * 12) / rows);
  const hasIcons = c.icons && c.icons.length >= points.length;
  points.slice(0, 6).forEach((pt, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 32 + col * (cardW + 16);
    const y = 136 + row * (cardH + 12);
    objs.push(rct({ left: x, top: y, width: cardW, height: cardH, fill: hexToRgba(ac, 0.07), rx: 12 }));
    objs.push(rct({ left: x, top: y, width: cardW, height: 4, fill: ac, rx: 2 }));
    if (hasIcons) {
      const icon = iconToFabric({ name: c.icons![i], left: x + 16, top: y + 18, size: 24, fill: ac });
      if (icon) {
        objs.push(icon);
        objs.push(txt({ text: pt, left: x + 50, top: y + 20, width: cardW - 66,
              fontSize: 22, fill: "#1e293b", lineHeight: 1.4 }));
      } else {
        objs.push(txt({ text: pt, left: x + 16, top: y + 20, width: cardW - 32,
              fontSize: 22, fill: "#1e293b", lineHeight: 1.4 }));
      }
    } else {
      objs.push(txt({ text: pt, left: x + 16, top: y + 20, width: cardW - 32,
            fontSize: 22, fill: "#1e293b", lineHeight: 1.4 }));
    }
  });
  return canvas(sf, objs);
};

export const twoColEqual: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const left = c.leftPoints ?? c.points?.slice(0, 3) ?? [PH.point(0), PH.point(1), PH.point(2)];
  const right = c.rightPoints ?? c.points?.slice(3) ?? [PH.point(3), PH.point(4), PH.point(5)];
  const colW = (W - 96) / 2;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44, width: W - 60,
          fontSize: 50, fill: "#0f172a", fontWeight: "bold" }),
    divider(112),
    rct({ left: W / 2, top: 124, width: 1.5, height: H - 156, fill: hexToRgba(ac, 0.15) }),
  ];
  const colStart = 132;
  [left, right].forEach((pts, ci) => {
    const x = ci === 0 ? 32 : W / 2 + 24;
    objs.push(txt({ text: ci === 0 ? "◈ Left" : "◈ Right", left: x, top: colStart - 4,
          width: colW, fontSize: 12, fill: ac, fontWeight: "700" }));
    pts.slice(0, 4).forEach((pt, i) => {
      objs.push(rct({ left: x, top: colStart + 24 + i * 82 + 28, width: 8, height: 8, fill: ac, rx: 4 }));
      objs.push(txt({ text: pt, left: x + 20, top: colStart + 24 + i * 82 + 20,
            width: colW - 24, fontSize: 25, fill: "#1e293b", lineHeight: 1.35 }));
    });
  });
  return canvas(sf, objs);
};

export const twoColWide: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const points = c.points ?? [PH.point(0), PH.point(1), PH.point(2), PH.point(3)];
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44, width: W * 0.6,
          fontSize: 50, fill: "#0f172a", fontWeight: "bold", lineHeight: 1.15 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 32, top: 160, width: W * 0.58,
          fontSize: 26, fill: hexToRgba("#000", 0.45), lineHeight: 1.5 })] : []),
    rct({ left: W * 0.65, top: 40, width: W * 0.3, height: H - 80,
          fill: hexToRgba(ac, 0.06), rx: 12 }),
    rct({ left: W * 0.65, top: 40, width: W * 0.3, height: 5, fill: ac, rx: 2 }),
  ];
  points.slice(0, 5).forEach((pt, i) => {
    objs.push(rct({ left: W * 0.65 + 20, top: 72 + i * 100, width: 8, height: 8, fill: ac, rx: 4 }));
    objs.push(txt({ text: pt, left: W * 0.65 + 40, top: 60 + i * 100,
          width: W * 0.3 - 56, fontSize: 22, fill: "#1e293b", lineHeight: 1.4 }));
  });
  return canvas(sf, objs);
};

export const threeCol: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const groups = c.points ?? [PH.point(0), PH.point(1), PH.point(2)];
  const colW = (W - 96) / 3;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44, width: W - 60,
          fontSize: 48, fill: "#0f172a", fontWeight: "bold" }),
    divider(110),
  ];
  const labels = c.steps ?? ["Point A", "Point B", "Point C"];
  for (let ci = 0; ci < 3; ci++) {
    const x = 32 + ci * (colW + 16);
    objs.push(rct({ left: x, top: 124, width: colW, height: H - 156, fill: hexToRgba(ac, 0.05), rx: 10 }));
    objs.push(rct({ left: x, top: 124, width: colW, height: 5, fill: hexToRgba(ac, ci === 0 ? 1 : 0.5), rx: 2 }));
    objs.push(txt({ text: labels[ci] ?? `Column ${ci + 1}`, left: x + 16, top: 140,
          width: colW - 32, fontSize: 20, fill: ac, fontWeight: "700" }));
    objs.push(txt({ text: groups[ci] ?? PH.point(ci), left: x + 16, top: 174,
          width: colW - 32, fontSize: 22, fill: "#1e293b", lineHeight: 1.45 }));
  }
  return canvas(sf, objs);
};

export const keyMessage: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const msg = c.heading ?? "One powerful idea changes everything.";
  const sz = msg.length > 60 ? 44 : msg.length > 40 ? 52 : msg.length > 25 ? 60 : 70;
  const objs: unknown[] = [
    ...darkOrbs(ac), accentBar(ac),
    ...(c.label ? badge(c.label, W / 2 - 60, 52, ac, true) : []),
    txt({ text: "“", left: 40, top: -40, width: 200, fontSize: 280,
          fill: hexToRgba(ac, 0.12), fontWeight: "bold", lineHeight: 1 }),
    txt({ text: msg, left: 100, top: H / 2 - sz * 1.2,
          width: W - 200, fontSize: sz, fill: "#ffffff",
          fontWeight: "bold", textAlign: "center", lineHeight: 1.3 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 160, top: H / 2 + sz * 0.8,
          width: W - 320, fontSize: 24, fill: hexToRgba("#fff", 0.5), textAlign: "center" })] : []),
  ];
  return canvas(dk, objs);
};

export const quoteLarge: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const quote = c.quote ?? c.heading ?? PH.quote;
  const sz = quote.length > 120 ? 28 : quote.length > 80 ? 34 : 40;
  const objs: unknown[] = [
    leftStripe(ac),
    rct({ left: 5, top: 0, width: W - 5, height: H, fill: hexToRgba(ac, 0.02) }),
    txt({ text: "“", left: 32, top: -30, width: 160, fontSize: 220,
          fill: hexToRgba(ac, 0.18), fontWeight: "bold", lineHeight: 1 }),
    txt({ text: quote, left: 80, top: H / 2 - sz * 2.4,
          width: W - 160, fontSize: sz, fill: "#1e293b",
          fontWeight: "500", textAlign: "center", lineHeight: 1.6 }),
    rct({ left: W / 2 - 40, top: H / 2 + sz * 1.8, width: 80, height: 3, fill: ac, rx: 1 }),
    ...(c.author ? [txt({ text: `— ${c.author}`, left: 80, top: H / 2 + sz * 2.2,
          width: W - 160, fontSize: 20, fill: hexToRgba("#000", 0.4), textAlign: "center" })] : []),
  ];
  return canvas(sf, objs);
};

export const tipHighlight: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const tip = c.heading ?? "Pro Tip: Always design for the audience, not yourself.";
  const iconName = c.icon ?? "lightbulb";
  const icon = iconToFabric({ name: iconName, left: W - 110, top: 145, size: 48, fill: ac, opacity: 0.5 });
  const objs: unknown[] = [
    leftStripe(ac),
    ...(c.label ? badge(c.label ?? "Key Insight", 32, 36, ac) : badge("Key Insight", 32, 36, ac)),
    rct({ left: 32, top: 120, width: W - 64, height: H - 160, fill: hexToRgba(ac, 0.06), rx: 16 }),
    rct({ left: 32, top: 120, width: 8, height: H - 160, fill: ac, rx: 4 }),
    ...(icon ? [icon] : []),
    txt({ text: tip, left: 72, top: H / 2 - 60,
          width: W - 200, fontSize: tip.length > 80 ? 30 : 36,
          fill: "#0f172a", fontWeight: "600", lineHeight: 1.5 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 72, top: H - 120,
          width: W - 200, fontSize: 22, fill: hexToRgba("#000", 0.45) })] : []),
  ];
  return canvas(sf, objs);
};

// ── NUMBERS & DATA ─────────────────────────────────────────────────────

export const singleStat: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const s = c.stats?.[0] ?? PH.stat(0);
  const objs: unknown[] = [
    ...darkOrbs(ac), accentBar(ac),
  ];
  if (c.icon) {
    const icon = iconToFabric({ name: c.icon, left: W / 2 - 20, top: H / 2 - 190, size: 40, fill: ac, opacity: 0.6 });
    if (icon) objs.push(icon);
  }
  objs.push(
    txt({ text: s.value, left: 80, top: H / 2 - 120,
          width: W - 160, fontSize: 180, fill: "#ffffff",
          fontWeight: "bold", textAlign: "center", lineHeight: 1 }),
    rct({ left: W / 2 - 60, top: H / 2 + 90, width: 120, height: 5, fill: ac, rx: 2 }),
    txt({ text: s.label, left: 80, top: H / 2 + 110,
          width: W - 160, fontSize: 32, fill: hexToRgba("#fff", 0.6),
          textAlign: "center", fontWeight: "500" }),
  );
  if (c.heading) objs.push(txt({ text: c.heading, left: 80, top: 40,
        width: W - 160, fontSize: 26, fill: hexToRgba("#fff", 0.45), textAlign: "center" }));
  return canvas(dk, objs);
};

export const threeStats: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const stats = c.stats ?? [PH.stat(0), PH.stat(1), PH.stat(2)];
  const colW = (W - 96) / 3;
  const hasIcons = c.icons && c.icons.length >= stats.length;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44,
          width: W - 60, fontSize: 48, fill: "#0f172a", fontWeight: "bold" }),
    divider(108),
  ];
  stats.slice(0, 3).forEach((s, i) => {
    const x = 32 + i * (colW + 16);
    objs.push(rct({ left: x, top: 124, width: colW, height: H - 156, fill: hexToRgba(ac, 0.05), rx: 12 }));
    objs.push(rct({ left: x, top: 124, width: colW, height: 5, fill: ac, rx: 2 }));
    if (hasIcons) {
      const icon = iconToFabric({ name: c.icons![i], left: x + colW / 2 - 16, top: 140, size: 32, fill: ac, opacity: 0.6 });
      if (icon) objs.push(icon);
    }
    objs.push(txt({ text: s.value, left: x + 16, top: hasIcons ? 185 : 148,
          width: colW - 32, fontSize: hasIcons ? 72 : 88, fill: "#0f172a", fontWeight: "bold", textAlign: "center" }));
    objs.push(txt({ text: s.label, left: x + 16, top: hasIcons ? 280 : 270,
          width: colW - 32, fontSize: 22, fill: hexToRgba("#000", 0.45), textAlign: "center" }));
  });
  return canvas(sf, objs);
};

export const fourStats: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const stats = c.stats ?? [PH.stat(0), PH.stat(1), PH.stat(2), PH.stat(3)];
  const cardW = (W - 80) / 2 - 8;
  const cardH = (H - 160) / 2 - 8;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44,
          width: W - 60, fontSize: 44, fill: "#0f172a", fontWeight: "bold" }),
    divider(104),
  ];
  stats.slice(0, 4).forEach((s, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 32 + col * (cardW + 16);
    const y = 116 + row * (cardH + 16);
    objs.push(rct({ left: x, top: y, width: cardW, height: cardH, fill: hexToRgba(ac, 0.06), rx: 12 }));
    objs.push(txt({ text: s.value, left: x, top: y + cardH * 0.2,
          width: cardW, fontSize: 68, fill: "#0f172a", fontWeight: "bold", textAlign: "center" }));
    objs.push(txt({ text: s.label, left: x, top: y + cardH * 0.72,
          width: cardW, fontSize: 20, fill: hexToRgba("#000", 0.4), textAlign: "center" }));
  });
  return canvas(sf, objs);
};

export const progressBars: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const items = c.stats ?? [
    { value: "87%", label: "Category A" },
    { value: "64%", label: "Category B" },
    { value: "45%", label: "Category C" },
    { value: "92%", label: "Category D" },
  ];
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44,
          width: W - 60, fontSize: 50, fill: "#0f172a", fontWeight: "bold" }),
    divider(112),
  ];
  const startY = 134, barH = 16, gap = (H - startY - 60) / items.length;
  items.slice(0, 5).forEach((s, i) => {
    const y = startY + i * gap;
    const pct = parseFloat(s.value) / 100 || 0.5;
    objs.push(txt({ text: s.label, left: 32, top: y,
          width: 300, fontSize: 22, fill: "#0f172a", fontWeight: "500" }));
    objs.push(txt({ text: s.value, left: W - 90, top: y,
          width: 80, fontSize: 22, fill: ac, fontWeight: "700", textAlign: "right" }));
    objs.push(rct({ left: 32, top: y + 36, width: W - 64, height: barH, fill: hexToRgba(ac, 0.1), rx: barH / 2 }));
    objs.push(rct({ left: 32, top: y + 36, width: Math.max((W - 64) * pct, barH), height: barH, fill: ac, rx: barH / 2 }));
  });
  return canvas(sf, objs);
};

export const timeline: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const steps = c.steps ?? c.points ?? [PH.step(0), PH.step(1), PH.step(2), PH.step(3)];
  const n = Math.min(steps.length, 5);
  const hasIcons = c.icons && c.icons.length >= n;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44,
          width: W - 60, fontSize: 50, fill: "#0f172a", fontWeight: "bold" }),
    divider(112),
    rct({ left: 60, top: H / 2 + 20, width: W - 120, height: 3, fill: hexToRgba(ac, 0.2), rx: 1 }),
  ];
  const itemW = (W - 120) / n;
  for (let i = 0; i < n; i++) {
    const cx = 60 + i * itemW + itemW / 2;
    if (hasIcons) {
      const icon = iconToFabric({ name: c.icons![i], left: cx - 14, top: H / 2 + 7, size: 28, fill: ac });
      if (icon) { objs.push(icon); }
      else {
        objs.push(rct({ left: cx - 16, top: H / 2 + 5, width: 32, height: 32, fill: ac, rx: 16 }));
        objs.push(txt({ text: String(i + 1), left: cx - 12, top: H / 2 + 10, width: 24, fontSize: 14, fill: "#fff", fontWeight: "700", textAlign: "center" }));
      }
    } else {
      objs.push(rct({ left: cx - 16, top: H / 2 + 5, width: 32, height: 32, fill: ac, rx: 16 }));
      objs.push(txt({ text: String(i + 1), left: cx - 12, top: H / 2 + 10, width: 24, fontSize: 14, fill: "#fff", fontWeight: "700", textAlign: "center" }));
    }
    if (i < n - 1) objs.push(rct({ left: cx + 16, top: H / 2 + 19, width: itemW - 32, height: 3, fill: hexToRgba(ac, 0.15) }));
    objs.push(txt({ text: steps[i], left: cx - itemW * 0.45, top: H / 2 + 50,
          width: itemW * 0.9, fontSize: 20, fill: "#1e293b", textAlign: "center", lineHeight: 1.4 }));
  }
  return canvas(sf, objs);
};

// ── COMPARISON ─────────────────────────────────────────────────────────

export const twoColCompare: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const left = c.leftPoints ?? c.points?.slice(0, 3) ?? [PH.point(0), PH.point(1), PH.point(2)];
  const right = c.rightPoints ?? c.points?.slice(3) ?? [PH.point(3), PH.point(4), PH.point(5)];
  const half = W / 2;
  const objs: unknown[] = [
    rct({ left: 0, top: 0, width: half - 2, height: H, fill: hexToRgba(ac, 0.04) }),
    rct({ left: half + 2, top: 0, width: half - 2, height: H, fill: hexToRgba("#000", 0.02) }),
    rct({ left: half - 2, top: 0, width: 4, height: H, fill: ac }),
    txt({ text: c.heading ?? "Comparison", left: 32, top: 32,
          width: W - 64, fontSize: 48, fill: "#0f172a", fontWeight: "bold", textAlign: "center" }),
  ];
  const colLabels = c.steps ?? ["✓  Pros", "✕  Cons"];
  [left, right].forEach((pts, ci) => {
    const x = ci === 0 ? 20 : half + 20;
    const labelColor = ci === 0 ? ac : "#64748b";
    objs.push(rct({ left: x, top: 90, width: half - 24, height: 40, fill: hexToRgba(labelColor, 0.1), rx: 8 }));
    objs.push(txt({ text: colLabels[ci], left: x + 12, top: 100, width: half - 48,
          fontSize: 18, fill: labelColor, fontWeight: "700" }));
    pts.slice(0, 4).forEach((pt, i) => {
      const dotColor = ci === 0 ? ac : "#94a3b8";
      objs.push(rct({ left: x + 12, top: 148 + i * 100 + 36, width: 8, height: 8, fill: dotColor, rx: 4 }));
      objs.push(txt({ text: pt, left: x + 28, top: 148 + i * 100 + 24,
            width: half - 56, fontSize: 24, fill: "#1e293b", lineHeight: 1.35 }));
    });
  });
  return canvas(sf, objs);
};

export const versus: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const items = c.steps ?? ["Option A", "Option B"];
  const objs: unknown[] = [
    rct({ left: 0, top: 0, width: W * 0.45, height: H, fill: dk }),
    rct({ left: W * 0.55, top: 0, width: W * 0.45, height: H, fill: hexToRgba(ac, 0.08) }),
    rct({ left: W * 0.45, top: 0, width: W * 0.1, height: H, fill: ac }),
    txt({ text: "VS", left: W * 0.45, top: H / 2 - 40, width: W * 0.1,
          fontSize: 36, fill: "#fff", fontWeight: "bold", textAlign: "center" }),
    txt({ text: items[0] ?? "Option A", left: 40, top: H / 2 - 50,
          width: W * 0.42, fontSize: 52, fill: "#ffffff", fontWeight: "bold", textAlign: "center" }),
    txt({ text: items[1] ?? "Option B", left: W * 0.58, top: H / 2 - 50,
          width: W * 0.38, fontSize: 52, fill: "#0f172a", fontWeight: "bold", textAlign: "center" }),
    ...(c.heading ? [txt({ text: c.heading, left: 0, top: 32, width: W,
          fontSize: 22, fill: hexToRgba("#fff", 0.4), textAlign: "center" })] : []),
  ];
  return canvas(sanitize(t.surface), objs);
};

export const featureList: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const features = c.points ?? [PH.point(0), PH.point(1), PH.point(2), PH.point(3), PH.point(4)];
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44,
          width: W - 60, fontSize: 50, fill: "#0f172a", fontWeight: "bold" }),
    divider(112),
  ];
  const n = Math.min(features.length, 6);
  const cols = n > 3 ? 2 : 1;
  const perCol = Math.ceil(n / cols);
  const colW = cols === 2 ? (W - 80) / 2 - 16 : W - 64;
  const hasIcons = c.icons && c.icons.length >= n;
  for (let i = 0; i < n; i++) {
    const col = Math.floor(i / perCol);
    const row = i % perCol;
    const x = 32 + col * (colW + 32);
    const y = 128 + row * 86;
    if (hasIcons) {
      const icon = iconToFabric({ name: c.icons![i], left: x + 2, top: y + 12, size: 28, fill: ac });
      if (icon) { objs.push(icon); }
      else {
        objs.push(rct({ left: x, top: y + 14, width: 28, height: 28, fill: ac, rx: 14 }));
        objs.push(txt({ text: "✓", left: x + 2, top: y + 15, width: 24, fontSize: 16, fill: "#fff", fontWeight: "700", textAlign: "center" }));
      }
    } else {
      objs.push(rct({ left: x, top: y + 14, width: 28, height: 28, fill: ac, rx: 14 }));
      objs.push(txt({ text: "✓", left: x + 2, top: y + 15, width: 24, fontSize: 16, fill: "#fff", fontWeight: "700", textAlign: "center" }));
    }
    objs.push(txt({ text: features[i], left: x + 44, top: y + 10,
          width: colW - 52, fontSize: 26, fill: "#1e293b", lineHeight: 1.35 }));
  }
  return canvas(sf, objs);
};

export const beforeAfter: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const left = c.leftPoints ?? [PH.point(0), PH.point(1)];
  const right = c.rightPoints ?? [PH.point(2), PH.point(3)];
  const half = W / 2;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? "Before & After", left: 32, top: 44,
          width: W - 60, fontSize: 50, fill: "#0f172a", fontWeight: "bold" }),
    divider(112),
    rct({ left: 32, top: 124, width: half - 48, height: H - 156, fill: hexToRgba("#94a3b8", 0.08), rx: 12 }),
    rct({ left: 32, top: 124, width: half - 48, height: 5, fill: "#94a3b8", rx: 2 }),
    txt({ text: "BEFORE", left: 48, top: 136, width: half - 80,
          fontSize: 14, fill: "#94a3b8", fontWeight: "700" }),
    rct({ left: half + 16, top: 124, width: half - 48, height: H - 156, fill: hexToRgba(ac, 0.07), rx: 12 }),
    rct({ left: half + 16, top: 124, width: half - 48, height: 5, fill: ac, rx: 2 }),
    txt({ text: "AFTER", left: half + 32, top: 136, width: half - 80,
          fontSize: 14, fill: ac, fontWeight: "700" }),
  ];
  left.slice(0, 3).forEach((pt, i) => {
    objs.push(rct({ left: 48, top: 168 + i * 100 + 36, width: 8, height: 8, fill: "#94a3b8", rx: 4 }));
    objs.push(txt({ text: pt, left: 64, top: 168 + i * 100 + 24, width: half - 100, fontSize: 24, fill: "#64748b", lineHeight: 1.35 }));
  });
  right.slice(0, 3).forEach((pt, i) => {
    objs.push(rct({ left: half + 32, top: 168 + i * 100 + 36, width: 8, height: 8, fill: ac, rx: 4 }));
    objs.push(txt({ text: pt, left: half + 48, top: 168 + i * 100 + 24, width: half - 100, fontSize: 24, fill: "#1e293b", lineHeight: 1.35 }));
  });
  return canvas(sf, objs);
};

// ── VISUAL / IMAGE ─────────────────────────────────────────────────────

export const imageLeft: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const objs: unknown[] = [
    ...placeholder("🖼  Image", 0, 0, W * 0.48, H, ac),
    rct({ left: W * 0.48, top: 0, width: 5, height: H, fill: hexToRgba(ac, 0.3) }),
    ...(c.label ? badge(c.label, W * 0.52 + 24, 40, ac) : []),
    txt({ text: c.heading ?? PH.heading, left: W * 0.52 + 24,
          top: c.label ? 88 : 60, width: W * 0.44,
          fontSize: 48, fill: "#0f172a", fontWeight: "bold", lineHeight: 1.2 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: W * 0.52 + 24, top: 220,
          width: W * 0.44, fontSize: 26, fill: hexToRgba("#000", 0.5), lineHeight: 1.5 })] : []),
    ...(c.points ?? []).slice(0, 3).map((pt, i) => {
      return [
        rct({ left: W * 0.52 + 24, top: 310 + i * 84 + 30, width: 8, height: 8, fill: ac, rx: 4 }),
        txt({ text: pt, left: W * 0.52 + 44, top: 310 + i * 84 + 18,
              width: W * 0.44 - 28, fontSize: 24, fill: "#1e293b", lineHeight: 1.35 }),
      ];
    }).flat(),
  ];
  return canvas(sf, objs);
};

export const imageRight: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const objs: unknown[] = [
    leftStripe(ac),
    ...(c.label ? badge(c.label, 24, 36, ac) : []),
    txt({ text: c.heading ?? PH.heading, left: 24, top: c.label ? 84 : 52, width: W * 0.46,
          fontSize: 48, fill: "#0f172a", fontWeight: "bold", lineHeight: 1.2 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 24, top: 220,
          width: W * 0.46, fontSize: 26, fill: hexToRgba("#000", 0.5), lineHeight: 1.5 })] : []),
    ...(c.points ?? []).slice(0, 3).map((pt, i) => [
      rct({ left: 24, top: 310 + i * 84 + 30, width: 8, height: 8, fill: ac, rx: 4 }),
      txt({ text: pt, left: 44, top: 310 + i * 84 + 18, width: W * 0.46 - 28, fontSize: 24, fill: "#1e293b", lineHeight: 1.35 }),
    ]).flat(),
    ...placeholder("🖼  Image", W * 0.52, 0, W * 0.48, H, ac),
    rct({ left: W * 0.52 - 5, top: 0, width: 5, height: H, fill: hexToRgba(ac, 0.3) }),
  ];
  return canvas(sf, objs);
};

export const imageFull: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const objs: unknown[] = [
    ...placeholder("🖼  Full-Width Image", 0, 0, W, H, ac),
    rct({ left: 0, top: H * 0.65, width: W, height: H * 0.35, fill: "rgba(0,0,0,0.55)" }),
    txt({ text: c.heading ?? PH.heading, left: 60, top: H * 0.68,
          width: W - 120, fontSize: 52, fill: "#ffffff", fontWeight: "bold", lineHeight: 1.2 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 60, top: H * 0.82,
          width: W * 0.7, fontSize: 26, fill: "rgba(255,255,255,0.7)" })] : []),
  ];
  return canvas(dk, objs);
};

export const imageGrid: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const gap = 8;
  const half = (W - gap) / 2;
  const halfH = (H - 140 - gap) / 2;
  const objs: unknown[] = [
    leftStripe(ac),
    txt({ text: c.heading ?? PH.heading, left: 32, top: 44,
          width: W - 60, fontSize: 44, fill: "#0f172a", fontWeight: "bold" }),
    divider(102),
    ...placeholder("🖼", 0, 114, half, halfH, ac),
    ...placeholder("🖼", half + gap, 114, half, halfH, ac),
    ...placeholder("🖼", 0, 114 + halfH + gap, half, halfH, ac),
    ...placeholder("🖼", half + gap, 114 + halfH + gap, half, halfH, ac),
  ];
  return canvas(sf, objs);
};

// ── CLOSING ────────────────────────────────────────────────────────────

export const thankYou: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const objs: unknown[] = [
    ...darkOrbs(ac), accentBar(ac),
    rct({ left: 0, top: 0, width: 320, height: 3, fill: hexToRgba(ac, 0.5) }),
    txt({ text: c.heading ?? "Thank You", left: 80, top: H / 2 - 90,
          width: W - 160, fontSize: 100, fill: "#ffffff",
          fontWeight: "bold", textAlign: "center", lineHeight: 1 }),
    rct({ left: W / 2 - 80, top: H / 2 + 32, width: 160, height: 4, fill: ac, rx: 2 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 160, top: H / 2 + 56,
          width: W - 320, fontSize: 26, fill: hexToRgba("#fff", 0.55), textAlign: "center" })] : []),
  ];
  return canvas(dk, objs);
};

export const ctaBold: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const objs: unknown[] = [
    ...darkOrbs(ac), accentBar(ac),
    txt({ text: c.heading ?? "Ready to Get Started?", left: 80, top: 180,
          width: W - 160, fontSize: 72, fill: "#ffffff",
          fontWeight: "bold", textAlign: "center", lineHeight: 1.15 }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 160, top: 360,
          width: W - 320, fontSize: 28, fill: hexToRgba("#fff", 0.55), textAlign: "center" })] : []),
    rct({ left: W / 2 - 160, top: 440, width: 320, height: 68, fill: ac, rx: 34 }),
    txt({ text: c.body ?? "Start Now →", left: W / 2 - 160, top: 457,
          width: 320, fontSize: 26, fill: "#ffffff", fontWeight: "700", textAlign: "center" }),
  ];
  return canvas(dk, objs);
};

export const qaSlide: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), dk = sanitize(t.dark);
  const objs: unknown[] = [
    ...darkOrbs(ac),
    txt({ text: "?", left: W - 320, top: -60, width: 360, fontSize: 480,
          fill: hexToRgba(ac, 0.07), fontWeight: "bold", lineHeight: 1 }),
    accentBar(ac),
    txt({ text: "Q&A", left: 80, top: H / 2 - 80,
          width: W * 0.55, fontSize: 120, fill: "#ffffff", fontWeight: "bold", lineHeight: 1 }),
    txt({ text: c.heading ?? "Questions & Answers", left: 80, top: H / 2 + 64,
          width: W * 0.6, fontSize: 28, fill: hexToRgba("#fff", 0.5) }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 80, top: H / 2 + 108,
          width: W * 0.6, fontSize: 22, fill: hexToRgba("#fff", 0.35) })] : []),
  ];
  return canvas(dk, objs);
};

export const contactInfo: CanvasBuilder = (t, c = {}) => {
  const ac = sanitize(t.accent), sf = sanitize(t.surface);
  const details = c.points ?? ["email@example.com", "twitter.com/handle", "company.com"];
  const defaultIcons = ["mail", "globe", "phone", "map-pin"];
  const objs: unknown[] = [
    leftStripe(ac),
    cir({ left: W - 260, top: -140, radius: 280, fill: hexToRgba(ac, 0.05) }),
    txt({ text: c.heading ?? "Get in Touch", left: 32, top: 48,
          width: W * 0.6, fontSize: 60, fill: "#0f172a", fontWeight: "bold" }),
    ...(c.subheading ? [txt({ text: c.subheading, left: 32, top: 148,
          width: W * 0.6, fontSize: 26, fill: hexToRgba("#000", 0.4) })] : []),
  ];
  details.slice(0, 4).forEach((d, i) => {
    const y = 220 + i * 100;
    const iconName = c.icons?.[i] ?? defaultIcons[i] ?? "circle";
    objs.push(rct({ left: 32, top: y, width: 56, height: 56, fill: hexToRgba(ac, 0.1), rx: 12 }));
    const icon = iconToFabric({ name: iconName, left: 44, top: y + 14, size: 28, fill: ac });
    if (icon) objs.push(icon);
    objs.push(txt({ text: d, left: 108, top: y + 12, width: W * 0.6,
          fontSize: 26, fill: "#1e293b" }));
  });
  return canvas(sf, objs);
};
