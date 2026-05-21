import { W, H, base, canvas, cir, hexToRgba, rct, txt } from "../helpers";

export const EB = {
  charcoal: "#111827",
  charcoal2: "#172033",
  black: "#0B1020",
  paper: "#F6F1E8",
  paper2: "#FFF8EA",
  ink: "#1F2933",
  mutedInk: "rgba(31,41,51,0.64)",
  mutedLight: "rgba(255,248,234,0.66)",
  faintLight: "rgba(255,248,234,0.13)",
  gold: "#C9A227",
  blue: "#2F5D8C",
  rust: "#A5543B",
  green: "#6E8B5E",
};

export const ebColors = [EB.gold, EB.blue, EB.rust, EB.green, EB.gold];

export function ebCanvas(objects: unknown[], bg = EB.charcoal) {
  return canvas(bg, [...boardTexture(bg), ...objects]);
}

export function ebLightCanvas(objects: unknown[]) {
  return canvas(EB.charcoal, [...memoBackdrop(), ...objects]);
}

export function ebText(p: {
  text: string;
  left: number;
  top: number;
  width: number;
  fontSize: number;
  fill?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: number;
  opacity?: number;
  fontFamily?: string;
}) {
  return txt({
    text: p.text,
    left: p.left,
    top: p.top,
    width: p.width,
    fontSize: p.fontSize,
    fill: p.fill ?? EB.paper,
    fontWeight: p.fontWeight,
    textAlign: p.textAlign,
    lineHeight: p.lineHeight,
    opacity: p.opacity,
  });
}

export function ebTitle(text: string, left: number, top: number, width: number, fontSize = 58, light = false) {
  return {
    ...ebText({
      text,
      left,
      top,
      width,
      fontSize,
      fill: light ? EB.ink : EB.paper,
      fontWeight: "800",
      lineHeight: 1.04,
    }),
    fontFamily: "Georgia, 'Times New Roman', serif",
  };
}

export function ebHeader(label: string | undefined, slideNo: string, light = false) {
  const fill = light ? "rgba(255,248,234,0.7)" : EB.mutedLight;
  const rule = light ? "rgba(201,162,39,0.32)" : EB.faintLight;
  return [
    ebText({ text: (label ?? "BOARDROOM BRIEF").toUpperCase(), left: 50, top: 25, width: 470, fontSize: 12, fill, fontWeight: "800" }),
    ebText({ text: slideNo, left: W - 150, top: 25, width: 96, fontSize: 12, fill, textAlign: "right", fontWeight: "800" }),
    rct({ left: 46, top: 58, width: W - 92, height: 1.5, fill: rule }),
  ];
}

export function ebRule(x: number, y: number, w: number, color = EB.gold, h = 3) {
  return rct({ left: x, top: y, width: w, height: h, fill: color, rx: h / 2 });
}

export function ebPanel(x: number, y: number, w: number, h: number, color = EB.gold, fill = "rgba(255,248,234,0.08)") {
  return [
    rct({ left: x, top: y, width: w, height: h, fill, rx: 6 }),
    rct({ left: x, top: y, width: w, height: 4, fill: color, rx: 2 }),
  ];
}

export function ebLightPanel(x: number, y: number, w: number, h: number, color = EB.gold) {
  return [
    rct({ left: x, top: y, width: w, height: h, fill: EB.paper2, rx: 2 }),
    rct({ left: x, top: y, width: 5, height: h, fill: color, rx: 2 }),
  ];
}

export function ebBullet(text: string, x: number, y: number, width: number, color = EB.gold, light = false, i?: number) {
  return [
    cir({ left: x, top: y + 8, radius: 5, fill: color }),
    ebText({
      text: i === undefined ? text : `${i + 1}. ${text}`,
      left: x + 20,
      top: y,
      width,
      fontSize: 18,
      fill: light ? EB.ink : EB.paper,
      lineHeight: 1.22,
      fontWeight: "650",
    }),
  ];
}

export function ebMetric(x: number, y: number, w: number, value: string, label: string, color: string, light = false) {
  const bg = light ? "rgba(255,255,255,0.5)" : "rgba(255,248,234,0.07)";
  return [
    ...ebPanel(x, y, w, 100, color, bg),
    ebText({ text: value, left: x + 20, top: y + 24, width: w - 40, fontSize: value.length > 7 ? 32 : 40, fill: color, fontWeight: "900" }),
    ebText({ text: label, left: x + 22, top: y + 66, width: w - 44, fontSize: 14, fill: light ? EB.mutedInk : EB.mutedLight, fontWeight: "700" }),
  ];
}

