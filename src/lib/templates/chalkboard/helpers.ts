import { W, H, base, canvas, cir, hexToRgba, rct, txt } from "../helpers";

export const CB = {
  board: "#183b31",
  boardDeep: "#102b25",
  chalk: "#f4f0dc",
  muted: "rgba(244,240,220,0.64)",
  faint: "rgba(244,240,220,0.18)",
  yellow: "#f4d35e",
  red: "#d96b5f",
  cyan: "#7fd1c7",
  green: "#9bd18b",
};

export function chalkCanvas(objects: unknown[]) {
  return canvas(CB.board, [...boardTexture(), ...objects]);
}

export function chalkText(p: {
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
}) {
  return {
    ...txt({
      text: p.text,
      left: p.left,
      top: p.top,
      width: p.width,
      fontSize: p.fontSize,
      fill: p.fill ?? CB.chalk,
      fontWeight: p.fontWeight,
      textAlign: p.textAlign,
      lineHeight: p.lineHeight,
      opacity: p.opacity,
    }),
    fontFamily: '"Comic Sans MS", "Bradley Hand", "Segoe Print", cursive',
  };
}

export function lessonHeader(label: string | undefined, slideNo: string) {
  return [
    chalkLine(50, 54, W - 50, 54, CB.faint, 2),
    chalkText({
      text: (label ?? "Technical classroom").toUpperCase(),
      left: 56,
      top: 24,
      width: 460,
      fontSize: 15,
      fill: CB.muted,
      fontWeight: "700",
    }),
    chalkText({
      text: slideNo,
      left: W - 160,
      top: 22,
      width: 104,
      fontSize: 15,
      fill: CB.muted,
      textAlign: "right",
      fontWeight: "700",
    }),
  ];
}

export function boardFrame() {
  return [
    rct({ left: 18, top: 16, width: W - 36, height: H - 32, fill: "transparent", rx: 10 }),
    chalkLine(22, 20, W - 24, 18, hexToRgba(CB.chalk, 0.22), 2),
    chalkLine(24, H - 20, W - 24, H - 22, hexToRgba(CB.chalk, 0.18), 2),
    chalkLine(20, 22, 22, H - 22, hexToRgba(CB.chalk, 0.18), 2),
    chalkLine(W - 22, 20, W - 20, H - 24, hexToRgba(CB.chalk, 0.18), 2),
  ];
}

export function chalkLine(x1: number, y1: number, x2: number, y2: number, fill = CB.chalk, thickness = 3) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return {
    type: "rect",
    version: "5.3.0",
    originX: "center",
    originY: "center",
    left: x1 + dx / 2,
    top: y1 + dy / 2,
    width: length,
    height: thickness,
    angle,
    fill,
    opacity: 0.9,
    scaleX: 1,
    scaleY: 1,
    visible: true,
    strokeWidth: 0,
    stroke: null,
    shadow: null,
    rx: thickness,
    ry: thickness,
  };
}

export function roughBox(x: number, y: number, w: number, h: number, color = CB.chalk, fill = "transparent") {
  return [
    rct({ left: x, top: y, width: w, height: h, fill, rx: 8 }),
    chalkLine(x, y, x + w, y + 2, hexToRgba(color, 0.74), 3),
    chalkLine(x + 2, y + h, x + w, y + h - 1, hexToRgba(color, 0.58), 3),
    chalkLine(x, y + 2, x + 2, y + h, hexToRgba(color, 0.6), 3),
    chalkLine(x + w, y, x + w - 2, y + h, hexToRgba(color, 0.6), 3),
  ];
}

export function formulaBox(text: string, x: number, y: number, w: number, h: number, color = CB.yellow) {
  return [
    ...roughBox(x, y, w, h, color, "rgba(244,240,220,0.035)"),
    chalkText({
      text,
      left: x + 18,
      top: y + h / 2 - 22,
      width: w - 36,
      fontSize: text.length > 42 ? 28 : 36,
      fill: CB.chalk,
      fontWeight: "700",
      textAlign: "center",
    }),
  ];
}

