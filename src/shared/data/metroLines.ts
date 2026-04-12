// Metro line constants
type LineNames = "Azul" | "Amarela" | "Verde" | "Vermelha";

// Line color constants
const LINE_COLORS: Record<LineNames, string> = {
  Azul: "#0075BF",
  Amarela: "#FFD800",
  Verde: "#00A9A6",
  Vermelha: "#ED1C24",
};

// Map train ID suffix to line name
const TRAIN_LINE_MAPPING: Record<string, LineNames> = {
  A: "Azul",
  B: "Amarela",
  C: "Verde",
  D: "Vermelha",
};

export { LINE_COLORS, TRAIN_LINE_MAPPING };
export type { LineNames };
