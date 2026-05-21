import { W, H, base, canvas, cir, hexToRgba, rct, txt } from "../helpers";

export const FR = {
  paper: "#F4EBDD",
  paperDeep: "#E7D9C5",
  ink: "#202124",
  muted: "rgba(32,33,36,0.62)",
  faint: "rgba(32,33,36,0.12)",
  rust: "#A9472B",
  navy: "#243B53",
  olive: "#64734A",
  ochre: "#C49A3A",
};

export function frCanvas(objects: unknown[]) {
  return canvas(FR.paper, [...paperTexture(), ...objects]);
}

export function frText(p: {
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
    fill: p.fill ?? FR.ink,
    fontWeight: p.fontWeight,
    textAlign: p.textAlign,
    lineHeight: p.lineHeight,
    opacity: p.opacity,
  });
}

export function frTitle(text: string, left: number, top: number, width: number, fontSize = 58) {
  return {
    ...frText({
      text,
      left,
      top,
      width,
      fontSize,
      fill: FR.ink,
      fontWeight: "800",
      lineHeight: 1.04,
    }),
    fontFamily: "Georgia, 'Times New Roman', serif",
  };
}

export function frHeader(label: string | undefined, slideNo: string) {
  return [
    frText({ text: (label ?? "FIELD REPORT").toUpperCase(), left: 56, top: 28, width: 420, fontSize: 13, fill: FR.muted, fontWeight: "800" }),
    frText({ text: slideNo, left: W - 150, top: 28, width: 94, fontSize: 13, fill: FR.muted, textAlign: "right", fontWeight: "800" }),
    rct({ left: 48, top: 58, width: W - 96, height: 1.5, fill: FR.faint }),
  ];
}

export function frRule(x: number, y: number, w: number, color = FR.rust, h = 3) {
  return rct({ left: x, top: y, width: w, height: h, fill: color, rx: h / 2 });
}

export function frBox(x: number, y: number, w: number, h: number, color = FR.navy, fill = "rgba(255,255,255,0.34)") {
  return [
    rct({ left: x, top: y, width: w, height: h, fill, rx: 3 }),
    rct({ left: x, top: y, width: w, height: 4, fill: color, rx: 2 }),
  ];
}

export function frStamp(text: string, x: number, y: number, color = FR.rust) {
  const w = Math.min(220, Math.max(74, text.length * 8 + 28));
  return [
    rct({ left: x, top: y, width: w, height: 30, fill: hexToRgba(color, 0.1), rx: 3 }),
    rct({ left: x, top: y, width: w, height: 30, fill: "transparent", rx: 3 }),
    frText({ text: text.toUpperCase(), left: x + 12, top: y + 8, width: w - 24, fontSize: 11, fill: color, fontWeight: "800", textAlign: "center" }),
  ];
}

export function frBullet(text: string, x: number, y: number, width: number, color = FR.rust, i?: number) {
  return [
    cir({ left: x, top: y + 7, radius: 5, fill: color }),
    frText({ text: i === undefined ? text : `${i + 1}. ${text}`, left: x + 18, top: y, width, fontSize: 18, fill: FR.ink, lineHeight: 1.26 }),
  ];
}

export function frImageSlot(p: {
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
}) {
  const color = p.color ?? FR.navy;
  const credit = [p.imageCredit, p.imageProvider].filter(Boolean).join(" · ");
  const fit = containImage(p.imageWidth, p.imageHeight, p.x, p.y, p.w, p.h);

  if (p.imageUrl) {
    const naturalW = p.imageWidth ?? fit.w;
    const naturalH = p.imageHeight ?? fit.h;
    return [
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: hexToRgba(FR.paperDeep, 0.5), rx: 3 }),
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
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: "transparent", rx: 3 }),
      rct({ left: p.x, top: p.y, width: p.w, height: 4, fill: color, rx: 2 }),
      ...(credit ? [frText({ text: credit, left: p.x + 12, top: p.y + p.h - 24, width: p.w - 24, fontSize: 11, fill: "rgba(255,255,255,0.76)", textAlign: "right" })] : []),
    ];
  }

  const label = p.imageQuery ?? p.imageAlt ?? p.label ?? "field image";
  return [
    ...frBox(p.x, p.y, p.w, p.h, color, hexToRgba(color, 0.06)),
    rct({ left: p.x + 22, top: p.y + 22, width: p.w - 44, height: p.h - 44, fill: "transparent", rx: 2 }),
    frText({ text: (p.label ?? "EVIDENCE").toUpperCase(), left: p.x + 24, top: p.y + 24, width: p.w - 48, fontSize: 12, fill: color, fontWeight: "800" }),
    frText({ text: label, left: p.x + 34, top: p.y + p.h / 2 - 18, width: p.w - 68, fontSize: label.length > 36 ? 18 : 22, fill: FR.muted, textAlign: "center", lineHeight: 1.18 }),
  ];
}

export function mapLines() {
  return [
    rct({ left: 0, top: 0, width: W, height: H, fill: "rgba(255,255,255,0.16)" }),
    ...Array.from({ length: 9 }).map((_, i) =>
      rct({ left: 60 + i * 140, top: 0, width: 1, height: H, fill: "rgba(36,59,83,0.035)" })
    ),
    ...Array.from({ length: 6 }).map((_, i) =>
      rct({ left: 0, top: 92 + i * 104, width: W, height: 1, fill: "rgba(36,59,83,0.035)" })
    ),
    base("path", {
      path: [
        ["M", 86, 640], ["C", 250, 520, 280, 220, 520, 300],
        ["S", 850, 510, 1130, 160],
      ],
      fill: "",
      stroke: "rgba(164,71,43,0.08)",
      strokeWidth: 3,
    }),
  ];
}

function paperTexture() {
  return [
    rct({ left: 0, top: 0, width: W, height: H, fill: FR.paper }),
    ...mapLines(),
    ...Array.from({ length: 18 }).map((_, i) =>
      rct({ left: 30 + i * 71, top: 50 + (i % 5) * 120, width: 48, height: 1, fill: "rgba(32,33,36,0.025)", opacity: 0.7 })
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
