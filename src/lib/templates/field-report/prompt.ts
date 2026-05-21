export const FIELD_REPORT_LAYOUTS = [
  "frCover",
  "frAgenda",
  "frMethodology",
  "frBrief",
  "frFinding",
  "frPhotoEvidence",
  "frWitnessAccount",
  "frFieldNotes",
  "frInvestigationSequence",
  "frTimeline",
  "frPhotographicEssay",
  "frVoicesFromField",
  "frCompare",
  "frStats",
  "frCaseStudy",
  "frQuote",
  "frClosing",
];

const VARIANT_POOLS: Record<string, string[]> = {
  cover: ["frCover", "frCoverB", "frCoverC"],
  agenda: ["frAgenda", "frAgendaB"],
  methodology: ["frMethodology"],
  brief: ["frBrief", "frBriefB"],
  finding: ["frFinding", "frFindingB"],
  photo: ["frPhotoEvidence", "frPhotoEvidenceB", "frPhotographicEssay"],
  witness: ["frWitnessAccount"],
  fieldNotes: ["frFieldNotes"],
  investigation: ["frInvestigationSequence"],
  timeline: ["frTimeline", "frTimelineB", "frMapProcess"],
  voices: ["frVoicesFromField"],
  compare: ["frCompare", "frCompareB"],
  stats: ["frStats", "frStatsB"],
  caseStudy: ["frCaseStudy", "frCaseStudyB"],
  quote: ["frQuote", "frQuoteB"],
  closing: ["frClosing", "frClosingB"],
};

