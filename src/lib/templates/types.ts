export interface Theme {
  dark: string;
  accent: string;
  surface: string;
}

export interface SlideContent {
  heading?: string;
  subheading?: string;
  body?: string;
  imageQuery?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageProvider?: string;
  imageSourceUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  points?: string[];
  stats?: Array<{ value: string; label: string }>;
  label?: string;
  quote?: string;
  author?: string;
  steps?: string[];
  leftPoints?: string[];
  rightPoints?: string[];
  icon?: string;
  icons?: string[];
}

export interface LayoutMeta {
  id: string;
  name: string;
  category: "intro" | "agenda" | "content" | "data" | "compare" | "visual" | "closing";
  description: string;
}

export type CanvasBuilder = (theme: Theme, content?: SlideContent, slideNum?: number) => Record<string, unknown>;
