type LineNames = 'Azul' | 'Amarela' | 'Verde' | 'Vermelha';

const LINE_COLORS: Record<LineNames, string> = {
  Azul: '#0075BF',
  Amarela: '#FFD800',
  Verde: '#00A9A6',
  Vermelha: '#ED1C24',
};

const TRAIN_LINE_MAPPING: Record<string, LineNames> = {
  A: 'Azul',
  B: 'Amarela',
  C: 'Verde',
  D: 'Vermelha',
};

export { LINE_COLORS, TRAIN_LINE_MAPPING };
export type { LineNames };
