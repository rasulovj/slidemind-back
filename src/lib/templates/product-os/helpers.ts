import type { Theme } from "../types";
import { W, H, base, canvas, cir, hexToRgba, rct, txt } from "../helpers";

export function poCanvas(theme: Theme, objects: unknown[], mode: "light" | "dark" = "light") {
  const bg = mode === "dark" ? theme.dark : theme.surface;
  const grid = mode === "dark" ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.04)";
  return canvas(bg, [
    rct({ left: 0, top: 0, width: W, height: H, fill: bg }),
    ...Array.from({ length: 9 }).map((_, i) => rct({ left: 64 + i * 144, top: 0, width: 1, height: H, fill: grid })),
    ...Array.from({ length: 5 }).map((_, i) => rct({ left: 0, top: 104 + i * 118, width: W, height: 1, fill: grid })),
    ...objects,
  ]);
}

export function poText(theme: Theme, p: {
  text: string;
  left: number;
  top: number;
  width: number;
  fontSize: number;
  fill?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: number;
  height?: number;
  mode?: "light" | "dark";
}) {
  const lineHeight = p.lineHeight ?? 1.22;
  return txt({
    text: p.text,
    left: p.left,
    top: p.top,
    width: p.width,
    fontSize: p.fontSize,
    fill: p.fill ?? (p.mode === "dark" ? theme.surface : theme.dark),
    fontWeight: p.fontWeight,
    textAlign: p.textAlign,
    lineHeight,
  });
}

export function poTitle(theme: Theme, text: string, left: number, top: number, width: number, height = 110, baseSize = 56, mode: "light" | "dark" = "light") {
  return poText(theme, {
    text,
    left,
    top,
    width,
    height,
    fontSize: titleSize(text, width, baseSize),
    fill: mode === "dark" ? theme.surface : theme.dark,
    fontWeight: "900",
    lineHeight: 1.04,
    mode,
  });
}

export function poHeader(theme: Theme, label: string | undefined, slideNo: string, mode: "light" | "dark" = "light") {
  const muted = mode === "dark" ? "rgba(255,255,255,0.66)" : hexToRgba(theme.dark, 0.55);
  return [
    rct({ left: 48, top: 28, width: 30, height: 30, fill: theme.accent, rx: 8 }),
    poText(theme, { text: (label ?? "PRODUCT OS").toUpperCase(), left: 92, top: 34, width: 420, fontSize: 11, fill: muted, fontWeight: "850", mode }),
    poText(theme, { text: slideNo, left: W - 124, top: 34, width: 72, fontSize: 12, fill: muted, textAlign: "right", fontWeight: "850", mode }),
  ];
}

export function poPanel(theme: Theme, x: number, y: number, w: number, h: number, color = theme.accent, mode: "light" | "dark" = "light") {
  return [
    rct({ left: x, top: y, width: w, height: h, fill: mode === "dark" ? "rgba(255,255,255,0.075)" : "#FFFFFF", rx: 14 }),
    rct({ left: x, top: y, width: w, height: 4, fill: color, rx: 2 }),
  ];
}

export function poMetric(theme: Theme, x: number, y: number, w: number, value: string, label: string, color = theme.accent, mode: "light" | "dark" = "light") {
  return [
    ...poPanel(theme, x, y, w, 96, color, mode),
    poText(theme, { text: value, left: x + 18, top: y + 24, width: 98, height: 38, fontSize: value.length > 7 ? 28 : 36, fill: color, fontWeight: "900", mode }),
    poText(theme, { text: label, left: x + 130, top: y + 32, width: w - 150, height: 36, fontSize: 14, fill: mode === "dark" ? "rgba(255,255,255,0.72)" : hexToRgba(theme.dark, 0.68), fontWeight: "750", mode }),
  ];
}

