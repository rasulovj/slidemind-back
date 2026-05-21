import { W, H, hexToRgba, txt, rct, cir, canvas } from "./helpers";
import type { Theme, SlideContent, CanvasBuilder } from "./types";

// ── Pitch Deck color palette ───────────────────────────────────────────
const NAVY  = "#0D1B4B";
const BLUE  = "#2563EB";   // bright blue matching the image
const MID   = "#3B82F6";
const WHITE = "#FFFFFF";
const LGRAY = "#CBD5E1";
const GRAY  = "#64748B";
const LBG   = "#F0F6FF";

// Shared header for content slides (not used on cover)
function pdHeader(label?: string) {
  return [
    rct({ left: 0, top: 0, width: W, height: 2, fill: BLUE }),
    txt({ text: (label ?? "SlideMind").slice(0, 24), left: 20, top: 10,
          width: 240, fontSize: 10, fill: NAVY, fontWeight: "600" }),
    txt({ text: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          left: W - 140, top: 10, width: 128, fontSize: 9, fill: GRAY, textAlign: "right" }),
  ];
}

function imgPlaceholder(x: number, y: number, w: number, h: number) {
  return [
    rct({ left: x, top: y, width: w, height: h, fill: LBG, rx: 0 }),
    rct({ left: x + w * 0.3, top: y + h * 0.25, width: w * 0.4, height: w * 0.4 * 0.67,
          fill: hexToRgba(BLUE, 0.12), rx: 4 }),
    txt({ text: "IMAGE", left: x, top: y + h * 0.5 - 8, width: w,
          fontSize: 10, fill: hexToRgba(BLUE, 0.25), textAlign: "center", fontWeight: "700" }),
  ];
}

// Angled rect helper — uses center origin so rotation is around center
function aRct(
  cx: number, cy: number, w: number, h: number,
  fill: string, angle: number, opacity = 1,
): Record<string, unknown> {
  return {
    type: "rect",
    version: "5.3.0",
    originX: "center",
    originY: "center",
    left: cx, top: cy,
    width: w, height: h,
    angle,
    fill,
    opacity,
    scaleX: 1, scaleY: 1,
    visible: true,
    strokeWidth: 0, stroke: null, shadow: null,
    rx: 0, ry: 0,
  };
}

// ── 1. Cover — geometric glass panels design ───────────────────────────
// Matches the reference image: light gray bg, white diagonal facets,
// small blue date top-left, massive bold blue heading, blue rule below.
export const pdCover: CanvasBuilder = (_t: Theme, c: SlideContent = {}) => {
  const heading = c.heading ?? "Pitch Deck";
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const BG = "#EBEBEB";   // slide background

  // Geometric angle — shapes lean like "/"
  const A = -33;

  const objs: unknown[] = [
    // ── Background ──────────────────────────────────────────────────────
    rct({ left: 0, top: 0, width: W, height: H, fill: BG }),

    // ── Diagonal geometric glass panels ─────────────────────────────────
    // Each large white/near-white plane simulates an architectural reflection

    // Plane 1 — large upper-right bright panel
    aRct(1060, 110, 1700, 540, "#F5F5F5", A, 0.95),

    // Plane 2 — main central white facet
    aRct(940, 300, 1700, 480, WHITE, A, 0.75),

    // Plane 3 — lower secondary panel
    aRct(780, 540, 1700, 480, "#F0F0F0", A, 0.65),

    // Edge line 1 — visible crease between planes (upper)
    aRct(930, 180, 1700, 2.5, "#C8C8C8", A, 0.85),

    // Edge line 2 — lower crease
    aRct(810, 420, 1700, 2, "#CECECE", A, 0.7),

    // Edge line 3 — very subtle lower crease
    aRct(680, 600, 1700, 1.5, "#D5D5D5", A, 0.5),

    // Highlight — bright white area upper-right corner
    aRct(1200, 40, 900, 280, WHITE, A, 0.88),

    // Inner highlight — small bright facet center-right
    aRct(1040, 340, 500, 200, WHITE, A, 0.55),

    // Shadow edge — very faint dark edge lower-left
    aRct(200, 560, 600, 3, "#BBBBBB", A, 0.4),

    // ── Date — top left ─────────────────────────────────────────────────
    txt({
      text: date,
      left: 110, top: 52,
      width: 500, fontSize: 18,
      fill: BLUE, fontWeight: "normal",
    }),

    // ── Main heading ────────────────────────────────────────────────────
    txt({
      text: heading,
      left: 110, top: 262,
      width: W - 160, fontSize: 168,
      fill: BLUE, fontWeight: "bold",
      lineHeight: 1.0, textAlign: "left",
    }),

    // ── Horizontal blue rule ─────────────────────────────────────────────
    rct({ left: 110, top: 514, width: W - 220, height: 3, fill: BLUE }),
  ];

  return canvas(BG, objs);
};

