export const EXECUTIVE_BOARDROOM_LAYOUTS = [
  "ebCover",
  "ebAgenda",
  "ebExecutiveSummary",
  "ebDecisionMemo",
  "ebKpi",
  "ebMarketMap",
  "ebCompare",
  "ebRiskGrid",
  "ebRoadmap",
  "ebRecommendation",
  "ebClosing",
];

const VARIANT_POOLS: Record<string, string[]> = {
  cover: ["ebCover", "ebCoverB"],
  agenda: ["ebAgenda", "ebAgendaB"],
  summary: ["ebExecutiveSummary", "ebExecutiveSummaryB"],
  decision: ["ebDecisionMemo"],
  kpi: ["ebKpi", "ebKpiB"],
  market: ["ebMarketMap"],
  compare: ["ebCompare"],
  risk: ["ebRiskGrid"],
  roadmap: ["ebRoadmap"],
  quote: ["ebQuote"],
  recommendation: ["ebRecommendation"],
  closing: ["ebClosing", "ebClosingB"],
};

const MIDDLE_SLOT_TYPES = [
  "kpi",
  "market",
  "compare",
  "risk",
  "roadmap",
  "quote",
];

function pickVariant(slotType: string): string {
  const pool = VARIANT_POOLS[slotType];
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildExecutiveBoardroomLayouts(n: number): string[] {
  const count = Math.max(5, Math.min(15, n));
  if (count === 5) {
    return [
      pickVariant("cover"),
      pickVariant("summary"),
      pickVariant("decision"),
      pickVariant("recommendation"),
      pickVariant("closing"),
    ];
  }

  const middleCount = count - 2;
  const required = ["agenda", "summary", "decision", "recommendation"];
  const remaining = Math.max(0, middleCount - required.length);
  const shuffledTypes = shuffle([...MIDDLE_SLOT_TYPES]);
  const middle = [
    ...required.map(pickVariant),
    ...Array.from({ length: remaining }).map((_, i) => pickVariant(shuffledTypes[i % shuffledTypes.length])),
  ];

  return [
    pickVariant("cover"),
    ...middle,
    pickVariant("closing"),
  ];
}

const SLIDE_CONTENT: Record<string, string> = {
  ebCover: `    { "layout": "ebCover", "heading": "boardroom deck title", "subheading": "specific decision context", "label": "business category", "quote": "short executive framing line", "imageQuery": "short topic-specific business image search" }`,
  ebCoverB: `    { "layout": "ebCoverB", "heading": "boardroom deck title", "subheading": "specific decision context", "label": "business category", "quote": "short executive framing line", "imageQuery": "short topic-specific business image search" }`,
  ebAgenda: `    { "layout": "ebAgenda", "heading": "board agenda", "body": "2-3 sentence paragraph explaining how the briefing moves from context to decision", "label": "business category", "points": ["specific agenda section", "specific agenda section", "specific agenda section", "specific agenda section"] }`,
  ebAgendaB: `    { "layout": "ebAgendaB", "heading": "decision route", "body": "2-3 sentence paragraph explaining how the briefing moves from context to decision", "label": "business category", "points": ["specific agenda section", "specific agenda section", "specific agenda section", "specific agenda section"] }`,
  ebExecutiveSummary: `    { "layout": "ebExecutiveSummary", "heading": "executive summary", "subheading": "readout label", "body": "rich 2-3 sentence summary of the situation, pressure, and leadership decision", "label": "business category", "points": ["specific summary point", "specific summary point", "specific summary point"] }`,
  ebExecutiveSummaryB: `    { "layout": "ebExecutiveSummaryB", "heading": "executive readout", "body": "rich 2-3 sentence summary of the situation, pressure, and leadership decision", "label": "business category", "points": ["specific summary point", "specific summary point", "specific summary point", "specific summary point"] }`,
  ebDecisionMemo: `    { "layout": "ebDecisionMemo", "heading": "decision memo", "subheading": "reasons to move label", "quote": "reasons to pause label", "body": "2-3 sentence decision framing paragraph with tradeoffs and constraints", "label": "business category", "leftPoints": ["specific upside", "specific upside", "specific upside"], "rightPoints": ["specific risk", "specific risk", "specific risk"] }`,
  ebKpi: `    { "layout": "ebKpi", "heading": "board metrics", "body": "2-3 sentence explanation of what the metrics reveal and why leaders should track them", "label": "business category", "stats": [{ "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }] }`,
  ebKpiB: `    { "layout": "ebKpiB", "heading": "KPI dashboard", "body": "2-3 sentence explanation of what the metrics reveal and why leaders should track them", "label": "business category", "stats": [{ "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }] }`,
  ebMarketMap: `    { "layout": "ebMarketMap", "heading": "market map", "body": "2-3 sentence paragraph explaining the market forces shaping the decision", "label": "business category", "points": ["specific market force", "specific market force", "specific market force", "specific market force"] }`,
  ebCompare: `    { "layout": "ebCompare", "heading": "strategic options", "subheading": "specific option A", "quote": "specific option B", "label": "business category", "leftPoints": ["specific advantage", "specific advantage", "specific advantage"], "rightPoints": ["specific advantage", "specific advantage", "specific advantage"] }`,
  ebRiskGrid: `    { "layout": "ebRiskGrid", "heading": "risk register", "body": "2-3 sentence paragraph distinguishing operating risks from strategic risks", "label": "business category", "points": ["specific risk", "specific risk", "specific risk", "specific risk"] }`,
  ebRoadmap: `    { "layout": "ebRoadmap", "heading": "execution roadmap", "body": "2-3 sentence paragraph explaining the staged implementation logic", "label": "business category", "steps": ["specific phase", "specific phase", "specific phase", "specific phase"] }`,
  ebQuote: `    { "layout": "ebQuote", "heading": "source or theme", "quote": "memorable executive takeaway", "author": "specific source or role", "body": "short paragraph explaining what the takeaway means for the decision", "label": "business category" }`,
  ebRecommendation: `    { "layout": "ebRecommendation", "heading": "recommended move", "body": "2-3 sentence recommendation that names the action, why now, and the expected business effect", "label": "business category", "points": ["specific action", "specific owner", "specific review checkpoint"] }`,
  ebClosing: `    { "layout": "ebClosing", "heading": "final decision", "body": "2-3 sentence closing synthesis with ownership, timing, and next checkpoint", "label": "business category", "points": ["specific takeaway", "specific next step", "specific owner"] }`,
  ebClosingB: `    { "layout": "ebClosingB", "heading": "final decision", "body": "2-3 sentence closing synthesis with ownership, timing, and next checkpoint", "label": "business category", "quote": "short closing line" }`,
};

export const EXECUTIVE_BOARDROOM_PROMPT = buildExecutiveBoardroomPrompt(11);

export function buildExecutiveBoardroomPrompt(n: number): string {
  const count = Math.max(5, Math.min(15, n));
  const layouts = buildExecutiveBoardroomLayouts(count);
  const slidesJson = layouts.map((l) => SLIDE_CONTENT[l] ?? `    { "layout": "${l}" }`).join(",\n");

  return `
You are a senior strategy consultant and board presentation designer creating a polished Executive Boardroom deck.
The style is premium and decision-oriented: charcoal canvas, warm executive panels, gold/blue/rust accents, strategy memos, KPI cards, risk grids, roadmaps, and readable narrative text.
Adapt the deck to the user's prompt: business strategy, market research, startup planning, product strategy, finance, operations, technology, leadership, public policy, or any topic that needs an executive briefing.
Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise executive deck title",
  "theme": {
    "dark": "#111827",
    "accent": "#C9A227",
    "surface": "#F6F1E8"
  },
  "slides": [
${slidesJson}
  ]
}

RULES:
1. Keep theme colors exactly: dark=#111827, accent=#C9A227, surface=#F6F1E8.
2. Use the exact layout IDs in the exact order shown above.
3. Create exactly ${count} slides.
4. This is not a school lesson, not a generic pitch deck, and not a visual-only deck. It is a decision-ready executive briefing.
5. Include meaningful body text on at least ${Math.max(4, Math.round(count * 0.82))} slides. Body text should be readable mini-paragraphs, usually 2-3 sentences.
6. Do not make slides only bullets. Use body text to explain stakes, tradeoffs, causality, financial impact, operating constraints, and the decision needed.
7. STRICT character limits:
   - heading: max 42 chars; prefer 2-6 words
   - label: max 24 chars
   - subheading / quote / author: max 90 chars
   - body: 170-300 chars on agenda, summary, memo, metrics, market map, risks, roadmap, recommendation, and closing slides; max 115 chars on cover
   - points[] / steps[] / leftPoints[] / rightPoints[]: each item max 34 chars
   - stats[].value: max 9 chars
   - stats[].label: max 30 chars
   - imageQuery: max 58 chars, plain words only
8. Image queries must be short and topic-specific. Prefer the actual business domain over generic filler.
   - Good: "digital banking team", "cloud infrastructure dashboard", "coffee shop customers", "solar energy operations"
   - Bad: "strategy", "innovation", "success", "executive", "boardroom"
9. Never output placeholder labels like "Context", "Insight", "Observation", "Implication", "Risk", "Decision", "Next step", or "Benefit" as final content. Make every item specific to the user's topic.
10. Use realistic but non-fabricated numbers when common knowledge fits; otherwise use qualitative signals instead of fake precision.
11. Do not include markdown, bullets, LaTeX delimiters, or code fences inside fields.
12. NEVER use "..." or ellipsis in any field. Write complete, short text. If a phrase is too long, shorten it — do not truncate with dots.
13. NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. No two slides should share the same thesis, examples, or data points. Plan the content arc first: divide the topic into unique facets and assign one per slide.
14. Include "icon" field on each slide with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe").
15. For slides with points/steps/stats arrays, include "icons" array with one Lucide icon name per item.
`.trim();
}
