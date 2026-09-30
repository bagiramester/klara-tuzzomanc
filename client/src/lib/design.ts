import { useEffect, useState } from 'react';

/**
 * Dizájnváltozatok az összehasonlításhoz (a választás után a végleges marad, a többi törölhető).
 *   a — Klasszikus: a mostani megjelenés, nagyobb betűkkel és több levegővel
 *   b — Modern: lekerekített kártyák, pill gombok, alsó menüsáv mobilon
 *   c — Ékszerdoboz: kék háttér + krémszínű kártyák, sötét szöveggel (legjobb olvashatóság)
 * Kiválasztás: ?design=a|b|c az URL-ben, vagy a jobb alsó váltóval. A böngésző megjegyzi.
 */
export type Design = 'a' | 'b' | 'c';
export const DESIGNS: { id: Design; label: string; title: string }[] = [
  { id: 'a', label: 'A', title: 'Klasszikus' },
  { id: 'b', label: 'B', title: 'Modern' },
  { id: 'c', label: 'C', title: 'Ékszerdoboz' },
];
/** Amíg a választás tart, látszik a jobb alsó A/B/C váltó. Döntés után: false. */
export const DESIGN_PREVIEW = true;
export const DEFAULT_DESIGN: Design = 'a';

const KEY = 'klara-design';
const isDesign = (v: unknown): v is Design => v === 'a' || v === 'b' || v === 'c';

function initialDesign(): Design {
  try {
    const q = new URLSearchParams(window.location.search).get('design');
    if (isDesign(q)) {
      localStorage.setItem(KEY, q);
      return q;
    }
    const saved = localStorage.getItem(KEY);
    if (DESIGN_PREVIEW && isDesign(saved)) return saved;
  } catch {
    /* privát mód stb. */
  }
  return DEFAULT_DESIGN;
}

let current: Design = initialDesign();
document.documentElement.dataset.design = current;
const listeners = new Set<(d: Design) => void>();

export function setDesign(d: Design) {
  current = d;
  document.documentElement.dataset.design = d;
  try {
    localStorage.setItem(KEY, d);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(d));
}

export function useDesign(): Design {
  const [d, setD] = useState<Design>(current);
  useEffect(() => {
    listeners.add(setD);
    return () => {
      listeners.delete(setD);
    };
  }, []);
  return d;
}