export function chalkImageSlot(p: {
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
}) {
  const color = p.color ?? CB.cyan;
  const query = (p.imageAlt ?? p.imageQuery ?? p.label ?? "Lesson visual").trim();
  const credit = [p.imageCredit, p.imageProvider].filter(Boolean).join(" · ");
  const fit = containImage(p.imageWidth, p.imageHeight, p.x, p.y, p.w, p.h);

  if (p.imageUrl) {
    const naturalW = p.imageWidth ?? fit.w;
    const naturalH = p.imageHeight ?? fit.h;
    return [
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: hexToRgba(CB.boardDeep, 0.18), rx: 8 }),
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
        opacity: 1,
        imageAlt: p.imageAlt,
        imageCredit: p.imageCredit,
        imageProvider: p.imageProvider,
        imageSourceUrl: p.imageSourceUrl,
      }),
      ...roughBox(p.x, p.y, p.w, p.h, color, "transparent"),
      ...(credit
        ? [chalkText({ text: credit, left: p.x + 12, top: p.y + p.h - 28, width: p.w - 24, fontSize: 12, fill: hexToRgba(CB.chalk, 0.62), textAlign: "right" })]
        : []),
    ];
  }

  return [
    ...roughBox(p.x, p.y, p.w, p.h, color, "rgba(0,0,0,0.1)"),
    chalkLine(p.x + 28, p.y + p.h - 38, p.x + p.w * 0.42, p.y + p.h * 0.58, hexToRgba(color, 0.65), 4),
    chalkLine(p.x + p.w * 0.42, p.y + p.h * 0.58, p.x + p.w * 0.58, p.y + p.h * 0.7, hexToRgba(color, 0.58), 4),
    chalkLine(p.x + p.w * 0.58, p.y + p.h * 0.7, p.x + p.w - 28, p.y + p.h * 0.42, hexToRgba(color, 0.65), 4),
    cir({ left: p.x + p.w - 76, top: p.y + 40, radius: 16, fill: hexToRgba(CB.yellow, 0.5) }),
    chalkText({ text: p.label ?? "Image", left: p.x + 18, top: p.y + 18, width: p.w - 36, fontSize: 17, fill: color, fontWeight: "700" }),
    chalkText({ text: query, left: p.x + 28, top: p.y + p.h / 2 - 18, width: p.w - 56, fontSize: query.length > 34 ? 18 : 22, fill: CB.chalk, textAlign: "center", lineHeight: 1.25 }),
  ];
}

function containImage(sourceW: number | undefined, sourceH: number | undefined, frameX: number, frameY: number, frameW: number, frameH: number) {
  if (!sourceW || !sourceH) return { x: frameX, y: frameY, w: frameW, h: frameH };

  const scale = Math.min(frameW / sourceW, frameH / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;

  return {
    x: frameX + (frameW - w) / 2,
    y: frameY + (frameH - h) / 2,
    w,
    h,
  };
}

export function conceptNode(text: string, x: number, y: number, w: number, color = CB.cyan) {
  return [
    rct({ left: x, top: y, width: w, height: 58, fill: hexToRgba(color, 0.08), rx: 28 }),
    chalkLine(x + 10, y + 2, x + w - 8, y, hexToRgba(color, 0.78), 2),
    chalkLine(x + 8, y + 56, x + w - 10, y + 58, hexToRgba(color, 0.55), 2),
    chalkText({ text, left: x + 14, top: y + 17, width: w - 28, fontSize: 18, fill: CB.chalk, textAlign: "center", fontWeight: "700" }),
  ];
}

export function arrow(x1: number, y1: number, x2: number, y2: number, color = CB.muted) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 12;
  return [
    chalkLine(x1, y1, x2, y2, color, 2),
    chalkLine(x2, y2, x2 - Math.cos(angle - 0.55) * size, y2 - Math.sin(angle - 0.55) * size, color, 2),
    chalkLine(x2, y2, x2 - Math.cos(angle + 0.55) * size, y2 - Math.sin(angle + 0.55) * size, color, 2),
  ];
}

// Returns the point where a ray from (ax, ay) toward box (bx, by, bw, bh) center hits the box edge.
function boxEdgePoint(ax: number, ay: number, bx: number, by: number, bw: number, bh: number) {
  const cx = bx + bw / 2, cy = by + bh / 2;
  const dx = cx - ax, dy = cy - ay;
  let t = Infinity;
  if (dx !== 0) {
    const tL = (bx - ax) / dx;         if (tL > 1e-4) { const iy = ay + dy * tL; if (iy >= by && iy <= by + bh) t = Math.min(t, tL); }
    const tR = (bx + bw - ax) / dx;    if (tR > 1e-4) { const iy = ay + dy * tR; if (iy >= by && iy <= by + bh) t = Math.min(t, tR); }
  }
  if (dy !== 0) {
    const tT = (by - ay) / dy;         if (tT > 1e-4) { const ix = ax + dx * tT; if (ix >= bx && ix <= bx + bw) t = Math.min(t, tT); }
    const tB = (by + bh - ay) / dy;    if (tB > 1e-4) { const ix = ax + dx * tB; if (ix >= bx && ix <= bx + bw) t = Math.min(t, tB); }
  }
  return { x: ax + dx * t, y: ay + dy * t };
}

