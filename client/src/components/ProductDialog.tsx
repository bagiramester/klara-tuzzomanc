import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Mail, X } from 'lucide-react';
import { categoryLabel, formatPrice, productCode, type Product } from '@/data/products';
import { Img } from './Picture';

const DIALOG_SIZES = '(min-width: 1024px) 640px, 100vw';

interface ProductDialogProps {
  products: Product[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onInterest: (product: Product) => void;
}

function preload(product?: Product) {
  if (!product?.image) return;
  const img = new Image();
  img.sizes = DIALOG_SIZES;
  img.srcset = product.image.sources.webp ?? '';
  img.src = product.image.img.src;
}

export function ProductDialog({ products, index, onIndexChange, onClose, onInterest }: ProductDialogProps) {
  const product = products[index];
  const count = products.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const prev = () => onIndexChange((index - 1 + count) % count);
  const next = () => onIndexChange((index + 1) % count);

  // Billentyűzet, görgetés-zár, fókusz visszaadása
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // A szomszédos képek előtöltése a gyors lapozáshoz
  useEffect(() => {
    preload(products[(index + 1) % count]);
    preload(products[(index - 1 + count) % count]);
  }, [index, products, count]);

  if (!product) return null;

  const specs = [
    { label: 'Méret', value: product.size },
    { label: 'Anyag', value: product.materialDetail },
    { label: 'Technika', value: product.technique },
  ].filter((s) => !!s.value);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[hsl(224_60%_4%/0.85)] backdrop-blur-md sm:items-center sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-dialog-title"
    >
      <div
        className="paper relative grid max-h-[94svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] shadow-2xl sm:rounded-[1.75rem] lg:h-[min(86vh,620px)] lg:grid-cols-[1.25fr_1fr] lg:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
          touchX.current = null;
        }}
      >
        {/* Kép */}
        <div className="relative flex items-center justify-center bg-white">
          <div className="aspect-square h-[min(52svh,100vw)] lg:aspect-auto lg:h-full lg:w-full">
            {product.image && (
              <Img
                key={product.id}
                picture={product.image}
                sizes={DIALOG_SIZES}
                alt={product.name}
                loading="eager"
                className="h-full w-full object-contain animate-fade-in"
              />
            )}
          </div>

          <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium tabular-nums text-paper">
            {index + 1} / {count}
          </span>

          {count > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg ring-1 ring-ink/10 transition hover:bg-ink hover:text-paper"
                aria-label="Előző ékszer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg ring-1 ring-ink/10 transition hover:bg-ink hover:text-paper"
                aria-label="Következő ékszer"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Részletek */}
        <div className="flex flex-col p-6 sm:p-8 lg:overflow-y-auto">
          <div className="flex items-center justify-between gap-3 lg:pr-12">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cobalt">
              {categoryLabel(product.category)}
            </span>
            <span className="rounded-full border border-ink/15 px-2.5 py-0.5 text-xs font-medium text-ink-muted">
              {productCode(product.id)}
            </span>
          </div>

          <h3 id="product-dialog-title" className="mt-3 font-serif text-3xl leading-tight sm:text-[2.1rem]">
            {product.name}
          </h3>
          <p className="mt-2 font-serif text-2xl text-[hsl(32_70%_38%)]">{formatPrice(product.price)}</p>

          <p className="mt-5 text-[0.95rem] leading-relaxed text-ink/80">{product.longDescription || product.description}</p>

          {specs.length > 0 && (
            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-ink-muted">{s.label}</dt>
                  <dd className="text-right font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.colors.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Színek">
              {product.colors.map((c) => (
                <li key={c} className="rounded-full bg-paper-2 px-3 py-1 text-xs font-medium text-ink/80">
                  {c}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto space-y-2.5 pt-8">
            <button onClick={() => onInterest(product)} className="btn-ink w-full">
              <Mail size={16} />
              Érdeklődöm erről a darabról
            </button>
            {product.image && (
              <a
                href={product.image.img.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-medium text-ink-muted transition hover:text-ink"
              >
                <ExternalLink size={14} />
                Kép megnyitása teljes méretben
              </a>
            )}
          </div>
        </div>

        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-lg ring-1 ring-ink/10 transition hover:bg-ink hover:text-paper"
          aria-label="Bezárás"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
