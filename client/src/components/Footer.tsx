import { Facebook, ArrowUp } from 'lucide-react';
import { Logo } from './Logo';
import { navLinks } from './Navigation';
import { scrollToSection } from '@/lib/scroll';
import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[hsl(224_65%_5%)] pt-16 pb-8" data-testid="footer">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size={52} />
            <p className="mt-6 font-serif text-2xl italic text-gold-bright">„Tűzzel, szívvel, lélekkel.”</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/55">
              Egyedi tervezésű, kézzel készített tűzzománc ékszerek Budapestről. Minden darab a hagyományos
              ötvöstechnikák és a 820 °C-os égetés eredménye.
            </p>
          </div>

          <nav aria-label="Lábléc navigáció">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/80">Oldal</h2>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-foreground/65 transition-colors hover:text-gold-bright"
                    data-testid={`footer-link-${link.id}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold/80">Kapcsolat</h2>
            <ul className="mt-5 space-y-3 text-sm text-foreground/65">
              <li>
                <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-gold-bright">
                  {site.email}
                </a>
              </li>
              <li>Budapest, Magyarország</li>
              <li>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold-bright"
                  data-testid="footer-link-facebook"
                >
                  <Facebook size={15} strokeWidth={1.6} />
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-6 text-xs text-foreground/60 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <p>© {new Date().getFullYear()} KLÁRA Tűzzománc — Minden jog fenntartva</p>
            <nav className="flex gap-4" aria-label="Jogi információk">
              <a href="#/impresszum" className="transition hover:text-gold-bright">Impresszum</a>
              <a href="#/adatkezeles" className="transition hover:text-gold-bright">Adatkezelési tájékoztató</a>
            </nav>
          </div>
          <button
            onClick={() => scrollToSection('hero')}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 transition hover:border-gold/40 hover:text-gold-bright"
          >
            Vissza a tetejére <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
