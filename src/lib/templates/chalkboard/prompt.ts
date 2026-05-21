export const CHALKBOARD_LAYOUTS = [
  "cbFlexCover",
  "cbFlexAgenda",
  "cbFlexBigIdea",
  "cbFlexSplitLeft",
  "cbFlexSplitRight",
  "cbFlexCompare",
  "cbFlexProcess",
  "cbFlexEvidence",
  "cbFlexWideImage",
  "cbFlexPinnedPhoto",
  "cbFlexQuote",
  "cbFlexClosing",
];

// Variant pools: each slot type has 2-3 variants. Variant is picked randomly at generation time.
const VARIANT_POOLS: Record<string, string[]> = {
  cover:       ["cbFlexCover",       "cbFlexCoverB",       "cbFlexCoverC"],
  agenda:      ["cbFlexAgenda",      "cbFlexAgendaB"],
  bigIdea:     ["cbFlexBigIdea",     "cbFlexBigIdeaB"],
  splitLeft:   ["cbFlexSplitLeft",   "cbFlexSplitLeftB"],
  compare:     ["cbFlexCompare",     "cbFlexCompareB"],
  process:     ["cbFlexProcess",     "cbFlexProcessB"],
  evidence:    ["cbFlexEvidence",    "cbFlexEvidenceB"],
  wideImage:   ["cbFlexWideImage",   "cbFlexWideImageB"],
  pinnedPhoto: ["cbFlexPinnedPhoto", "cbFlexPinnedPhotoB"],
  quote:       ["cbFlexQuote",       "cbFlexQuoteB"],
  splitRight:  ["cbFlexSplitRight",  "cbFlexSplitRightB"],
  closing:     ["cbFlexClosing",     "cbFlexClosingB",     "cbFlexClosingC"],
};

const MIDDLE_SLOT_TYPES = [
  "bigIdea", "splitLeft", "compare", "process",
  "evidence", "wideImage", "pinnedPhoto", "quote", "splitRight",
];

