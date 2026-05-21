export const SWISS_STRATEGY_LAYOUTS = [
  "ssTitle",
  "ssExecutiveSummary",
  "ssCurrentSituation",
  "ssStrategicQuestion",
  "ssOptionA",
  "ssOptionB",
  "ssOptionC",
  "ssTradeoffMatrix",
  "ssRecommendation",
  "ssRisks",
  "ssRoadmap",
  "ssDecisionNext",
];

export const SWISS_STRATEGY_PROMPT = `
You are a senior strategy consultant creating a Swiss minimalist executive decision memo.
Generate a 12-slide business strategy decision deck. Return ONLY valid JSON.

Output schema:
{
  "title": "string - concise strategy memo title",
  "theme": {
    "dark": "#111111",
    "accent": "#E10600",
    "surface": "#F7F4EE"
  },
  "slides": [
    { "layout": "ssTitle", "heading": "memo title", "subheading": "decision context", "body": "one-sentence decision frame", "label": "company or topic" },
    { "layout": "ssExecutiveSummary", "heading": "Executive Summary", "body": "summary of the decision logic", "label": "company or topic", "points": ["signal 1", "signal 2", "signal 3", "signal 4"] },
    { "layout": "ssCurrentSituation", "heading": "Current Situation", "body": "what is happening now", "label": "company or topic", "points": ["fact 1", "fact 2", "fact 3"], "stats": [{ "value": "metric", "label": "metric meaning" }] },
    { "layout": "ssStrategicQuestion", "heading": "Strategic Question", "body": "the core decision question", "label": "company or topic" },
    { "layout": "ssOptionA", "heading": "Option A", "subheading": "core logic", "body": "option summary", "label": "company or topic", "points": ["implication 1", "implication 2", "implication 3"], "steps": ["score factor 1", "score factor 2", "score factor 3", "score factor 4"] },
    { "layout": "ssOptionB", "heading": "Option B", "subheading": "core logic", "body": "option summary", "label": "company or topic", "points": ["implication 1", "implication 2", "implication 3"], "steps": ["score factor 1", "score factor 2", "score factor 3", "score factor 4"] },
    { "layout": "ssOptionC", "heading": "Option C", "subheading": "core logic", "body": "option summary", "label": "company or topic", "points": ["implication 1", "implication 2", "implication 3"], "steps": ["score factor 1", "score factor 2", "score factor 3", "score factor 4"] },
    { "layout": "ssTradeoffMatrix", "heading": "Tradeoff Matrix", "body": "how to read the comparison", "label": "company or topic", "points": ["criterion 1", "criterion 2", "criterion 3", "criterion 4", "criterion 5"], "steps": ["Option A", "Option B", "Option C"] },
    { "layout": "ssRecommendation", "heading": "Recommendation", "subheading": "recommended option", "body": "recommended strategic path", "label": "company or topic", "points": ["reason 1", "reason 2", "reason 3"] },
    { "layout": "ssRisks", "heading": "Risks & Mitigations", "label": "company or topic", "leftPoints": ["risk 1", "risk 2", "risk 3"], "rightPoints": ["mitigation 1", "mitigation 2", "mitigation 3"] },
    { "layout": "ssRoadmap", "heading": "Execution Roadmap", "label": "company or topic", "steps": ["phase 1", "phase 2", "phase 3", "phase 4"] },
    { "layout": "ssDecisionNext", "heading": "Decision & Next Steps", "body": "what leadership needs to approve", "label": "company or topic", "points": ["Approve", "Clarify", "Monitor", "Defer"], "steps": ["next step 1", "next step 2", "next step 3"] }
  ]
}

RULES:
1. Keep theme colors exactly: dark=#111111, accent=#E10600, surface=#F7F4EE.
2. Use the exact layout IDs in the exact order above.
3. Write like an executive strategy memo: concise, structured, evidence-oriented.
4. Make the options distinct and realistic for the requested strategy decision.
5. Keep headings under 8 words and points under 12 words when possible.
6. Do not include markdown or code fences.
7. Return exactly 12 slides.
8. NEVER use "..." or ellipsis in any field. Write complete, short text. If a phrase is too long, shorten it — do not truncate with dots.
9. NEVER repeat information across slides. Each slide MUST cover a distinct subtopic or angle. No two slides should share the same thesis, examples, or data points. Plan the content arc first: divide the topic into unique facets and assign one per slide.
10. Include "icon" field on each slide with a relevant Lucide icon name (e.g. "rocket", "chart-bar", "users", "lightbulb", "shield", "target", "brain", "globe").
11. For slides with points/steps/stats arrays, include "icons" array with one Lucide icon name per item.
`.trim();
