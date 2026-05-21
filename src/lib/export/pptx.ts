import PptxGenJS from "pptxgenjs";
import {
  hexWithoutHash,
  objectHeight,
  objectLeft,
  objectTop,
  objectWidth,
  parseColor,
  pxToIn,
  readCanvasJson,
  safeFilename,
  sizePxToPt,
  type ExportDeck,
  type FabricObject,
} from "./fabric";

export async function buildPptx(deck: ExportDeck): Promise<{ buffer: Buffer; filename: string }> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "SlideMind";
  pptx.company = "SlideMind";
  pptx.subject = deck.presentation.title;
  pptx.title = deck.presentation.title;
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
  };

  for (const dbSlide of deck.slides) {
    const canvas = readCanvasJson(dbSlide);
    const slide = pptx.addSlide();
    const bg = parseColor(canvas.background, "#ffffff");
    slide.background = { color: hexWithoutHash(bg.hex) };

    for (const obj of canvas.objects ?? []) {
      addFabricObject(slide, pptx, obj);
    }
  }

  const output = await pptx.write({ outputType: "nodebuffer", compression: true });
  return {
    buffer: Buffer.from(output as Uint8Array),
    filename: safeFilename(deck.presentation.title, "pptx"),
  };
}

function addFabricObject(slide: PptxGenJS.Slide, pptx: PptxGenJS, obj: FabricObject) {
  if (obj.visible === false || (obj.opacity ?? 1) <= 0) return;

  if (obj.type === "textbox" || obj.type === "text") {
    addText(slide, obj);
    return;
  }

  if (obj.type === "rect") {
    addShape(slide, pptx.ShapeType.rect, obj);
    return;
  }

  if (obj.type === "circle" || obj.type === "ellipse") {
    addShape(slide, pptx.ShapeType.ellipse, obj);
    return;
  }

  if (obj.type === "image" && obj.src) {
    addImage(slide, obj);
  }
}

function addText(slide: PptxGenJS.Slide, obj: FabricObject) {
  const fill = parseColor(obj.fill, "#000000");
  const width = objectWidth(obj);
  const height = Math.max(objectHeight(obj), (obj.fontSize ?? 16) * 1.35);

  slide.addText(obj.text ?? "", {
    x: pxToIn(objectLeft(obj)),
    y: pxToIn(objectTop(obj)),
    w: pxToIn(width),
    h: pxToIn(height),
    rotate: obj.angle ?? 0,
    margin: 0,
    fit: "shrink",
    fontFace: fontFace(obj),
    fontSize: Math.max(1, sizePxToPt(obj.fontSize ?? 16)),
    color: hexWithoutHash(fill.hex),
    transparency: Math.round((1 - fill.alpha * (obj.opacity ?? 1)) * 100),
    bold: isBold(obj.fontWeight),
    italic: obj.fontStyle === "italic",
    align: textAlign(obj.textAlign),
    valign: "middle",
    breakLine: false,
  });
}

function addShape(slide: PptxGenJS.Slide, shape: PptxGenJS.SHAPE_NAME, obj: FabricObject) {
  const fill = parseColor(obj.fill, "#000000");
  const stroke = parseColor(obj.stroke, fill.hex);
  const opacity = obj.opacity ?? 1;
  const hasFill = fill.alpha > 0;
  const hasStroke = !!obj.stroke && stroke.alpha > 0 && (obj.strokeWidth ?? 0) > 0;

  slide.addShape(shape, {
    x: pxToIn(objectLeft(obj)),
    y: pxToIn(objectTop(obj)),
    w: pxToIn(objectWidth(obj)),
    h: pxToIn(objectHeight(obj)),
    rotate: obj.angle ?? 0,
    fill: hasFill
      ? { color: hexWithoutHash(fill.hex), transparency: Math.round((1 - fill.alpha * opacity) * 100) }
      : { color: "FFFFFF", transparency: 100 },
    line: hasStroke
      ? {
          color: hexWithoutHash(stroke.hex),
          transparency: Math.round((1 - stroke.alpha * opacity) * 100),
          width: obj.strokeWidth,
        }
      : { color: hexWithoutHash(fill.hex), transparency: 100, width: 0 },
  });
}

function addImage(slide: PptxGenJS.Slide, obj: FabricObject) {
  slide.addImage({
    path: obj.src!,
    x: pxToIn(objectLeft(obj)),
    y: pxToIn(objectTop(obj)),
    w: pxToIn(objectWidth(obj)),
    h: pxToIn(objectHeight(obj)),
    rotate: obj.angle ?? 0,
    transparency: Math.round((1 - (obj.opacity ?? 1)) * 100),
  });
}

function textAlign(value: string | undefined): PptxGenJS.HAlign {
  if (value === "center" || value === "right" || value === "justify") return value;
  return "left";
}

function isBold(weight: string | undefined) {
  if (!weight) return false;
  if (weight === "bold") return true;
  const numeric = Number(weight);
  return Number.isFinite(numeric) && numeric >= 600;
}

function fontFace(obj: FabricObject) {
  const font = obj.fontFamily ?? "";
  if (font.includes("Comic Sans") || font.includes("Bradley Hand") || font.includes("Segoe Print")) {
    return "Segoe Print";
  }
  if (font.includes("Fraunces")) return "Georgia";
  return "Aptos";
}
