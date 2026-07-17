import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { id: 'kollekcio', label: 'Kollekció' },
  { id: 'rolam', label: 'Rólam' },
  { id: 'folyamat', label: 'A folyamat' },
  { id: 'vasarlas', label: 'Vásárlás' },
  { id: 'kapcsolat', label: 'Kapcsolat' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-gold/20 py-3'
            : 'bg-transparent py-6'
        }`}
        data-testid="nav-main"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 group"
            data-testid="button-home"
            aria-label="Vissza a főoldalra"
          >
            <Logo size={scrolled ? 40 : 48} showText={false} />
            <div className="hidden sm:block text-left">
              <div className="font-serif text-gold-bright tracking-[0.25em] text-base leading-none">
                KLÁRA
              </div>
              <div className="font-serif text-gold/60 tracking-[0.2em] text-[9px] mt-1 uppercase">
                Tűzzománc
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-5 py-2.5 text-[15px] tracking-wide text-foreground/85 hover:text-gold-bright transition-colors duration-300 relative group"
                data-testid={`link-${link.id}`}
              >
                {link.label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-px bg-gold group-hover:w-6 transition-all duration-300" />
              </button>
            ))}
            <button
              onClick={() => scrollTo('kapcsolat')}
              className="ml-4 px-6 py-2.5 border border-gold/50 text-gold-bright hover:bg-gold/10 hover:border-gold-bright transition-all duration-300 text-[14px] tracking-[0.15em] uppercase"
              data-testid="button-cta-erdeklodes"
            >
              Érdeklődés
            </button>
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden p-3 text-gold-bright"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden flex flex-col items-center justify-center gap-2 animate-fade-in"
          data-testid="menu-mobile"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="px-8 py-4 text-2xl font-serif text-foreground hover:text-gold-bright transition-colors"
              data-testid={`link-mobile-${link.id}`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('kapcsolat')}
            className="mt-6 px-10 py-4 border border-gold text-gold-bright text-lg tracking-[0.15em] uppercase"
          >
            Érdeklődés
          </button>
        </div>
      )}
    </>
  );
}