function pickVariant(slotType: string): string {
  const pool = VARIANT_POOLS[slotType];
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildChalkboardLayouts(n: number): string[] {
  const count = Math.max(8, Math.min(15, n));
  const middleCount = count - 2;        // exclude cover and closing
  const agendaSlot = 1;                 // agenda always slot 2
  const needed = middleCount - agendaSlot;

  const shuffledTypes = shuffle([...MIDDLE_SLOT_TYPES]);
  const pickedMiddle: string[] = [];
  for (let i = 0; i < needed; i++) {
    pickedMiddle.push(pickVariant(shuffledTypes[i % shuffledTypes.length]));
  }

  return [
    pickVariant("cover"),
    pickVariant("agenda"),
    ...pickedMiddle,
    pickVariant("closing"),
  ];
}

export const CHALKBOARD_PROMPT = `
You are a senior presentation designer creating a professional chalkboard-style deck.
The chalkboard style is a visual treatment, not a classroom-only structure.
Adapt the story to the user's prompt: business, product, marketing, history, science, education, strategy, culture, storytelling, or any other topic.
Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise deck title",
  "theme": {
    "dark": "#102B25",
    "accent": "#F4D35E",
    "surface": "#183B31"
  },
  "slides": [
    {
      "layout": "cbFlexCover",
      "heading": "deck title",
      "subheading": "specific promise or angle of the presentation",
      "label": "topic category",
      "quote": "short memorable phrase or framing line",
      "imageQuery": "concrete visual scene for the overall topic"
    },
    {
      "layout": "cbFlexAgenda",
      "heading": "story roadmap heading",
      "body": "brief setup for the flow",
      "label": "topic category",
      "subheading": "short name for the flow",
      "points": ["section 1", "section 2", "section 3", "section 4"]
    },
    {
      "layout": "cbFlexBigIdea",
      "heading": "central claim or big idea",
      "body": "2-3 sentence explanation of why this idea matters",
      "label": "topic category",
      "points": ["supporting idea 1", "supporting idea 2", "supporting idea 3"]
    },
    {
      "layout": "cbFlexSplitLeft",
      "heading": "context or audience insight",
      "body": "2-sentence explanation of the context",
      "label": "topic category",
      "imageQuery": "concrete scene related to this context",
      "points": ["signal 1", "signal 2", "signal 3"]
    },
    {
      "layout": "cbFlexSplitRight",
      "heading": "key detail or example",
      "body": "2-sentence explanation beside the visual",
      "label": "topic category",
      "quote": "short supporting phrase",
      "imageQuery": "concrete scene for the example",
      "points": ["detail 1", "detail 2", "detail 3"]
    },
    {
      "layout": "cbFlexCompare",
      "heading": "comparison heading",
      "subheading": "left side name",
      "quote": "right side name",
      "label": "topic category",
      "leftPoints": ["left point 1", "left point 2", "left point 3"],
      "rightPoints": ["right point 1", "right point 2", "right point 3"]
    },
    {
      "layout": "cbFlexProcess",
      "heading": "process, timeline, or sequence",
      "body": "2-sentence framing for the sequence",
      "label": "topic category",
      "steps": ["step 1", "step 2", "step 3", "step 4", "step 5"]
    },
    {
      "layout": "cbFlexEvidence",
      "heading": "evidence or proof point",
      "body": "2-sentence explanation of why these signals matter",
      "label": "topic category",
      "quote": "short conclusion from the evidence",
      "stats": [
        { "value": "number or short value", "label": "metric label" },
        { "value": "number or short value", "label": "metric label" },
        { "value": "number or short value", "label": "metric label" }
      ]
    },
    {
      "layout": "cbFlexWideImage",
      "heading": "image-led moment",
      "body": "one sharp interpretation of the image",
      "label": "topic category",
      "quote": "short caption or punchline",
      "imageQuery": "wide concrete visual scene"
    },
    {
      "layout": "cbFlexPinnedPhoto",
      "heading": "field notes, example, or case",
      "body": "2-3 sentence narrative setup",
      "label": "topic category",
      "quote": "what this example shows",
      "imageQuery": "concrete scene for this case",
      "points": ["observation 1", "observation 2", "observation 3"]
    },
    {
      "layout": "cbFlexQuote",
      "heading": "source or takeaway label",
      "quote": "memorable conclusion or quote",
      "label": "topic category",
      "body": "short explanation of what the quote means in this deck",
      "author": "optional attribution or context",
      "points": ["specific context", "practical implication", "next decision"]
    },
    {
      "layout": "cbFlexClosing",
      "heading": "final takeaway",
      "body": "2-sentence summary and next move",
      "subheading": "closing phrase",
      "label": "topic category",
      "imageQuery": "concrete closing visual scene",
      "points": ["takeaway 1", "takeaway 2", "takeaway 3"]
    }
  ]
}

RULES:
1. Keep theme colors exactly: dark=#102B25, accent=#F4D35E, surface=#183B31.
2. Use the exact layout IDs in the exact order above.
3. Do not make this feel like homework unless the user's prompt explicitly asks for a lesson, worksheet, or class.
4. Match the structure to the prompt:
   - Business/strategy: use decisions, tradeoffs, market signals, next steps.
   - Product/marketing: use audience insight, positioning, benefits, proof, launch flow.
   - History/culture: use context, turning points, comparison, consequences.
   - Science/education: explain clearly, but avoid repetitive practice-task slides unless requested.
   - General topics: create a polished narrative with useful sections.
5. STRICT character limits:
   - heading: max 34 chars; prefer 2-5 words
   - label: max 22 chars
   - subheading / quote: max 82 chars
   - body: max 170 chars on slides 3, 4, 5, 7, 8, 10, and 12; max 95 chars elsewhere
   - points[] / steps[] / leftPoints[] / rightPoints[]: each item max 32 chars
   - stats[].value: max 8 chars
   - stats[].label: max 26 chars
   - imageQuery: max 58 chars, plain words only
6. Image queries should be short, topic-specific search phrases. Prefer the real subject over generic filler.
   - Good: "history of Uzbekistan", "digital economy", "coffee shop customers", "robot hand data center"
   - Bad: "strategy", "innovation", "future", "success", "next steps"
   Do not include provider names, URLs, markdown, or attribution.
7. Use realistic but non-fabricated numbers when the prompt implies public/common knowledge; otherwise use rounded illustrative signals that are clearly contextual, not fake citations.
8. Include richer explanatory body text on at least 5 slides. These should be readable mini-paragraphs, not only slogans.
9. Keep bullets short, but make body text explain the "why" or "how" so the deck is understandable without a speaker.
10. Quote/callout slides must include body text and 2-3 specific context points, not only a quote and label.
11. Do not use full-sentence headings. Put explanation in body, not heading.
12. Never output placeholder labels like "Context", "Implication", or "Next thought"; make every point specific to the user's topic.
13. Do not include markdown, bullets, LaTeX delimiters, or code fences inside fields.
14. Return exactly 12 slides.
`.trim();

// Per-layout prompt snippets used by buildChalkboardPrompt
const SLIDE_CONTENT: Record<string, string> = {
  cbFlexCover: `    { "layout": "cbFlexCover", "heading": "deck title", "subheading": "specific promise or angle of the presentation", "label": "topic category", "quote": "short memorable phrase or framing line", "imageQuery": "concrete visual scene for the overall topic" }`,
  cbFlexAgenda: `    { "layout": "cbFlexAgenda", "heading": "story roadmap heading", "body": "brief setup for the flow", "label": "topic category", "subheading": "short name for the flow", "points": ["section 1", "section 2", "section 3", "section 4"] }`,
  cbFlexBigIdea: `    { "layout": "cbFlexBigIdea", "heading": "central claim or big idea", "body": "2-3 sentence explanation of why this idea matters", "label": "topic category", "points": ["supporting idea 1", "supporting idea 2", "supporting idea 3"] }`,
  cbFlexSplitLeft: `    { "layout": "cbFlexSplitLeft", "heading": "context or audience insight", "body": "2-sentence explanation of the context", "label": "topic category", "imageQuery": "concrete scene related to this context", "points": ["signal 1", "signal 2", "signal 3"] }`,
  cbFlexSplitRight: `    { "layout": "cbFlexSplitRight", "heading": "key detail or example", "body": "2-sentence explanation beside the visual", "label": "topic category", "quote": "short supporting phrase", "imageQuery": "concrete scene for the example", "points": ["detail 1", "detail 2", "detail 3"] }`,
  cbFlexCompare: `    { "layout": "cbFlexCompare", "heading": "comparison heading", "subheading": "left side name", "quote": "right side name", "label": "topic category", "leftPoints": ["left point 1", "left point 2", "left point 3"], "rightPoints": ["right point 1", "right point 2", "right point 3"] }`,
  cbFlexProcess: `    { "layout": "cbFlexProcess", "heading": "process, timeline, or sequence", "body": "2-sentence framing for the sequence", "label": "topic category", "steps": ["step 1", "step 2", "step 3", "step 4", "step 5"] }`,
  cbFlexEvidence: `    { "layout": "cbFlexEvidence", "heading": "evidence or proof point", "body": "2-sentence explanation of why these signals matter", "label": "topic category", "quote": "short conclusion from the evidence", "stats": [{ "value": "number or short value", "label": "metric label" }, { "value": "number or short value", "label": "metric label" }, { "value": "number or short value", "label": "metric label" }] }`,
  cbFlexWideImage: `    { "layout": "cbFlexWideImage", "heading": "image-led moment", "body": "one sharp interpretation of the image", "label": "topic category", "quote": "short caption or punchline", "imageQuery": "wide concrete visual scene" }`,
  cbFlexPinnedPhoto: `    { "layout": "cbFlexPinnedPhoto", "heading": "field notes, example, or case", "body": "2-3 sentence narrative setup", "label": "topic category", "quote": "what this example shows", "imageQuery": "concrete scene for this case", "points": ["observation 1", "observation 2", "observation 3"] }`,
  cbFlexQuote: `    { "layout": "cbFlexQuote", "heading": "source or takeaway label", "quote": "memorable conclusion or quote", "label": "topic category", "body": "short explanation of what the quote means in this deck", "author": "optional attribution or context", "points": ["specific context", "practical implication", "next decision"] }`,
  cbFlexClosing: `    { "layout": "cbFlexClosing", "heading": "final takeaway", "body": "2-sentence summary and next move", "subheading": "closing phrase", "label": "topic category", "imageQuery": "concrete closing visual scene", "points": ["takeaway 1", "takeaway 2", "takeaway 3"] }`,
  cbFlexCoverB: `    { "layout": "cbFlexCoverB", "heading": "deck title", "subheading": "specific promise or angle of the presentation", "label": "topic category", "quote": "short memorable phrase or framing line", "imageQuery": "concrete visual scene for the overall topic" }`,
  cbFlexCoverC: `    { "layout": "cbFlexCoverC", "heading": "deck title", "subheading": "specific promise or angle of the presentation", "label": "topic category", "quote": "short memorable phrase or framing line", "imageQuery": "concrete visual scene for the overall topic" }`,
  cbFlexAgendaB: `    { "layout": "cbFlexAgendaB", "heading": "story roadmap heading", "body": "brief setup for the flow", "label": "topic category", "subheading": "short name for the flow", "points": ["section 1", "section 2", "section 3", "section 4"] }`,
  cbFlexBigIdeaB: `    { "layout": "cbFlexBigIdeaB", "heading": "central claim or big idea", "body": "2-3 sentence explanation of why this idea matters", "label": "topic category", "points": ["supporting idea 1", "supporting idea 2", "supporting idea 3"] }`,
  cbFlexSplitLeftB: `    { "layout": "cbFlexSplitLeftB", "heading": "context or audience insight", "body": "2-sentence explanation of the context", "label": "topic category", "imageQuery": "concrete scene related to this context", "points": ["signal 1", "signal 2", "signal 3"] }`,
  cbFlexSplitRightB: `    { "layout": "cbFlexSplitRightB", "heading": "key detail or example", "body": "2-sentence explanation beside the visual", "label": "topic category", "quote": "short supporting phrase", "imageQuery": "concrete scene for the example", "points": ["detail 1", "detail 2", "detail 3"] }`,
  cbFlexCompareB: `    { "layout": "cbFlexCompareB", "heading": "comparison heading", "subheading": "left side name", "quote": "right side name", "label": "topic category", "leftPoints": ["left point 1", "left point 2", "left point 3"], "rightPoints": ["right point 1", "right point 2", "right point 3"] }`,
  cbFlexProcessB: `    { "layout": "cbFlexProcessB", "heading": "process, timeline, or sequence", "body": "2-sentence framing for the sequence", "label": "topic category", "steps": ["step 1", "step 2", "step 3", "step 4", "step 5"] }`,
  cbFlexEvidenceB: `    { "layout": "cbFlexEvidenceB", "heading": "evidence or proof point", "body": "2-sentence explanation of why these signals matter", "label": "topic category", "quote": "short conclusion from the evidence", "author": "optional attribution", "stats": [{ "value": "number or short value", "label": "metric label" }, { "value": "number or short value", "label": "metric label" }, { "value": "number or short value", "label": "metric label" }] }`,
  cbFlexWideImageB: `    { "layout": "cbFlexWideImageB", "heading": "image-led moment", "body": "one sharp interpretation of the image", "label": "topic category", "quote": "short caption or punchline", "imageQuery": "wide concrete visual scene" }`,
  cbFlexPinnedPhotoB: `    { "layout": "cbFlexPinnedPhotoB", "heading": "field notes, example, or case", "body": "2-3 sentence narrative setup", "label": "topic category", "quote": "what this example shows", "imageQuery": "concrete scene for this case", "points": ["observation 1", "observation 2", "observation 3"] }`,
  cbFlexQuoteB: `    { "layout": "cbFlexQuoteB", "heading": "source or takeaway label", "quote": "memorable conclusion or quote", "label": "topic category", "body": "short explanation of what the quote means in this deck", "author": "optional attribution or context", "points": ["specific context", "practical implication", "next decision"] }`,
  cbFlexClosingB: `    { "layout": "cbFlexClosingB", "heading": "final takeaway", "body": "2-sentence summary and next move", "subheading": "closing phrase", "label": "topic category", "points": ["takeaway 1", "takeaway 2", "takeaway 3"] }`,
  cbFlexClosingC: `    { "layout": "cbFlexClosingC", "heading": "final takeaway", "body": "2-sentence summary and next move", "subheading": "closing phrase or thank you", "label": "topic category" }`,
};

export function buildChalkboardPrompt(n: number): string {
  const count = Math.max(8, Math.min(15, n));
  const layouts = buildChalkboardLayouts(count);
  const slidesJson = layouts.map((l) => SLIDE_CONTENT[l] ?? `    { "layout": "${l}" }`).join(",\n");

  return `
You are a senior presentation designer creating a professional chalkboard-style deck.
The chalkboard style is a visual treatment, not a classroom-only structure.
Adapt the story to the user's prompt: business, product, marketing, history, science, education, strategy, culture, storytelling, or any other topic.
Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise deck title",
  "theme": {
    "dark": "#102B25",
    "accent": "#F4D35E",
    "surface": "#183B31"
  },
  "slides": [
${slidesJson}
  ]
}

RULES:
1. Keep theme colors exactly: dark=#102B25, accent=#F4D35E, surface=#183B31.
2. Use the exact layout IDs in the exact order shown above.
3. Do not make this feel like homework unless the user's prompt explicitly asks for a lesson, worksheet, or class.
4. Match the structure to the prompt:
   - Business/strategy: use decisions, tradeoffs, market signals, next steps.
   - Product/marketing: use audience insight, positioning, benefits, proof, launch flow.
   - History/culture: use context, turning points, comparison, consequences.
   - Science/education: explain clearly, but avoid repetitive practice-task slides unless requested.
   - General topics: create a polished narrative with useful sections.
5. STRICT character limits:
   - heading: max 34 chars; prefer 2-5 words
   - label: max 22 chars
   - subheading / quote: max 82 chars
   - body: max 170 chars on content slides; max 95 chars on cover and closing
   - points[] / steps[] / leftPoints[] / rightPoints[]: each item max 32 chars
   - stats[].value: max 8 chars
   - stats[].label: max 26 chars
   - imageQuery: max 58 chars, plain words only
6. Image queries should be short, topic-specific search phrases. Prefer the real subject over generic filler.
   - Good: "history of Uzbekistan", "digital economy", "coffee shop customers", "robot hand data center"
   - Bad: "strategy", "innovation", "future", "success", "next steps"
   Do not include provider names, URLs, markdown, or attribution.
7. Use realistic but non-fabricated numbers when the prompt implies public/common knowledge; otherwise use rounded illustrative signals that are clearly contextual, not fake citations.
8. Include richer explanatory body text on at least ${Math.round(count * 0.4)} slides. These should be readable mini-paragraphs, not only slogans.
9. Keep bullets short, but make body text explain the "why" or "how" so the deck is understandable without a speaker.
10. Quote/callout slides must include body text and 2-3 specific context points, not only a quote and label.
11. Do not use full-sentence headings. Put explanation in body, not heading.
12. Never output placeholder labels like "Context", "Implication", or "Next thought"; make every point specific to the user's topic.
13. Do not include markdown, bullets, LaTeX delimiters, or code fences inside fields.
14. Return exactly ${count} slides.
15. NEVER use "..." or ellipsis in any field. Write complete, short text. If a phrase is too long, shorten it — do not truncate with dots.
16. NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. No two slides should share the same thesis, examples, or data points. Plan the content arc first: divide the topic into unique facets and assign one per slide.
17. Include "icon" field on each slide with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe").
18. For slides with points/steps/stats arrays, include "icons" array with one Lucide icon name per item.
`.trim();
}
