import type { Theme } from "../types";
import { W, H, base, canvas, cir, hexToRgba, rct, txt } from "../helpers";

export function adCanvas(theme: Theme, objects: unknown[], mode: "light" | "dark" = "light") {
  const bg = mode === "dark" ? theme.dark : theme.surface;
  const line = mode === "dark" ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)";
  return canvas(bg, [
    rct({ left: 0, top: 0, width: W, height: H, fill: bg }),
    ...Array.from({ length: 8 }).map((_, i) => rct({ left: 70 + i * 145, top: 0, width: 1, height: H, fill: line })),
    ...objects,
  ]);
}

export function adText(theme: Theme, p: {
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
  const lineHeight = p.lineHeight ?? 1.24;
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

export function adTitle(theme: Theme, text: string, left: number, top: number, width: number, height = 110, baseSize = 54, mode: "light" | "dark" = "light", textAlign?: string) {
  return {
    ...adText(theme, {
      text,
      left,
      top,
      width,
      height,
      fontSize: titleSize(text, width, baseSize),
      fill: mode === "dark" ? theme.surface : theme.dark,
      fontWeight: "850",
      textAlign,
      lineHeight: 1.05,
      mode,
    }),
    fontFamily: "Georgia, 'Times New Roman', serif",
  };
}

export function adHeader(theme: Theme, label: string | undefined, slideNo: string, mode: "light" | "dark" = "light") {
  const muted = mode === "dark" ? "rgba(255,255,255,0.65)" : hexToRgba(theme.dark, 0.56);
  const rule = mode === "dark" ? "rgba(255,255,255,0.14)" : hexToRgba(theme.dark, 0.12);
  return [
    adText(theme, { text: (label ?? "AI DESIGN").toUpperCase(), left: 56, top: 28, width: 420, fontSize: 11, fill: muted, fontWeight: "850", mode }),
    adText(theme, { text: slideNo, left: W - 134, top: 28, width: 78, fontSize: 12, fill: muted, textAlign: "right", fontWeight: "850", mode }),
    rct({ left: 56, top: 58, width: W - 112, height: 1.5, fill: rule }),
  ];
}

export function adCard(theme: Theme, x: number, y: number, w: number, h: number, color = theme.accent, mode: "light" | "dark" = "light") {
  const fill = mode === "dark" ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  return [
    rct({ left: x, top: y, width: w, height: h, fill, rx: 10 }),
    rct({ left: x, top: y, width: 5, height: h, fill: color, rx: 2.5 }),
  ];
}

export function adBullet(theme: Theme, text: string, x: number, y: number, width: number, color = theme.accent, height = 42, mode: "light" | "dark" = "light", i?: number) {
  return [
    cir({ left: x, top: y + 8, radius: 4.5, fill: color }),
    adText(theme, {
      text: i === undefined ? text : `${i + 1}. ${text}`,
      left: x + 18,
      top: y,
      width,
      height,
      fontSize: 16,
      fill: mode === "dark" ? theme.surface : theme.dark,
      fontWeight: "650",
      lineHeight: 1.22,
      mode,
    }),
  ];
}

export function adRule(x: number, y: number, w: number, color: string, h = 3) {
  return rct({ left: x, top: y, width: w, height: h, fill: color, rx: h / 2 });
}

export function adImageSlot(theme: Theme, p: {
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
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: mode === "dark" ? "rgba(255,255,255,0.08)" : "#FFFFFF", rx: 10 }),
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
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: "transparent", rx: 10 }),
      rct({ left: p.x, top: p.y, width: p.w, height: 4, fill: color, rx: 2 }),
      ...(credit ? [adText(theme, { text: credit, left: p.x + 12, top: p.y + p.h - 25, width: p.w - 24, fontSize: 10, fill: mode === "dark" ? "rgba(255,255,255,0.76)" : hexToRgba(theme.dark, 0.62), textAlign: "right", mode })] : []),
    ];
  }

  const label = p.imageQuery ?? p.imageAlt ?? p.label ?? "adaptive visual";
  return [
    ...adCard(theme, p.x, p.y, p.w, p.h, color, mode),
    cir({ left: p.x + p.w - 98, top: p.y + 42, radius: 38, fill: hexToRgba(color, 0.14) }),
    adText(theme, { text: (p.label ?? "VISUAL").toUpperCase(), left: p.x + 24, top: p.y + 24, width: p.w - 48, fontSize: 11, fill: color, fontWeight: "900", mode }),
    adText(theme, { text: label, left: p.x + 36, top: p.y + p.h / 2 - 24, width: p.w - 72, height: 58, fontSize: label.length > 40 ? 17 : 21, fill: mode === "dark" ? theme.surface : theme.dark, textAlign: "center", fontWeight: "820", lineHeight: 1.15, mode }),
  ];
}

export function adArrow(x1: number, y1: number, x2: number, y2: number, color: string) {
  return base("path", {
    path: [["M", x1, y1], ["L", x2, y2], ["M", x2 - 8, y2 - 6], ["L", x2, y2], ["L", x2 - 8, y2 + 6]],
    fill: "",
    stroke: color,
    strokeWidth: 2,
    strokeLineCap: "round",
    strokeLineJoin: "round",
  });
}


function titleSize(text: string, width: number, baseSize: number) {
  const charsAtBase = width / (baseSize * 0.55);
  if (text.length > charsAtBase * 1.7) return Math.max(30, baseSize - 18);
  if (text.length > charsAtBase * 1.25) return Math.max(34, baseSize - 10);
  return baseSize;
}

function containImage(sourceW: number | undefined, sourceH: number | undefined, frameX: number, frameY: number, frameW: number, frameH: number) {
  if (!sourceW || !sourceH) return { x: frameX, y: frameY, w: frameW, h: frameH };
  const scale = Math.min(frameW / sourceW, frameH / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;
  return { x: frameX + (frameW - w) / 2, y: frameY + (frameH - h) / 2, w, h };
}
