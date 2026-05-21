export const ADAPTIVE_DESIGN_LAYOUTS = [
  "adCover",
  "adDarkCover",
  "adImageCover",
  "adBoldCover",
  "adGradientCover",
  "adMinimalCover",
  "adSplitImageCover",
  "adAgenda",
  "adSummary",
  "adEditorialBrief",
  "adStatement",
  "adBoldStatement",
  "adSplit",
  "adVisualSplit",
  "adEditorialImage",
  "adCards",
  "adProcess",
  "adMetrics",
  "adConsoleMetrics",
  "adCompare",
  "adTimeline",
  "adConsoleFlow",
  "adMatrix",
  "adCase",
  "adClosing",
  "adEditorialClosing",
  "adNumberedList",
  "adIconGrid",
  "adTwoColumn",
  "adFunnel",
  "adPyramid",
  "adProsCons",
  "adQuoteCard",
  "adBigNumber",
  "adTeamGrid",
  "adPhotoGrid",
  "adFullImage",
  "adBarChart",
  "adScorecard",
  "adGaugeMetrics",
  "adStoryBlock",
  "adHighlight",
  "adCallToAction",
  "adThankYou",
  "adCircularProcess",
  "adVerticalSteps",
  "adRoadmap",
  "adVersus",
  "adDecisionTree",
  "adSwot",
  "adSummaryClosing",
  "adContactClosing",
];

const VARIANT_POOLS: Record<string, string[]> = {
  cover: ["adCover", "adDarkCover", "adImageCover", "adBoldCover", "adGradientCover", "adMinimalCover", "adSplitImageCover"],
  agenda: ["adAgenda"],
  summary: ["adSummary", "adEditorialBrief"],
  statement: ["adStatement", "adBoldStatement", "adHighlight", "adQuoteCard"],
  split: ["adSplit", "adVisualSplit", "adTwoColumn"],
  image: ["adImageCover", "adVisualSplit", "adEditorialImage", "adPhotoGrid", "adFullImage", "adSplitImageCover"],
  cards: ["adCards", "adIconGrid", "adNumberedList"],
  process: ["adProcess", "adCircularProcess", "adVerticalSteps"],
  metrics: ["adMetrics", "adConsoleMetrics", "adBigNumber", "adBarChart", "adScorecard", "adGaugeMetrics"],
  compare: ["adCompare", "adProsCons", "adVersus", "adSwot"],
  timeline: ["adTimeline", "adRoadmap"],
  flow: ["adProcess", "adConsoleFlow", "adCircularProcess", "adFunnel"],
  matrix: ["adMatrix", "adDecisionTree", "adPyramid"],
  case: ["adCase", "adStoryBlock"],
  closing: ["adClosing", "adEditorialClosing", "adCallToAction", "adThankYou", "adSummaryClosing", "adContactClosing"],
  team: ["adTeamGrid"],
};

const STYLE_MODES: Record<string, { required: string[]; middle: string[] }> = {
  cleanGrid: {
    required: ["agenda", "summary", "split", "statement"],
    middle: ["cards", "process", "metrics", "compare", "timeline", "matrix", "case", "image"],
  },
  boldBlocks: {
    required: ["agenda", "summary", "statement", "split"],
    middle: ["image", "cards", "metrics", "compare", "flow", "case", "statement"],
  },
  softEditorial: {
    required: ["agenda", "summary", "image", "case"],
    middle: ["timeline", "split", "statement", "compare", "cards", "image", "summary"],
  },
  dataConsole: {
    required: ["agenda", "metrics", "flow", "split"],
    middle: ["matrix", "compare", "timeline", "statement", "cards", "metrics", "image"],
  },
  visualNarrative: {
    required: ["image", "summary", "statement", "case"],
    middle: ["image", "cards", "timeline", "compare", "flow", "metrics", "statement"],
  },
  analyticalDeck: {
    required: ["agenda", "metrics", "compare", "matrix"],
    middle: ["flow", "metrics", "timeline", "cards", "case", "split", "statement"],
  },
  storyDriven: {
    required: ["summary", "case", "statement", "image"],
    middle: ["timeline", "cards", "compare", "process", "case", "statement", "image"],
  },
};

