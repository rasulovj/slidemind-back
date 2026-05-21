import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import {
  CANVAS_H,
  CANVAS_W,
  objectHeight,
  objectLeft,
  objectTop,
  objectWidth,
  parseColor,
  readCanvasJson,
  safeFilename,
  wrapText,
  type ExportDeck,
  type FabricObject,
  type ParsedColor,
} from "./fabric";

export async function buildPdf(deck: ExportDeck): Promise<{ buffer: Buffer; filename: string }> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(deck.presentation.title);
  pdf.setAuthor("SlideMind");
  pdf.setProducer("SlideMind");
  pdf.setCreator("SlideMind");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  for (const dbSlide of deck.slides) {
    const canvas = readCanvasJson(dbSlide);
    const page = pdf.addPage([CANVAS_W, CANVAS_H]);
    const bg = parseColor(canvas.background, "#ffffff");
    page.drawRectangle({
      x: 0,
      y: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      color: toRgb(bg),
      opacity: bg.alpha,
    });

    for (const obj of canvas.objects ?? []) {
      if (obj.visible === false || (obj.opacity ?? 1) <= 0) continue;

      if (obj.type === "textbox" || obj.type === "text") {
        const font = obj.fontStyle === "italic" ? italic : isBold(obj.fontWeight) ? bold : regular;
        drawText(page, obj, font);
        continue;
      }

      if (obj.type === "rect") {
        drawRect(page, obj);
        continue;
      }

      if (obj.type === "circle" || obj.type === "ellipse") {
        drawEllipse(page, obj);
      }
    }
  }

  const bytes = await pdf.save();
  return {
    buffer: Buffer.from(bytes),
    filename: safeFilename(deck.presentation.title, "pdf"),
  };
}

type PdfPage = Awaited<ReturnType<PDFDocument["addPage"]>>;
type PdfFont = Awaited<ReturnType<PDFDocument["embedFont"]>>;

function drawText(page: PdfPage, obj: FabricObject, font: PdfFont) {
  const fill = parseColor(obj.fill, "#000000");
  const width = objectWidth(obj);
  const fontSize = obj.fontSize ?? 16;
  const maxChars = Math.max(8, Math.floor(width / Math.max(fontSize * 0.52, 1)));
  const lineHeight = fontSize * (obj.lineHeight ?? 1.2);
  const lines = wrapText(normalizePdfText(obj.text ?? ""), maxChars).split("\n");
  const textHeight = lines.length * lineHeight;
  const yStart = CANVAS_H - objectTop(obj) - fontSize;
  const x = alignedX(obj, lines, font, fontSize);

  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: yStart - index * lineHeight,
      size: fontSize,
      font,
      color: toRgb(fill),
      opacity: fill.alpha * (obj.opacity ?? 1),
      rotate: degrees(obj.angle ?? 0),
      maxWidth: width,
    });
  });

  if (obj.angle && textHeight > 0) {
    return;
  }
}

function normalizePdfText(text: string) {
  const replacements: Record<string, string> = {
    "α": "alpha",
    "β": "beta",
    "γ": "gamma",
    "δ": "delta",
    "Δ": "Delta",
    "θ": "theta",
    "λ": "lambda",
    "μ": "mu",
    "π": "pi",
    "ρ": "rho",
    "σ": "sigma",
    "Σ": "Sigma",
    "Ω": "Ohm",
    "∞": "infinity",
    "√": "sqrt",
    "∑": "sum",
    "∫": "integral",
    "≈": "~=",
    "≠": "!=",
    "≤": "<=",
    "≥": ">=",
    "×": "x",
    "÷": "/",
    "±": "+/-",
    "→": "->",
    "←": "<-",
    "↔": "<->",
    "²": "^2",
    "³": "^3",
    "¹": "^1",
    "⁰": "^0",
    "⁴": "^4",
    "⁵": "^5",
    "⁶": "^6",
    "⁷": "^7",
    "⁸": "^8",
    "⁹": "^9",
    "₀": "_0",
    "₁": "_1",
    "₂": "_2",
    "₃": "_3",
    "₄": "_4",
    "₅": "_5",
    "₆": "_6",
    "₇": "_7",
    "₈": "_8",
    "₉": "_9",
    "“": "\"",
    "”": "\"",
    "‘": "'",
    "’": "'",
    "—": "-",
    "–": "-",
    "•": "-",
  };

  return Array.from(text)
    .map((char) => {
      if (replacements[char]) return replacements[char];
      const code = char.charCodeAt(0);
      return code >= 32 && code <= 255 ? char : "?";
    })
    .join("");
}

function drawRect(page: PdfPage, obj: FabricObject) {
  const fill = parseColor(obj.fill, "#000000");
  const stroke = parseColor(obj.stroke, fill.hex);
  const width = objectWidth(obj);
  const height = objectHeight(obj);
  const opacity = obj.opacity ?? 1;

  page.drawRectangle({
    x: objectLeft(obj),
    y: CANVAS_H - objectTop(obj) - height,
    width,
    height,
    rotate: degrees(obj.angle ?? 0),
    color: fill.alpha > 0 ? toRgb(fill) : undefined,
    opacity: fill.alpha * opacity,
    borderColor: obj.stroke && stroke.alpha > 0 ? toRgb(stroke) : undefined,
    borderOpacity: stroke.alpha * opacity,
    borderWidth: obj.stroke ? obj.strokeWidth ?? 1 : 0,
  });
}

function drawEllipse(page: PdfPage, obj: FabricObject) {
  const fill = parseColor(obj.fill, "#000000");
  const stroke = parseColor(obj.stroke, fill.hex);
  const width = objectWidth(obj);
  const height = objectHeight(obj);
  const opacity = obj.opacity ?? 1;

  page.drawEllipse({
    x: objectLeft(obj) + width / 2,
    y: CANVAS_H - objectTop(obj) - height / 2,
    xScale: width / 2,
    yScale: height / 2,
    rotate: degrees(obj.angle ?? 0),
    color: fill.alpha > 0 ? toRgb(fill) : undefined,
    opacity: fill.alpha * opacity,
    borderColor: obj.stroke && stroke.alpha > 0 ? toRgb(stroke) : undefined,
    borderOpacity: stroke.alpha * opacity,
    borderWidth: obj.stroke ? obj.strokeWidth ?? 1 : 0,
  });
}

function alignedX(obj: FabricObject, lines: string[], font: PdfFont, fontSize: number) {
  const left = objectLeft(obj);
  const width = objectWidth(obj);
  if (obj.textAlign === "right") {
    const widest = Math.max(...lines.map((line) => font.widthOfTextAtSize(line, fontSize)), 0);
    return left + Math.max(0, width - widest);
  }
  if (obj.textAlign === "center") {
    const widest = Math.max(...lines.map((line) => font.widthOfTextAtSize(line, fontSize)), 0);
    return left + Math.max(0, (width - widest) / 2);
  }
  return left;
}

function toRgb(color: ParsedColor) {
  const hex = color.hex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

function isBold(weight: string | undefined) {
  if (!weight) return false;
  if (weight === "bold") return true;
  const numeric = Number(weight);
  return Number.isFinite(numeric) && numeric >= 600;
}