// ── 2. About Our Company ───────────────────────────────────────────────
export const pdAbout: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const objs: unknown[] = [
    ...pdHeader(c.label),
    ...imgPlaceholder(0, 0, W * 0.45, H),
    // Right side
    rct({ left: W * 0.45, top: 0, width: 3, height: H, fill: hexToRgba(BLUE, 0.1) }),
    txt({ text: c.heading ?? "About Our Company", left: W * 0.48, top: 80,
          width: W * 0.46, fontSize: 44, fill: BLUE, fontWeight: "bold", lineHeight: 1.2 }),
    rct({ left: W * 0.48, top: 168, width: 60, height: 3, fill: BLUE, rx: 1 }),
    txt({ text: c.body ?? c.subheading ?? "A brief description of your company and what makes it unique in the market.",
          left: W * 0.48, top: 186, width: W * 0.46,
          fontSize: 16, fill: GRAY, lineHeight: 1.65 }),
    ...(c.points ?? []).slice(0, 3).map((pt, i) => [
      rct({ left: W * 0.48, top: 340 + i * 72, width: W * 0.46, height: 60, fill: LBG, rx: 4 }),
      rct({ left: W * 0.48, top: 340 + i * 72, width: 4, height: 60, fill: BLUE }),
      txt({ text: pt, left: W * 0.48 + 16, top: 356 + i * 72,
            width: W * 0.44 - 20, fontSize: 15, fill: NAVY }),
    ]).flat(),
  ];
  return canvas(WHITE, objs);
};

// ── 3. Problem ────────────────────────────────────────────────────────
export const pdProblem: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const categories = c.steps ?? ["Society", "Environment", "Economy"];
  const objs: unknown[] = [
    ...pdHeader(c.label),
    rct({ left: 0, top: 0, width: W, height: H, fill: NAVY }),
    rct({ left: 0, top: 0, width: W, height: 2, fill: MID }),
    txt({ text: (c.label ?? "SlideMind").slice(0, 24), left: 20, top: 10,
          width: 240, fontSize: 10, fill: hexToRgba(WHITE, 0.6), fontWeight: "600" }),
    txt({ text: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          left: W - 140, top: 10, width: 128, fontSize: 9, fill: hexToRgba(WHITE, 0.4), textAlign: "right" }),
    txt({ text: c.heading ?? "Problem", left: 48, top: 56,
          width: W * 0.55, fontSize: 64, fill: WHITE, fontWeight: "bold", lineHeight: 1.05 }),
    rct({ left: 48, top: 148, width: 48, height: 3, fill: MID, rx: 1 }),
    txt({ text: c.body ?? c.subheading ?? "Describe the core problem your solution addresses and why it matters.",
          left: 48, top: 168, width: W * 0.55,
          fontSize: 15, fill: hexToRgba(WHITE, 0.65), lineHeight: 1.6 }),
    ...imgPlaceholder(W * 0.6, 32, W * 0.36, H * 0.5).map((o: unknown) => o),
    // Category boxes at bottom
    rct({ left: 0, top: H - 100, width: W, height: 100, fill: hexToRgba(WHITE, 0.04) }),
    ...categories.slice(0, 3).map((cat, i) => {
      const bw = W / 3;
      return [
        ...(i > 0 ? [rct({ left: bw * i, top: H - 100, width: 1, height: 100, fill: hexToRgba(WHITE, 0.1) })] : []),
        txt({ text: cat.toUpperCase(), left: bw * i + 24, top: H - 76,
              width: bw - 32, fontSize: 11, fill: MID, fontWeight: "700" }),
        txt({ text: (c.points ?? [])[i] ?? "Key aspect of this dimension",
              left: bw * i + 24, top: H - 58,
              width: bw - 32, fontSize: 13, fill: hexToRgba(WHITE, 0.55), lineHeight: 1.35 }),
      ];
    }).flat(),
  ];
  return canvas(NAVY, objs);
};

