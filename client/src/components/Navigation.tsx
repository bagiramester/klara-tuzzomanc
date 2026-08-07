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
            <Logo size={scrolled ? 40 : 48} showText={true} />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Fő navigáció">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-xs tracking-[0.2em] uppercase text-foreground/80 hover:text-gold-bright transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all hover:after:w-full"
                data-testid={`nav-link-${link.id}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gold-bright hover:text-gold transition-colors"
            aria-label={mobileOpen ? 'Menü bezárása' : 'Menü megnyitása'}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col justify-center px-8 py-20 md:hidden animate-fade-in"
          data-testid="drawer-mobile-menu"
        >
          <nav className="flex flex-col items-center gap-8" aria-label="Mobil navigáció">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="font-serif text-2xl tracking-[0.15em] text-foreground hover:text-gold-bright transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