const MIDDLE_SLOT_TYPES = [
  "brief",
  "finding",
  "photo",
  "witness",
  "fieldNotes",
  "investigation",
  "timeline",
  "voices",
  "caseStudy",
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

export function buildFieldReportLayouts(n: number): string[] {
  const count = Math.max(5, Math.min(15, n));
  if (count === 5) {
    return [
      pickVariant("cover"),
      pickVariant("brief"),
      pickVariant("finding"),
      pickVariant("photo"),
      pickVariant("closing"),
    ];
  }

  if (count <= 7) {
    return [
      pickVariant("cover"),
      pickVariant("agenda"),
      pickVariant("brief"),
      pickVariant("finding"),
      pickVariant("photo"),
      ...(count > 6 ? [pickVariant("witness")] : []),
      pickVariant("closing"),
    ];
  }

  const middleCount = count - 2;
  // Narrative-focused: always include methodology, witness/voices, and field evidence
  const required = ["agenda", "methodology", "brief", "finding"];
  const narrativeTypes = ["witness", "fieldNotes", "voices", "investigation"];
  const evidenceTypes = ["photo", "caseStudy"];

  const remaining = Math.max(0, middleCount - required.length);
  const narrativeCount = Math.min(2, Math.floor(remaining * 0.5));
  const evidenceCount = Math.min(2, Math.floor(remaining * 0.3));
  const otherCount = remaining - narrativeCount - evidenceCount;

  const shuffledNarrative = shuffle([...narrativeTypes]);
  const shuffledEvidence = shuffle([...evidenceTypes]);
  const shuffledOther = shuffle(["timeline", "compare", "stats", "quote"]);

  const middle = [
    ...required.map(pickVariant),
    ...Array.from({ length: narrativeCount }).map((_, i) => pickVariant(shuffledNarrative[i % shuffledNarrative.length])),
    ...Array.from({ length: evidenceCount }).map((_, i) => pickVariant(shuffledEvidence[i % shuffledEvidence.length])),
    ...Array.from({ length: otherCount }).map((_, i) => pickVariant(shuffledOther[i % shuffledOther.length])),
  ];

  return [
    pickVariant("cover"),
    ...middle,
    pickVariant("closing"),
  ];
}

const SLIDE_CONTENT: Record<string, string> = {
  frCover: `    { "layout": "frCover", "heading": "report title", "subheading": "specific angle or promise", "label": "topic category", "quote": "short framing line", "imageQuery": "short topic-specific image search phrase" }`,
  frCoverB: `    { "layout": "frCoverB", "heading": "report title", "subheading": "specific angle or promise", "label": "topic category", "quote": "short framing line", "imageQuery": "short topic-specific image search phrase" }`,
  frCoverC: `    { "layout": "frCoverC", "heading": "report title", "subheading": "specific angle or promise", "label": "topic category", "quote": "short framing line", "imageQuery": "short topic-specific image search phrase" }`,
  frAgenda: `    { "layout": "frAgenda", "heading": "report route", "body": "full 2-3 sentence paragraph explaining the report flow, what each section will prove, and why the route matters", "label": "topic category", "points": ["specific section", "specific section", "specific section", "specific section"] }`,
  frAgendaB: `    { "layout": "frAgendaB", "heading": "report route", "body": "full 2-3 sentence paragraph explaining the report flow, what each section will prove, and why the route matters", "label": "topic category", "points": ["specific section", "specific section", "specific section", "specific section"] }`,
  frBrief: `    { "layout": "frBrief", "heading": "context heading", "subheading": "field notes label", "body": "rich 2-3 sentence background paragraph that makes the deck readable", "label": "topic category", "points": ["specific context", "specific pressure", "specific consequence"] }`,
  frBriefB: `    { "layout": "frBriefB", "heading": "context heading", "subheading": "briefing note label", "body": "rich 2-3 sentence background paragraph that makes the deck readable", "label": "topic category", "quote": "short takeaway from the context" }`,
  frFinding: `    { "layout": "frFinding", "heading": "main finding", "body": "2-3 sentence explanation of the finding and why it matters", "label": "topic category", "points": ["specific signal", "specific affected group", "specific implication"] }`,
  frFindingB: `    { "layout": "frFindingB", "heading": "main finding", "body": "2-3 sentence explanation of the finding and why it matters", "label": "topic category", "points": ["specific signal", "specific cause", "specific effect"] }`,
  frPhotoEvidence: `    { "layout": "frPhotoEvidence", "heading": "visual evidence heading", "subheading": "interpretation label", "body": "paragraph interpreting what the visual shows", "label": "topic category", "imageQuery": "short topic-specific image search phrase" }`,
  frPhotoEvidenceB: `    { "layout": "frPhotoEvidenceB", "heading": "visual evidence heading", "body": "paragraph interpreting what the visual shows", "label": "topic category", "imageQuery": "short topic-specific image search phrase" }`,
  frTimeline: `    { "layout": "frTimeline", "heading": "timeline heading", "body": "full 2 sentence explanation of the sequence and what changed between phases", "label": "topic category", "steps": ["specific phase", "specific phase", "specific phase", "specific phase"] }`,
  frTimelineB: `    { "layout": "frTimelineB", "heading": "timeline heading", "body": "full 2 sentence explanation of the sequence and what changed between phases", "label": "topic category", "steps": ["specific phase", "specific phase", "specific phase", "specific phase"] }`,
  frMapProcess: `    { "layout": "frMapProcess", "heading": "process heading", "body": "full 2 sentence explanation of the route from cause to consequence", "label": "topic category", "steps": ["specific stage", "specific stage", "specific stage", "specific stage"] }`,
  frCompare: `    { "layout": "frCompare", "heading": "comparison heading", "subheading": "left side label", "quote": "right side label", "label": "topic category", "leftPoints": ["specific left point", "specific left point", "specific left point"], "rightPoints": ["specific right point", "specific right point", "specific right point"] }`,
  frCompareB: `    { "layout": "frCompareB", "heading": "tradeoff heading", "body": "full 2 sentence paragraph explaining the tradeoff and why both sides matter", "label": "topic category", "leftPoints": ["specific pressure", "specific risk", "specific constraint"], "rightPoints": ["specific response", "specific benefit", "specific decision"] }`,
  frStats: `    { "layout": "frStats", "heading": "evidence in numbers", "body": "full 2 sentence paragraph explaining what the numbers mean and what they imply", "label": "topic category", "stats": [{ "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }] }`,
  frStatsB: `    { "layout": "frStatsB", "heading": "measured signals", "body": "full 2 sentence paragraph explaining what the numbers mean and what they imply", "label": "topic category", "stats": [{ "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }, { "value": "short value", "label": "specific metric label" }] }`,
  frCaseStudy: `    { "layout": "frCaseStudy", "heading": "case study title", "body": "rich 2-3 sentence mini narrative about the example, including place, affected people or system, and why it matters", "label": "topic category", "imageQuery": "short topic-specific image search phrase", "points": ["specific observation with detail", "specific tension or pattern", "specific lesson for the report"] }`,
  frCaseStudyB: `    { "layout": "frCaseStudyB", "heading": "case study title", "body": "rich 2-3 sentence mini narrative about the example, including place, affected people or system, and why it matters", "label": "topic category", "imageQuery": "short topic-specific image search phrase", "points": ["specific observation with detail", "specific tension or pattern", "specific lesson for the report"] }`,
  frQuote: `    { "layout": "frQuote", "heading": "source or theme", "quote": "memorable line", "author": "specific source or attribution", "body": "paragraph explaining the quote's meaning", "label": "topic category", "points": ["specific clarification", "specific implication", "specific next decision"] }`,
  frQuoteB: `    { "layout": "frQuoteB", "heading": "source or theme", "quote": "memorable line", "author": "specific source or attribution", "body": "paragraph explaining the quote's meaning", "label": "topic category" }`,
  frClosing: `    { "layout": "frClosing", "heading": "final takeaway", "subheading": "conclusion label", "body": "2-3 sentence synthesis with practical next steps", "label": "topic category", "quote": "short closing line", "points": ["specific takeaway", "specific open question", "specific next step"] }`,
  frClosingB: `    { "layout": "frClosingB", "heading": "final takeaway", "body": "2-3 sentence synthesis with practical next steps", "label": "topic category", "points": ["specific takeaway", "specific open question", "specific next step"] }`,
  frWitnessAccount: `    { "layout": "frWitnessAccount", "heading": "witness perspective", "subheading": "testimony label", "quote": "direct quote from witness or participant (2-3 sentences max)", "author": "name or role of source", "body": "2-3 sentence paragraph explaining what this account reveals about the larger story", "label": "topic category" }`,
  frMethodology: `    { "layout": "frMethodology", "heading": "research methods", "subheading": "approach label", "body": "2-3 sentence paragraph explaining how evidence was gathered and validated", "label": "topic category", "points": ["specific method 1", "specific method 2", "specific method 3", "specific method 4"] }`,
  frFieldNotes: `    { "layout": "frFieldNotes", "heading": "field observations", "subheading": "journal label", "body": "2-3 sentence paragraph explaining what field notes reveal that formal data cannot", "label": "topic category", "points": ["specific observation", "specific detail", "specific pattern", "specific question"] }`,
  frInvestigationSequence: `    { "layout": "frInvestigationSequence", "heading": "investigation steps", "body": "2 sentence explanation of the investigation path from initial signal to conclusion", "label": "topic category", "steps": ["specific step 1", "specific step 2", "specific step 3", "specific step 4", "specific step 5"] }`,
  frPhotographicEssay: `    { "layout": "frPhotographicEssay", "heading": "visual documentation", "body": "2-3 sentence caption explaining what the images show and why visual evidence matters here", "label": "topic category", "imageQuery": "primary documentary image search phrase" }`,
  frVoicesFromField: `    { "layout": "frVoicesFromField", "heading": "multiple voices", "body": "2-3 sentence paragraph explaining whose voices are included and what the range of experience reveals", "label": "topic category", "points": ["perspective 1 with specific detail", "perspective 2 with specific detail", "perspective 3 with specific detail"] }`,
};

export const FIELD_REPORT_PROMPT = buildFieldReportPrompt(11);

export function buildFieldReportPrompt(n: number): string {
  const count = Math.max(5, Math.min(15, n));
  const layouts = buildFieldReportLayouts(count);
  const slidesJson = layouts.map((l) => SLIDE_CONTENT[l] ?? `    { "layout": "${l}" }`).join(",\n");

  return `
You are an investigative journalist and documentary researcher creating a narrative Field Report.
This is NOT a business deck or strategy presentation. It is evidence-led storytelling: witness accounts, field observations, photographic documentation, chronological investigation, and human voices.
Think National Geographic feature, investigative journalism, or academic ethnography — not McKinsey or startup pitch.
Adapt the report to the user's prompt: history, culture, social issues, science, environment, human rights, technology impact, or any narrative-worthy topic.
Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise report title",
  "theme": {
    "dark": "#243B53",
    "accent": "#A9472B",
    "surface": "#F4EBDD"
  },
  "slides": [
${slidesJson}
  ]
}

RULES:
1. Keep theme colors exactly: dark=#243B53, accent=#A9472B, surface=#F4EBDD.
2. Use the exact layout IDs in the exact order shown above.
3. Create exactly ${count} slides.
4. This is NARRATIVE NONFICTION, not business strategy. Write like a documentary filmmaker or investigative reporter:
   - Use real places, specific people (roles/occupations), concrete scenes
   - Show causality through chronology and evidence, not bullet-point logic
   - Include witness voices, field observations, and photographic documentation
   - Frame findings as discoveries, not recommendations
5. Include meaningful body text on at least ${Math.max(5, Math.round(count * 0.85))} slides. Body text is mini-narrative paragraphs (2-3 sentences) that tell the story.
6. Do NOT write business language: avoid "stakeholder," "leverage," "optimize," "strategic," "ROI," "KPI," "value proposition."
7. DO write documentary language: "witnessed," "documented," "traced," "revealed," "affected," "observed," "testified."
8. STRICT character limits:
   - heading: max 42 chars; prefer 2-6 words
   - label: max 24 chars
   - subheading / quote / author: max 90 chars
   - body: 170-300 chars on agenda, brief, finding, timeline, process, stats, case study, quote, and closing slides; max 110 chars on cover
   - points[] / steps[] / leftPoints[] / rightPoints[]: each item max 34 chars
   - stats[].value: max 9 chars
   - stats[].label: max 30 chars
   - imageQuery: max 58 chars, plain words only
9. Image queries must be documentary and specific — name actual places, scenes, artifacts:
   - Good: "Samarkand Registan square", "coal mining Appalachia", "refugee camp Syria border", "Amazon rainforest deforestation"
   - Bad: "strategy", "success", "innovation", "field report", "evidence", "business meeting"
10. For witness/voice slides, write quotes as if spoken by real people: conversational, specific, emotional. Not corporate-speak.
11. Never output placeholder labels like "Context", "Insight", "Observation", "Implication", "Pattern", "Lesson", "Local detail", or "Next thought" as final content. Make every item specific to the user's topic.
12. Use realistic but non-fabricated numbers when common knowledge fits; otherwise use qualitative evidence instead of fake precision.
13. Chronology matters: timeline slides should show actual sequences of events, not generic "past → present → future."
14. Do not include markdown, bullets, LaTeX delimiters, or code fences inside fields.
15. NEVER use "..." or ellipsis in any field. Write complete, short text. If a phrase is too long, shorten it — do not truncate with dots.
16. NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. No two slides should share the same thesis, examples, or data points. Plan the content arc first: divide the topic into unique facets and assign one per slide.
17. Include "icon" field on each slide with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe").
18. For slides with points/steps/stats arrays, include "icons" array with one Lucide icon name per item.
`.trim();
}