// ── 4. Solution ───────────────────────────────────────────────────────
export const pdSolution: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const features = c.rightPoints ?? c.points?.slice(2) ?? [
    "Market", "Industry", "SEM", "End User",
  ];
  const featureDesc = c.steps ?? [
    "Addresses the core market need systematically.",
    "Sound industry decisions with real impact.",
    "Precise and actionable SEM approach.",
    "Ensures users can have a tangible impact.",
  ];
  const objs: unknown[] = [
    ...pdHeader(c.label),
    txt({ text: c.heading ?? "Solution", left: 48, top: 40,
          width: W * 0.5, fontSize: 52, fill: BLUE, fontWeight: "bold", lineHeight: 1.1 }),
    rct({ left: 48, top: 108, width: 48, height: 3, fill: BLUE, rx: 1 }),
    ...imgPlaceholder(48, 124, W * 0.38, 180),
    txt({ text: c.body ?? c.subheading ?? "Our solution directly addresses the identified problems with a proven, scalable approach.",
          left: 48, top: 316, width: W * 0.38,
          fontSize: 13, fill: GRAY, lineHeight: 1.6 }),
    // Right: feature grid 2x2
    rct({ left: W * 0.5, top: 24, width: 1, height: H - 40, fill: LGRAY }),
    ...features.slice(0, 4).map((feat, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const fw = (W * 0.46) / 2 - 16;
      const x = W * 0.52 + col * (fw + 16);
      const y = 40 + row * 200;
      return [
        rct({ left: x, top: y, width: fw, height: 180, fill: LBG, rx: 4 }),
        rct({ left: x, top: y, width: fw, height: 3, fill: BLUE, rx: 1 }),
        txt({ text: feat, left: x + 16, top: y + 18,
              width: fw - 24, fontSize: 17, fill: NAVY, fontWeight: "700" }),
        txt({ text: featureDesc[i] ?? "Feature description and impact.",
              left: x + 16, top: y + 46, width: fw - 24,
              fontSize: 13, fill: GRAY, lineHeight: 1.5 }),
      ];
    }).flat(),
  ];
  return canvas(WHITE, objs);
};

// ── 5. Product Overview ───────────────────────────────────────────────
export const pdProduct: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const features = c.points ?? ["Smart Home Platform", "Internet of Things"];
  const objs: unknown[] = [
    ...pdHeader(c.label),
    txt({ text: c.heading ?? "Product Overview", left: 48, top: 40,
          width: W * 0.46, fontSize: 52, fill: BLUE, fontWeight: "bold", lineHeight: 1.1 }),
    rct({ left: 48, top: 108, width: 48, height: 3, fill: BLUE, rx: 1 }),
    txt({ text: c.body ?? c.subheading ?? "A comprehensive overview of our product and its core capabilities.",
          left: 48, top: 124, width: W * 0.44,
          fontSize: 15, fill: GRAY, lineHeight: 1.6 }),
    // Right: image + feature cards
    ...imgPlaceholder(W * 0.54, 32, W * 0.42, H * 0.52),
    ...features.slice(0, 2).map((feat, i) => {
      const y = H * 0.58 + i * 80;
      return [
        rct({ left: W * 0.54, top: y, width: W * 0.42, height: 66, fill: LBG, rx: 4 }),
        rct({ left: W * 0.54, top: y, width: 4, height: 66, fill: BLUE }),
        txt({ text: feat, left: W * 0.54 + 16, top: y + 8,
              width: W * 0.4, fontSize: 15, fill: NAVY, fontWeight: "700" }),
        txt({ text: (c.steps ?? [])[i] ?? "Core product feature with real impact.",
              left: W * 0.54 + 16, top: y + 32, width: W * 0.4,
              fontSize: 12, fill: GRAY }),
      ];
    }).flat(),
  ];
  return canvas(WHITE, objs);
};

