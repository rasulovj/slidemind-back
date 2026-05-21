export const PRODUCT_OS_LAYOUTS = [
  "poCover",
  "poImageCover",
  "poAgenda",
  "poBrief",
  "poFeatureGrid",
  "poImageSplit",
  "poShowcase",
  "poWorkflow",
  "poMetrics",
  "poCompare",
  "poRoadmap",
  "poDecision",
  "poClosing",
];

const VARIANT_POOLS: Record<string, string[]> = {
  cover: ["poCover", "poImageCover"],
  agenda: ["poAgenda"],
  brief: ["poBrief"],
  features: ["poFeatureGrid"],
  image: ["poImageSplit", "poShowcase"],
  workflow: ["poWorkflow"],
  metrics: ["poMetrics"],
  compare: ["poCompare"],
  roadmap: ["poRoadmap"],
  decision: ["poDecision"],
  closing: ["poClosing"],
};

const MIDDLE_TYPES = ["brief", "features", "workflow", "metrics", "compare", "roadmap", "decision", "image"];

function pickVariant(type: string) {
  const pool = VARIANT_POOLS[type];
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle<T>(arr: T[]) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildProductOsLayouts(n: number): string[] {
  const count = Math.max(5, Math.min(15, n));
  if (count === 5) {
    return [
      pickVariant("cover"),
      pickVariant("brief"),
      pickVariant("image"),
      pickVariant("decision"),
      pickVariant("closing"),
    ];
  }

  const middleCount = count - 2;
  const required = ["agenda", "brief", "features", "workflow", "decision"];
  const remaining = Math.max(0, middleCount - required.length);
  const shuffled = shuffle([...MIDDLE_TYPES]);

  return [
    pickVariant("cover"),
    ...required.map(pickVariant),
    ...Array.from({ length: remaining }).map((_, i) => pickVariant(shuffled[i % shuffled.length])),
    pickVariant("closing"),
  ];
}

const SLIDE_CONTENT: Record<string, string> = {
  poCover: `    { "layout": "poCover", "heading": "concise product deck title", "subheading": "specific product promise or angle", "label": "topic category", "quote": "short product thesis" }`,
  poImageCover: `    { "layout": "poImageCover", "heading": "concise product deck title", "subheading": "specific product promise or angle", "label": "topic category", "imageQuery": "short concrete visual phrase for the product topic" }`,
  poAgenda: `    { "layout": "poAgenda", "heading": "build route", "body": "3-4 sentence explanation of how the deck moves from user problem to product system, workflow, launch path, and decision", "label": "topic category", "points": ["specific section", "specific section", "specific section", "specific section"] }`,
  poBrief: `    { "layout": "poBrief", "heading": "product brief", "subheading": "specific readout label", "body": "3-5 sentence paragraph explaining the user problem, current workaround, urgency, and what the product must prove", "label": "topic category", "points": ["specific user pressure", "specific workflow gap", "specific adoption trigger"] }`,
  poFeatureGrid: `    { "layout": "poFeatureGrid", "heading": "feature system", "body": "3-4 sentence explanation of how the main product capabilities work together as an operating system", "label": "topic category", "points": ["specific capability", "specific capability", "specific capability", "specific capability"] }`,
  poImageSplit: `    { "layout": "poImageSplit", "heading": "user workflow", "body": "3-4 sentence explanation connecting the visual scene to the product workflow and user outcome", "label": "topic category", "imageQuery": "short concrete visual phrase for user workflow", "points": ["specific context", "specific product response", "specific adoption signal"] }`,
  poShowcase: `    { "layout": "poShowcase", "heading": "product moment", "body": "2-3 sentence interpretation of what the visual should help the audience understand", "label": "topic category", "imageQuery": "short concrete visual phrase for product interface or real usage" }`,
  poWorkflow: `    { "layout": "poWorkflow", "heading": "workflow engine", "body": "3-4 sentence explanation of the sequence, why each stage matters, and what the final stage produces", "label": "topic category", "steps": ["specific step", "specific step", "specific step", "specific step"] }`,
  poMetrics: `    { "layout": "poMetrics", "heading": "product signals", "body": "3-4 sentence explanation of the indicators that prove adoption, value, retention, or operational improvement", "label": "topic category", "stats": [{ "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }] }`,
  poCompare: `    { "layout": "poCompare", "heading": "before and after", "subheading": "specific current workflow", "quote": "specific product workflow", "label": "topic category", "leftPoints": ["specific current pain", "specific current pain", "specific current pain"], "rightPoints": ["specific product benefit", "specific product benefit", "specific product benefit"] }`,
  poRoadmap: `    { "layout": "poRoadmap", "heading": "product roadmap", "body": "3-4 sentence explanation of what gets validated at each stage and how learning reduces risk", "label": "topic category", "steps": ["specific milestone", "specific milestone", "specific milestone", "specific milestone"] }`,
  poDecision: `    { "layout": "poDecision", "heading": "decision stack", "body": "3-4 sentence explanation of the recommended product move, the evidence behind it, and the checkpoint for success", "label": "topic category", "points": ["specific action", "specific validation", "specific checkpoint"] }`,
  poClosing: `    { "layout": "poClosing", "heading": "final product move", "body": "3-4 sentence closing synthesis naming the user value, product direction, first release, and measurable checkpoint", "label": "topic category", "quote": "short final product line" }`,
};

export const PRODUCT_OS_PROMPT = buildProductOsPrompt(12);

export function buildProductOsPrompt(n: number, fixedLayouts?: string[]): string {
  const count = Math.max(5, Math.min(15, n));
  const layouts = fixedLayouts?.length ? fixedLayouts.slice(0, count) : buildProductOsLayouts(count);
  const slidesJson = layouts.map((l) => SLIDE_CONTENT[l] ?? `    { "layout": "${l}" }`).join(",\n");
  const imageLayouts = layouts.filter((l) => ["poImageCover", "poImageSplit", "poShowcase"].includes(l));

  return `
You are a senior product designer creating a Modern Product OS presentation.
The base system has no fixed color palette: choose colors that fit the user's prompt, product category, audience, and mood.
The style is product-native: clean software interface panels, command-center rhythm, feature systems, workflows, product metrics, roadmaps, and controlled image slots.
Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise title",
  "theme": {
    "dark": "#hexcolor - topic-relevant deep product UI color",
    "accent": "#hexcolor - distinctive product accent",
    "surface": "#hexcolor - light readable app surface color"
  },
  "slides": [
${slidesJson}
  ]
}

RULES:
1. Use the exact layout IDs in the exact order shown above.
2. Create exactly ${count} slides.
3. Choose a topic-specific palette:
   - dark must be deep and readable
   - accent must contrast clearly against dark and surface
   - surface must be near-white or lightly tinted
   - do not copy fixed palettes from other templates unless the topic strongly demands it
4. Image rules:
   - Layouts requiring imageQuery in this deck: ${imageLayouts.length ? imageLayouts.join(", ") : "none"}
   - If a slide example above includes imageQuery, you MUST provide it.
   - If a slide example does not include imageQuery, do not add imageQuery.
   - imageQuery must be short, concrete, and visual, max 58 chars.
   - Prefer real-world product/user scenes or interface-like visuals: "designer reviewing app dashboard", "small business mobile payments", "students using learning app".
   - Avoid abstract words alone: "innovation", "strategy", "success", "future", "platform".
5. Include meaningful explanatory body text on at least ${Math.max(4, Math.round(count * 0.85))} slides.
6. Write for the user's actual topic. The topic can be SaaS, AI, apps, business, education, health, finance, civic services, marketplace, operations, or any product-like idea.
7. STRICT character limits:
   - heading: max 44 chars
   - label: max 24 chars
   - subheading / quote / author: max 120 chars
   - body: 260-520 chars, absolute max 650 chars
   - points[] / steps[] / leftPoints[] / rightPoints[]: each item max 48 chars
   - stats[].value: max 9 chars
   - stats[].label: max 30 chars
   - imageQuery: max 58 chars
8. Avoid generic placeholders like "Context", "Insight", "Benefit", "Risk", "Decision", "Next step", or "Key point". Make every phrase topic-specific.
9. Use realistic numbers only when broadly plausible. If unsure, use qualitative indicators instead of fake precision.
10. Do not include markdown, bullets, LaTeX delimiters, or code fences inside fields.
11. NEVER use "..." or ellipsis in any field. Write complete, short text. If a phrase is too long, shorten it — do not truncate with dots.
12. NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. No two slides should share the same thesis, examples, or data points. Plan the content arc first: divide the topic into unique facets and assign one per slide.
13. Include "icon" field on each slide with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe").
14. For slides with points/steps/stats arrays, include "icons" array with one Lucide icon name per item.
`.trim();
}
