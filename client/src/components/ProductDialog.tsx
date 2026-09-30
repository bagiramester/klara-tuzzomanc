import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Mail, X } from 'lucide-react';
import { categoryLabel, formatPrice, productCode, type Product } from '@/data/products';
import { Img } from './Picture';

const DIALOG_SIZES = '(min-width: 1024px) 600px, 100vw';

interface ProductDialogProps {
  products: Product[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onInterest: (product: Product) => void;
}

function preload(product?: Product) {
  if (!product) return;
  const img = new Image();
  img.sizes = DIALOG_SIZES;
  img.srcset = product.image.sources.webp ?? '';
  img.src = product.image.img.src;
}

const arrowClass =
  'absolute top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/75 border border-gold/40 text-gold-bright hover:bg-gold hover:text-background transition-all shadow-lg backdrop-blur-sm';

export function ProductDialog({ products, index, onIndexChange, onClose, onInterest }: ProductDialogProps) {
  const product = products[index];
  const count = products.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const prev = () => onIndexChange((index - 1 + count) % count);
  const next = () => onIndexChange((index + 1) % count);

  // Görgetés-zár, fókusz a bezárás gombra, majd vissza az eredeti elemre
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
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

  // Lapozáskor a leírás az elejéről induljon; a szomszédos képek előtöltése
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md sm:p-6 lg:p-10 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-dialog-title"
    >
      <div
        className="relative flex h-[100svh] w-full max-w-5xl flex-col overflow-hidden border-gold/40 bg-card shadow-2xl sm:h-auto sm:max-h-[90svh] sm:border lg:grid lg:h-[min(88svh,680px)] lg:grid-cols-12 lg:grid-rows-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kép */}
        <div
          className="relative flex h-[44svh] shrink-0 items-center justify-center bg-black/60 p-4 sm:h-[46svh] lg:col-span-7 lg:h-full lg:min-h-0 lg:p-6"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
            touchX.current = null;
          }}
        >
          <Img
            key={product.id}
            picture={product.image}
            sizes={DIALOG_SIZES}
            alt={product.name}
            loading="eager"
            className="max-h-full w-auto max-w-full object-contain rounded shadow-2xl animate-fade-in"
          />

          <span className="absolute left-3 top-3 z-20 px-3 py-1 bg-background/80 border border-gold/30 text-xs tracking-widest text-gold-bright tabular-nums backdrop-blur-sm">
            {index + 1} / {count}
          </span>

          {count > 1 && (
            <>
              <button onClick={prev} className={`${arrowClass} left-3`} aria-label="Előző ékszer">
                <ChevronLeft size={22} />
              </button>
              <button onClick={next} className={`${arrowClass} right-3`} aria-label="Következő ékszer">
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Részletek: a szöveg görgethető, a gombok mindig látszanak alul */}
        <div className="flex min-h-0 flex-1 flex-col bg-background/90 lg:col-span-5 lg:h-full">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 lg:p-8">
            <div className="flex items-center justify-between gap-2 mb-3 lg:pr-10">
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold font-medium">
                {categoryLabel(product.category)}
              </span>
              <span className="text-xs text-muted-foreground">Sorszám: {productCode(product.id)}</span>
            </div>

            <h3 id="product-dialog-title" className="font-serif text-3xl text-foreground mb-3 leading-tight">
              {product.name}
            </h3>
            <div className="text-2xl font-serif text-gold-bright mb-6">{formatPrice(product.price)}</div>

            <div className="gold-divider mb-6 opacity-40" />

            <p className="text-sm text-foreground/80 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {specs.length > 0 && (
              <dl className="mt-6 divide-y divide-gold/10 border-y border-gold/15 text-sm">
                {specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-6 py-2.5">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {product.colors.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Színek">
                {product.colors.map((c) => (
                  <li key={c} className="px-3 py-1 border border-gold/20 text-xs text-foreground/80">
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="shrink-0 space-y-3 border-t border-gold/20 bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-8 lg:pb-8 lg:pt-5">
            <button
              onClick={() => onInterest(product)}
              className="w-full py-3.5 gold-gradient text-background font-medium tracking-[0.15em] uppercase text-xs hover:shadow-[0_4px_24px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
              data-testid="button-dialog-interest"
            >
              <Mail size={16} />
              Érdeklődés erről a darabról
            </button>
            <a
              href={product.image.img.src}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border border-gold/30 text-gold hover:border-gold hover:bg-gold/10 transition-colors text-xs tracking-wider uppercase flex items-center justify-center gap-2"
              data-testid="link-dialog-image"
            >
              <ExternalLink size={14} />
              Kép megnyitása új lapon
            </a>
          </div>
        </div>

        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-3 top-3 z-30 p-2.5 rounded-full bg-background/80 border border-gold/30 text-gold-bright hover:bg-gold hover:text-background transition-all backdrop-blur-sm"
          aria-label="Bezárás"
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
}