// ── 6. Market Size ────────────────────────────────────────────────────
export const pdMarketSize: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const stats = c.stats ?? [
    { value: "1.4B", label: "Total Addressable Market" },
    { value: "194M", label: "Serviceable Addressable Market" },
    { value: "167M", label: "Serviceable Obtainable Market" },
  ];
  const objs: unknown[] = [
    ...pdHeader(c.label),
    txt({ text: c.heading ?? "Market Size", left: 48, top: 40,
          width: W * 0.44, fontSize: 52, fill: BLUE, fontWeight: "bold" }),
    rct({ left: 48, top: 108, width: 48, height: 3, fill: BLUE, rx: 1 }),
    // World map placeholder (left side)
    rct({ left: 48, top: 124, width: W * 0.44, height: H - 180, fill: LBG, rx: 4 }),
    txt({ text: "🗺  MARKET MAP", left: 48, top: H / 2 - 12, width: W * 0.44,
          fontSize: 13, fill: hexToRgba(BLUE, 0.3), textAlign: "center", fontWeight: "700" }),
    // Stats right side
    rct({ left: W * 0.54, top: 24, width: 1, height: H - 40, fill: LGRAY }),
    ...stats.slice(0, 3).map((s, i) => {
      const y = 64 + i * 180;
      const barColors = [BLUE, MID, hexToRgba(BLUE, 0.5)];
      return [
        rct({ left: W * 0.58, top: y, width: W * 0.36, height: 2, fill: barColors[i], rx: 1 }),
        txt({ text: s.value, left: W * 0.58, top: y + 10,
              width: W * 0.36, fontSize: 52, fill: NAVY, fontWeight: "bold", lineHeight: 1 }),
        txt({ text: s.label, left: W * 0.58, top: y + 72,
              width: W * 0.36, fontSize: 14, fill: GRAY, lineHeight: 1.4 }),
      ];
    }).flat(),
  ];
  return canvas(WHITE, objs);
};

// ── 7. Market Affirmation / Key Metrics ───────────────────────────────
export const pdAffirmation: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const stats = c.stats ?? [
    { value: "2,650", label: "Total Users" },
    { value: "1,850", label: "Active Users" },
    { value: "1,010", label: "Paying Users" },
  ];
  const subtitles = c.steps ?? ["Total Achieved", "Solved E%", "Levels E%"];
  const objs: unknown[] = [
    rct({ left: 0, top: 0, width: W, height: H, fill: NAVY }),
    rct({ left: 0, top: 0, width: W, height: 2, fill: MID }),
    txt({ text: (c.label ?? "SlideMind").slice(0, 24), left: 20, top: 10,
          width: 240, fontSize: 10, fill: hexToRgba(WHITE, 0.5), fontWeight: "600" }),
    txt({ text: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          left: W - 140, top: 10, width: 128, fontSize: 9, fill: hexToRgba(WHITE, 0.35), textAlign: "right" }),
    txt({ text: c.heading ?? "Market Affirmation", left: 48, top: 44,
          width: W * 0.8, fontSize: 52, fill: WHITE, fontWeight: "bold" }),
    rct({ left: 48, top: 112, width: 48, height: 3, fill: MID, rx: 1 }),
    txt({ text: c.body ?? c.subheading ?? "Validated by real market data showing our product-market fit.",
          left: 48, top: 128, width: W * 0.7,
          fontSize: 15, fill: hexToRgba(WHITE, 0.55), lineHeight: 1.6 }),
    // Stats row
    ...stats.slice(0, 3).map((s, i) => {
      const x = 48 + i * (W / 3 - 16);
      return [
        txt({ text: subtitles[i] ?? s.label, left: x, top: 320,
              width: W / 3 - 32, fontSize: 11, fill: hexToRgba(WHITE, 0.4), fontWeight: "600" }),
        txt({ text: s.value, left: x, top: 344,
              width: W / 3 - 32, fontSize: 64, fill: WHITE, fontWeight: "bold", lineHeight: 1 }),
        rct({ left: x, top: 420, width: W / 3 - 64, height: 2, fill: MID, rx: 1 }),
        txt({ text: s.label, left: x, top: 430,
              width: W / 3 - 32, fontSize: 13, fill: hexToRgba(WHITE, 0.5) }),
      ];
    }).flat(),
  ];
  return canvas(NAVY, objs);
};

