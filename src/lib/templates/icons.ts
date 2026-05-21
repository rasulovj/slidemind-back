import iconNodes from "lucide-static/icon-nodes.json";

type IconNode = Array<[string, Record<string, string>]>;

const allIcons = iconNodes as unknown as Record<string, IconNode>;

// Curated set of icons useful for presentations, grouped by topic
const ICON_CATALOG: Record<string, string[]> = {
  business: [
    "briefcase", "building-2", "chart-bar", "chart-line", "chart-pie",
    "coins", "credit-card", "dollar-sign", "handshake", "landmark",
    "piggy-bank", "receipt", "trending-up", "trending-down", "wallet",
    "badge-dollar-sign", "banknote", "calculator", "percent", "store",
  ],
  tech: [
    "cpu", "database", "globe", "hard-drive", "laptop",
    "monitor", "server", "shield", "smartphone", "wifi",
    "cloud", "code", "terminal", "binary", "circuit-board",
    "bot", "brain-circuit", "cable", "microchip", "scan",
  ],
  education: [
    "book-open", "graduation-cap", "library", "pen-tool", "school",
    "users", "award", "bookmark", "clipboard", "file-text",
    "lamp", "lightbulb", "notebook-pen", "presentation", "trophy",
    "brain", "puzzle", "search", "telescope", "microscope",
  ],
  health: [
    "activity", "heart", "heart-pulse", "pill", "stethoscope",
    "thermometer", "syringe", "hospital", "cross", "apple",
    "dumbbell", "flask-conical", "scan", "shield-check", "bone",
    "eye", "ear", "hand", "brain", "wind",
  ],
  science: [
    "atom", "beaker", "dna", "flask-conical", "microscope",
    "orbit", "rocket", "satellite", "telescope", "zap",
    "magnet", "radiation", "test-tube-diagonal", "waves-horizontal", "thermometer",
    "flame", "droplets", "mountain", "leaf", "sun",
  ],
  communication: [
    "mail", "message-circle", "phone", "send", "video",
    "megaphone", "radio", "rss", "share-2", "at-sign",
    "bell", "cast", "headphones", "mic", "podcast",
    "newspaper", "quote", "radio", "volume-2", "wifi",
  ],
  people: [
    "user", "users", "user-check", "user-plus", "heart-handshake",
    "hand-helping", "baby", "person-standing", "accessibility", "contact",
    "crown", "smile", "thumbs-up", "star", "target",
    "flag", "medal", "gem", "sparkles", "circle-user-round",
  ],
  nature: [
    "leaf", "tree-pine", "flower-2", "sun", "moon",
    "cloud-rain", "snowflake", "wind", "mountain", "waves-horizontal",
    "fish", "bird", "bug", "sprout", "clover",
    "rainbow", "sunrise", "sunset", "tornado", "droplets",
  ],
  general: [
    "arrow-right", "check", "circle-check", "star", "target",
    "zap", "shield", "lock", "lock-open", "key",
    "lightbulb", "rocket", "flag", "clock", "calendar",
    "map-pin", "compass", "layers", "grid-3x3", "settings",
  ],
  process: [
    "arrow-right", "arrow-down", "rotate-cw", "refresh-cw", "repeat",
    "git-branch", "git-merge", "workflow", "route", "milestone",
    "circle-dot", "play", "pause", "fast-forward", "skip-forward",
    "timer", "hourglass", "list-checks", "kanban", "chart-gantt",
  ],
};

export function getIconSvgPath(name: string): IconNode | undefined {
  return allIcons[name];
}

export function getIconNames(): string[] {
  return Object.keys(allIcons);
}

export function getCatalogIcons(category?: string): string[] {
  if (category && ICON_CATALOG[category]) return ICON_CATALOG[category];
  return Object.values(ICON_CATALOG).flat();
}

export function getIconCategories(): string[] {
  return Object.keys(ICON_CATALOG);
}

