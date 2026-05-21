import { W, H, base, canvas, hexToRgba, rct, txt } from "../helpers";

export const EM = {
  // Core colors
  white: "#FFFFFF",
  black: "#0A0A0A",
  ink: "#1A1A1A",
  muted: "#6B6B6B",
  faint: "#E5E5E5",

  // Accent options (vibrant magazine colors)
  electric: "#0066FF",
  magenta: "#FF0054",
  emerald: "#00D084",
  amber: "#FF8800",

  // Backgrounds
  paper: "#FAFAFA",
  cream: "#FFF9F5",
};

export function emCanvas(objects: unknown[], bg = EM.white) {
  return canvas(bg, [
    rct({ left: 0, top: 0, width: W, height: H, fill: bg }),
    // Subtle grid for magazine feel
    ...Array.from({ length: 9 }).map((_, i) =>
      rct({ left: 60 + i * 140, top: 0, width: 0.5, height: H, fill: hexToRgba(EM.faint, 0.3) })
    ),
    ...objects,
  ]);
}

export function emText(p: {
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
  return txt({
    text: p.text,
    left: p.left,
    top: p.top,
    width: p.width,
    fontSize: p.fontSize,
    fill: p.fill ?? EM.ink,
    fontWeight: p.fontWeight,
    textAlign: p.textAlign,
    lineHeight: p.lineHeight,
    opacity: p.opacity,
  });
}

// Magazine-style headline (large serif)
export function emHeadline(text: string, left: number, top: number, width: number, fontSize = 72, accent = EM.electric) {
  return base("textbox", {
    text,
    left,
    top,
    width,
    fontSize,
    fill: EM.black,
    fontWeight: "800",
    lineHeight: 0.96,
    fontFamily: "Georgia, 'Playfair Display', serif",
    splitByGrapheme: false,
    charSpacing: 0,
    styles: {},
    underline: false,
    overline: false,
    linethrough: false,
    fontStyle: "normal",
    textBackgroundColor: "",
    textAlign: "left",
  });
}

// Kicker (small label above headline)
export function emKicker(text: string, left: number, top: number, accent = EM.electric) {
  return [
    rct({ left, top: top + 20, width: 40, height: 3, fill: accent }),
    emText({
      text: text.toUpperCase(),
      left: left + 50,
      top,
      width: 400,
      fontSize: 13,
      fill: accent,
      fontWeight: "800",
      lineHeight: 1.2,
    }),
  ];
}

// Deck (subheadline below main headline)
export function emDeck(text: string, left: number, top: number, width: number, size = 22) {
  return emText({
    text,
    left,
    top,
    width,
    fontSize: size,
    fill: EM.muted,
    lineHeight: 1.36,
    fontWeight: "400",
  });
}

// Byline (author attribution)
export function emByline(author: string, date: string, left: number, top: number) {
  return [
    rct({ left, top: top + 8, width: 28, height: 1, fill: EM.ink }),
    emText({ text: `By ${author}`, left: left + 38, top, width: 300, fontSize: 13, fill: EM.ink, fontWeight: "600" }),
    emText({ text: date, left: left + 38, top: top + 20, width: 300, fontSize: 12, fill: EM.muted, fontWeight: "400" }),
  ];
}

// Running header (page identifier at top)
export function emRunningHeader(category: string, pageNum: string) {
  return [
    rct({ left: 0, top: 0, width: W, height: 1, fill: EM.faint }),
    emText({ text: category.toUpperCase(), left: 60, top: 24, width: 400, fontSize: 11, fill: EM.muted, fontWeight: "700" }),
    emText({ text: pageNum, left: W - 120, top: 24, width: 60, fontSize: 28, fill: EM.electric, fontWeight: "900", textAlign: "right" }),
  ];
}

// Drop cap (large first letter)
export function emDropCap(letter: string, left: number, top: number, accent = EM.electric) {
  return {
    ...emText({
      text: letter,
      left,
      top,
      width: 80,
      fontSize: 110,
      fill: accent,
      fontWeight: "900",
      lineHeight: 0.8,
    }),
    fontFamily: "Georgia, serif",
  };
}

// Body text column
export function emBodyColumn(text: string, left: number, top: number, width: number, size = 17) {
  return emText({
    text,
    left,
    top,
    width,
    fontSize: size,
    fill: EM.ink,
    lineHeight: 1.58,
    fontWeight: "400",
  });
}

// Pull quote (large quote in margin or center)
export function emPullQuote(quote: string, left: number, top: number, width: number, accent = EM.electric) {
  return [
    rct({ left, top: top - 12, width: 5, height: 60, fill: accent }),
    {
      ...emText({
        text: `"${quote}"`,
        left: left + 24,
        top,
        width: width - 24,
        fontSize: 28,
        fill: EM.ink,
        fontWeight: "700",
        lineHeight: 1.24,
      }),
      fontFamily: "Georgia, serif",
    },
  ];
}

// Sidebar box (colored background with content)
export function emSidebar(left: number, top: number, width: number, height: number, accent = EM.electric) {
  return [
    rct({ left, top, width, height, fill: hexToRgba(accent, 0.08), rx: 0 }),
    rct({ left, top, width: 6, height, fill: accent, rx: 0 }),
  ];
}

// Section number (large decorative number - should be 1-2 chars only)
export function emSectionNumber(num: string, left: number, top: number, accent = EM.electric) {
  // Only use first 2 characters to avoid layout issues
  const displayNum = num.substring(0, 2);
  return emText({
    text: displayNum,
    left,
    top,
    width: 200,
    fontSize: 160,
    fill: hexToRgba(accent, 0.12),
    fontWeight: "900",
  });
}

// Image caption (small text below photos)
export function emCaption(text: string, left: number, top: number, width: number) {
  return emText({
    text,
    left,
    top,
    width,
    fontSize: 13,
    fill: EM.muted,
    lineHeight: 1.42,
    fontWeight: "400",
  });
}

// Divider line
export function emDivider(left: number, top: number, width: number, accent = EM.electric) {
  return rct({ left, top, width, height: 2, fill: accent });
}

// Issue label (magazine issue info)
export function emIssueLabel(issue: string, year: string, left: number, top: number) {
  return [
    emText({ text: issue.toUpperCase(), left, top, width: 200, fontSize: 10, fill: EM.muted, fontWeight: "700" }),
    emText({ text: year, left, top: top + 16, width: 200, fontSize: 10, fill: EM.muted, fontWeight: "400" }),
  ];
}

// Stat callout (large number + label)
export function emStatCallout(value: string, label: string, left: number, top: number, accent = EM.electric) {
  return [
    emText({ text: value, left, top, width: 280, fontSize: 68, fill: accent, fontWeight: "900" }),
    emText({ text: label, left, top: top + 80, width: 280, fontSize: 16, fill: EM.ink, lineHeight: 1.36, fontWeight: "400" }),
  ];
}

// Image slot with editorial styling
export function emImageSlot(p: {
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
  caption?: string;
  accent?: string;
}) {
  const accent = p.accent ?? EM.electric;
  const credit = [p.imageCredit, p.imageProvider].filter(Boolean).join(" / ");
  const fit = containImage(p.imageWidth, p.imageHeight, p.x, p.y, p.w, p.h);

  if (p.imageUrl) {
    const naturalW = p.imageWidth ?? fit.w;
    const naturalH = p.imageHeight ?? fit.h;
    return [
      rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: EM.faint }),
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
      ...(credit ? [emText({ text: credit.toUpperCase(), left: p.x + 12, top: p.y + p.h - 28, width: p.w - 24, fontSize: 9, fill: "rgba(255,255,255,0.85)", fontWeight: "600" })] : []),
    ];
  }

  const label = p.imageQuery ?? p.imageAlt ?? "EDITORIAL IMAGE";
  return [
    rct({ left: p.x, top: p.y, width: p.w, height: p.h, fill: EM.faint }),
    rct({ left: p.x, top: p.y, width: 6, height: p.h, fill: accent }),
    emText({ text: "PHOTO", left: p.x + 24, top: p.y + 24, width: p.w - 48, fontSize: 11, fill: EM.muted, fontWeight: "800" }),
    emText({ text: label, left: p.x + 24, top: p.y + p.h / 2 - 12, width: p.w - 48, fontSize: 16, fill: EM.muted, textAlign: "center", lineHeight: 1.4 }),
  ];
}

function containImage(sourceW: number | undefined, sourceH: number | undefined, frameX: number, frameY: number, frameW: number, frameH: number) {
  if (!sourceW || !sourceH) return { x: frameX, y: frameY, w: frameW, h: frameH };
  const scale = Math.min(frameW / sourceW, frameH / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;
  return { x: frameX + (frameW - w) / 2, y: frameY + (frameH - h) / 2, w, h };
}