// ── 8. Company Traction ───────────────────────────────────────────────
export const pdTraction: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const metrics = c.stats ?? [
    { value: "+42%", label: "Revenue Growth (QoQ)" },
    { value: "+53%", label: "User Acquisition Rate" },
    { value: "+42%", label: "Customer Retention" },
  ];
  const objs: unknown[] = [
    ...pdHeader(c.label),
    txt({ text: c.heading ?? "Company Traction", left: 48, top: 40,
          width: W * 0.44, fontSize: 52, fill: BLUE, fontWeight: "bold" }),
    rct({ left: 48, top: 108, width: 48, height: 3, fill: BLUE, rx: 1 }),
    // Chart placeholder left
    rct({ left: 48, top: 124, width: W * 0.52, height: H - 180, fill: LBG, rx: 4 }),
    // Draw simplified line chart
    ...Array.from({ length: 5 }, (_, i) => {
      const points = [0.4, 0.6, 0.5, 0.75, 0.9];
      const x = 80 + i * (W * 0.46 / 4);
      const y = 260 - points[i] * 120;
      return rct({ left: x - 4, top: y, width: 8, height: 8, fill: BLUE, rx: 4 });
    }),
    rct({ left: 80, top: 180, width: W * 0.46 - 32, height: 1, fill: LGRAY }),
    txt({ text: "GROWTH CHART", left: 48, top: H / 2 + 40, width: W * 0.52,
          fontSize: 11, fill: hexToRgba(BLUE, 0.25), textAlign: "center", fontWeight: "700" }),
    // Metrics right
    rct({ left: W * 0.58, top: 24, width: 1, height: H - 40, fill: LGRAY }),
    ...metrics.slice(0, 3).map((m, i) => {
      const y = 72 + i * 164;
      return [
        rct({ left: W * 0.62, top: y, width: W * 0.32, height: 136, fill: LBG, rx: 4 }),
        rct({ left: W * 0.62, top: y, width: W * 0.32, height: 4, fill: BLUE, rx: 2 }),
        txt({ text: m.value, left: W * 0.62 + 16, top: y + 24,
              width: W * 0.3, fontSize: 40, fill: BLUE, fontWeight: "bold" }),
        txt({ text: m.label, left: W * 0.62 + 16, top: y + 76,
              width: W * 0.3, fontSize: 13, fill: GRAY, lineHeight: 1.4 }),
      ];
    }).flat(),
  ];
  return canvas(WHITE, objs);
};

// ── 9. Competitive Advantage ──────────────────────────────────────────
export const pdCompetitive: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const advantages = c.points ?? ["Responsive", "Resilient", "Efficient"];
  const descs = c.steps ?? [
    "Adapts to changing market conditions in real-time.",
    "Built to withstand competitive pressure and scale.",
    "Optimized processes deliver superior ROI.",
  ];
  const pcts = [85, 72, 91];
  const objs: unknown[] = [
    ...pdHeader(c.label),
    txt({ text: c.heading ?? "Competitive Advantage", left: 48, top: 40,
          width: W * 0.52, fontSize: 52, fill: BLUE, fontWeight: "bold", lineHeight: 1.1 }),
    rct({ left: 48, top: 116, width: 48, height: 3, fill: BLUE, rx: 1 }),
    // Features with progress bars on left
    ...advantages.slice(0, 3).map((adv, i) => {
      const y = 148 + i * 152;
      return [
        txt({ text: adv, left: 48, top: y,
              width: W * 0.46, fontSize: 20, fill: NAVY, fontWeight: "700" }),
        txt({ text: descs[i] ?? "", left: 48, top: y + 28,
              width: W * 0.46, fontSize: 13, fill: GRAY, lineHeight: 1.5 }),
        rct({ left: 48, top: y + 72, width: W * 0.44, height: 8, fill: hexToRgba(BLUE, 0.1), rx: 4 }),
        rct({ left: 48, top: y + 72, width: W * 0.44 * (pcts[i] / 100), height: 8, fill: BLUE, rx: 4 }),
        txt({ text: `${pcts[i]}%`, left: 48 + W * 0.44 * (pcts[i] / 100) - 28, top: y + 52,
              width: 36, fontSize: 12, fill: BLUE, fontWeight: "700", textAlign: "right" }),
      ];
    }).flat(),
    // Image right
    ...imgPlaceholder(W * 0.58, 40, W * 0.38, H - 80),
    rct({ left: W * 0.56, top: 0, width: 3, height: H, fill: hexToRgba(BLUE, 0.07) }),
  ];
  return canvas(WHITE, objs);
};

