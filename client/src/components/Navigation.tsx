import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { scrollToSection } from '@/lib/scroll';

export const navLinks = [
  { id: 'kollekcio', label: 'Kollekció' },
  { id: 'rolam', label: 'Rólam' },
  { id: 'folyamat', label: 'A folyamat' },
  { id: 'vasarlas', label: 'Vásárlás' },
  { id: 'kapcsolat', label: 'Kapcsolat' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Az éppen látható szekció kiemelése a menüben
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const go = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2.5' : 'py-4 md:py-6'
        }`}
        data-testid="nav-main"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 transition-all duration-500 ${
            scrolled ? 'lg:px-6' : 'lg:px-10'
          }`}
        >
          <div
            className={`flex w-full items-center justify-between gap-6 rounded-full transition-all duration-500 ${
              scrolled ? 'glass border border-white/[0.07] py-2 pl-2 pr-2 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.6)] sm:pr-3' : 'border border-transparent'
            }`}
          >
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                go('hero');
              }}
              className="rounded-full"
              data-testid="button-home"
            >
              <Logo size={scrolled ? 38 : 44} />
              <span className="sr-only"> — vissza az oldal tetejére</span>
            </a>

            <nav className="hidden md:flex items-center gap-1" aria-label="Fő navigáció">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`rounded-full px-4 py-2 text-[0.84rem] font-medium transition-colors ${
                    active === link.id
                      ? 'bg-gold/10 text-gold-bright'
                      : 'text-foreground/75 hover:text-foreground hover:bg-white/5'
                  }`}
                  data-testid={`nav-link-${link.id}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => go('kapcsolat')}
                className="btn-gold hidden lg:inline-flex !px-5 !py-2.5 text-[0.8rem]"
              >
                Érdeklődöm
              </button>
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden grid h-11 w-11 place-items-center rounded-full border border-gold/30 text-gold-bright"
                aria-label={mobileOpen ? 'Menü bezárása' : 'Menü megnyitása'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                data-testid="button-mobile-menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col justify-center bg-background/95 px-8 py-24 backdrop-blur-xl md:hidden animate-fade-in"
          data-testid="drawer-mobile-menu"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobil navigáció">
            {navLinks.map((link, i) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className="flex items-baseline gap-4 border-b border-white/[0.06] py-4 text-left font-serif text-3xl text-foreground transition-colors hover:text-gold-bright animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="font-sans text-xs text-gold/70 tabular-nums">0{i + 1}</span>
                {link.label}
              </button>
            ))}
          </nav>
          <button onClick={() => go('kapcsolat')} className="btn-gold mt-10 w-full">
            Érdeklődöm
          </button>
        </div>
      )}
    </>
  );
}
