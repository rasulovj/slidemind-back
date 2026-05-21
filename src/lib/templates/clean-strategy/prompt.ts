export const CLEAN_STRATEGY_LAYOUTS = [
  "csCover",
  "csAgenda",
  "csSummary",
  "csInsight",
  "csTwoColumn",
  "csProcess",
  "csMetrics",
  "csCompare",
  "csRisk",
  "csRecommendation",
  "csClosing",
];

const VARIANT_POOLS: Record<string, string[]> = {
  cover: ["csCover"],
  agenda: ["csAgenda"],
  summary: ["csSummary"],
  insight: ["csInsight"],
  analysis: ["csTwoColumn"],
  process: ["csProcess"],
  metrics: ["csMetrics"],
  compare: ["csCompare"],
  case: ["csCase"],
  risk: ["csRisk"],
  recommendation: ["csRecommendation"],
  closing: ["csClosing"],
};

const MIDDLE_TYPES = ["insight", "analysis", "process", "metrics", "compare", "case", "risk"];

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

export function buildCleanStrategyLayouts(n: number): string[] {
  const count = Math.max(5, Math.min(15, n));
  if (count === 5) {
    return [
      pickVariant("cover"),
      pickVariant("summary"),
      pickVariant("analysis"),
      pickVariant("recommendation"),
      pickVariant("closing"),
    ];
  }

  const middleCount = count - 2;
  const required = ["agenda", "summary", "analysis", "recommendation"];
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
  csCover: `    { "layout": "csCover", "heading": "concise deck title", "subheading": "specific promise or angle", "label": "topic category", "quote": "short closing line for cover" }`,
  csAgenda: `    { "layout": "csAgenda", "heading": "briefing route (max 3 words)", "body": "1-2 sentence explanation of the deck flow (max 180 chars)", "label": "topic category", "points": ["2-3 word section name", "2-3 word section name", "2-3 word section name", "2-3 word section name"] }`,
  csSummary: `    { "layout": "csSummary", "heading": "executive summary", "subheading": "readout label", "body": "3 sentence paragraph explaining the situation, why it matters, and what the audience should understand before deciding", "label": "topic category", "points": ["specific summary point", "specific summary point", "specific summary point"] }`,
  csInsight: `    { "layout": "csInsight", "heading": "key insight theme", "quote": "single sharp strategic claim", "body": "2-3 sentences explaining the evidence behind the claim and its practical implication", "label": "topic category" }`,
  csTwoColumn: `    { "layout": "csTwoColumn", "heading": "analysis heading", "subheading": "left column label", "quote": "right column label", "body": "2-3 sentence framing paragraph that explains the tradeoff before the columns", "label": "topic category", "leftPoints": ["specific left point", "specific left point", "specific left point"], "rightPoints": ["specific right point", "specific right point", "specific right point"] }`,
  csProcess: `    { "layout": "csProcess", "heading": "process heading", "body": "2-3 sentence explanation of the sequence, why the order matters, and what the final stage should produce", "label": "topic category", "steps": ["specific step", "specific step", "specific step", "specific step"] }`,
  csMetrics: `    { "layout": "csMetrics", "heading": "metrics heading", "body": "2-3 sentence explanation of what the numbers show, where attention is needed, and how leaders should interpret them", "label": "topic category", "stats": [{ "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }] }`,
  csCompare: `    { "layout": "csCompare", "heading": "comparison heading", "subheading": "specific option A", "quote": "specific option B", "label": "topic category", "leftPoints": ["specific advantage", "specific advantage", "specific advantage"], "rightPoints": ["specific advantage", "specific advantage", "specific advantage"] }`,
  csCase: `    { "layout": "csCase", "heading": "example title", "body": "3 sentence mini case explaining the situation, the action taken, and why the example matters", "label": "topic category", "points": ["specific situation", "specific action", "specific result"] }`,
  csRisk: `    { "layout": "csRisk", "heading": "risk heading", "body": "2-3 sentence explanation of the risk posture, which risks matter most, and how they should be managed", "label": "topic category", "points": ["specific risk", "specific risk", "specific risk", "specific risk"] }`,
  csRecommendation: `    { "layout": "csRecommendation", "heading": "recommended move", "body": "3 sentence recommendation naming the action, reason to act now, expected result, and checkpoint", "label": "topic category", "points": ["specific action", "specific owner", "specific checkpoint"] }`,
  csClosing: `    { "layout": "csClosing", "heading": "final takeaway", "body": "2-3 sentence closing synthesis that explains the main decision and what should happen next", "label": "topic category", "quote": "short final line" }`,
};

export const CLEAN_STRATEGY_PROMPT = buildCleanStrategyPrompt(11);

export function buildCleanStrategyPrompt(n: number): string {
  const count = Math.max(5, Math.min(15, n));
  const layouts = buildCleanStrategyLayouts(count);
  const slidesJson = layouts.map((l) => SLIDE_CONTENT[l] ?? `    { "layout": "${l}" }`).join(",\n");

  return `
You are a senior presentation designer creating a Clean Strategy Brief.
The style is calm, modern, structured, and highly readable: generous whitespace, fixed cards, useful explanatory paragraphs, simple diagrams, and no images.
Adapt to the user's topic: business, education, research, policy, product, history, science, planning, or strategy.
Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise title",
  "theme": {
    "dark": "#1E293B",
    "accent": "#2563EB",
    "surface": "#F8F7F2"
  },
  "slides": [
${slidesJson}
  ]
}

RULES:
1. Keep theme colors exactly: dark=#1E293B, accent=#2563EB, surface=#F8F7F2.
2. Use the exact layout IDs in the exact order shown above.
3. Create exactly ${count} slides.
4. Do not include imageQuery or imageUrl fields. This template is text-and-diagram only.
5. Use meaningful explanatory text. The template is safe against overflow, so make slides readable without a speaker.
6. Include useful body text on at least ${Math.max(4, Math.round(count * 0.9))} slides. Prefer 3-5 sentence mini-paragraphs.
7. STRICT character limits:
   - heading: max 42 chars
   - label: max 24 chars
   - subheading / quote / author: max 120 chars
   - body: 320-620 chars, absolute max 700 chars
   - points[] / steps[] / leftPoints[] / rightPoints[]: each item max 48 chars
   - stats[].value: max 8 chars
   - stats[].label: max 28 chars
8. Make every item topic-specific. Avoid generic placeholders like "Context", "Insight", "Next step", "Benefit", "Risk", or "Decision".
9. Use realistic numbers only when broadly plausible. If unsure, use qualitative metrics instead of fake precision.
10. Do not include markdown, bullets, LaTeX delimiters, or code fences inside fields.
11. NEVER use "..." or ellipsis in any field. Write complete, short text. If a phrase is too long, shorten it — do not truncate with dots.
12. For agenda/points items: write COMPLETE short phrases (2-4 words). Never abbreviate or cut off text.
13. Include "icon" field on each slide with a relevant Lucide icon name (e.g. "briefcase", "chart-bar", "target", "lightbulb", "shield", "users", "rocket", "trending-up").
14. For slides with points/steps arrays, include "icons" array with one Lucide icon name per item.
15. NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. No two slides should restate the same facts, examples, or data points. Plan the content arc first: divide the topic into unique facets and assign one per slide.
`.trim();
}