// Convert Lucide icon to Fabric.js group object
export function iconToFabric(params: {
  name: string;
  left: number;
  top: number;
  size: number;
  fill: string;
  opacity?: number;
}): Record<string, unknown> | null {
  const nodes = allIcons[params.name];
  if (!nodes) return null;

  const scale = params.size / 24; // Lucide icons are 24x24 viewbox

  const objects = nodes.map(([tag, attrs]) => {
    const base = {
      originX: "left",
      originY: "top",
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      opacity: params.opacity ?? 1,
      visible: true,
      fill: "",
      stroke: params.fill,
      strokeWidth: 2,
      strokeLineCap: "round",
      strokeLineJoin: "round",
    };

    if (tag === "path") {
      return {
        ...base,
        type: "path",
        version: "5.3.0",
        path: parseSvgPath(attrs.d),
      };
    }

    if (tag === "circle") {
      return {
        ...base,
        type: "circle",
        version: "5.3.0",
        left: parseFloat(attrs.cx) - parseFloat(attrs.r),
        top: parseFloat(attrs.cy) - parseFloat(attrs.r),
        radius: parseFloat(attrs.r),
      };
    }

    if (tag === "rect") {
      return {
        ...base,
        type: "rect",
        version: "5.3.0",
        left: parseFloat(attrs.x || "0"),
        top: parseFloat(attrs.y || "0"),
        width: parseFloat(attrs.width || "0"),
        height: parseFloat(attrs.height || "0"),
        rx: parseFloat(attrs.rx || "0"),
        ry: parseFloat(attrs.ry || "0"),
      };
    }

    if (tag === "line") {
      return {
        ...base,
        type: "path",
        version: "5.3.0",
        path: [["M", parseFloat(attrs.x1), parseFloat(attrs.y1)], ["L", parseFloat(attrs.x2), parseFloat(attrs.y2)]],
      };
    }

    if (tag === "polyline" || tag === "polygon") {
      const points = attrs.points.trim().split(/\s+/).map((p) => p.split(",").map(Number));
      const pathData: unknown[][] = points.map((pt, idx) => [idx === 0 ? "M" : "L", pt[0], pt[1]]);
      if (tag === "polygon") pathData.push(["Z"]);
      return {
        ...base,
        type: "path",
        version: "5.3.0",
        path: pathData,
      };
    }

    if (tag === "ellipse") {
      return {
        ...base,
        type: "ellipse",
        version: "5.3.0",
        left: parseFloat(attrs.cx) - parseFloat(attrs.rx),
        top: parseFloat(attrs.cy) - parseFloat(attrs.ry),
        rx: parseFloat(attrs.rx),
        ry: parseFloat(attrs.ry),
      };
    }

    return null;
  }).filter(Boolean);

  return {
    type: "group",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: params.left,
    top: params.top,
    width: 24,
    height: 24,
    scaleX: scale,
    scaleY: scale,
    angle: 0,
    opacity: params.opacity ?? 1,
    visible: true,
    objects,
  };
}

// Parse SVG path d attribute into Fabric.js path array
function parseSvgPath(d: string): unknown[][] {
  const result: unknown[][] = [];
  const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

  for (const cmd of commands) {
    const type = cmd[0];
    const nums = cmd.slice(1).trim().match(/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi)?.map(Number) || [];

    if ("MmLlHhVvZz".includes(type)) {
      if (type === "Z" || type === "z") {
        result.push([type]);
      } else if (type === "H" || type === "h") {
        for (const n of nums) result.push([type, n]);
      } else if (type === "V" || type === "v") {
        for (const n of nums) result.push([type, n]);
      } else {
        for (let i = 0; i < nums.length; i += 2) {
          result.push([type, nums[i], nums[i + 1]]);
        }
      }
    } else if (type === "C" || type === "c") {
      for (let i = 0; i < nums.length; i += 6) {
        result.push([type, nums[i], nums[i + 1], nums[i + 2], nums[i + 3], nums[i + 4], nums[i + 5]]);
      }
    } else if (type === "S" || type === "s") {
      for (let i = 0; i < nums.length; i += 4) {
        result.push([type, nums[i], nums[i + 1], nums[i + 2], nums[i + 3]]);
      }
    } else if (type === "Q" || type === "q") {
      for (let i = 0; i < nums.length; i += 4) {
        result.push([type, nums[i], nums[i + 1], nums[i + 2], nums[i + 3]]);
      }
    } else if (type === "T" || type === "t") {
      for (let i = 0; i < nums.length; i += 2) {
        result.push([type, nums[i], nums[i + 1]]);
      }
    } else if (type === "A" || type === "a") {
      for (let i = 0; i < nums.length; i += 7) {
        result.push([type, nums[i], nums[i + 1], nums[i + 2], nums[i + 3], nums[i + 4], nums[i + 5], nums[i + 6]]);
      }
    } else {
      result.push([type, ...nums]);
    }
  }

  return result;
}
