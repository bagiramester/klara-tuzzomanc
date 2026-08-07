import { useState, useEffect, useCallback } from 'react';
import { products, categories, formatPrice, type Category, type Product } from '@/data/products';
import { ZoomIn, X, ChevronLeft, ChevronRight, ExternalLink, Mail } from 'lucide-react';

type Filter = Category | 'all';

interface CollectionProps {
  onSelectProduct?: (product: Product) => void;
}

export function Collection({ onSelectProduct }: CollectionProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  // Filter products based on selected category
  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => p.category === activeFilter);

  const activeProduct = selectedProductIndex !== null ? filteredProducts[selectedProductIndex] : null;

  // Handle modal navigation
  const handlePrev = useCallback(() => {
    if (selectedProductIndex !== null && filteredProducts.length > 0) {
      setSelectedProductIndex((prev) =>
        prev === 0 ? filteredProducts.length - 1 : (prev as number) - 1
      );
    }
  }, [selectedProductIndex, filteredProducts]);

  const handleNext = useCallback(() => {
    if (selectedProductIndex !== null && filteredProducts.length > 0) {
      setSelectedProductIndex((prev) =>
        prev === filteredProducts.length - 1 ? 0 : (prev as number) + 1
      );
    }
  }, [selectedProductIndex, filteredProducts]);

  const closeModal = useCallback(() => {
    setSelectedProductIndex(null);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProductIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProductIndex, closeModal, handlePrev, handleNext]);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (selectedProductIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProductIndex]);

  const handleInterest = (product: Product) => {
    closeModal();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    const contactElement = document.getElementById('kapcsolat');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="kollekcio" className="py-24 md:py-32 px-6 bg-background/50 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Ékszerkatalógus</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Kézzel készült
            <span className="block italic gold-gradient-text mt-2">tűzzománc alkotások</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
            Minden darab egyedi, kézzel formázott réz, ezüst vagy bronz alapon készült, 820°C-os égetéssel.
            Kattints bármelyik képre a részletes nagyításhoz!
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <button
            onClick={() => {
              setActiveFilter('all');
              setSelectedProductIndex(null);
            }}
            className={`px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
              activeFilter === 'all'
                ? 'bg-gold/15 border-gold text-gold-bright shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                : 'border-card-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
            }`}
            data-testid="filter-all"
          >
            Összes ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id);
                  setSelectedProductIndex(null);
                }}
                className={`px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
                  activeFilter === cat.id
                    ? 'bg-gold/15 border-gold text-gold-bright shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'border-card-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
                }`}
                data-testid={`filter-${cat.id}`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <article
              key={product.id}
              className="group flex flex-col bg-card/60 border border-card-border hover:border-gold/50 transition-all duration-500 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              data-testid={`card-product-${product.id}`}
            >
              {/* Image area */}
              <div
                className="relative aspect-square overflow-hidden bg-background/50 cursor-pointer"
                onClick={() => setSelectedProductIndex(index)}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center relative"
                    style={{ background: product.imageBg }}
                  >
                    <span className="font-serif italic text-2xl text-white/50 px-6 text-center z-10">
                      {product.name}
                    </span>
                  </div>
                )}

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-background/85 backdrop-blur-sm border border-gold/40 z-10">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-gold-bright">Kiemelt</span>
                  </div>
                )}

                {/* Hover overlay with Zoom icon */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/60 text-gold-bright flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <ZoomIn size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-xs tracking-[0.2em] uppercase text-gold-bright font-medium">Nagyítás</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex-1">
                  <h3
                    className="font-serif text-xl text-foreground mb-2 leading-tight group-hover:text-gold-bright transition-colors cursor-pointer"
                    onClick={() => setSelectedProductIndex(index)}
                    data-testid={`text-name-${product.id}`}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-gold/15 flex items-center justify-between gap-4 mt-auto">
                  <span className="font-serif text-lg text-gold-bright font-medium">
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
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md transition-opacity duration-300"
          onClick={closeModal}
        >
          {/* Top Bar: Close & Counter */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50">
            <div className="px-4 py-1.5 bg-background/80 border border-gold/30 text-xs tracking-widest text-gold-bright uppercase backdrop-blur-sm">
              {selectedProductIndex! + 1} / {filteredProducts.length}
            </div>
            <button
              onClick={closeModal}
              className="p-2.5 rounded-full bg-background/80 border border-gold/30 text-gold-bright hover:bg-gold hover:text-background transition-all backdrop-blur-sm"
              aria-label="Bezárás"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Container */}
          <div
            className="relative max-w-5xl w-full bg-card/95 border border-gold/40 shadow-2xl overflow-hidden grid lg:grid-cols-12 gap-0 my-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left / Prev Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/75 border border-gold/40 text-gold-bright hover:bg-gold hover:text-background transition-all shadow-lg backdrop-blur-sm"
              aria-label="Előző kép"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right / Next Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background/75 border border-gold/40 text-gold-bright hover:bg-gold hover:text-background transition-all shadow-lg backdrop-blur-sm lg:hidden"
              aria-label="Következő kép"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Preview (8 cols on Desktop) */}
            <div className="lg:col-span-7 bg-black/60 relative flex items-center justify-center p-6 min-h-[320px] lg:min-h-[500px]">
              {activeProduct.image ? (
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded shadow-2xl"
                />
              ) : (
                <div
                  className="w-full h-64 flex items-center justify-center rounded"
                  style={{ background: activeProduct.imageBg }}
                >
                  <span className="font-serif italic text-3xl text-white/60 text-center px-4">
                    {activeProduct.name}
                  </span>
                </div>
              )}
            </div>

            {/* Product Details Sidebar (5 cols on Desktop) */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto bg-background/90">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-gold font-medium">
                    {categories.find((c) => c.id === activeProduct.category)?.name || activeProduct.category}
                  </span>
                  <span className="text-xs text-muted-foreground">ID: {activeProduct.id}</span>
                </div>

                <h3 className="font-serif text-3xl text-foreground mb-3 leading-tight">
                  {activeProduct.name}
                </h3>

                <div className="text-2xl font-serif text-gold-bright mb-6">
                  {formatPrice(activeProduct.price)}
                </div>

                <div className="gold-divider mb-6 opacity-40" />

                <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                  {activeProduct.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gold/20 mt-auto">
                <button
                  onClick={() => handleInterest(activeProduct)}
                  className="w-full py-3.5 gold-gradient text-background font-medium tracking-[0.15em] uppercase text-xs hover:shadow-[0_4px_24px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  <span>Érdeklődés erről a darabról</span>
                </button>

                {activeProduct.image && (
                  <a
                    href={activeProduct.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 border border-gold/30 text-gold hover:border-gold hover:bg-gold/10 transition-colors text-xs tracking-wider uppercase flex items-center justify-center gap-2 text-center"
                  >
                    <ExternalLink size={14} />
                    <span>Kép megnyitása új lapon</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