export function poBullet(theme: Theme, text: string, x: number, y: number, width: number, color = theme.accent, mode: "light" | "dark" = "light") {
  return [
    rct({ left: x, top: y + 7, width: 8, height: 8, fill: color, rx: 4 }),
    poText(theme, { text, left: x + 22, top: y, width, height: 38, fontSize: 15, fill: mode === "dark" ? theme.surface : theme.dark, fontWeight: "720", lineHeight: 1.16, mode }),
  ];
}

export function poRule(x: number, y: number, w: number, color: string, h = 3) {
  return rct({ left: x, top: y, width: w, height: h, fill: color, rx: h / 2 });
}

export function poImageSlot(theme: Theme, p: {
  imageUrl?: string;
  imageQuery?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageProvider?: string;
  imageSourceUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  label?: string;
  mode?: "light" | "dark";
}) {
  const color = p.color ?? theme.accent;
  const mode = p.mode ?? "light";
  const credit = [p.imageCredit, p.imageProvider].filter(Boolean).join(" · ");
  const fit = containImage(p.imageWidth, p.imageHeight, p.x, p.y, p.w, p.h);

  if (p.imageUrl) {
    const naturalW = p.imageWidth ?? fit.w;
    const naturalH = p.imageHeight ?? fit.h;
    return [
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: mode === "dark" ? "rgba(255,255,255,0.07)" : "#FFFFFF", rx: 14 }),
      base("image", {
        src: p.imageUrl,
        crossOrigin: "anonymous",
        left: fit.x,
        top: fit.y,
        width: naturalW,
        height: naturalH,
        cropX: 0,
        cropY: 0,
        scaleX: fit.w / naturalW,
        scaleY: fit.h / naturalH,
        imageAlt: p.imageAlt,
        imageCredit: p.imageCredit,
        imageProvider: p.imageProvider,
        imageSourceUrl: p.imageSourceUrl,
      }),
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: "transparent", rx: 14 }),
      rct({ left: p.x, top: p.y, width: p.w, height: 4, fill: color, rx: 2 }),
      ...(credit ? [poText(theme, { text: credit, left: p.x + 14, top: p.y + p.h - 25, width: p.w - 28, fontSize: 10, fill: mode === "dark" ? "rgba(255,255,255,0.76)" : hexToRgba(theme.dark, 0.62), textAlign: "right", mode })] : []),
    ];
  }

  const label = p.imageQuery ?? p.imageAlt ?? p.label ?? "product visual";
  return [
    ...poPanel(theme, p.x, p.y, p.w, p.h, color, mode),
    cir({ left: p.x + p.w - 98, top: p.y + 46, radius: 38, fill: hexToRgba(color, 0.14) }),
    poText(theme, { text: (p.label ?? "VISUAL").toUpperCase(), left: p.x + 26, top: p.y + 26, width: p.w - 52, fontSize: 11, fill: color, fontWeight: "900", mode }),
    poText(theme, { text: label, left: p.x + 36, top: p.y + p.h / 2 - 22, width: p.w - 72, height: 54, fontSize: label.length > 38 ? 17 : 21, fill: mode === "dark" ? theme.surface : theme.dark, textAlign: "center", fontWeight: "800", lineHeight: 1.15, mode }),
  ];
}


function titleSize(text: string, width: number, baseSize: number) {
  const charsAtBase = width / (baseSize * 0.54);
  if (text.length > charsAtBase * 1.75) return Math.max(31, baseSize - 20);
  if (text.length > charsAtBase * 1.28) return Math.max(36, baseSize - 12);
  return baseSize;
}

function containImage(sourceW: number | undefined, sourceH: number | undefined, frameX: number, frameY: number, frameW: number, frameH: number) {
  if (!sourceW || !sourceH) return { x: frameX, y: frameY, w: frameW, h: frameH };
  const scale = Math.min(frameW / sourceW, frameH / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;
  return { x: frameX + (frameW - w) / 2, y: frameY + (frameH - h) / 2, w, h };
}