function pickVariant(type: string) {
  const pool = VARIANT_POOLS[type];
  if (!pool || pool.length === 0) return "adCards";
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

function hasImageLayout(layouts: string[]) {
  return layouts.some((layout) => VARIANT_POOLS.image.includes(layout));
}

function ensureImageLayout(layouts: string[]) {
  if (hasImageLayout(layouts)) return layouts;
  const out = [...layouts];
  const replaceAt = Math.max(1, Math.min(out.length - 2, Math.floor(out.length / 2)));
  out[replaceAt] = pickVariant("image");
  return out;
}

export function buildAdaptiveDesignLayouts(n: number): string[] {
  const count = Math.max(5, Math.min(15, n));
  const modeNames = Object.keys(STYLE_MODES);
  const style = STYLE_MODES[modeNames[Math.floor(Math.random() * modeNames.length)]];

  if (count === 5) {
    return ensureImageLayout([
      pickVariant("cover"),
      pickVariant(style.required[1] ?? "summary"),
      pickVariant("image"),
      pickVariant(style.required[3] ?? "statement"),
      pickVariant("closing"),
    ]);
  }

  const middleCount = count - 2;
  const required = style.required;
  const remaining = Math.max(0, middleCount - required.length);
  const shuffled = shuffle([...style.middle]);

  return ensureImageLayout([
    pickVariant("cover"),
    ...required.map(pickVariant),
    ...Array.from({ length: remaining }).map((_, i) => pickVariant(shuffled[i % shuffled.length])),
    pickVariant("closing"),
  ]);
}

const SLIDE_CONTENT: Record<string, string> = {
  adCover: `    { "layout": "adCover", "heading": "concise deck title", "subheading": "specific promise or angle", "label": "topic category", "quote": "short memorable line" }`,
  adDarkCover: `    { "layout": "adDarkCover", "heading": "concise deck title", "subheading": "specific promise or angle", "label": "topic category" }`,
  adImageCover: `    { "layout": "adImageCover", "heading": "concise deck title", "subheading": "specific promise or angle", "label": "topic category", "imageQuery": "short concrete visual phrase for the topic" }`,
  adBoldCover: `    { "layout": "adBoldCover", "heading": "concise deck title", "subheading": "specific promise or angle", "label": "topic category" }`,
  adGradientCover: `    { "layout": "adGradientCover", "heading": "concise deck title", "subheading": "engaging subtitle", "label": "topic category" }`,
  adMinimalCover: `    { "layout": "adMinimalCover", "heading": "concise deck title", "subheading": "clean subtitle" }`,
  adSplitImageCover: `    { "layout": "adSplitImageCover", "heading": "concise deck title", "subheading": "specific promise or angle", "label": "topic category", "imageQuery": "striking visual for the topic" }`,
  adAgenda: `    { "layout": "adAgenda", "heading": "presentation route", "body": "3-4 sentence explanation of how the deck moves from context to evidence, choices, and next steps", "label": "topic category", "points": ["specific section", "specific section", "specific section", "specific section"] }`,
  adSummary: `    { "layout": "adSummary", "heading": "executive summary", "subheading": "specific readout label", "body": "3-5 sentence paragraph explaining the situation, why it matters, what changed, and what the audience should understand", "label": "topic category", "points": ["specific summary point", "specific summary point", "specific summary point"] }`,
  adEditorialBrief: `    { "layout": "adEditorialBrief", "heading": "context and meaning", "body": "3-5 sentence narrative paragraph explaining the background, current tension, and interpretation", "label": "topic category", "points": ["specific context note", "specific pressure", "specific interpretation"] }`,
  adStatement: `    { "layout": "adStatement", "heading": "key idea heading", "quote": "single sharp claim", "body": "3-4 sentence explanation of the evidence behind the claim", "label": "topic category" }`,
  adBoldStatement: `    { "layout": "adBoldStatement", "heading": "key idea heading", "quote": "single sharp claim", "body": "3-4 sentence explanation of why this changes the decision", "label": "topic category" }`,
  adSplit: `    { "layout": "adSplit", "heading": "analysis heading", "subheading": "specific left label", "quote": "specific right label", "body": "3-4 sentence framing paragraph", "label": "topic category", "leftPoints": ["specific left point", "specific left point", "specific left point"], "rightPoints": ["specific right point", "specific right point", "specific right point"] }`,
  adVisualSplit: `    { "layout": "adVisualSplit", "heading": "visual evidence", "body": "3-4 sentence explanation connecting the image to the topic", "label": "topic category", "imageQuery": "short concrete visual phrase", "points": ["specific observation", "specific meaning", "specific implication"] }`,
  adEditorialImage: `    { "layout": "adEditorialImage", "heading": "seen in context", "body": "2-3 sentence interpretation of the image", "label": "topic category", "imageQuery": "short concrete documentary visual phrase" }`,
  adCards: `    { "layout": "adCards", "heading": "priority map", "body": "3-4 sentence paragraph introducing the priorities", "label": "topic category", "points": ["specific priority", "specific priority", "specific priority", "specific priority"] }`,
  adProcess: `    { "layout": "adProcess", "heading": "process flow", "body": "3-4 sentence explanation of the sequence", "label": "topic category", "steps": ["specific step", "specific step", "specific step", "specific step"] }`,
  adMetrics: `    { "layout": "adMetrics", "heading": "signal dashboard", "body": "3-4 sentence explanation of what the numbers show", "label": "topic category", "stats": [{ "value": "short", "label": "metric label" }, { "value": "short", "label": "metric label" }, { "value": "short", "label": "metric label" }, { "value": "short", "label": "metric label" }] }`,
  adConsoleMetrics: `    { "layout": "adConsoleMetrics", "heading": "signal console", "body": "3-4 sentence explanation of what the indicators show", "label": "topic category", "stats": [{ "value": "short", "label": "metric label" }, { "value": "short", "label": "metric label" }, { "value": "short", "label": "metric label" }, { "value": "short", "label": "metric label" }] }`,
  adCompare: `    { "layout": "adCompare", "heading": "comparison heading", "subheading": "specific option A", "quote": "specific option B", "label": "topic category", "leftPoints": ["advantage", "constraint", "implication"], "rightPoints": ["advantage", "constraint", "implication"] }`,
  adTimeline: `    { "layout": "adTimeline", "heading": "timeline heading", "body": "3-4 sentence explanation of development over time", "label": "topic category", "steps": ["phase 1", "phase 2", "phase 3", "phase 4", "phase 5"] }`,
  adConsoleFlow: `    { "layout": "adConsoleFlow", "heading": "system flow", "body": "3-4 sentence explanation of inputs, decisions, feedback", "label": "topic category", "steps": ["signal", "pattern", "decision", "response"] }`,
  adMatrix: `    { "layout": "adMatrix", "heading": "decision matrix", "body": "3-4 sentence paragraph explaining what is being compared", "label": "topic category", "points": ["quadrant 1", "quadrant 2", "quadrant 3", "quadrant 4"] }`,
  adCase: `    { "layout": "adCase", "heading": "example in practice", "body": "3-5 sentence mini case: situation, action, result, lesson", "label": "topic category", "points": ["situation", "action", "result"] }`,
  adClosing: `    { "layout": "adClosing", "heading": "final takeaway", "body": "3-4 sentence closing synthesis", "label": "topic category", "quote": "short final line" }`,
  adEditorialClosing: `    { "layout": "adEditorialClosing", "heading": "final takeaway", "body": "3-4 sentence reflective synthesis", "label": "topic category", "quote": "short final line" }`,
  adNumberedList: `    { "layout": "adNumberedList", "heading": "list heading", "body": "brief intro sentence", "label": "topic category", "points": ["first key point", "second key point", "third key point", "fourth key point"] }`,
  adIconGrid: `    { "layout": "adIconGrid", "heading": "overview heading", "label": "topic category", "points": ["item one", "item two", "item three", "item four", "item five", "item six"] }`,
  adTwoColumn: `    { "layout": "adTwoColumn", "heading": "comparison heading", "subheading": "left column title", "quote": "right column title", "body": "brief framing sentence", "label": "topic category", "leftPoints": ["left point", "left point", "left point"], "rightPoints": ["right point", "right point", "right point"] }`,
  adFunnel: `    { "layout": "adFunnel", "heading": "funnel heading", "body": "how the process narrows", "label": "topic category", "steps": ["top stage", "middle stage", "narrow stage", "final stage"] }`,
  adPyramid: `    { "layout": "adPyramid", "heading": "hierarchy heading", "body": "each level builds on the previous", "label": "topic category", "steps": ["foundation level", "structure level", "execution level", "excellence level"] }`,
  adProsCons: `    { "layout": "adProsCons", "heading": "tradeoff analysis", "label": "topic category", "leftPoints": ["advantage one", "advantage two", "advantage three"], "rightPoints": ["drawback one", "drawback two", "drawback three"] }`,
  adQuoteCard: `    { "layout": "adQuoteCard", "quote": "powerful memorable quote (20-40 words)", "author": "attribution", "body": "why this matters", "label": "topic category" }`,
  adBigNumber: `    { "layout": "adBigNumber", "body": "context behind the number", "label": "topic category", "stats": [{ "value": "47%", "label": "what this represents" }] }`,
  adTeamGrid: `    { "layout": "adTeamGrid", "heading": "team or roles heading", "body": "brief role description", "label": "topic category", "points": ["Role 1", "Role 2", "Role 3", "Role 4"] }`,
  adPhotoGrid: `    { "layout": "adPhotoGrid", "heading": "visual evidence", "label": "topic category", "imageQuery": "main scene photo", "subheading": "detail photo query", "quote": "context photo query" }`,
  adFullImage: `    { "layout": "adFullImage", "heading": "immersive visual title", "subheading": "caption or context", "imageQuery": "immersive full-bleed photo" }`,
  adBarChart: `    { "layout": "adBarChart", "heading": "performance overview", "body": "how the metrics compare", "label": "topic category", "stats": [{ "value": "72%", "label": "Category A" }, { "value": "58%", "label": "Category B" }, { "value": "91%", "label": "Category C" }, { "value": "45%", "label": "Category D" }] }`,
  adScorecard: `    { "layout": "adScorecard", "heading": "scorecard", "body": "key indicators at a glance", "label": "topic category", "stats": [{ "value": "92", "label": "Score A" }, { "value": "3.8x", "label": "Score B" }, { "value": "24%", "label": "Score C" }] }`,
  adGaugeMetrics: `    { "layout": "adGaugeMetrics", "heading": "status report", "label": "topic category", "stats": [{ "value": "85%", "label": "metric 1" }, { "value": "4.2", "label": "metric 2" }, { "value": "+18%", "label": "metric 3" }, { "value": "97%", "label": "metric 4" }] }`,
  adStoryBlock: `    { "layout": "adStoryBlock", "heading": "narrative heading", "body": "3-5 sentence narrative paragraph providing context and direction", "label": "topic category" }`,
  adHighlight: `    { "layout": "adHighlight", "heading": "key highlight", "body": "an important point that needs emphasis", "label": "topic category" }`,
  adCallToAction: `    { "layout": "adCallToAction", "heading": "action heading", "body": "what the audience should do next", "label": "topic category", "quote": "action button text" }`,
  adThankYou: `    { "layout": "adThankYou", "heading": "thank you or closing", "subheading": "discussion prompt", "quote": "contact info" }`,
  adCircularProcess: `    { "layout": "adCircularProcess", "heading": "cycle heading", "body": "how the process feeds back", "label": "topic category", "steps": ["stage 1", "stage 2", "stage 3", "stage 4"] }`,
  adVerticalSteps: `    { "layout": "adVerticalSteps", "heading": "step by step", "body": "clear sequence explanation", "label": "topic category", "steps": ["step one", "step two", "step three", "step four"] }`,
  adRoadmap: `    { "layout": "adRoadmap", "heading": "roadmap heading", "body": "key milestones ahead", "label": "topic category", "steps": ["Q1 milestone", "Q2 milestone", "Q3 milestone", "Q4 milestone"] }`,
  adVersus: `    { "layout": "adVersus", "subheading": "option A name", "quote": "option B name", "label": "topic category", "leftPoints": ["A advantage", "A advantage"], "rightPoints": ["B advantage", "B advantage"] }`,
  adDecisionTree: `    { "layout": "adDecisionTree", "heading": "decision logic", "body": "how to choose the right path", "label": "topic category", "points": ["if condition → action", "if condition → action", "otherwise → action"] }`,
  adSwot: `    { "layout": "adSwot", "heading": "SWOT analysis", "label": "topic category", "points": ["strength description", "weakness description", "opportunity description", "threat description"] }`,
  adSummaryClosing: `    { "layout": "adSummaryClosing", "heading": "key takeaways", "body": "what to remember", "label": "topic category", "points": ["takeaway one", "takeaway two", "takeaway three"] }`,
  adContactClosing: `    { "layout": "adContactClosing", "heading": "let's connect", "body": "reach out for collaboration", "quote": "email@example.com", "author": "Your Name" }`,
};

export const ADAPTIVE_DESIGN_PROMPT = buildAdaptiveDesignPrompt(12);

export function buildAdaptiveDesignPrompt(n: number, fixedLayouts?: string[]): string {
  const count = Math.max(5, Math.min(15, n));
  const layouts = fixedLayouts?.length ? fixedLayouts.slice(0, count) : buildAdaptiveDesignLayouts(count);
  const slidesJson = layouts.map((l) => SLIDE_CONTENT[l] ?? `    { "layout": "${l}" }`).join(",\n");
  const imageLayouts = layouts.filter((l) => VARIANT_POOLS.image.includes(l) || ["adPhotoGrid", "adFullImage"].includes(l));

  return `
You are a senior presentation designer creating a Freestyle deck.
The system has no fixed color palette: choose colors that fit the user's prompt, mood, industry, and audience.
The system is a meta-template with multiple internal visual modes: Clean Grid, Bold Blocks, Soft Editorial, Data Console, Visual Narrative, Analytical, and Story-driven.
The layouts are intentionally varied but safe: covers, agenda, summary, editorial, statements, splits, cards, process, metrics, comparison, timeline, matrix, case, funnel, pyramid, SWOT, quotes, roadmaps, and closings.
Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise title",
  "styleMode": "Clean Grid | Bold Blocks | Soft Editorial | Data Console | Visual Narrative | Analytical | Story-driven",
  "theme": {
    "dark": "#hexcolor - topic-relevant dark color",
    "accent": "#hexcolor - distinctive accent color",
    "surface": "#hexcolor - light readable surface color"
  },
  "slides": [
${slidesJson}
  ]
}

RULES:
1. Use the exact layout IDs in the exact order shown above.
2. Create exactly ${count} slides.
3. Choose a topic-specific palette:
   - dark must be a deep readable color, not pure black unless the topic calls for it
   - accent must clearly contrast with both dark and surface
   - surface must be near-white or lightly tinted so body text stays readable
   - do not reuse the fixed palettes from Chalkboard, Field Report, Clean Strategy, or Executive Boardroom unless the topic strongly demands it
4. Image rules:
   - Layouts requiring imageQuery in this deck: ${imageLayouts.length ? imageLayouts.join(", ") : "none"}
   - If a slide example above includes imageQuery, you MUST provide it.
   - If a slide example does not include imageQuery, do not add imageQuery.
   - imageQuery must be concrete, visual, and topic-specific, max 58 chars.
   - Good: "Samarkand Registan square", "students using learning app", "solar farm desert workers", "factory robot inspection".
   - Bad: "innovation", "strategy", "success", "future", "presentation", "abstract background".
5. Include meaningful explanatory body text on at least ${Math.max(4, Math.round(count * 0.85))} slides so the presentation is readable without a speaker.
6. Write content for the user's actual topic. The deck may be business, science, history, education, policy, culture, product, research, or strategy.
7. Make styleMode match the rendered layout direction implied by the layout IDs:
   - adBoldCover/adBoldStatement/adVersus -> Bold Blocks
   - adEditorialBrief/adEditorialImage/adEditorialClosing/adStoryBlock -> Soft Editorial
   - adConsoleMetrics/adConsoleFlow/adBarChart/adScorecard -> Data Console
   - image-heavy layout mix -> Visual Narrative
   - adMatrix/adDecisionTree/adSwot -> Analytical
   - adCase/adStoryBlock heavy -> Story-driven
   - otherwise -> Clean Grid
8. STRICT character limits:
   - heading: max 44 chars
   - label: max 24 chars
   - subheading / quote / author: max 120 chars
   - body: 260-520 chars, absolute max 650 chars
   - points[] / steps[] / leftPoints[] / rightPoints[]: each item max 48 chars
   - stats[].value: max 9 chars
   - stats[].label: max 30 chars
   - imageQuery: max 58 chars
9. Avoid generic placeholders like "Context", "Insight", "Benefit", "Risk", "Decision", "Next step", or "Key point". Make every phrase topic-specific.
10. Use realistic numbers only when broadly plausible. If unsure, use qualitative indicators instead of fake precision.
11. Do not include markdown, bullets, LaTeX delimiters, or code fences inside fields.
12. NEVER use "..." or ellipsis in any field. Write complete short phrases.
13. Include "icon" field on each slide with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe", "zap", "heart", "trending-up", "book-open").
14. For slides with points/steps/stats arrays, include "icons" array with one Lucide icon name per item. Use simple, common names: lowercase with hyphens.
15. NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. If the topic is "History of X", each slide should cover a DIFFERENT era, event, or theme — never restate facts from another slide. Plan the content arc before writing: divide the topic into unique facets and assign one per slide.
16. Treat the deck as a narrative arc: each slide advances the story. No two slides should share the same thesis, examples, or data points.
`.trim();
}
