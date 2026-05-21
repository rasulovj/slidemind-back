export interface FontConfig {
  body: string;
  heading: string;
}

const FONT_CONFIGS: Record<string, FontConfig> = {
  en: {
    body: "Inter, system-ui, sans-serif",
    heading: "Georgia, 'Times New Roman', serif",
  },
  uz: {
    body: "Inter, system-ui, sans-serif",
    heading: "Georgia, 'Times New Roman', serif",
  },
  ru: {
    body: "'Noto Sans', 'Inter', system-ui, sans-serif",
    heading: "'Noto Serif', Georgia, serif",
  },
  tr: {
    body: "Inter, system-ui, sans-serif",
    heading: "Georgia, 'Times New Roman', serif",
  },
  uz_cyrl: {
    body: "'Noto Sans', 'Inter', system-ui, sans-serif",
    heading: "'Noto Serif', Georgia, serif",
  },
};

export function getFontConfig(language: string): FontConfig {
  return FONT_CONFIGS[language] ?? FONT_CONFIGS.en;
}

export function applyFonts(canvasJson: Record<string, unknown>, language: string): Record<string, unknown> {
  const fonts = getFontConfig(language);
  const objects = canvasJson.objects as Array<Record<string, unknown>> | undefined;
  if (!objects) return canvasJson;

  const patched = objects.map((obj) => {
    if (obj.type !== "textbox") return obj;

    const currentFont = (obj.fontFamily as string) ?? "";
    const isSerif = /georgia|serif|playfair|times/i.test(currentFont);

    return {
      ...obj,
      fontFamily: isSerif ? fonts.heading : fonts.body,
    };
  });

  return { ...canvasJson, objects: patched };
}

export function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: "English",
    uz: "Uzbek (Latin)",
    uz_cyrl: "Uzbek (Cyrillic)",
    ru: "Russian",
    tr: "Turkish",
  };
  return names[code] ?? "English";
}

export function getLanguageInstruction(code: string): string {
  const lang = getLanguageName(code);
  if (code === "en") {
    return `Write ALL text content in English. Use professional, formal business language.`;
  }

  const specific: Record<string, string> = {
    uz: `Write ALL text in formal Uzbek (Latin script). Use professional academic/business register — not colloquial speech. For slide headings use proper formal terms (e.g. "Taqdimot rejasi" not "Kun tartibi", "Xulosa" not "Yakun", "Asosiy ko'rsatkichlar" not abbreviations). Every heading, body, point, stat label, and subheading must be in proper formal Uzbek. Keep points/items SHORT (2-3 words max). NEVER use "..." — write complete short phrases.`,
    uz_cyrl: `Write ALL text in formal Uzbek (Cyrillic script: Ўзбек). Use professional academic/business register. For slide headings use proper formal terms (e.g. "Тақдимот режаси" not "Кун тартиби"). Every heading, body, point, stat label, and subheading must be in proper formal Uzbek Cyrillic.`,
    ru: `Write ALL text in formal Russian. Use professional business/academic register — no colloquialisms. For slide headings use proper formal terms (e.g. "План презентации" not "Повестка дня"). Every heading, body, point, stat label, and subheading must be in proper formal Russian.`,
    tr: `Write ALL text in formal Turkish. Use professional business/academic register. For slide headings use proper formal terms (e.g. "Sunum Planı" not "Gündem"). Every heading, body, point, stat label, and subheading must be in proper formal Turkish.`,
  };

  return specific[code] ?? `Write ALL text content in ${lang}. Use professional, formal language. Every heading, body, point, stat label, quote, and subheading must be in ${lang}. Do not mix languages.`;
}