// ── 10. Our Team ──────────────────────────────────────────────────────
export const pdTeam: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const members = c.steps ?? ["Team Member 1", "Team Member 2", "Team Member 3", "Team Member 4"];
  const roles = c.points ?? ["CEO & Founder", "CTO", "Head of Design", "Head of Sales"];
  const cardW = (W - 96 - 3 * 20) / 4;
  const cardH = H - 200;
  const objs: unknown[] = [
    ...pdHeader(c.label),
    txt({ text: c.heading ?? "Our Team", left: 48, top: 40,
          width: W - 96, fontSize: 52, fill: BLUE, fontWeight: "bold" }),
    rct({ left: 48, top: 108, width: 48, height: 3, fill: BLUE, rx: 1 }),
    txt({ text: c.body ?? c.subheading ?? "The experienced team driving our mission forward.",
          left: 48, top: 124, width: W - 96,
          fontSize: 15, fill: GRAY, lineHeight: 1.5 }),
    ...members.slice(0, 4).map((name, i) => {
      const x = 48 + i * (cardW + 20);
      return [
        // Photo placeholder
        rct({ left: x, top: 168, width: cardW, height: cardW * 1.15, fill: LBG, rx: 4 }),
        rct({ left: x + cardW * 0.3, top: 168 + cardW * 0.2, width: cardW * 0.4, height: cardW * 0.4, fill: hexToRgba(BLUE, 0.15), rx: cardW * 0.2 }),
        // CEO badge
        rct({ left: x + cardW - 36, top: 168 + 8, width: 28, height: 16, fill: BLUE, rx: 3 }),
        txt({ text: "CEO".slice(0, i === 0 ? 3 : i === 1 ? 3 : 3), left: x + cardW - 36, top: 169,
              width: 28, fontSize: 9, fill: WHITE, fontWeight: "700", textAlign: "center" }),
        // Name + role
        txt({ text: name, left: x, top: 168 + cardW * 1.15 + 12,
              width: cardW, fontSize: 16, fill: NAVY, fontWeight: "700", textAlign: "center" }),
        txt({ text: roles[i] ?? "Team Member", left: x, top: 168 + cardW * 1.15 + 36,
              width: cardW, fontSize: 12, fill: GRAY, textAlign: "center" }),
      ];
    }).flat(),
  ];
  return canvas(WHITE, objs);
};

// ── 11. Thank You ─────────────────────────────────────────────────────
export const pdThankYou: CanvasBuilder = (t: Theme, c: SlideContent = {}) => {
  const contacts = c.points ?? ["123 Anywhere St, City 12345", "+123 456 7890", "www.company.com"];
  const objs: unknown[] = [
    rct({ left: 0, top: 0, width: W, height: H, fill: NAVY }),
    rct({ left: 0, top: 0, width: W, height: 2, fill: MID }),
    txt({ text: (c.label ?? "SlideMind").slice(0, 24), left: 20, top: 10,
          width: 240, fontSize: 10, fill: hexToRgba(WHITE, 0.5), fontWeight: "600" }),
    txt({ text: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          left: W - 140, top: 10, width: 128, fontSize: 9, fill: hexToRgba(WHITE, 0.35), textAlign: "right" }),
    txt({ text: c.heading ?? "Thank You", left: 48, top: 160,
          width: W - 96, fontSize: 120, fill: WHITE, fontWeight: "bold", lineHeight: 1 }),
    rct({ left: 48, top: 310, width: 80, height: 3, fill: MID, rx: 1 }),
    txt({ text: c.body ?? c.subheading ?? "We are ready to assist you.",
          left: 48, top: 328, width: W * 0.6,
          fontSize: 22, fill: hexToRgba(WHITE, 0.55), lineHeight: 1.5 }),
    // Contact info bottom
    rct({ left: 0, top: H - 80, width: W, height: 80, fill: hexToRgba(WHITE, 0.04) }),
    rct({ left: 0, top: H - 80, width: W, height: 1, fill: hexToRgba(WHITE, 0.1) }),
    ...contacts.slice(0, 3).map((ct, i) => {
      const icons = ["📍", "📞", "🌐"];
      return [
        txt({ text: icons[i], left: 48 + i * 380, top: H - 56, width: 20, fontSize: 13, fill: MID }),
        txt({ text: ct, left: 72 + i * 380, top: H - 56,
              width: 340, fontSize: 13, fill: hexToRgba(WHITE, 0.55) }),
      ];
    }).flat(),
  ];
  return canvas(NAVY, objs);
};
