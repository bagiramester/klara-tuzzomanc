import { useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { products, categories, formatPrice, isNew, productCode, type Category, type Product } from '@/data/products';
import { scrollToSection } from '@/lib/scroll';
import { Img } from './Picture';
import { ProductDialog } from './ProductDialog';

type Filter = Category | 'all';
type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc';

const PAGE_SIZE = 12;
const CARD_SIZES = '(min-width: 1280px) 300px, (min-width: 768px) 31vw, 46vw';

// Ékezet- és kisbetű-független keresés
const normalize = (s: string) =>
  s.toLocaleLowerCase('hu').normalize('NFD').replace(/[̀-ͯ]/g, '');

const searchIndex = new Map(
  products.map((p) => [
    p.id,
    normalize([p.name, p.description, productCode(p.id), p.materialDetail ?? '', p.technique ?? '', ...p.colors].join(' ')),
  ]),
);

interface CollectionProps {
  onSelectProduct?: (product: Product) => void;
}

export function Collection({ onSelectProduct }: CollectionProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('featured');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const list = useMemo(() => {
    const q = normalize(query.trim());
    let result = products.filter(
      (p) => (filter === 'all' || p.category === filter) && (!q || searchIndex.get(p.id)!.includes(q)),
    );
    const added = (p: Product) => (p.addedAt ? new Date(p.addedAt).getTime() : 0);
    if (sort === 'featured') {
      // kiemeltek elöl, utánuk a legfrissebb feltöltések, majd a katalógus sorrendje
      result = [...result].sort(
        (a, b) => Number(!!b.featured) - Number(!!a.featured) || Number(isNew(b)) - Number(isNew(a)) || added(b) - added(a),
      );
    } else if (sort === 'newest') {
      result = [...result].sort((a, b) => added(b) - added(a));
    } else {
      result = [...result].sort((a, b) => (sort === 'price-asc' ? a.price - b.price : b.price - a.price));
    }
    return result;
  }, [filter, sort, query]);

  const visible = list.slice(0, visibleCount);
  const remaining = list.length - visible.length;

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setVisibleCount(PAGE_SIZE);
  };

  const handleInterest = (product: Product) => {
    setOpenIndex(null);
    onSelectProduct?.(product);
    // a dialógus bezárása után görgessünk
    requestAnimationFrame(() => scrollToSection('kapcsolat'));
  };

  const chips: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'Összes', count: products.length },
    ...categories
      .map((c) => ({ id: c.id as Filter, label: c.label, count: products.filter((p) => p.category === c.id).length }))
      .filter((c) => c.count > 0),
  ];

  return (
    <section id="kollekcio" className="paper relative py-24 md:py-32" aria-labelledby="kollekcio-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Fejléc */}
        <div className="reveal grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="eyebrow !text-[hsl(32_70%_40%)]">Ékszerkatalógus</p>
            <h2 id="kollekcio-title" className="section-title mt-5">
              Kézzel készült <em className="text-cobalt">tűzzománc</em> alkotások
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ink-muted md:justify-self-end md:text-right">
            Minden darab egyedi: kézzel formázott réz, ezüst vagy bronz alapon, 820 °C-os égetéssel.
            Kattints bármelyik ékszerre a részletekért!
          </p>
        </div>

        {/* Szűrők — görgetéskor a menü alatt maradnak */}
        <div className="relative z-20 -mx-4 mt-12 bg-paper/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:sticky md:top-[4.9rem] lg:mx-0 lg:rounded-full lg:px-3 lg:shadow-[0_10px_30px_-18px_hsl(224_45%_13%/0.35)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Kategóriák">
              {chips.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={filter === c.id}
                  onClick={() => changeFilter(c.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    filter === c.id
                      ? 'bg-ink text-paper shadow-md'
                      : 'bg-white text-ink/75 ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25'
                  }`}
                  data-testid={`filter-${c.id}`}
                >
                  {c.label}
                  <span className={`ml-1.5 tabular-nums ${filter === c.id ? 'text-paper/70' : 'text-ink/60'}`}>
                    {c.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <label className="relative flex-1 lg:w-60 lg:flex-none">
                <span className="sr-only">Keresés az ékszerek között</span>
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder="Keresés (pl. kék, M12)"
                  className="w-full rounded-full bg-white py-2 pl-10 pr-9 text-sm text-ink ring-1 ring-ink/10 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-cobalt/40 [&::-webkit-search-cancel-button]:hidden"
                  data-testid="input-search"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink"
                    aria-label="Keresés törlése"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              <label className="relative">
                <span className="sr-only">Rendezés</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-full appearance-none rounded-full bg-white py-2 pl-4 pr-9 text-sm font-medium text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-cobalt/40"
                  data-testid="select-sort"
                >
                  <option value="featured">Ajánlott</option>
                  <option value="newest">Legújabb</option>
                  <option value="price-asc">Ár ↑</option>
                  <option value="price-desc">Ár ↓</option>
                </select>
                <svg className="pointer-events-none absolute right-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/50" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </label>
            </div>
          </div>
        </div>

        {/* Termékrács */}
        {list.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-ink/15 py-20 text-center">
            <p className="font-serif text-2xl">Nincs találat</p>
            <p className="mt-2 text-sm text-ink-muted">Próbálj más kulcsszót, vagy nézd meg az összes ékszert.</p>
            <button
              onClick={() => {
                setQuery('');
                changeFilter('all');
              }}
              className="btn-ink mt-6"
            >
              Összes ékszer
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-10">
            {visible.map((product, index) => (
              <li
                key={product.id}
                className="reveal"
                style={{ ['--reveal-delay' as string]: `${(index % 4) * 70}ms` }}
              >
                <article className="group flex h-full flex-col" data-testid={`card-product-${product.id}`}>
                  <button
                    onClick={() => setOpenIndex(index)}
                    className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-ink/[0.06] transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-20px_hsl(224_45%_13%/0.35)]"
                    aria-label={`${product.name} — részletek`}
                  >
                    {product.image && (
                      <Img
                        picture={product.image}
                        sizes={CARD_SIZES}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    )}
                    {(product.featured || isNew(product)) && (
                      <span className="absolute left-2.5 top-2.5 flex gap-1.5">
                        {isNew(product) && (
                          <span className="rounded-full bg-[hsl(22_80%_50%)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                            Új
                          </span>
                        )}
                        {product.featured && (
                          <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold-bright backdrop-blur">
                            Kiemelt
                          </span>
                        )}
                      </span>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white/95 text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Plus size={16} />
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col px-1 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg leading-snug sm:text-xl" data-testid={`text-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <span className="mt-1 shrink-0 text-[0.7rem] font-medium text-ink/60">{productCode(product.id)}</span>
                    </div>
                    <p className="mt-1 hidden text-sm leading-relaxed text-ink-muted line-clamp-2 sm:block">
                      {product.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <span className="whitespace-nowrap font-semibold tabular-nums text-ink">{formatPrice(product.price)}</span>
                      <button
                        onClick={() => handleInterest(product)}
                        className="hidden rounded-full px-3 py-1.5 text-xs font-semibold text-cobalt ring-1 ring-cobalt/25 transition hover:bg-cobalt hover:text-white sm:inline-flex"
                        data-testid={`button-interest-${product.id}`}
                      >
                        Érdeklődöm
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {remaining > 0 && (
          <div className="mt-14 flex flex-col items-center gap-3">
            <p className="text-sm text-ink-muted">
              {visible.length} / {list.length} ékszer látható
            </p>
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="btn-ink"
              data-testid="button-load-more"
            >
              További {Math.min(PAGE_SIZE, remaining)} ékszer
            </button>
          </div>
        )}
      </div>

      {openIndex !== null && (
        <ProductDialog
          products={list}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          onInterest={handleInterest}
        />
      )}
    </section>
  );
}
