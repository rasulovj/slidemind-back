export const W = 1280;
export const H = 720;

export function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function sanitize(color: string): string {
  const m = (color ?? "").match(/#?([0-9a-fA-F]{6})/);
  return m ? `#${m[1]}` : "#AB3E16";
}

export function base(type: string, extra: Record<string, unknown>) {
  return {
    type,
    version: "5.3.0",
    originX: "left",
    originY: "top",
    scaleX: 1, scaleY: 1,
    angle: 0, opacity: 1,
    visible: true,
    strokeWidth: 0, stroke: null, shadow: null,
    ...extra,
  };
}

export function txt(p: {
  text: string; left: number; top: number; width: number;
  fontSize: number; fill: string;
  fontWeight?: string; textAlign?: string; lineHeight?: number; opacity?: number;
}) {
  return base("textbox", {
    splitByGrapheme: false, lineHeight: p.lineHeight ?? 1.2,
    charSpacing: 0, styles: {}, underline: false, overline: false, linethrough: false,
    fontStyle: "normal", fontFamily: "Inter, system-ui, sans-serif",
    textBackgroundColor: "", ...p,
    fontWeight: p.fontWeight ?? "normal",
    textAlign: p.textAlign ?? "left",
  });
}

export function rct(p: {
  left: number; top: number; width: number; height: number;
  fill: string; rx?: number; opacity?: number;
}) {
  return base("rect", { rx: p.rx ?? 0, ry: p.rx ?? 0, ...p });
}

export function cir(p: { left: number; top: number; radius: number; fill: string; opacity?: number }) {
  return base("circle", p);
}

export function canvas(bg: string, objects: unknown[]) {
  return { version: "5.3.0", objects, background: bg };
}

// Shared decorations
export function darkOrbs(accent: string) {
  return [
    cir({ left: W - 200, top: -200, radius: 340, fill: hexToRgba(accent, 0.12) }),
    cir({ left: -160, top: H - 120, radius: 260, fill: hexToRgba(accent, 0.08) }),
    cir({ left: W - 380, top: H / 2 - 60, radius: 120, fill: hexToRgba(accent, 0.06) }),
  ];
}

export function accentBar(accent: string, width = W) {
  return rct({ left: 0, top: H - 5, width, height: 5, fill: accent });
}

export function leftStripe(accent: string) {
  return rct({ left: 0, top: 0, width: 5, height: H, fill: accent });
}

export function divider(y: number, alpha = 0.08) {
  return rct({ left: 32, top: y, width: W - 64, height: 1.5, fill: `rgba(0,0,0,${alpha})` });
}

export function badge(label: string, left: number, top: number, accent: string, dark = false) {
  const w = label.length * 9 + 28;
  return [
    rct({ left, top, width: w, height: 26, fill: hexToRgba(accent, dark ? 0.25 : 0.12), rx: 13 }),
    txt({ text: label.toUpperCase(), left: left + 12, top: top + 5, width: w - 24,
          fontSize: 11, fill: dark ? hexToRgba("#fff", 0.85) : accent, fontWeight: "700" }),
  ];
}

export function watermarkNum(num: number, accent: string) {
  return txt({ text: String(num).padStart(2, "0"), left: W - 220, top: -30, width: 260,
    fontSize: 230, fill: hexToRgba(accent, 0.05), fontWeight: "bold",
    textAlign: "right", lineHeight: 1 });
}

export function safeFontSize(text: string, width: number, height: number, baseFontSize: number, lineHeight = 1.24): number {
  const charsPerLine = Math.max(8, Math.floor(width / (baseFontSize * 0.54)));
  const lines = Math.max(1, Math.floor(height / (baseFontSize * lineHeight)));
  const maxChars = charsPerLine * lines;
  if (text.length <= maxChars) return baseFontSize;
  const ratio = Math.sqrt(maxChars / text.length);
  return Math.max(12, Math.round(baseFontSize * ratio));
}

export function placeholder(label: string, left: number, top: number, w: number, h: number, accent: string) {
  return [
    rct({ left, top, width: w, height: h, fill: hexToRgba(accent, 0.06),
      rx: 8 }),
    rct({ left, top, width: w, height: h,
      fill: "transparent", rx: 8 }),
    txt({ text: label, left, top: top + h / 2 - 12, width: w,
          fontSize: 18, fill: hexToRgba(accent, 0.3), textAlign: "center" }),
  ];
}