// Arrow that starts at the edge of box A and ends at the edge of box B.
export function arrowBetweenBoxes(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
  color = CB.muted,
) {
  const acx = ax + aw / 2, acy = ay + ah / 2;
  const bcx = bx + bw / 2, bcy = by + bh / 2;
  const src = boxEdgePoint(bcx, bcy, ax, ay, aw, ah);
  const tgt = boxEdgePoint(acx, acy, bx, by, bw, bh);
  return arrow(src.x, src.y, tgt.x, tgt.y, color);
}

export function coordinatePlane(x: number, y: number, w: number, h: number, color = CB.cyan) {
  const objs: unknown[] = [
    ...roughBox(x, y, w, h, color, "rgba(0,0,0,0.08)"),
    chalkLine(x + 36, y + h - 36, x + w - 22, y + h - 36, hexToRgba(CB.chalk, 0.45), 2),
    chalkLine(x + 36, y + h - 36, x + 36, y + 22, hexToRgba(CB.chalk, 0.45), 2),
  ];
  for (let i = 1; i < 5; i += 1) {
    objs.push(chalkLine(x + 36 + i * ((w - 70) / 5), y + 22, x + 36 + i * ((w - 70) / 5), y + h - 36, hexToRgba(CB.chalk, 0.08), 1));
    objs.push(chalkLine(x + 36, y + 22 + i * ((h - 62) / 5), x + w - 22, y + 22 + i * ((h - 62) / 5), hexToRgba(CB.chalk, 0.08), 1));
  }
  objs.push(chalkLine(x + 58, y + h - 64, x + 140, y + h - 116, color, 4));
  objs.push(chalkLine(x + 140, y + h - 116, x + 230, y + 86, color, 4));
  objs.push(chalkLine(x + 230, y + 86, x + w - 52, y + 58, color, 4));
  return objs;
}

export function miniBars(x: number, y: number, w: number, h: number, labels: string[], color = CB.yellow) {
  const values = [0.48, 0.72, 0.58, 0.86];
  const bw = (w - 70) / labels.slice(0, 4).length;
  const objs: unknown[] = [
    ...roughBox(x, y, w, h, color, "rgba(0,0,0,0.08)"),
    chalkLine(x + 32, y + h - 34, x + w - 20, y + h - 34, hexToRgba(CB.chalk, 0.45), 2),
    chalkLine(x + 32, y + h - 34, x + 32, y + 24, hexToRgba(CB.chalk, 0.45), 2),
  ];
  labels.slice(0, 4).forEach((label, i) => {
    const barH = (h - 82) * values[i];
    const bx = x + 48 + i * bw;
    objs.push(rct({ left: bx, top: y + h - 35 - barH, width: bw * 0.45, height: barH, fill: hexToRgba(color, 0.34), rx: 4 }));
    objs.push(chalkText({ text: label.slice(0, 8), left: bx - 8, top: y + h - 26, width: bw, fontSize: 12, fill: CB.muted, textAlign: "center" }));
  });
  return objs;
}

export function chalkBullet(text: string, x: number, y: number, width: number, color = CB.yellow, i?: number) {
  return [
    cir({ left: x, top: y + 7, radius: 7, fill: hexToRgba(color, 0.7) }),
    chalkText({
      text: i === undefined ? text : `${i + 1}. ${text}`,
      left: x + 24,
      top: y,
      width,
      fontSize: 22,
      fill: CB.chalk,
      lineHeight: 1.32,
    }),
  ];
}

function boardTexture() {
  return [
    rct({ left: 0, top: 0, width: W, height: H, fill: CB.boardDeep }),
    rct({ left: 0, top: 0, width: W, height: H, fill: "rgba(255,255,255,0.025)" }),
    ...Array.from({ length: 18 }).map((_, i) =>
      chalkLine(40 + i * 73, 90 + (i % 5) * 92, 160 + i * 61, 128 + (i % 4) * 88, "rgba(244,240,220,0.035)", 1)
    ),
    ...Array.from({ length: 9 }).map((_, i) =>
      base("ellipse", {
        left: 80 + i * 134,
        top: 120 + (i % 3) * 160,
        rx: 72,
        ry: 20,
        fill: "rgba(244,240,220,0.035)",
        opacity: 0.55,
      })
    ),
  ];
}
