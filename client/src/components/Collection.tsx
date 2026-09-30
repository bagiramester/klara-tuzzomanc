import { useMemo, useState } from 'react';
import { Mail, Search, X, ZoomIn } from 'lucide-react';
import { products, categories, formatPrice, isNew, productCode, type Category, type Product } from '@/data/products';
import { scrollToSection } from '@/lib/scroll';
import { Img } from './Picture';
import { ProductDialog } from './ProductDialog';

type Filter = Category | 'all';
type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc';

const PAGE_SIZE = 24;
const CARD_SIZES = '(min-width: 1280px) 300px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw';

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

  const chipClass = (active: boolean) =>
    `px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 border shrink-0 ${
      active
        ? 'bg-gold/15 border-gold text-gold-bright shadow-[0_0_20px_rgba(212,175,55,0.2)]'
        : 'border-card-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
    }`;

  return (
    <section id="kollekcio" className="py-24 md:py-32 px-6 relative" aria-labelledby="kollekcio-title">
      <div className="max-w-7xl mx-auto">
        {/* Fejléc */}
        <div className="text-center mb-14 reveal">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Ékszerkatalógus</p>
          <h2 id="kollekcio-title" className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Kézzel készült
            <span className="block italic gold-gradient-text mt-2">tűzzománc alkotások</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
            Minden darab egyedi, kézzel formázott réz, ezüst vagy bronz alapon készült, 820°C-os égetéssel.
            Kattints bármelyik képre a részletes nagyításhoz!
          </p>
        </div>

        {/* Kategóriák */}
        <div className="-mx-6 px-6 flex sm:flex-wrap items-center sm:justify-center gap-3 overflow-x-auto scrollbar-none" role="tablist" aria-label="Kategóriák">
          {chips.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              onClick={() => changeFilter(c.id)}
              className={chipClass(filter === c.id)}
              data-testid={`filter-${c.id}`}
            >
              {c.label} ({c.count})
            </button>
          ))}
        </div>

        {/* Keresés + rendezés */}
        <div className="mt-5 mb-14 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <label className="relative sm:w-80">
            <span className="sr-only">Keresés az ékszerek között</span>
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Keresés (név, szín, sorszám)"
              className="field !py-2.5 pl-11 pr-10 text-sm [&::-webkit-search-cancel-button]:hidden"
              data-testid="input-search"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-gold-bright"
                aria-label="Keresés törlése"
              >
                <X size={15} />
              </button>
            )}
          </label>
          <label className="relative">
            <span className="sr-only">Rendezés</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="field !py-2.5 pr-10 text-sm appearance-none cursor-pointer"
              data-testid="select-sort"
            >
              <option value="featured">Ajánlott sorrend</option>
              <option value="newest">Legújabb elöl</option>
              <option value="price-asc">Ár szerint növekvő</option>
              <option value="price-desc">Ár szerint csökkenő</option>
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-gold/70" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>
        </div>

        {/* Termékrács */}
        {list.length === 0 ? (
          <div className="border border-dashed border-card-border py-20 text-center">
            <p className="font-serif text-2xl text-foreground">Nincs találat</p>
            <p className="mt-2 text-sm text-muted-foreground">Próbálj más kulcsszót, vagy nézd meg az összes ékszert.</p>
            <button
              onClick={() => {
                setQuery('');
                changeFilter('all');
              }}
              className="btn-outline mt-6 !py-3"
            >
              Összes ékszer
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visible.map((product, index) => (
              <li key={product.id} className="reveal" style={{ ['--reveal-delay' as string]: `${(index % 4) * 60}ms` }}>
                <article
                  className="group h-full flex flex-col bg-card/60 border border-card-border hover:border-gold/50 transition-all duration-500 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                  data-testid={`card-product-${product.id}`}
                >
                  <button
                    onClick={() => setOpenIndex(index)}
                    className="relative block aspect-square w-full overflow-hidden bg-background/50"
                    aria-label={`${product.name} — nagyítás és részletek`}
                  >
                    <Img
                      picture={product.image}
                      sizes={CARD_SIZES}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {(product.featured || isNew(product)) && (
                      <span className="absolute top-3 left-3 flex gap-2 z-10">
                        {isNew(product) && (
                          <span className="px-3 py-1 bg-accent/90 text-[10px] tracking-[0.2em] uppercase text-white">Új</span>
                        )}
                        {product.featured && (
                          <span className="px-3 py-1 bg-background/85 backdrop-blur-sm border border-gold/40 text-[10px] tracking-[0.2em] uppercase text-gold-bright">
                            Kiemelt
                          </span>
                        )}
                      </span>
                    )}
                    <span className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                      <span className="w-12 h-12 rounded-full bg-gold/20 border border-gold/60 text-gold-bright flex items-center justify-center shadow-lg">
                        <ZoomIn size={22} strokeWidth={1.5} />
                      </span>
                      <span className="text-xs tracking-[0.2em] uppercase text-gold-bright font-medium">Nagyítás</span>
                    </span>
                  </button>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex-1">
                      <h3
                        className="font-serif text-xl text-foreground mb-2 leading-tight group-hover:text-gold-bright transition-colors"
                        data-testid={`text-name-${product.id}`}
                      >
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="pt-4 border-t border-gold/15 flex items-center justify-between gap-4 mt-auto">
                      <span className="font-serif text-lg text-gold-bright font-medium whitespace-nowrap">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => handleInterest(product)}
                        className="px-4 py-2 text-xs tracking-wider uppercase border border-gold/40 text-gold hover:bg-gold hover:text-background font-medium transition-all duration-300 flex items-center gap-1.5"
                        data-testid={`button-interest-${product.id}`}
                      >
                        <Mail size={14} />
                        <span>Érdeklődöm</span>
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {remaining > 0 && (
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {visible.length} / {list.length} ékszer látható
            </p>
            <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="btn-outline" data-testid="button-load-more">
              További ékszerek ({remaining})
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
