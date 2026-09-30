import { DESIGNS, DESIGN_PREVIEW, setDesign, useDesign } from '@/lib/design';

/** Ideiglenes A/B/C váltó a dizájnváltozatok összehasonlításához (jobb alsó sarok). */
export function DesignSwitcher() {
  const design = useDesign();
  if (!DESIGN_PREVIEW) return null;
  return (
    <div
      className="design-switcher fixed right-1.5 top-1/2 z-[70] flex -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-gold/40 bg-background/90 p-1 shadow-xl backdrop-blur-md"
      role="radiogroup"
      aria-label="Dizájnváltozat"
    >
      {DESIGNS.map((d) => (
        <button
          key={d.id}
          role="radio"
          aria-checked={design === d.id}
          title={d.title}
          onClick={() => setDesign(d.id)}
          className={`grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition ${
            design === d.id ? 'bg-gold text-background' : 'text-gold-bright hover:bg-gold/15'
          }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
