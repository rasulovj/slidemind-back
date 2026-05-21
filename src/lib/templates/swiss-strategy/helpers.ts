import { W, H, canvas, hexToRgba, rct, txt } from "../helpers";

export const SW = {
  ink: "#111111",
  muted: "#666666",
  faint: "#d9d6cf",
  paper: "#f7f4ee",
  red: "#e10600",
  softRed: "#fff0ef",
  grid: "#e8e3da",
};

export function swissCanvas(objects: unknown[]) {
  return canvas(SW.paper, [rct({ left: 0, top: 0, width: W, height: H, fill: SW.paper }), ...objects]);
}

export function swissHeader(label: string | undefined, slideNo: string) {
  return [
    txt({ text: (label ?? "STRATEGY MEMO").toUpperCase(), left: 56, top: 34, width: 420, fontSize: 14, fill: SW.ink, fontWeight: "700" }),
    txt({ text: slideNo, left: W - 156, top: 34, width: 100, fontSize: 14, fill: SW.ink, fontWeight: "700", textAlign: "right" }),
    rct({ left: 56, top: 64, width: W - 112, height: 1.5, fill: SW.ink }),
  ];
}

export function swissTitle(text: string, top = 94, width = 720, size = 58) {
  return txt({ text, left: 56, top, width, fontSize: size, fill: SW.ink, fontWeight: "700", lineHeight: 1.02 });
}

export function sectionMarker(text: string, x: number, y: number, red = true) {
  return [
    rct({ left: x, top: y, width: 48, height: 48, fill: red ? SW.red : SW.ink }),
    txt({ text, left: x, top: y + 14, width: 48, fontSize: 15, fill: "#ffffff", fontWeight: "700", textAlign: "center" }),
  ];
}

export function rule(x: number, y: number, w: number, color = SW.ink, h = 2) {
  return rct({ left: x, top: y, width: w, height: h, fill: color });
}

export function noteBlock(title: string, body: string, x: number, y: number, w: number, h: number, accent = SW.red) {
  return [
    rct({ left: x, top: y, width: w, height: h, fill: "#ffffff" }),
    rule(x, y, w, accent, 5),
    txt({ text: title.toUpperCase(), left: x + 18, top: y + 22, width: w - 36, fontSize: 13, fill: accent, fontWeight: "700" }),
    txt({ text: body, left: x + 18, top: y + 52, width: w - 36, fontSize: 22, fill: SW.ink, lineHeight: 1.22, fontWeight: "600" }),
  ];
}

export function metricCard(value: string, label: string, x: number, y: number, w: number, h: number, accent = SW.red) {
  return [
    rct({ left: x, top: y, width: w, height: h, fill: "#ffffff" }),
    txt({ text: value, left: x + 18, top: y + 22, width: w - 36, fontSize: 42, fill: accent, fontWeight: "700" }),
    txt({ text: label, left: x + 20, top: y + 80, width: w - 40, fontSize: 15, fill: SW.muted, lineHeight: 1.25 }),
  ];
}

export function listRows(items: string[], x: number, y: number, w: number, rowH: number, accent = SW.red) {
  return items.slice(0, 5).flatMap((item, i) => [
    rule(x, y + i * rowH, w, i === 0 ? SW.ink : SW.faint, i === 0 ? 2 : 1),
    txt({ text: String(i + 1).padStart(2, "0"), left: x, top: y + i * rowH + 20, width: 46, fontSize: 16, fill: accent, fontWeight: "700" }),
    txt({ text: item, left: x + 62, top: y + i * rowH + 17, width: w - 70, fontSize: 21, fill: SW.ink, lineHeight: 1.2 }),
  ]);
}

export function matrixCell(text: string, x: number, y: number, w: number, h: number, active = false) {
  return [
    rct({ left: x, top: y, width: w, height: h, fill: active ? SW.softRed : "#ffffff" }),
    rct({ left: x, top: y, width: w, height: 1, fill: active ? SW.red : SW.faint }),
    txt({ text, left: x + 14, top: y + 18, width: w - 28, fontSize: 16, fill: SW.ink, lineHeight: 1.22, fontWeight: active ? "700" : "500" }),
  ];
}

export function scoreBar(label: string, score: number, x: number, y: number, w: number, accent = SW.red) {
  const pct = Math.max(0.12, Math.min(1, score / 10));
  return [
    txt({ text: label, left: x, top: y, width: 210, fontSize: 17, fill: SW.ink, fontWeight: "600" }),
    rct({ left: x + 230, top: y + 5, width: w - 230, height: 12, fill: SW.grid }),
    rct({ left: x + 230, top: y + 5, width: (w - 230) * pct, height: 12, fill: accent }),
    txt({ text: `${score}/10`, left: x + w - 54, top: y - 2, width: 54, fontSize: 14, fill: SW.muted, textAlign: "right", fontWeight: "700" }),
  ];
}

export function quadrant(x: number, y: number, w: number, h: number, labels: string[]) {
  return [
    rct({ left: x, top: y, width: w, height: h, fill: "#ffffff" }),
    rule(x + w / 2, y, 1.5, SW.faint, h),
    rule(x, y + h / 2, w, SW.faint, 1.5),
    txt({ text: labels[0] ?? "High impact", left: x + 20, top: y + 22, width: w / 2 - 40, fontSize: 18, fill: SW.red, fontWeight: "700" }),
    txt({ text: labels[1] ?? "Strategic bet", left: x + w / 2 + 20, top: y + 22, width: w / 2 - 40, fontSize: 18, fill: SW.ink, fontWeight: "700" }),
    txt({ text: labels[2] ?? "Maintain", left: x + 20, top: y + h / 2 + 22, width: w / 2 - 40, fontSize: 18, fill: SW.ink, fontWeight: "700" }),
    txt({ text: labels[3] ?? "Avoid", left: x + w / 2 + 20, top: y + h / 2 + 22, width: w / 2 - 40, fontSize: 18, fill: SW.muted, fontWeight: "700" }),
  ];
}