export function ebImageSlot(p: {
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
  label?: string;
  color?: string;
  light?: boolean;
}) {
  const color = p.color ?? EB.gold;
  const credit = [p.imageCredit, p.imageProvider].filter(Boolean).join(" · ");
  const fit = containImage(p.imageWidth, p.imageHeight, p.x, p.y, p.w, p.h);

  if (p.imageUrl) {
    const naturalW = p.imageWidth ?? fit.w;
    const naturalH = p.imageHeight ?? fit.h;
    return [
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: p.light ? hexToRgba(EB.ink, 0.08) : "rgba(255,248,234,0.07)", rx: 5 }),
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
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: "transparent", rx: 5 }),
      rct({ left: p.x, top: p.y, width: p.w, height: 4, fill: color, rx: 2 }),
      ...(credit ? [ebText({ text: credit, left: p.x + 12, top: p.y + p.h - 24, width: p.w - 24, fontSize: 10, fill: "rgba(255,248,234,0.78)", textAlign: "right" })] : []),
    ];
  }

  const label = p.imageQuery ?? p.imageAlt ?? p.label ?? "boardroom image";
  return [
    ...ebPanel(p.x, p.y, p.w, p.h, color, p.light ? "rgba(31,41,51,0.06)" : "rgba(255,248,234,0.06)"),
    ebText({ text: (p.label ?? "VISUAL BRIEF").toUpperCase(), left: p.x + 22, top: p.y + 22, width: p.w - 44, fontSize: 11, fill: color, fontWeight: "900" }),
    ebText({ text: label, left: p.x + 34, top: p.y + p.h / 2 - 16, width: p.w - 68, fontSize: label.length > 40 ? 17 : 21, fill: p.light ? EB.mutedInk : EB.mutedLight, textAlign: "center", lineHeight: 1.18 }),
  ];
}

function boardTexture(bg: string) {
  return [
    rct({ left: 0, top: 0, width: W, height: H, fill: bg }),
    rct({ left: 0, top: 0, width: 36, height: H, fill: EB.black }),
    rct({ left: 36, top: 0, width: 5, height: H, fill: EB.gold, opacity: 0.72 }),
    rct({ left: 0, top: H - 46, width: W, height: 46, fill: "rgba(11,16,32,0.54)" }),
    rct({ left: 92, top: 88, width: 210, height: 2, fill: "rgba(201,162,39,0.42)" }),
    rct({ left: W - 420, top: 0, width: 420, height: H, fill: "rgba(255,248,234,0.025)" }),
    rct({ left: 780, top: 0, width: 1, height: H, fill: "rgba(255,248,234,0.075)" }),
    rct({ left: 1040, top: 0, width: 1, height: H, fill: "rgba(255,248,234,0.06)" }),
    base("path", {
      path: [["M", 1090, 100], ["L", 1238, 235], ["L", 1238, 308], ["L", 1040, 128], ["Z"]],
      fill: "",
      stroke: "rgba(201,162,39,0.1)",
      strokeWidth: 2,
    }),
    ...Array.from({ length: 5 }).map((_, i) =>
      rct({ left: 91 + i * 58, top: H - 30, width: 36, height: 3, fill: i === 0 ? EB.gold : "rgba(255,248,234,0.14)", rx: 1.5 })
    ),
  ];
}

function memoBackdrop() {
  return [
    ...boardTexture(EB.charcoal),
    rct({ left: 56, top: 82, width: W - 112, height: H - 126, fill: EB.paper, rx: 3 }),
    rct({ left: 56, top: 82, width: W - 112, height: 5, fill: EB.gold, rx: 2 }),
    rct({ left: 84, top: 116, width: W - 168, height: 1, fill: "rgba(31,41,51,0.12)" }),
    rct({ left: 84, top: H - 75, width: W - 168, height: 1, fill: "rgba(31,41,51,0.08)" }),
    ...Array.from({ length: 4 }).map((_, i) =>
      rct({ left: 1010 + i * 35, top: 106, width: 22, height: 3, fill: i === 0 ? EB.rust : "rgba(31,41,51,0.16)", rx: 1.5 })
    ),
  ];
}

function containImage(sourceW: number | undefined, sourceH: number | undefined, frameX: number, frameY: number, frameW: number, frameH: number) {
  if (!sourceW || !sourceH) return { x: frameX, y: frameY, w: frameW, h: frameH };
  const scale = Math.min(frameW / sourceW, frameH / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;
  return { x: frameX + (frameW - w) / 2, y: frameY + (frameH - h) / 2, w, h };
}
