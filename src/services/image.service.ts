import { logger } from "@/utils/logger";

export interface ResolvedImage {
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageProvider: string;
  imageSourceUrl: string;
  imageWidth?: number;
  imageHeight?: number;
}

interface PexelsPhoto {
  id: number;
  width?: number;
  height?: number;
  url: string;
  alt?: string;
  photographer: string;
  photographer_url: string;
  src: {
    landscape?: string;
    large2x?: string;
    large?: string;
    medium?: string;
    original?: string;
  };
}

interface PexelsSearchResponse {
  photos?: PexelsPhoto[];
}

interface UnsplashPhoto {
  id: string;
  width?: number;
  height?: number;
  alt_description?: string | null;
  description?: string | null;
  links: {
    html: string;
  };
  urls: {
    raw?: string;
    full?: string;
    regular?: string;
  };
  user: {
    name: string;
    links?: {
      html?: string;
    };
  };
}

interface UnsplashSearchResponse {
  results?: UnsplashPhoto[];
}

const PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search";
const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos";

export async function resolveImage(params: {
  query?: string;
  heading?: string;
  label?: string;
}): Promise<ResolvedImage | undefined> {
  const cleanQuery = buildSearchQuery(params);
  if (!cleanQuery) return undefined;

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  const pexelsKey = process.env.PEXELS_API_KEY?.trim();
  if (!unsplashKey && !pexelsKey) return undefined;

  try {
    if (unsplashKey) {
      const unsplashImage = await searchUnsplash(cleanQuery, unsplashKey, searchTerms(params));
      if (unsplashImage) return unsplashImage;
    }
  } catch (error) {
    logger.warn({ error, query: cleanQuery }, "Unsplash image lookup failed");
  }

  if (!pexelsKey) return undefined;

  try {
    return await searchPexels(cleanQuery, pexelsKey, searchTerms(params));
  } catch (error) {
    logger.warn({ error, query: cleanQuery }, "Pexels image lookup failed");
    return undefined;
  }
}

async function searchUnsplash(query: string, apiKey: string, terms: string[]): Promise<ResolvedImage | undefined> {
  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "10",
    content_filter: "high",
  });

  const response = await fetch(`${UNSPLASH_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Client-ID ${apiKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash API returned ${response.status}`);
  }

  const data = (await response.json()) as UnsplashSearchResponse;
  const photo = selectBestUnsplashPhoto(data.results ?? [], terms);
  if (!photo) return undefined;

  const imageUrl = photo.urls.raw
    ? `${photo.urls.raw}&w=1800&fit=max&q=85`
    : photo.urls.full ?? photo.urls.regular;
  if (!imageUrl) return undefined;

  // Served image is constrained to w=1800; compute actual served dimensions
  const unsplashMaxW = 1800;
  const servedUnsplashW = Math.min(unsplashMaxW, photo.width ?? unsplashMaxW);
  const servedUnsplashH = photo.width && photo.height
    ? Math.round(photo.height * servedUnsplashW / photo.width)
    : undefined;

  return {
    imageUrl,
    imageAlt: photo.alt_description?.trim() || photo.description?.trim() || query,
    imageCredit: `Photo: ${photo.user.name}`,
    imageProvider: "Unsplash",
    imageSourceUrl: photo.links.html,
    imageWidth: servedUnsplashW,
    imageHeight: servedUnsplashH,
  };
}

async function searchPexels(query: string, apiKey: string, terms: string[]): Promise<ResolvedImage | undefined> {
  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "10",
  });

  const response = await fetch(`${PEXELS_SEARCH_URL}?${params.toString()}`, {
    headers: { Authorization: apiKey },
  });

  if (!response.ok) {
    throw new Error(`Pexels API returned ${response.status}`);
  }

  const data = (await response.json()) as PexelsSearchResponse;
  const photo = selectBestPhoto(data.photos ?? [], terms);
  if (!photo) return undefined;

  const imageUrl = photo.src.large2x ?? photo.src.original ?? photo.src.large ?? photo.src.landscape ?? photo.src.medium;
  if (!imageUrl) return undefined;

  // Pexels large2x is served at max 1880px wide (940 * dpr=2); compute actual served dimensions
  const pexelsMaxW = 1880;
  const servedPexelsW = Math.min(pexelsMaxW, photo.width ?? pexelsMaxW);
  const servedPexelsH = photo.width && photo.height
    ? Math.round(photo.height * servedPexelsW / photo.width)
    : undefined;

  return {
    imageUrl,
    imageAlt: photo.alt?.trim() || query,
    imageCredit: `Photo: ${photo.photographer}`,
    imageProvider: "Pexels",
    imageSourceUrl: photo.url,
    imageWidth: servedPexelsW,
    imageHeight: servedPexelsH,
  };
}

