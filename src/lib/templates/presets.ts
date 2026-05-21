import { ADAPTIVE_DESIGN_LAYOUTS, ADAPTIVE_DESIGN_PROMPT, buildAdaptiveDesignLayouts, buildAdaptiveDesignPrompt } from "./adaptive-design/prompt";
import { CHALKBOARD_LAYOUTS, CHALKBOARD_PROMPT, buildChalkboardLayouts, buildChalkboardPrompt } from "./chalkboard/prompt";
import { CLEAN_STRATEGY_LAYOUTS, CLEAN_STRATEGY_PROMPT, buildCleanStrategyLayouts, buildCleanStrategyPrompt } from "./clean-strategy/prompt";
import { EXECUTIVE_BOARDROOM_LAYOUTS, EXECUTIVE_BOARDROOM_PROMPT, buildExecutiveBoardroomLayouts, buildExecutiveBoardroomPrompt } from "./executive-boardroom/prompt";
import { FIELD_REPORT_LAYOUTS, FIELD_REPORT_PROMPT, buildFieldReportLayouts, buildFieldReportPrompt } from "./field-report/prompt";
import { PRODUCT_OS_LAYOUTS, PRODUCT_OS_PROMPT, buildProductOsLayouts, buildProductOsPrompt } from "./product-os/prompt";

export interface PresentationPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  slideCount: number;
  minSlides?: number;
  maxSlides?: number;
  accentColor: string;
  darkColor: string;
  surfaceColor?: string;
  layouts: string[];
  aiPrompt: string;
  allowAiTheme?: boolean;
  buildDynamic?: (n: number) => { layouts: string[]; aiPrompt: string };
}

export const PRESETS: PresentationPreset[] = [
  {
    id: "chalkboard-masterclass",
    name: "Chalkboard Storyboard",
    tagline: "A flexible chalkboard style for any topic",
    description: "A professional chalkboard-style presentation (8–15 slides) with visual, comparison, process, evidence, quote, and closing layouts.",
    slideCount: 12,
    minSlides: 8,
    maxSlides: 15,
    accentColor: "#F4D35E",
    darkColor: "#102B25",
    surfaceColor: "#183B31",
    layouts: CHALKBOARD_LAYOUTS,
    aiPrompt: CHALKBOARD_PROMPT,
    buildDynamic: (n) => ({
      layouts: buildChalkboardLayouts(n),
      aiPrompt: buildChalkboardPrompt(n),
    }),
  },
  {
    id: "field-report",
    name: "Field Report",
    tagline: "Documentary evidence deck",
    description: "A flexible 5-15 slide field-report style with paper texture, photo evidence, findings, timelines, stats, and readable narrative text.",
    slideCount: 11,
    minSlides: 5,
    maxSlides: 15,
    accentColor: "#A9472B",
    darkColor: "#243B53",
    surfaceColor: "#F4EBDD",
    layouts: FIELD_REPORT_LAYOUTS,
    aiPrompt: FIELD_REPORT_PROMPT,
    buildDynamic: (n) => ({
      layouts: buildFieldReportLayouts(n),
      aiPrompt: buildFieldReportPrompt(n),
    }),
  },
  {
    id: "adaptive-design-system",
    name: "Freestyle",
    tagline: "AI picks everything",
    description: "AI chooses the design, colors, and layout from a library of 50+ hidden templates. Just give a topic — the system handles the rest.",
    slideCount: 12,
    minSlides: 5,
    maxSlides: 15,
    accentColor: "#2563EB",
    darkColor: "#1E293B",
    surfaceColor: "#F8F7F2",
    layouts: ADAPTIVE_DESIGN_LAYOUTS,
    aiPrompt: ADAPTIVE_DESIGN_PROMPT,
    allowAiTheme: true,
    buildDynamic: (n) => {
      const layouts = buildAdaptiveDesignLayouts(n);
      return {
        layouts,
        aiPrompt: buildAdaptiveDesignPrompt(n, layouts),
      };
    },
  },
  {
    id: "modern-product-os",
    name: "Modern Product OS",
    tagline: "AI-colored product system",
    description: "A flexible 5-15 slide product-native base with interface panels, workflows, metrics, roadmaps, and optional image layouts.",
    slideCount: 12,
    minSlides: 5,
    maxSlides: 15,
    accentColor: "#3B82F6",
    darkColor: "#111827",
    surfaceColor: "#F8FAFC",
    layouts: PRODUCT_OS_LAYOUTS,
    aiPrompt: PRODUCT_OS_PROMPT,
    allowAiTheme: true,
    buildDynamic: (n) => {
      const layouts = buildProductOsLayouts(n);
      return {
        layouts,
        aiPrompt: buildProductOsPrompt(n, layouts),
      };
    },
  },
  {
    id: "clean-strategy-brief",
    name: "Clean Strategy Brief",
    tagline: "Readable structured brief",
    description: "A flexible 5-15 slide strategy brief with concise text, clean cards, metrics, comparisons, process steps, risks, and recommendations.",
    slideCount: 11,
    minSlides: 5,
    maxSlides: 15,
    accentColor: "#2563EB",
    darkColor: "#1E293B",
    surfaceColor: "#F8F7F2",
    layouts: CLEAN_STRATEGY_LAYOUTS,
    aiPrompt: CLEAN_STRATEGY_PROMPT,
    buildDynamic: (n) => ({
      layouts: buildCleanStrategyLayouts(n),
      aiPrompt: buildCleanStrategyPrompt(n),
    }),
  },
  {
    id: "executive-boardroom",
    name: "Executive Boardroom",
    tagline: "Premium decision brief",
    description: "A flexible 5-15 slide executive briefing style with board-ready summaries, decision memos, KPI cards, risks, roadmaps, and recommendations.",
    slideCount: 11,
    minSlides: 5,
    maxSlides: 15,
    accentColor: "#C9A227",
    darkColor: "#111827",
    surfaceColor: "#F6F1E8",
    layouts: EXECUTIVE_BOARDROOM_LAYOUTS,
    aiPrompt: EXECUTIVE_BOARDROOM_PROMPT,
    buildDynamic: (n) => ({
      layouts: buildExecutiveBoardroomLayouts(n),
      aiPrompt: buildExecutiveBoardroomPrompt(n),
    }),
  },
];

export function getPreset(id: string): PresentationPreset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export function getAllPresets(): PresentationPreset[] {
  return PRESETS;
}
