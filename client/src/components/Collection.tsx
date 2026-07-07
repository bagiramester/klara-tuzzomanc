import { useState } from 'react';
import { products, categories, formatPrice, type Category, type Product } from '@/data/products';
import { Heart } from 'lucide-react';

type Filter = Category | 'all';

interface ProductCardProps {
  product: Product;
  onInterest: (product: Product) => void;
}

function ProductCard({ product, onInterest }: ProductCardProps) {
  return (
    <article
      className="group flex flex-col bg-card/60 border border-card-border hover:border-gold/40 transition-all duration-500"
      data-testid={`card-product-${product.id}`}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-background/50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{ background: product.imageBg }}
          >
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            }} />
            <span className="font-serif italic text-2xl text-white/50 px-6 text-center relative z-10">
              {product.name.replace(' medál', '').replace(' fülbevaló', '').replace(' karkötő', '').replace(' bross', '').replace(' szett', '')}
            </span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-background/85 backdrop-blur-sm border border-gold/40">
            <span className="text-[10px] tracking-[0.2em] uppercase text-gold-bright">Kiemelt</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex-1">
          <h3 className="font-serif text-2xl text-foreground mb-2 leading-tight" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {product.description}
          </p>

          {(product.size || product.materialDetail || product.technique) && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 mb-5 text-xs" data-testid={`specs-${product.id}`}>
              {product.size && (
                <>
                  <dt className="tracking-[0.18em] uppercase text-gold/60">Méret</dt>
                  <dd className="text-foreground/85">{product.size}</dd>
                </>
              )}
              {product.materialDetail && (
                <>
                  <dt className="tracking-[0.18em] uppercase text-gold/60">Anyag</dt>
                  <dd className="text-foreground/85">{product.materialDetail}</dd>
                </>
              )}
              {product.technique && (
                <>
                  <dt className="tracking-[0.18em] uppercase text-gold/60">Technika</dt>
                  <dd className="text-foreground/85">{product.technique}</dd>
                </>
              )}
            </dl>
          )}

          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.colors.map((color) => (
              <span
                key={color}
                className="text-[11px] tracking-wider uppercase text-gold/70 border border-gold/20 px-2 py-1"
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/60">
          <span className="font-serif text-2xl text-gold-bright" data-testid={`text-price-${product.id}`}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onInterest(product)}
            className="px-5 py-3 border border-gold/40 text-gold-bright text-xs tracking-[0.2em] uppercase hover:bg-gold/10 hover:border-gold transition-all duration-300 inline-flex items-center gap-2"
            data-testid={`button-interest-${product.id}`}
          >
            <Heart size={14} />
            Érdeklődöm
          </button>
        </div>
      </div>
    </article>
  );
}

interface CollectionProps {
  onInterest: (product: Product) => void;
}

export function Collection({ onInterest }: CollectionProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filteredProducts =
    filter === 'all' ? products : products.filter((p) => p.category === filter);

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Minden darab' },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <section id="kollekcio" className="relative py-24 lg:py-32 px-6" data-testid="section-collection">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-gold/70 tracking-[0.4em] text-xs uppercase mb-4">A Kollekció</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Egyedi darabok,
            <span className="block italic gold-gradient-text mt-2">tűzben születve</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <div className="w-1 h-1 rotate-45 bg-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
          <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Minden ékszer egyedi — két azonos darab nem létezik. Réz, ezüst és bronz alapra
            ráégetett zománcrétegek, hosszú napok aprólékos munkájával.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14" role="tablist" aria-label="Termékkategóriák">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                role="tab"
                aria-selected={active}
                className={`px-5 sm:px-7 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-300 border ${
                  active
                    ? 'bg-gold text-background border-gold shadow-[0_4px_24px_rgba(212,175,55,0.25)]'
                    : 'border-gold/30 text-foreground/80 hover:border-gold/60 hover:text-gold-bright'
                }`}
                data-testid={`filter-${f.id}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-testid="grid-products">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onInterest={onInterest} />
          ))}
        </div>

        {/* Count */}
        <p className="text-center text-sm text-muted-foreground mt-12 tracking-wider">
          {filteredProducts.length} darab a kollekcióban
        </p>
      </div>
    </section>
  );
}