function buildSearchQuery(params: { query?: string; heading?: string; label?: string }) {
  const topic = normalizeWords(params.query || params.heading || params.label || "");
  if (!topic) return undefined;

  const context = visualContextFor(params);
  if (!context || topic.includes(context)) return topic;

  return `${topic} ${context}`;
}

function visualContextFor(params: { query?: string; heading?: string; label?: string }) {
  const context = normalizeWords([params.label, params.heading, params.query].filter(Boolean).join(" "));

  if (/\b(history|historical|culture|heritage|ancient|empire|war|revolution|uzbekistan|samarkand|bukhara|khiva)\b/.test(context)) {
    return "historic architecture museum city";
  }

  if (/\b(economics|economy|finance|market|business|strategy|startup|sales|revenue|customer)\b/.test(context)) {
    return "business team data dashboard";
  }

  if (/\b(ai|artificial intelligence|machine learning|neural network|algorithm|software|technology|digital|platform|remote work)\b/.test(context)) {
    return "technology people laptop dashboard";
  }

  if (/\b(science|physics|chemistry|biology|medicine|health|engineering|research)\b/.test(context)) {
    return "research lab people equipment";
  }

  if (/\b(education|learning|school|student|teacher|classroom|course)\b/.test(context)) {
    return "students classroom learning";
  }

  if (/\b(environment|climate|energy|sustainability|renewable|nature)\b/.test(context)) {
    return "landscape people environment";
  }

  if (/\b(marketing|brand|design|creative|social media|campaign)\b/.test(context)) {
    return "creative team planning campaign";
  }

  return "people real world scene";
}

function selectBestPhoto(photos: PexelsPhoto[], terms: string[]) {
  if (!photos.length) return undefined;

  const scored = photos.map((photo, index) => ({
    photo,
    score: scorePhoto(photo, terms) - index * 0.05,
  }));

  scored.sort((a, b) => b.score - a.score);
  // Return best match if it meets threshold, otherwise fall back to first result
  return scored[0].score >= minimumScore(terms) ? scored[0].photo : photos[0];
}

function selectBestUnsplashPhoto(photos: UnsplashPhoto[], terms: string[]) {
  if (!photos.length) return undefined;

  const scored = photos.map((photo, index) => ({
    photo,
    score: scoreUnsplashPhoto(photo, terms) - index * 0.05,
  }));

  scored.sort((a, b) => b.score - a.score);
  // Return best match if it meets threshold, otherwise fall back to first result
  return scored[0].score >= minimumScore(terms) ? scored[0].photo : photos[0];
}

function scoreUnsplashPhoto(photo: UnsplashPhoto, terms: string[]) {
  const haystack = normalizeWords(`${photo.alt_description ?? ""} ${photo.description ?? ""} ${photo.links.html}`);
  return scoreText(haystack, terms);
}

function scorePhoto(photo: PexelsPhoto, terms: string[]) {
  const haystack = normalizeWords(`${photo.alt ?? ""} ${photo.url}`);
  return scoreText(haystack, terms);
}

function scoreText(haystack: string, terms: string[]) {
  let score = 0;

  for (const term of terms) {
    if (term.length < 3) continue;
    if (haystack.includes(term)) score += 2;
  }

  if (/\b(robot|technology|computer|data|network|code|digital|machine|science|laboratory)\b/.test(haystack)) {
    score += 3;
  }

  if (/\b(food|kitchen|flower|animal|fashion|sport|beach|wedding|baby|toy|plastic|container)\b/.test(haystack)) {
    score -= 4;
  }

  if (/\b(blank|dark|wall|texture|abstract|blur|background|surface|shadow)\b/.test(haystack)) {
    score -= 3;
  }

  return score;
}

function minimumScore(terms: string[]) {
  return terms.length >= 3 ? 2 : 1;
}

function searchTerms(params: { query?: string; heading?: string; label?: string }) {
  return normalizeWords([params.heading, params.query, params.label].filter(Boolean).join(" "))
    .split(" ")
    .filter((word) => word.length > 2);
}

function normalizeWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
