import { W, H, base, canvas, cir, hexToRgba, rct, txt } from "../helpers";

export const CS = {
  paper: "#F8F7F2",
  white: "#FFFFFF",
  ink: "#1E293B",
  muted: "rgba(30,41,59,0.62)",
  faint: "rgba(30,41,59,0.10)",
  blue: "#2563EB",
  teal: "#0F766E",
  amber: "#B7791F",
  rose: "#BE3455",
  slate: "#334155",
};

export const csColors = [CS.blue, CS.teal, CS.amber, CS.rose, CS.slate];

export function csCanvas(objects: unknown[]) {
  return canvas(CS.paper, [
    rct({ left: 0, top: 0, width: W, height: H, fill: CS.paper }),
    ...Array.from({ length: 8 }).map((_, i) =>
      rct({ left: 72 + i * 142, top: 0, width: 1, height: H, fill: "rgba(30,41,59,0.028)" })
    ),
    ...objects,
  ]);
}

export function csText(p: {
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
}) {
  const lineHeight = p.lineHeight ?? 1.22;
  return txt({
    text: p.text,
    left: p.left,
    top: p.top,
    width: p.width,
    fontSize: p.fontSize,
    fill: p.fill ?? CS.ink,
    fontWeight: p.fontWeight,
    textAlign: p.textAlign,
    lineHeight,
  });
}

export function csTitle(text: string, left: number, top: number, width: number, height = 112, baseSize = 52) {
  return {
    ...csText({
      text,
      left,
      top,
      width,
      height,
      fontSize: titleSize(text, width, baseSize),
      fill: CS.ink,
      fontWeight: "850",
      lineHeight: 1.05,
    }),
    fontFamily: "Georgia, 'Times New Roman', serif",
  };
}

export function csHeader(label: string | undefined, slideNo: string) {
  return [
    csText({ text: (label ?? "STRATEGY BRIEF").toUpperCase(), left: 56, top: 28, width: 420, fontSize: 11, fill: CS.muted, fontWeight: "800" }),
    csText({ text: slideNo, left: W - 134, top: 28, width: 78, fontSize: 12, fill: CS.muted, textAlign: "right", fontWeight: "800" }),
    rct({ left: 56, top: 58, width: W - 112, height: 1.5, fill: CS.faint }),
  ];
}

export function csRule(x: number, y: number, w: number, color = CS.blue, h = 3) {
  return rct({ left: x, top: y, width: w, height: h, fill: color, rx: h / 2 });
}

export function csCard(x: number, y: number, w: number, h: number, color = CS.blue, fill = CS.white) {
  return [
    rct({ left: x, top: y, width: w, height: h, fill, rx: 8 }),
    rct({ left: x, top: y, width: 4, height: h, fill: color, rx: 2 }),
  ];
}

export function csBullet(text: string, x: number, y: number, width: number, color = CS.blue, height = 42, i?: number) {
  return [
    cir({ left: x, top: y + 8, radius: 4.5, fill: color }),
    csText({
      text: i === undefined ? text : `${i + 1}. ${text}`,
      left: x + 18,
      top: y,
      width,
      height,
      fontSize: 16,
      fill: CS.ink,
      fontWeight: "650",
      lineHeight: 1.22,
    }),
  ];
}

export function csMetric(x: number, y: number, w: number, h: number, value: string, label: string, color = CS.blue) {
  return [
    ...csCard(x, y, w, h, color),
    csText({ text: value, left: x + 22, top: y + 22, width: w - 44, height: 48, fontSize: value.length > 7 ? 30 : 38, fill: color, fontWeight: "900" }),
    csText({ text: label, left: x + 22, top: y + 74, width: w - 44, height: h - 86, fontSize: 14, fill: CS.muted, fontWeight: "650", lineHeight: 1.22 }),
  ];
}

export function csPill(text: string, x: number, y: number, w: number, color = CS.blue) {
  return [
    rct({ left: x, top: y, width: w, height: 30, fill: hexToRgba(color, 0.1), rx: 15 }),
    csText({ text: text.toUpperCase(), left: x + 14, top: y + 8, width: w - 28, height: 16, fontSize: 10, fill: color, fontWeight: "850", textAlign: "center" }),
  ];
}

export function csArrow(x1: number, y1: number, x2: number, y2: number, color = CS.muted) {
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
