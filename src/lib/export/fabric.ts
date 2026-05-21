import type { Presentation, Slide } from "@prisma/client";

export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const PPTX_W = 13.333333;
export const PPTX_H = 7.5;

export interface ExportDeck {
  presentation: Presentation;
  slides: Slide[];
}

export interface FabricCanvasJson {
  background?: string;
  objects?: FabricObject[];
}

export interface FabricObject {
  type?: string;
  text?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  radius?: number;
  rx?: number;
  ry?: number;
  fill?: string | null;
  stroke?: string | null;
  strokeWidth?: number;
  opacity?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  originX?: "left" | "center" | "right" | string;
  originY?: "top" | "center" | "bottom" | string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  fontFamily?: string;
  textAlign?: string;
  lineHeight?: number;
  visible?: boolean;
  src?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageProvider?: string;
  imageSourceUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  cropX?: number;
  cropY?: number;
}

export interface ParsedColor {
  hex: string;
  alpha: number;
}

export function readCanvasJson(slide: Slide): FabricCanvasJson {
  const value = slide.canvasJson;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { objects: [], background: "#ffffff" };
  }
  const json = value as Record<string, unknown>;
  return {
    background: typeof json.background === "string" ? json.background : "#ffffff",
    objects: Array.isArray(json.objects) ? json.objects as FabricObject[] : [],
  };
}

export function pxToIn(px = 0) {
  return px * (PPTX_W / CANVAS_W);
}

export function sizePxToPt(px = 0) {
  return px * 0.75;
}

export function objectWidth(obj: FabricObject) {
  if (obj.type === "circle") return (obj.radius ?? 0) * 2 * (obj.scaleX ?? 1);
  if (obj.type === "ellipse") return (obj.rx ?? 0) * 2 * (obj.scaleX ?? 1);
  return (obj.width ?? 0) * (obj.scaleX ?? 1);
}

export function objectHeight(obj: FabricObject) {
  if (obj.type === "circle") return (obj.radius ?? 0) * 2 * (obj.scaleY ?? 1);
  if (obj.type === "ellipse") return (obj.ry ?? 0) * 2 * (obj.scaleY ?? 1);
  return (obj.height ?? 0) * (obj.scaleY ?? 1);
}

export function objectLeft(obj: FabricObject) {
  const left = obj.left ?? 0;
  const width = objectWidth(obj);
  if (obj.originX === "center") return left - width / 2;
  if (obj.originX === "right") return left - width;
  return left;
}

export function objectTop(obj: FabricObject) {
  const top = obj.top ?? 0;
  const height = objectHeight(obj);
  if (obj.originY === "center") return top - height / 2;
  if (obj.originY === "bottom") return top - height;
  return top;
}

export function parseColor(value: string | null | undefined, fallback = "#000000"): ParsedColor {
  if (!value || value === "transparent") return { hex: normalizeHex(fallback), alpha: 0 };

  const rgba = value.match(/rgba?\(([^)]+)\)/i);
  if (rgba) {
    const parts = rgba[1].split(",").map((part) => part.trim());
    const r = clamp255(Number(parts[0]));
    const g = clamp255(Number(parts[1]));
    const b = clamp255(Number(parts[2]));
    const alpha = parts[3] === undefined ? 1 : clamp(Number(parts[3]), 0, 1);
    return { hex: rgbToHex(r, g, b), alpha };
  }

  return { hex: normalizeHex(value), alpha: 1 };
}

export function hexWithoutHash(hex: string) {
  return normalizeHex(hex).replace("#", "");
}

export function safeFilename(name: string, ext: string) {
  const base = name
    .trim()
    .replace(/[^a-z0-9\-_ ]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "presentation";
  return `${base}.${ext}`;
}

export function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.join("\n");
}

function normalizeHex(value: string) {
  const full = value.match(/^#?([0-9a-f]{6})$/i);
  if (full) return `#${full[1]}`;

  const short = value.match(/^#?([0-9a-f]{3})$/i);
  if (short) {
    return `#${short[1].split("").map((c) => `${c}${c}`).join("")}`;
  }

  return "#000000";
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function clamp255(value: number) {
  return Math.round(clamp(Number.isFinite(value) ? value : 0, 0, 255));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
