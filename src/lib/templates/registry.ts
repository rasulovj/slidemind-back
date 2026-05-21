import type { CanvasBuilder, LayoutMeta, Theme, SlideContent } from "./types";
import * as B from "./builders";
import * as AD from "./adaptive-design/layouts";
import * as AX from "./adaptive-design/layouts-extra";
import * as PD from "./pitch-deck";
import * as CB from "./chalkboard/layouts";
import * as CS from "./clean-strategy/layouts";
import * as EB from "./executive-boardroom/layouts";
import * as FR from "./field-report/layouts";
import * as PO from "./product-os/layouts";
import * as SS from "./swiss-strategy/layouts";
import * as EM from "./editorial-magazine/layouts";

export interface LayoutEntry {
  meta: LayoutMeta;
  build: CanvasBuilder;
}

export const LAYOUTS: Record<string, LayoutEntry> = {
  // ── INTRO ──────────────────────────────────────────────────────────────
  heroCentered: {
    meta: { id: "heroCentered", name: "Hero — Centered", category: "intro",
      description: "Full-dark title slide with centered heading and optional subtitle" },
    build: B.heroCentered,
  },
  heroSplit: {
    meta: { id: "heroSplit", name: "Hero — Split", category: "intro",
      description: "Dark left panel with title, light right panel for supplementary text" },
    build: B.heroSplit,
  },
  titleClean: {
    meta: { id: "titleClean", name: "Title — Clean", category: "intro",
      description: "Light background with left-aligned bold title and accent stripe" },
    build: B.titleClean,
  },
  coverAccent: {
    meta: { id: "coverAccent", name: "Cover — Accent", category: "intro",
      description: "Dark top 70% with bold accent color strip at the bottom" },
    build: B.coverAccent,
  },
  chapterDivider: {
    meta: { id: "chapterDivider", name: "Chapter Divider", category: "intro",
      description: "Section break with large chapter number watermark and title" },
    build: B.chapterDivider,
  },

  // ── AGENDA ─────────────────────────────────────────────────────────────
  agendaNumbered: {
    meta: { id: "agendaNumbered", name: "Agenda — Numbered", category: "agenda",
      description: "Numbered list of agenda items with accent circles" },
    build: B.agendaNumbered,
  },
  agendaPills: {
    meta: { id: "agendaPills", name: "Agenda — Pills", category: "agenda",
      description: "Agenda items as pill cards with left accent bar, one or two columns" },
    build: B.agendaPills,
  },
  sectionBreak: {
    meta: { id: "sectionBreak", name: "Section Break", category: "agenda",
      description: "Dark divider slide marking the start of a new section" },
    build: B.sectionBreak,
  },

  // ── CONTENT ────────────────────────────────────────────────────────────
  bulletsClassic: {
    meta: { id: "bulletsClassic", name: "Bullets — Classic", category: "content",
      description: "Heading + numbered bullet points with slide-number watermark" },
    build: B.bulletsClassic,
  },
  bulletsCards: {
    meta: { id: "bulletsCards", name: "Bullets — Cards", category: "content",
      description: "Each bullet rendered as a card tile, auto-layout 1–3 columns" },
    build: B.bulletsCards,
  },
  twoColEqual: {
    meta: { id: "twoColEqual", name: "Two Columns — Equal", category: "content",
      description: "Heading + two equal-width columns with bullet lists" },
    build: B.twoColEqual,
  },
  twoColWide: {
    meta: { id: "twoColWide", name: "Two Columns — Wide + Narrow", category: "content",
      description: "Wide left text area + narrow right sidebar with bullets" },
    build: B.twoColWide,
  },
  threeCol: {
    meta: { id: "threeCol", name: "Three Columns", category: "content",
      description: "Three equal columns each with a label and supporting text" },
    build: B.threeCol,
  },
  keyMessage: {
    meta: { id: "keyMessage", name: "Key Message", category: "content",
      description: "Dark slide with one bold statement at center — high impact" },
    build: B.keyMessage,
  },
  quoteLarge: {
    meta: { id: "quoteLarge", name: "Quote — Large", category: "content",
      description: "Light slide with giant typographic quote and optional attribution" },
    build: B.quoteLarge,
  },
  tipHighlight: {
    meta: { id: "tipHighlight", name: "Tip / Highlight", category: "content",
      description: "Key insight callout box with emoji icon and supporting note" },
    build: B.tipHighlight,
  },

  // ── DATA ───────────────────────────────────────────────────────────────
  singleStat: {
    meta: { id: "singleStat", name: "Single Stat", category: "data",
      description: "Dark hero slide with one massive metric front and center" },
    build: B.singleStat,
  },
  threeStats: {
    meta: { id: "threeStats", name: "Three Stats", category: "data",
      description: "Three key metrics in equal columns with label beneath each" },
    build: B.threeStats,
  },
  fourStats: {
    meta: { id: "fourStats", name: "Four Stats", category: "data",
      description: "2×2 grid of metric cards with values and labels" },
    build: B.fourStats,
  },
  progressBars: {
    meta: { id: "progressBars", name: "Progress Bars", category: "data",
      description: "Horizontal bar chart showing up to 5 categories with percentages" },
    build: B.progressBars,
  },
  timeline: {
    meta: { id: "timeline", name: "Timeline", category: "data",
      description: "Horizontal timeline with numbered milestones and step labels" },
    build: B.timeline,
  },

  // ── COMPARE ────────────────────────────────────────────────────────────
  twoColCompare: {
    meta: { id: "twoColCompare", name: "Two-Column Compare", category: "compare",
      description: "Side-by-side columns for pros vs cons or two options" },
    build: B.twoColCompare,
  },
  versus: {
    meta: { id: "versus", name: "Versus", category: "compare",
      description: "Bold A vs B layout: dark left, accent center divider, light right" },
    build: B.versus,
  },
  featureList: {
    meta: { id: "featureList", name: "Feature List", category: "compare",
      description: "Checkmark feature list, auto 1–2 column layout" },
    build: B.featureList,
  },
  beforeAfter: {
    meta: { id: "beforeAfter", name: "Before & After", category: "compare",
      description: "Before (grey) and After (accent) two-panel comparison" },
    build: B.beforeAfter,
  },

  // ── VISUAL ─────────────────────────────────────────────────────────────
  imageLeft: {
    meta: { id: "imageLeft", name: "Image — Left", category: "visual",
      description: "Image placeholder on left half, title and bullets on right" },
    build: B.imageLeft,
  },
  imageRight: {
    meta: { id: "imageRight", name: "Image — Right", category: "visual",
      description: "Title and bullets on left, image placeholder on right half" },
    build: B.imageRight,
  },
  imageFull: {
    meta: { id: "imageFull", name: "Image — Full Bleed", category: "visual",
      description: "Full-canvas image placeholder with caption overlay at bottom" },
    build: B.imageFull,
  },
  imageGrid: {
    meta: { id: "imageGrid", name: "Image Grid", category: "visual",
      description: "2×2 image placeholder grid with title above" },
    build: B.imageGrid,
  },

  // ── CLOSING ────────────────────────────────────────────────────────────
  thankYou: {
    meta: { id: "thankYou", name: "Thank You", category: "closing",
      description: "Dark closing slide with large Thank You message" },
    build: B.thankYou,
  },
  ctaBold: {
    meta: { id: "ctaBold", name: "CTA — Bold", category: "closing",
      description: "Dark slide with call-to-action headline and accent button" },
    build: B.ctaBold,
  },
  qaSlide: {
    meta: { id: "qaSlide", name: "Q&A", category: "closing",
      description: "Q&A session slide with giant question-mark watermark" },
    build: B.qaSlide,
  },
  contactInfo: {
    meta: { id: "contactInfo", name: "Contact Info", category: "closing",
      description: "Light slide listing contact details with icon rows" },
    build: B.contactInfo,
  },

  // ── PITCH DECK preset layouts ───────────────────────────────────────────
  pdCover: {
    meta: { id: "pdCover", name: "Pitch — Cover", category: "intro",
      description: "Pitch deck title slide: bold blue heading, company info, contact row" },
    build: PD.pdCover,
  },
  pdAbout: {
    meta: { id: "pdAbout", name: "Pitch — About", category: "content",
      description: "Half-image, half-text 'About Us' slide with key facts" },
    build: PD.pdAbout,
  },
  pdProblem: {
    meta: { id: "pdProblem", name: "Pitch — Problem", category: "content",
      description: "Dark navy problem slide with categories at bottom" },
    build: PD.pdProblem,
  },
  pdSolution: {
    meta: { id: "pdSolution", name: "Pitch — Solution", category: "content",
      description: "Split: image + description left, 2×2 feature grid right" },
    build: PD.pdSolution,
  },
  pdProduct: {
    meta: { id: "pdProduct", name: "Pitch — Product", category: "visual",
      description: "Product overview: text left, image + two feature cards right" },
    build: PD.pdProduct,
  },
  pdMarketSize: {
    meta: { id: "pdMarketSize", name: "Pitch — Market Size", category: "data",
      description: "Map placeholder left, three market size stats right" },
    build: PD.pdMarketSize,
  },
  pdAffirmation: {
    meta: { id: "pdAffirmation", name: "Pitch — Key Metrics", category: "data",
      description: "Dark navy slide with three large metric numbers in a row" },
    build: PD.pdAffirmation,
  },
  pdTraction: {
    meta: { id: "pdTraction", name: "Pitch — Traction", category: "data",
      description: "Growth chart placeholder left, three growth % metrics right" },
    build: PD.pdTraction,
  },
  pdCompetitive: {
    meta: { id: "pdCompetitive", name: "Pitch — Competitive Advantage", category: "compare",
      description: "Three advantage bars with progress indicators, image right" },
    build: PD.pdCompetitive,
  },
  pdTeam: {
    meta: { id: "pdTeam", name: "Pitch — Team", category: "visual",
      description: "Four team member cards with photo placeholders and roles" },
    build: PD.pdTeam,
  },
  pdThankYou: {
    meta: { id: "pdThankYou", name: "Pitch — Thank You", category: "closing",
      description: "Dark navy closing slide with large heading and contact info" },
    build: PD.pdThankYou,
  },

  // ── CHALKBOARD MASTERCLASS preset layouts ─────────────────────────────
  cbTitle: {
    meta: { id: "cbTitle", name: "Chalkboard — Title", category: "intro",
      description: "Realistic chalkboard lecture opener with title, subject tag, and chalk formulas" },
    build: CB.cbTitle,
  },
  cbObjectives: {
    meta: { id: "cbObjectives", name: "Chalkboard — Objectives", category: "agenda",
      description: "Four learning objectives as chalk note cards" },
    build: CB.cbObjectives,
  },
  cbConceptMap: {
    meta: { id: "cbConceptMap", name: "Chalkboard — Concept Map", category: "visual",
      description: "Central concept node connected to related technical ideas" },
    build: CB.cbConceptMap,
  },
  cbDefinition: {
    meta: { id: "cbDefinition", name: "Chalkboard — Definition", category: "content",
      description: "Plain-language definition with term breakdown and visual model" },
    build: CB.cbDefinition,
  },
  cbFormula: {
    meta: { id: "cbFormula", name: "Chalkboard — Formula", category: "content",
      description: "Core formula or principle with variable legend and usage note" },
    build: CB.cbFormula,
  },
  cbExampleSetup: {
    meta: { id: "cbExampleSetup", name: "Chalkboard — Example Setup", category: "content",
      description: "Worked example problem setup with givens, unknowns, and visual plane" },
    build: CB.cbExampleSetup,
  },
  cbSolutionSteps: {
    meta: { id: "cbSolutionSteps", name: "Chalkboard — Solution Steps", category: "content",
      description: "Numbered solution ladder for teacher-guided reasoning" },
    build: CB.cbSolutionSteps,
  },
  cbMistakes: {
    meta: { id: "cbMistakes", name: "Chalkboard — Mistakes", category: "compare",
      description: "Mistake versus correct method with correction marks" },
    build: CB.cbMistakes,
  },
  cbSecondExample: {
    meta: { id: "cbSecondExample", name: "Chalkboard — Second Example", category: "data",
      description: "Higher-difficulty worked example with mini chart and checkpoints" },
    build: CB.cbSecondExample,
  },
  cbPractice: {
    meta: { id: "cbPractice", name: "Chalkboard — Practice", category: "content",
      description: "Student practice prompt with hints and editable workspace grid" },
    build: CB.cbPractice,
  },
  cbTakeaways: {
    meta: { id: "cbTakeaways", name: "Chalkboard — Takeaways", category: "closing",
      description: "Key takeaways with memory hook and formula strip" },
    build: CB.cbTakeaways,
  },
  cbConclusion: {
    meta: { id: "cbConclusion", name: "Chalkboard — Conclusion", category: "closing",
      description: "Teacher-friendly conclusion with final principle and next concept preview" },
    build: CB.cbConclusion,
  },
  cbFlexCover: {
    meta: { id: "cbFlexCover", name: "Chalkboard — Cover", category: "intro",
      description: "Professional chalkboard cover with large title and flexible visual placement" },
    build: CB.cbFlexCover,
  },
  cbFlexAgenda: {
    meta: { id: "cbFlexAgenda", name: "Chalkboard — Roadmap", category: "agenda",
      description: "Story roadmap with chalk flow diagram and section list" },
    build: CB.cbFlexAgenda,
  },
  cbFlexBigIdea: {
    meta: { id: "cbFlexBigIdea", name: "Chalkboard — Big Idea", category: "content",
      description: "Large central message slide for thesis, insight, or strategic claim" },
    build: CB.cbFlexBigIdea,
  },
  cbFlexSplitLeft: {
    meta: { id: "cbFlexSplitLeft", name: "Chalkboard — Image Left", category: "visual",
      description: "Image on the left with explanatory text and bullets on the right" },
    build: CB.cbFlexSplitLeft,
  },
  cbFlexSplitRight: {
    meta: { id: "cbFlexSplitRight", name: "Chalkboard — Image Right", category: "visual",
      description: "Text and bullets on the left with a wide image on the right" },
    build: CB.cbFlexSplitRight,
  },
  cbFlexCompare: {
    meta: { id: "cbFlexCompare", name: "Chalkboard — Compare", category: "compare",
      description: "Professional two-column comparison for options, eras, segments, or tradeoffs" },
    build: CB.cbFlexCompare,
  },
  cbFlexProcess: {
    meta: { id: "cbFlexProcess", name: "Chalkboard — Process", category: "data",
      description: "Curved sequence or timeline for steps, phases, or story progression" },
    build: CB.cbFlexProcess,
  },
  cbFlexEvidence: {
    meta: { id: "cbFlexEvidence", name: "Chalkboard — Evidence", category: "data",
      description: "Three proof points or metrics with chalk-framed emphasis" },
    build: CB.cbFlexEvidence,
  },
  cbFlexWideImage: {
    meta: { id: "cbFlexWideImage", name: "Chalkboard — Wide Image", category: "visual",
      description: "Wide image-led slide with caption and chalk interpretation" },
    build: CB.cbFlexWideImage,
  },
  cbFlexPinnedPhoto: {
    meta: { id: "cbFlexPinnedPhoto", name: "Chalkboard — Pinned Photo", category: "visual",
      description: "Pinned-photo note layout for examples, field notes, or narrative cases" },
    build: CB.cbFlexPinnedPhoto,
  },
  cbFlexQuote: {
    meta: { id: "cbFlexQuote", name: "Chalkboard — Quote", category: "content",
      description: "Large chalk quote or memorable takeaway slide" },
    build: CB.cbFlexQuote,
  },
  cbFlexClosing: {
    meta: { id: "cbFlexClosing", name: "Chalkboard — Closing", category: "closing",
      description: "Professional closing slide with takeaway bullets and optional visual" },
    build: CB.cbFlexClosing,
  },
  cbFlexCoverB: {
    meta: { id: "cbFlexCoverB", name: "Chalkboard — Cover (Centered)", category: "intro",
      description: "Bold centered chalkboard cover with dramatic full-width heading" },
    build: CB.cbFlexCoverB,
  },
  cbFlexCoverC: {
    meta: { id: "cbFlexCoverC", name: "Chalkboard — Cover (Image Left)", category: "intro",
      description: "Full-height image left panel with text on right" },
    build: CB.cbFlexCoverC,
  },
  cbFlexAgendaB: {
    meta: { id: "cbFlexAgendaB", name: "Chalkboard — Roadmap (Horizontal)", category: "agenda",
      description: "Horizontal pill timeline agenda with five slots" },
    build: CB.cbFlexAgendaB,
  },
  cbFlexBigIdeaB: {
    meta: { id: "cbFlexBigIdeaB", name: "Chalkboard — Big Idea (Split)", category: "content",
      description: "Heading left column with three vertical cards on the right" },
    build: CB.cbFlexBigIdeaB,
  },
  cbFlexSplitLeftB: {
    meta: { id: "cbFlexSplitLeftB", name: "Chalkboard — Image Left (Boxed)", category: "visual",
      description: "Image left with text in a yellow roughBox on the right" },
    build: CB.cbFlexSplitLeftB,
  },
  cbFlexSplitRightB: {
    meta: { id: "cbFlexSplitRightB", name: "Chalkboard — Image Right (Boxed)", category: "visual",
      description: "Text in green roughBox left with image on the right" },
    build: CB.cbFlexSplitRightB,
  },
  cbFlexCompareB: {
    meta: { id: "cbFlexCompareB", name: "Chalkboard — Compare (Clean)", category: "compare",
      description: "Chalk line divider comparison without rough boxes for a cleaner look" },
    build: CB.cbFlexCompareB,
  },
  cbFlexProcessB: {
    meta: { id: "cbFlexProcessB", name: "Chalkboard — Process (Vertical)", category: "data",
      description: "Vertical numbered steps on the right with text on the left" },
    build: CB.cbFlexProcessB,
  },
  cbFlexEvidenceB: {
    meta: { id: "cbFlexEvidenceB", name: "Chalkboard — Evidence (Quote)", category: "data",
      description: "Stats left column with large quote panel on the right" },
    build: CB.cbFlexEvidenceB,
  },
  cbFlexWideImageB: {
    meta: { id: "cbFlexWideImageB", name: "Chalkboard — Wide Image (Right)", category: "visual",
      description: "Text left column with image filling the right full height" },
    build: CB.cbFlexWideImageB,
  },
  cbFlexPinnedPhotoB: {
    meta: { id: "cbFlexPinnedPhotoB", name: "Chalkboard — Pinned Photo (Cards)", category: "visual",
      description: "Wide image top with three note cards below" },
    build: CB.cbFlexPinnedPhotoB,
  },
  cbFlexQuoteB: {
    meta: { id: "cbFlexQuoteB", name: "Chalkboard — Quote (Attribution)", category: "content",
      description: "Large quote roughBox left with attribution panel on the right" },
    build: CB.cbFlexQuoteB,
  },
  cbFlexClosingB: {
    meta: { id: "cbFlexClosingB", name: "Chalkboard — Closing (Cards)", category: "closing",
      description: "Centered heading with three takeaway cards in the bottom row" },
    build: CB.cbFlexClosingB,
  },
  cbFlexClosingC: {
    meta: { id: "cbFlexClosingC", name: "Chalkboard — Closing (Minimal)", category: "closing",
      description: "Full board frame with huge centered heading only" },
    build: CB.cbFlexClosingC,
  },

  // ── FIELD REPORT preset layouts ──────────────────────────────────────
  frCover: {
    meta: { id: "frCover", name: "Field Report — Cover", category: "intro",
      description: "Documentary report cover with large title and photo evidence panel" },
    build: FR.frCover,
  },
  frCoverB: {
    meta: { id: "frCoverB", name: "Field Report — Cover (Image Strip)", category: "intro",
      description: "Wide photo strip cover with report title below" },
    build: FR.frCoverB,
  },
  frCoverC: {
    meta: { id: "frCoverC", name: "Field Report — Cover (Dossier)", category: "intro",
      description: "Left photo dossier cover with title and briefing note" },
    build: FR.frCoverC,
  },
  frAgenda: {
    meta: { id: "frAgenda", name: "Field Report — Route", category: "agenda",
      description: "Centered report route cards for the investigation flow" },
    build: FR.frAgenda,
  },
  frAgendaB: {
    meta: { id: "frAgendaB", name: "Field Report — Route (List)", category: "agenda",
      description: "Vertical numbered route list with report framing text" },
    build: FR.frAgendaB,
  },
  frBrief: {
    meta: { id: "frBrief", name: "Field Report — Brief", category: "content",
      description: "Readable context paragraph with side field notes" },
    build: FR.frBrief,
  },
  frBriefB: {
    meta: { id: "frBriefB", name: "Field Report — Brief (Memo)", category: "content",
      description: "Large briefing memo layout for richer explanatory text" },
    build: FR.frBriefB,
  },
  frFinding: {
    meta: { id: "frFinding", name: "Field Report — Finding", category: "content",
      description: "Main finding with explanation and three evidence cards" },
    build: FR.frFinding,
  },
  frFindingB: {
    meta: { id: "frFindingB", name: "Field Report — Finding (Panel)", category: "content",
      description: "Boxed key finding with narrative explanation and bullets" },
    build: FR.frFindingB,
  },
  frPhotoEvidence: {
    meta: { id: "frPhotoEvidence", name: "Field Report — Photo Evidence", category: "visual",
      description: "Large contained photo with interpretation panel" },
    build: FR.frPhotoEvidence,
  },
  frPhotoEvidenceB: {
    meta: { id: "frPhotoEvidenceB", name: "Field Report — Photo Evidence (Wide)", category: "visual",
      description: "Wide documentary photo with text interpretation underneath" },
    build: FR.frPhotoEvidenceB,
  },
  frTimeline: {
    meta: { id: "frTimeline", name: "Field Report — Timeline", category: "data",
      description: "Horizontal timeline for events, eras, or development stages" },
    build: FR.frTimeline,
  },
  frTimelineB: {
    meta: { id: "frTimelineB", name: "Field Report — Timeline (Rows)", category: "data",
      description: "Vertical timeline rows with explanatory introduction" },
    build: FR.frTimelineB,
  },
  frMapProcess: {
    meta: { id: "frMapProcess", name: "Field Report — Map Process", category: "data",
      description: "Map-style process route from cause to consequence" },
    build: FR.frMapProcess,
  },
  frCompare: {
    meta: { id: "frCompare", name: "Field Report — Compare", category: "compare",
      description: "Before/after or two-option comparison in report panels" },
    build: FR.frCompare,
  },
  frCompareB: {
    meta: { id: "frCompareB", name: "Field Report — Compare (Tradeoffs)", category: "compare",
      description: "Tradeoff comparison with two vertical evidence lists" },
    build: FR.frCompareB,
  },
  frStats: {
    meta: { id: "frStats", name: "Field Report — Stats", category: "data",
      description: "Three metric cards with explanatory report paragraph" },
    build: FR.frStats,
  },
  frStatsB: {
    meta: { id: "frStatsB", name: "Field Report — Stats (Grid)", category: "data",
      description: "Metric grid beside a readable explanatory paragraph" },
    build: FR.frStatsB,
  },
  frCaseStudy: {
    meta: { id: "frCaseStudy", name: "Field Report — Case Study", category: "visual",
      description: "Case narrative with photo evidence and key notes" },
    build: FR.frCaseStudy,
  },
  frCaseStudyB: {
    meta: { id: "frCaseStudyB", name: "Field Report — Case Study (Split)", category: "visual",
      description: "Split image and case narrative with field observations" },
    build: FR.frCaseStudyB,
  },
  frQuote: {
    meta: { id: "frQuote", name: "Field Report — Quote", category: "content",
      description: "Large quote with explanation and context chips" },
    build: FR.frQuote,
  },
  frQuoteB: {
    meta: { id: "frQuoteB", name: "Field Report — Quote (Interpretation)", category: "content",
      description: "Quote panel with side interpretation card" },
    build: FR.frQuoteB,
  },
  frClosing: {
    meta: { id: "frClosing", name: "Field Report — Closing", category: "closing",
      description: "Final synthesis with takeaways and next steps" },
    build: FR.frClosing,
  },
  frClosingB: {
    meta: { id: "frClosingB", name: "Field Report — Closing (Cards)", category: "closing",
      description: "Centered closing with three takeaway cards" },
    build: FR.frClosingB,
  },
  frWitnessAccount: {
    meta: { id: "frWitnessAccount", name: "Field Report — Witness Account", category: "content",
      description: "First-hand testimony with quote panel and interpretation" },
    build: FR.frWitnessAccount,
  },
  frMethodology: {
    meta: { id: "frMethodology", name: "Field Report — Methodology", category: "content",
      description: "Research methods and data collection approach" },
    build: FR.frMethodology,
  },
  frFieldNotes: {
    meta: { id: "frFieldNotes", name: "Field Report — Field Notes", category: "content",
      description: "Observational notes captured in journal-style panel" },
    build: FR.frFieldNotes,
  },
  frInvestigationSequence: {
    meta: { id: "frInvestigationSequence", name: "Field Report — Investigation Path", category: "data",
      description: "Step-by-step investigation sequence with arrows" },
    build: FR.frInvestigationSequence,
  },
  frPhotographicEssay: {
    meta: { id: "frPhotographicEssay", name: "Field Report — Photo Essay", category: "visual",
      description: "Multi-image documentary layout with detailed captions" },
    build: FR.frPhotographicEssay,
  },
  frVoicesFromField: {
    meta: { id: "frVoicesFromField", name: "Field Report — Multiple Voices", category: "content",
      description: "Three different perspectives or witness accounts" },
    build: FR.frVoicesFromField,
  },

  // ── EDITORIAL MAGAZINE preset layouts ────────────────────────────────
  emCover: {
    meta: { id: "emCover", name: "Editorial Magazine — Cover", category: "intro",
      description: "High-end magazine cover with large headline and editorial image" },
    build: EM.emCover,
  },
  emCoverBold: {
    meta: { id: "emCoverBold", name: "Editorial Magazine — Bold Cover", category: "intro",
      description: "Full-bleed image cover with overlay headline" },
    build: EM.emCoverBold,
  },
  emCoverMinimal: {
    meta: { id: "emCoverMinimal", name: "Editorial Magazine — Minimal Cover", category: "intro",
      description: "Clean centered cover with elegant typography" },
    build: EM.emCoverMinimal,
  },
  emFeatureOpener: {
    meta: { id: "emFeatureOpener", name: "Editorial Magazine — Feature Opener", category: "content",
      description: "Multi-column opener with drop cap and pull quote (300-350 words)" },
    build: EM.emFeatureOpener,
  },
  emFeatureOpenerWide: {
    meta: { id: "emFeatureOpenerWide", name: "Editorial Magazine — Wide Opener", category: "content",
      description: "Three-column wide format for expansive introductions (400-500 words)" },
    build: EM.emFeatureOpenerWide,
  },
  emDataStory: {
    meta: { id: "emDataStory", name: "Editorial Magazine — Data Story", category: "data",
      description: "Bold statistics with analytical text columns (250-300 words)" },
    build: EM.emDataStory,
  },
  emInterview: {
    meta: { id: "emInterview", name: "Editorial Magazine — Interview", category: "content",
      description: "Q&A format with bold questions and flowing answers (300-400 words)" },
    build: EM.emInterview,
  },
  emSidebarFeature: {
    meta: { id: "emSidebarFeature", name: "Editorial Magazine — Sidebar Feature", category: "content",
      description: "Main two-column text with colored sidebar for related content (350-400 words)" },
    build: EM.emSidebarFeature,
  },
  emPhotoEssay: {
    meta: { id: "emPhotoEssay", name: "Editorial Magazine — Photo Essay", category: "visual",
      description: "Large image with two detail shots and rich caption (200-250 words)" },
    build: EM.emPhotoEssay,
  },
  emQuoteSpread: {
    meta: { id: "emQuoteSpread", name: "Editorial Magazine — Quote Spread", category: "content",
      description: "Full-page centered quote with supporting context text (200 words)" },
    build: EM.emQuoteSpread,
  },
  emSectionBreak: {
    meta: { id: "emSectionBreak", name: "Editorial Magazine — Section Break", category: "intro",
      description: "Chapter divider with large section number" },
    build: EM.emSectionBreak,
  },
  emListFeature: {
    meta: { id: "emListFeature", name: "Editorial Magazine — List Feature", category: "content",
      description: "Numbered insights with detailed explanations (250-300 words)" },
    build: EM.emListFeature,
  },
  emConclusion: {
    meta: { id: "emConclusion", name: "Editorial Magazine — Conclusion", category: "closing",
      description: "Three-column wrap-up with key takeaways (300-350 words)" },
    build: EM.emConclusion,
  },

  // ── CLEAN STRATEGY BRIEF preset layouts ──────────────────────────────
  csCover: {
    meta: { id: "csCover", name: "Clean Strategy — Cover", category: "intro",
      description: "Minimal cover with concise title, deck, and abstract visual" },
    build: CS.csCover,
  },
  csAgenda: {
    meta: { id: "csAgenda", name: "Clean Strategy — Agenda", category: "agenda",
      description: "Centered route cards for the briefing flow" },
    build: CS.csAgenda,
  },
  csSummary: {
    meta: { id: "csSummary", name: "Clean Strategy — Summary", category: "content",
      description: "Concise summary with three key readout points" },
    build: CS.csSummary,
  },
  csInsight: {
    meta: { id: "csInsight", name: "Clean Strategy — Key Insight", category: "content",
      description: "Single strategic claim with short explanatory note" },
    build: CS.csInsight,
  },
  csTwoColumn: {
    meta: { id: "csTwoColumn", name: "Clean Strategy — Two Column", category: "content",
      description: "Diagnosis and response columns with bounded bullets" },
    build: CS.csTwoColumn,
  },
  csProcess: {
    meta: { id: "csProcess", name: "Clean Strategy — Process", category: "data",
      description: "Simple horizontal process sequence" },
    build: CS.csProcess,
  },
  csMetrics: {
    meta: { id: "csMetrics", name: "Clean Strategy — Metrics", category: "data",
      description: "Four concise metric cards" },
    build: CS.csMetrics,
  },
  csCompare: {
    meta: { id: "csCompare", name: "Clean Strategy — Compare", category: "compare",
      description: "Two option comparison with concise points" },
    build: CS.csCompare,
  },
  csCase: {
    meta: { id: "csCase", name: "Clean Strategy — Case", category: "content",
      description: "Short example narrative with situation/action/result notes" },
    build: CS.csCase,
  },
  csRisk: {
    meta: { id: "csRisk", name: "Clean Strategy — Risks", category: "compare",
      description: "Risk rows with ownership/checkpoint placeholders" },
    build: CS.csRisk,
  },
  csRecommendation: {
    meta: { id: "csRecommendation", name: "Clean Strategy — Recommendation", category: "closing",
      description: "Recommendation with three bounded action points" },
    build: CS.csRecommendation,
  },
  csClosing: {
    meta: { id: "csClosing", name: "Clean Strategy — Closing", category: "closing",
      description: "Final takeaway with one clear next step" },
    build: CS.csClosing,
  },

  // ── ADAPTIVE DESIGN SYSTEM preset layouts ───────────────────────────
  adCover: {
    meta: { id: "adCover", name: "Adaptive — Cover", category: "intro",
      description: "AI-colored cover with dynamic palette and visual motif" },
    build: AD.adCover,
  },
  adDarkCover: {
    meta: { id: "adDarkCover", name: "Adaptive — Dark Cover", category: "intro",
      description: "Dark adaptive cover for high-impact openings" },
    build: AD.adDarkCover,
  },
  adImageCover: {
    meta: { id: "adImageCover", name: "Adaptive — Image Cover", category: "visual",
      description: "Adaptive cover with contained visual slot" },
    build: AD.adImageCover,
  },
  adBoldCover: {
    meta: { id: "adBoldCover", name: "Adaptive — Bold Cover", category: "intro",
      description: "High-contrast block cover for energetic decks" },
    build: AD.adBoldCover,
  },
  adAgenda: {
    meta: { id: "adAgenda", name: "Adaptive — Agenda", category: "agenda",
      description: "Centered route cards for variable presentation flow" },
    build: AD.adAgenda,
  },
  adSummary: {
    meta: { id: "adSummary", name: "Adaptive — Summary", category: "content",
      description: "Readable summary with supporting decision notes" },
    build: AD.adSummary,
  },
  adEditorialBrief: {
    meta: { id: "adEditorialBrief", name: "Adaptive — Editorial Brief", category: "content",
      description: "Narrative editorial-style brief with interpretive notes" },
    build: AD.adEditorialBrief,
  },
  adStatement: {
    meta: { id: "adStatement", name: "Adaptive — Key Idea", category: "content",
      description: "Dark key-idea slide with explanatory note" },
    build: AD.adStatement,
  },
  adBoldStatement: {
    meta: { id: "adBoldStatement", name: "Adaptive — Bold Statement", category: "content",
      description: "High-contrast statement slide with strong color block" },
    build: AD.adBoldStatement,
  },
  adSplit: {
    meta: { id: "adSplit", name: "Adaptive — Split Analysis", category: "content",
      description: "Two-panel diagnosis and response analysis" },
    build: AD.adSplit,
  },
  adVisualSplit: {
    meta: { id: "adVisualSplit", name: "Adaptive — Visual Split", category: "visual",
      description: "Contained image beside explanatory analysis" },
    build: AD.adVisualSplit,
  },
  adEditorialImage: {
    meta: { id: "adEditorialImage", name: "Adaptive — Editorial Image", category: "visual",
      description: "Wide contained image with editorial interpretation" },
    build: AD.adEditorialImage,
  },
  adCards: {
    meta: { id: "adCards", name: "Adaptive — Cards", category: "content",
      description: "Four flexible topic-specific priority cards" },
    build: AD.adCards,
  },
  adProcess: {
    meta: { id: "adProcess", name: "Adaptive — Process", category: "data",
      description: "Horizontal process flow with safe spacing" },
    build: AD.adProcess,
  },
  adMetrics: {
    meta: { id: "adMetrics", name: "Adaptive — Metrics", category: "data",
      description: "Metric dashboard driven by AI-selected palette" },
    build: AD.adMetrics,
  },
  adConsoleMetrics: {
    meta: { id: "adConsoleMetrics", name: "Adaptive — Console Metrics", category: "data",
      description: "Dark console-style metric dashboard" },
    build: AD.adConsoleMetrics,
  },
  adCompare: {
    meta: { id: "adCompare", name: "Adaptive — Compare", category: "compare",
      description: "Side-by-side option comparison with bounded bullets" },
    build: AD.adCompare,
  },
  adTimeline: {
    meta: { id: "adTimeline", name: "Adaptive — Timeline", category: "data",
      description: "Topic-specific chronological or staged timeline" },
    build: AD.adTimeline,
  },
  adConsoleFlow: {
    meta: { id: "adConsoleFlow", name: "Adaptive — Console Flow", category: "data",
      description: "Dark system-flow diagram for technical or operational topics" },
    build: AD.adConsoleFlow,
  },
  adMatrix: {
    meta: { id: "adMatrix", name: "Adaptive — Matrix", category: "compare",
      description: "Decision matrix for priorities and tradeoffs" },
    build: AD.adMatrix,
  },
  adCase: {
    meta: { id: "adCase", name: "Adaptive — Case", category: "content",
      description: "Mini case study with situation, action, and result" },
    build: AD.adCase,
  },
  adClosing: {
    meta: { id: "adClosing", name: "Adaptive — Closing", category: "closing",
      description: "Dark final takeaway and next action" },
    build: AD.adClosing,
  },
  adEditorialClosing: {
    meta: { id: "adEditorialClosing", name: "Adaptive — Editorial Closing", category: "closing",
      description: "Reflective editorial closing with final note" },
    build: AD.adEditorialClosing,
  },

  // ── ADAPTIVE DESIGN EXTRA LAYOUTS ────────────────────────────────────
  adGradientCover: {
    meta: { id: "adGradientCover", name: "Adaptive — Gradient Cover", category: "intro",
      description: "Dark gradient cover with decorative orbs and accent rule" },
    build: AX.adGradientCover,
  },
  adMinimalCover: {
    meta: { id: "adMinimalCover", name: "Adaptive — Minimal Cover", category: "intro",
      description: "Clean centered cover with minimal decoration" },
    build: AX.adMinimalCover,
  },
  adSplitImageCover: {
    meta: { id: "adSplitImageCover", name: "Adaptive — Split Image Cover", category: "intro",
      description: "Half-dark text, half-image cover layout" },
    build: AX.adSplitImageCover,
  },
  adNumberedList: {
    meta: { id: "adNumberedList", name: "Adaptive — Numbered List", category: "content",
      description: "Clean numbered list with accent circles" },
    build: AX.adNumberedList,
  },
  adIconGrid: {
    meta: { id: "adIconGrid", name: "Adaptive — Icon Grid", category: "content",
      description: "Six-item grid with icon circles for quick overview" },
    build: AX.adIconGrid,
  },
  adTwoColumn: {
    meta: { id: "adTwoColumn", name: "Adaptive — Two Column", category: "compare",
      description: "Split content into two labelled columns with bullets" },
    build: AX.adTwoColumn,
  },
  adFunnel: {
    meta: { id: "adFunnel", name: "Adaptive — Funnel", category: "data",
      description: "Narrowing funnel showing conversion or filtering stages" },
    build: AX.adFunnel,
  },
  adPyramid: {
    meta: { id: "adPyramid", name: "Adaptive — Pyramid", category: "data",
      description: "Pyramid hierarchy showing layered priorities" },
    build: AX.adPyramid,
  },
  adProsCons: {
    meta: { id: "adProsCons", name: "Adaptive — Pros & Cons", category: "compare",
      description: "Side-by-side advantages vs drawbacks with color coding" },
    build: AX.adProsCons,
  },
  adQuoteCard: {
    meta: { id: "adQuoteCard", name: "Adaptive — Quote Card", category: "content",
      description: "Dark centered quote card with attribution" },
    build: AX.adQuoteCard,
  },
  adBigNumber: {
    meta: { id: "adBigNumber", name: "Adaptive — Big Number", category: "data",
      description: "Single large stat with context text below" },
    build: AX.adBigNumber,
  },
  adTeamGrid: {
    meta: { id: "adTeamGrid", name: "Adaptive — Team Grid", category: "content",
      description: "Four-person team or role grid with circles" },
    build: AX.adTeamGrid,
  },
  adPhotoGrid: {
    meta: { id: "adPhotoGrid", name: "Adaptive — Photo Grid", category: "visual",
      description: "Main image with two smaller detail images" },
    build: AX.adPhotoGrid,
  },
  adFullImage: {
    meta: { id: "adFullImage", name: "Adaptive — Full Image", category: "visual",
      description: "Full-bleed image with dark caption overlay at bottom" },
    build: AX.adFullImage,
  },
  adBarChart: {
    meta: { id: "adBarChart", name: "Adaptive — Bar Chart", category: "data",
      description: "Horizontal bar chart comparing four metrics" },
    build: AX.adBarChart,
  },
  adScorecard: {
    meta: { id: "adScorecard", name: "Adaptive — Scorecard", category: "data",
      description: "Dark three-metric scorecard with large values" },
    build: AX.adScorecard,
  },
  adGaugeMetrics: {
    meta: { id: "adGaugeMetrics", name: "Adaptive — Gauge Metrics", category: "data",
      description: "Four gauge-style metric cards in a row" },
    build: AX.adGaugeMetrics,
  },
  adStoryBlock: {
    meta: { id: "adStoryBlock", name: "Adaptive — Story Block", category: "content",
      description: "Full-width narrative text block with editorial feel" },
    build: AX.adStoryBlock,
  },
  adHighlight: {
    meta: { id: "adHighlight", name: "Adaptive — Highlight", category: "content",
      description: "Accent-bordered highlight box for emphasis" },
    build: AX.adHighlight,
  },
  adCallToAction: {
    meta: { id: "adCallToAction", name: "Adaptive — Call to Action", category: "closing",
      description: "Dark closing with action button prompt" },
    build: AX.adCallToAction,
  },
  adThankYou: {
    meta: { id: "adThankYou", name: "Adaptive — Thank You", category: "closing",
      description: "Simple dark thank you with contact info" },
    build: AX.adThankYou,
  },
  adCircularProcess: {
    meta: { id: "adCircularProcess", name: "Adaptive — Circular Process", category: "content",
      description: "Circular repeating process with numbered nodes" },
    build: AX.adCircularProcess,
  },
  adVerticalSteps: {
    meta: { id: "adVerticalSteps", name: "Adaptive — Vertical Steps", category: "content",
      description: "Vertical timeline with connected step nodes" },
    build: AX.adVerticalSteps,
  },
  adRoadmap: {
    meta: { id: "adRoadmap", name: "Adaptive — Roadmap", category: "content",
      description: "Dark horizontal roadmap with milestone cards" },
    build: AX.adRoadmap,
  },
  adVersus: {
    meta: { id: "adVersus", name: "Adaptive — Versus", category: "compare",
      description: "Full-height split VS comparison with two options" },
    build: AX.adVersus,
  },
  adDecisionTree: {
    meta: { id: "adDecisionTree", name: "Adaptive — Decision Tree", category: "compare",
      description: "If/then decision tree with branching options" },
    build: AX.adDecisionTree,
  },
  adSwot: {
    meta: { id: "adSwot", name: "Adaptive — SWOT", category: "compare",
      description: "Four-quadrant SWOT analysis grid" },
    build: AX.adSwot,
  },
  adSummaryClosing: {
    meta: { id: "adSummaryClosing", name: "Adaptive — Summary Closing", category: "closing",
      description: "Key takeaways closing with numbered cards" },
    build: AX.adSummaryClosing,
  },
  adContactClosing: {
    meta: { id: "adContactClosing", name: "Adaptive — Contact Closing", category: "closing",
      description: "Dark closing with contact info and CTA" },
    build: AX.adContactClosing,
  },

  // ── MODERN PRODUCT OS preset layouts ────────────────────────────────
  poCover: {
    meta: { id: "poCover", name: "Product OS — Cover", category: "intro",
      description: "AI-colored product cover with interface-style visual motif" },
    build: PO.poCover,
  },
  poImageCover: {
    meta: { id: "poImageCover", name: "Product OS — Image Cover", category: "visual",
      description: "Product cover with contained image slot and explanatory text" },
    build: PO.poImageCover,
  },
  poAgenda: {
    meta: { id: "poAgenda", name: "Product OS — Build Route", category: "agenda",
      description: "Product route from user problem to launch decision" },
    build: PO.poAgenda,
  },
  poBrief: {
    meta: { id: "poBrief", name: "Product OS — Brief", category: "content",
      description: "User problem and product readout with focused points" },
    build: PO.poBrief,
  },
  poFeatureGrid: {
    meta: { id: "poFeatureGrid", name: "Product OS — Feature Grid", category: "content",
      description: "Four product capabilities as modular interface cards" },
    build: PO.poFeatureGrid,
  },
  poImageSplit: {
    meta: { id: "poImageSplit", name: "Product OS — Image Split", category: "visual",
      description: "Contained visual slot beside workflow interpretation" },
    build: PO.poImageSplit,
  },
  poShowcase: {
    meta: { id: "poShowcase", name: "Product OS — Showcase", category: "visual",
      description: "Wide contained visual moment with concise interpretation" },
    build: PO.poShowcase,
  },
  poWorkflow: {
    meta: { id: "poWorkflow", name: "Product OS — Workflow", category: "data",
      description: "Product workflow engine with staged process blocks" },
    build: PO.poWorkflow,
  },
  poMetrics: {
    meta: { id: "poMetrics", name: "Product OS — Metrics", category: "data",
      description: "Dark product signal dashboard with four metrics" },
    build: PO.poMetrics,
  },
  poCompare: {
    meta: { id: "poCompare", name: "Product OS — Before After", category: "compare",
      description: "Current workflow versus product workflow comparison" },
    build: PO.poCompare,
  },
  poRoadmap: {
    meta: { id: "poRoadmap", name: "Product OS — Roadmap", category: "data",
      description: "Validation-first product roadmap timeline" },
    build: PO.poRoadmap,
  },
  poDecision: {
    meta: { id: "poDecision", name: "Product OS — Decision Stack", category: "closing",
      description: "Recommended product move with action checkpoints" },
    build: PO.poDecision,
  },
  poClosing: {
    meta: { id: "poClosing", name: "Product OS — Closing", category: "closing",
      description: "Dark product closing slide with final release move" },
    build: PO.poClosing,
  },

  // ── EXECUTIVE BOARDROOM preset layouts ───────────────────────────────
  ebCover: {
    meta: { id: "ebCover", name: "Executive Boardroom — Cover", category: "intro",
      description: "Premium dark boardroom cover with strategic image panel" },
    build: EB.ebCover,
  },
  ebCoverB: {
    meta: { id: "ebCoverB", name: "Executive Boardroom — Cover (Image)", category: "intro",
      description: "Wide image cover with executive title block" },
    build: EB.ebCoverB,
  },
  ebAgenda: {
    meta: { id: "ebAgenda", name: "Executive Boardroom — Agenda", category: "agenda",
      description: "Board agenda cards for decision flow" },
    build: EB.ebAgenda,
  },
  ebAgendaB: {
    meta: { id: "ebAgendaB", name: "Executive Boardroom — Agenda (Light)", category: "agenda",
      description: "Light decision route list with executive framing" },
    build: EB.ebAgendaB,
  },
  ebExecutiveSummary: {
    meta: { id: "ebExecutiveSummary", name: "Executive Boardroom — Summary", category: "content",
      description: "Executive summary with leadership readout panel" },
    build: EB.ebExecutiveSummary,
  },
  ebExecutiveSummaryB: {
    meta: { id: "ebExecutiveSummaryB", name: "Executive Boardroom — Summary Grid", category: "content",
      description: "Light executive readout with four signals" },
    build: EB.ebExecutiveSummaryB,
  },
  ebDecisionMemo: {
    meta: { id: "ebDecisionMemo", name: "Executive Boardroom — Decision Memo", category: "compare",
      description: "Decision framing with reasons to move and pause" },
    build: EB.ebDecisionMemo,
  },
  ebKpi: {
    meta: { id: "ebKpi", name: "Executive Boardroom — KPI", category: "data",
      description: "Board metrics with explanatory narrative" },
    build: EB.ebKpi,
  },
  ebKpiB: {
    meta: { id: "ebKpiB", name: "Executive Boardroom — KPI Dashboard", category: "data",
      description: "Light KPI dashboard with four metric cards" },
    build: EB.ebKpiB,
  },
  ebMarketMap: {
    meta: { id: "ebMarketMap", name: "Executive Boardroom — Market Map", category: "data",
      description: "Market forces map with strategic interpretation" },
    build: EB.ebMarketMap,
  },
  ebCompare: {
    meta: { id: "ebCompare", name: "Executive Boardroom — Compare", category: "compare",
      description: "Two strategic options with supporting points" },
    build: EB.ebCompare,
  },
  ebRiskGrid: {
    meta: { id: "ebRiskGrid", name: "Executive Boardroom — Risk Grid", category: "compare",
      description: "Four-risk register with narrative context" },
    build: EB.ebRiskGrid,
  },
  ebRoadmap: {
    meta: { id: "ebRoadmap", name: "Executive Boardroom — Roadmap", category: "data",
      description: "Staged execution roadmap for leadership review" },
    build: EB.ebRoadmap,
  },
  ebQuote: {
    meta: { id: "ebQuote", name: "Executive Boardroom — Quote", category: "content",
      description: "Large executive takeaway with interpretation" },
    build: EB.ebQuote,
  },
  ebRecommendation: {
    meta: { id: "ebRecommendation", name: "Executive Boardroom — Recommendation", category: "closing",
      description: "Board recommendation with action points" },
    build: EB.ebRecommendation,
  },
  ebClosing: {
    meta: { id: "ebClosing", name: "Executive Boardroom — Closing", category: "closing",
      description: "Final decision slide with ownership and next steps" },
    build: EB.ebClosing,
  },
  ebClosingB: {
    meta: { id: "ebClosingB", name: "Executive Boardroom — Closing (Light)", category: "closing",
      description: "Light closing slide with final executive decision" },
    build: EB.ebClosingB,
  },

  // ── SWISS STRATEGY MEMO preset layouts ────────────────────────────────
  ssTitle: {
    meta: { id: "ssTitle", name: "Swiss Strategy — Title", category: "intro",
      description: "Minimal executive memo title slide with decision context" },
    build: SS.ssTitle,
  },
  ssExecutiveSummary: {
    meta: { id: "ssExecutiveSummary", name: "Swiss Strategy — Executive Summary", category: "content",
      description: "Four-signal executive summary in strict Swiss grid" },
    build: SS.ssExecutiveSummary,
  },
  ssCurrentSituation: {
    meta: { id: "ssCurrentSituation", name: "Swiss Strategy — Current Situation", category: "data",
      description: "Situation framing with metrics and key forces" },
    build: SS.ssCurrentSituation,
  },
  ssStrategicQuestion: {
    meta: { id: "ssStrategicQuestion", name: "Swiss Strategy — Strategic Question", category: "content",
      description: "Large decision question slide for framing the choice" },
    build: SS.ssStrategicQuestion,
  },
  ssOptionA: {
    meta: { id: "ssOptionA", name: "Swiss Strategy — Option A", category: "compare",
      description: "Option analysis with score bars and implications" },
    build: SS.ssOptionA,
  },
  ssOptionB: {
    meta: { id: "ssOptionB", name: "Swiss Strategy — Option B", category: "compare",
      description: "Second strategic option analysis" },
    build: SS.ssOptionB,
  },
  ssOptionC: {
    meta: { id: "ssOptionC", name: "Swiss Strategy — Option C", category: "compare",
      description: "Third strategic option analysis" },
    build: SS.ssOptionC,
  },
  ssTradeoffMatrix: {
    meta: { id: "ssTradeoffMatrix", name: "Swiss Strategy — Tradeoff Matrix", category: "compare",
      description: "Option comparison matrix across decision criteria" },
    build: SS.ssTradeoffMatrix,
  },
  ssRecommendation: {
    meta: { id: "ssRecommendation", name: "Swiss Strategy — Recommendation", category: "closing",
      description: "Bold recommendation slide with supporting reasons" },
    build: SS.ssRecommendation,
  },
  ssRisks: {
    meta: { id: "ssRisks", name: "Swiss Strategy — Risks", category: "compare",
      description: "Risk and mitigation paired rows" },
    build: SS.ssRisks,
  },
  ssRoadmap: {
    meta: { id: "ssRoadmap", name: "Swiss Strategy — Roadmap", category: "data",
      description: "Four-phase execution roadmap" },
    build: SS.ssRoadmap,
  },
  ssDecisionNext: {
    meta: { id: "ssDecisionNext", name: "Swiss Strategy — Decision", category: "closing",
      description: "Final decision and next steps slide" },
    build: SS.ssDecisionNext,
  },
};

export const ALL_LAYOUT_IDS = Object.keys(LAYOUTS);

export function buildCanvas(
  layoutId: string,
  theme: Theme,
  content?: SlideContent,
  slideNum?: number,
): Record<string, unknown> {
  const entry = LAYOUTS[layoutId];
  if (!entry) return LAYOUTS["bulletsClassic"].build(theme, content, slideNum);
  return entry.build(theme, content, slideNum);
}

export function getLayoutMeta(layoutId: string): LayoutMeta | undefined {
  return LAYOUTS[layoutId]?.meta;
}

export function getAllMeta(): LayoutMeta[] {
  return Object.values(LAYOUTS).map((e) => e.meta);
}
