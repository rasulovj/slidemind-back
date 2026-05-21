export const EDITORIAL_MAGAZINE_LAYOUTS = [
  "emCover",
  "emFeatureOpener",
  "emDataStory",
  "emInterview",
  "emSidebarFeature",
  "emPhotoEssay",
  "emQuoteSpread",
  "emListFeature",
  "emSectionBreak",
  "emConclusion",
];

const VARIANT_POOLS: Record<string, string[]> = {
  cover: ["emCover", "emCoverBold", "emCoverMinimal"],
  opener: ["emFeatureOpener", "emFeatureOpenerWide"],
  data: ["emDataStory"],
  interview: ["emInterview"],
  sidebar: ["emSidebarFeature"],
  photo: ["emPhotoEssay"],
  quote: ["emQuoteSpread"],
  list: ["emListFeature"],
  section: ["emSectionBreak"],
  conclusion: ["emConclusion"],
};

const MIDDLE_SLOT_TYPES = [
  "opener",
  "data",
  "interview",
  "sidebar",
  "photo",
  "quote",
  "list",
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

export function buildEditorialMagazineLayouts(n: number): string[] {
  const count = Math.max(5, Math.min(15, n));

  if (count === 5) {
    return [
      pickVariant("cover"),
      pickVariant("opener"),
      pickVariant("data"),
      pickVariant("quote"),
      pickVariant("conclusion"),
    ];
  }

  if (count <= 7) {
    return [
      pickVariant("cover"),
      pickVariant("opener"),
      pickVariant("data"),
      pickVariant("sidebar"),
      pickVariant("quote"),
      ...(count > 6 ? [pickVariant("photo")] : []),
      pickVariant("conclusion"),
    ];
  }

  const middleCount = count - 2;

  // Always include opener (sets the tone)
  const required = ["opener"];

  // Text-heavy features (50%)
  const textTypes = ["sidebar", "interview", "list"];

  // Visual + data (30%)
  const visualTypes = ["photo", "data"];

  // Impact moments (20%)
  const impactTypes = ["quote", "section"];

  const remaining = middleCount - required.length;
  const textCount = Math.min(3, Math.floor(remaining * 0.5));
  const visualCount = Math.min(2, Math.floor(remaining * 0.3));
  const impactCount = remaining - textCount - visualCount;

  const shuffledText = shuffle([...textTypes]);
  const shuffledVisual = shuffle([...visualTypes]);
  const shuffledImpact = shuffle([...impactTypes]);

  const middle = [
    ...required.map(pickVariant),
    ...Array.from({ length: textCount }).map((_, i) => pickVariant(shuffledText[i % shuffledText.length])),
    ...Array.from({ length: visualCount }).map((_, i) => pickVariant(shuffledVisual[i % shuffledVisual.length])),
    ...Array.from({ length: impactCount }).map((_, i) => pickVariant(shuffledImpact[i % shuffledImpact.length])),
  ];

  return [
    pickVariant("cover"),
    ...middle,
    pickVariant("conclusion"),
  ];
}

const SLIDE_CONTENT: Record<string, string> = {
  emCover: `    { "layout": "emCover", "heading": "magazine feature title (2-8 words)", "subheading": "deck or subtitle (10-20 words)", "label": "section name", "author": "byline name", "quote": "issue or date", "imageQuery": "editorial cover image search" }`,
  emCoverBold: `    { "layout": "emCoverBold", "heading": "bold magazine title (2-8 words)", "subheading": "engaging deck (10-20 words)", "label": "kicker or category", "imageQuery": "striking editorial image" }`,
  emCoverMinimal: `    { "layout": "emCoverMinimal", "heading": "clean magazine title (2-8 words)", "subheading": "thoughtful deck (10-20 words)", "label": "section or theme", "quote": "volume and issue info" }`,
  emFeatureOpener: `    { "layout": "emFeatureOpener", "heading": "feature headline (3-10 words)", "subheading": "engaging deck or lede (12-25 words)", "body": "rich opening paragraph (200-350 words) that hooks readers and sets up the story with context, stakes, and compelling details", "quote": "pull quote highlighting key insight (15-30 words)", "label": "section name" }`,
  emFeatureOpenerWide: `    { "layout": "emFeatureOpenerWide", "heading": "feature headline (3-10 words)", "subheading": "kicker or category", "body": "expansive opening text (300-500 words) spread across three columns, providing deep context, multiple perspectives, or comprehensive background that readers need before diving deeper", "label": "section name" }`,
  emDataStory: `    { "layout": "emDataStory", "heading": "data-driven headline (3-8 words)", "body": "analytical text (200-300 words) explaining what the numbers mean, why they matter, and what conclusions readers should draw", "stats": [{ "value": "84%", "label": "what this percentage represents and why it matters (8-15 words)" }, { "value": "2.4x", "label": "what this multiplier shows (8-15 words)" }], "label": "section name" }`,
  emInterview: `    { "layout": "emInterview", "heading": "interviewee name or title", "subheading": "role or description (8-15 words)", "author": "interviewee name", "quote": "short bio or context", "body": "answer text (50-80 words per answer)", "points": ["question 1 (8-15 words)", "question 2 (8-15 words)", "question 3 (8-15 words)"], "label": "section name" }`,
  emSidebarFeature: `    { "layout": "emSidebarFeature", "heading": "main story headline (3-8 words)", "subheading": "sidebar title (3-6 words)", "body": "main narrative text (250-300 words) telling the primary story with depth and detail", "quote": "sidebar content (100-150 words) providing related context, parallel story, or expert commentary", "label": "section name" }`,
  emPhotoEssay: `    { "layout": "emPhotoEssay", "heading": "photo essay title (3-8 words)", "body": "rich caption (150-250 words) providing context, backstory, technical details, or explaining what viewers are seeing and why it matters", "imageQuery": "primary wide shot image search (3-8 words)", "subheading": "detail/closeup image search (3-8 words, different from main)", "author": "context/establishing shot search (3-8 words, different from both)", "label": "section name" }`,
  emQuoteSpread: `    { "layout": "emQuoteSpread", "quote": "powerful quote or insight (20-40 words) that deserves full-page treatment", "author": "attribution or source context", "heading": "optional context label", "body": "supporting text (150-200 words) explaining where this quote comes from, why it matters, what it reveals about the larger story", "label": "section name" }`,
  emListFeature: `    { "layout": "emListFeature", "heading": "list headline with number (e.g. 'Four Key Insights')", "subheading": "introductory context (12-20 words)", "body": "explanation text for list items (40-60 words per item)", "points": ["first insight or principle (5-10 words)", "second key observation (5-10 words)", "third important element (5-10 words)", "fourth critical factor (5-10 words)"], "label": "section name" }`,
  emSectionBreak: `    { "layout": "emSectionBreak", "heading": "chapter or section title (2-6 words)", "subheading": "transition or theme description (10-18 words)", "label": "section name or chapter label" }`,
  emConclusion: `    { "layout": "emConclusion", "heading": "concluding headline (2-6 words)", "subheading": "optional kicker", "body": "wrap-up text (250-350 words) synthesizing insights, looking forward, or reflecting on implications across three columns", "points": ["first key takeaway (6-12 words)", "second important lesson (6-12 words)", "final thought or reflection (6-12 words)"], "label": "section name" }`,
};

export const EDITORIAL_MAGAZINE_PROMPT = buildEditorialMagazinePrompt(11);

export function buildEditorialMagazinePrompt(n: number): string {
  const count = Math.max(5, Math.min(15, n));
  const layouts = buildEditorialMagazineLayouts(count);
  const slidesJson = layouts.map((l) => SLIDE_CONTENT[l] ?? `    { "layout": "${l}" }`).join(",\n");

  return `
You are a senior magazine editor and art director creating a high-end Editorial Magazine feature.
Think Wired, Bloomberg Businessweek, The New Yorker, or The Atlantic — sophisticated long-form journalism with stunning visual design.
This is text-rich editorial content, but every slide must still fit cleanly on a 16:9 canvas.
Write like a professional journalist: vivid, specific, well-reported, with compelling narrative voice.
Return ONLY valid JSON.

Output schema:
{
  "title": "string — magazine feature title (2-8 words)",
  "theme": {
    "dark": "#0A0A0A",
    "accent": "#0066FF",
    "surface": "#FFFFFF"
  },
  "slides": [
${slidesJson}
  ]
}

**CRITICAL: Every slide object with an imageQuery field shown above MUST include that field with a specific 3-8 word visual search query. Never omit imageQuery fields from layouts that show them.**

EDITORIAL WRITING RULES:
1. Keep theme colors exactly: dark=#0A0A0A, accent=#0066FF, surface=#FFFFFF.
2. Use the exact layout IDs in the exact order shown above.
3. Create exactly ${count} slides.
4. **CRITICAL - IMAGE QUERIES ARE MANDATORY**:
   - If the slide example shows an "imageQuery" field, you MUST provide it
   - Layouts requiring imageQuery: emCover, emCoverBold, emPhotoEssay
   - Each imageQuery must be 3-8 specific visual words (e.g., "startup team brainstorming session")
   - Generic terms like "business" or "technology" are NOT acceptable
   - For emPhotoEssay: provide THREE different imageQuery values using imageQuery, subheading, and author fields
   - **Omitting imageQuery from these layouts will result in failed generation**
5. Write like a professional magazine journalist:
   - Use vivid, specific language with concrete details
   - Show don't tell: use scenes, anecdotes, sensory details
   - Active voice, present tense where appropriate
   - Varied sentence structure (mix short punchy sentences with longer flowing ones)
   - No corporate jargon, no buzzwords, no clichés
6. Body text is substantial but bounded:
   - opener/sidebar/conclusion: 90-150 words
   - data story/photo essay: 70-120 words
   - interview answer text: 90-140 words total, not per question
   - Each paragraph should be readable, flowing prose that can fit without clipping
7. Include body text on at least ${Math.max(5, Math.round(count * 0.85))} slides.
8. Headlines should be:
   - Specific and intriguing (not generic)
   - 2-10 words max
   - Can be provocative, poetic, or precise (but never clickbait)
   - Examples: "The Cost of Speed", "Why Everyone Got It Wrong", "Inside the Machine"
9. STRICT character limits:
   - heading: 2-10 words (max 60 chars)
   - subheading/deck: 10-25 words (max 150 chars)
   - body: 220-650 chars depending on layout; never exceed 750 chars
   - points[] (interview Q, list items): 5-15 words each (max 90 chars)
   - quote (pull quote): 15-40 words (max 220 chars)
   - stats[].value: max 8 chars
   - stats[].label: 8-15 words (max 95 chars)
   - **imageQuery: 3-8 words REQUIRED for image layouts, specific and visual (max 50 chars)**
10. Image queries must be editorial and specific:
   - Good: "startup founders in warehouse office", "climate protest march crowd", "AI chip manufacturing closeup"
   - Bad: "business", "success", "technology", "teamwork", "innovation"
   - **MANDATORY for**: emCover, emCoverBold, emCoverMinimal, emPhotoEssay
11. For emPhotoEssay layout, provide THREE DIFFERENT image queries:
   - imageQuery: wide shot / main scene (e.g., "warehouse distribution center wide view")
   - subheading: detail / closeup (e.g., "worker hands sorting packages closeup")
   - author: context / establishing shot (e.g., "loading dock exterior trucks")
   - Never repeat the same search terms
10. For interview layout, write CONVERSATIONAL questions and answers:
    - Questions are direct and journalistic ("What drives your approach?" not "Please elaborate on...")
    - Answers sound like real speech (contractions, personality, not formal)
11. Pull quotes should be MEMORABLE and INSIGHT-RICH:
    - Not just a sentence lifted from body text
    - Should make reader want to read the full piece
    - Can be provocative, surprising, or beautifully stated
12. Data story layout requires ANALYTICAL voice:
    - Don't just state the numbers
    - Explain what caused them, what they reveal, why they matter
    - Connect data to human impact
13. Photo essay captions are RICH and CONTEXTUAL:
    - Not just describing what's visible
    - Backstory, technical context, why this moment matters
    - Can be narrative (tells a mini-story)
14. Section breaks can be poetic or thematic, not just "Part 2"
15. Do NOT include markdown, bullet points, LaTeX, or code fences inside fields.
16. Do NOT use placeholder content. Every field must be specific to the user's topic.

CONTENT INTEGRITY:
- NEVER use "..." or ellipsis in any field. Write complete, short text. If a phrase is too long, shorten it — do not truncate with dots.
- NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. No two slides should share the same thesis, examples, or data points. Plan the content arc first: divide the topic into unique facets and assign one per slide.

ICONS:
- Include "icon" field on each slide with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe").
- For slides with points/steps/stats arrays, include "icons" array with one Lucide icon name per item.

VOICE AND TONE:
- Authoritative but not academic
- Engaging but not breathless
- Sophisticated but not pretentious
- Can be: investigative, reflective, analytical, narrative, or provocative
- NEVER: corporate, salesy, generic, or surface-level
`.trim();
}
