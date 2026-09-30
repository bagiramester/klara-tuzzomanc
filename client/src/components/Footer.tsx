import { Logo } from './Logo';
import { Facebook } from 'lucide-react';
import { navLinks } from './Navigation';
import { site } from '@/data/site';
import { scrollToSection } from '@/lib/scroll';

export function Footer() {
  const scrollTo = scrollToSection;

  return (
    <footer className="relative border-t border-gold/20 pt-16 pb-8 px-6" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size={56} showText={false} />
            <div className="mt-4">
              <div className="font-serif text-gold-bright tracking-[0.3em] text-xl leading-none">
                KLÁRA
              </div>
              <div className="font-serif text-gold/80 tracking-[0.2em] text-xs mt-1 uppercase">
                Tűzzománc
              </div>
            </div>
            <p className="font-serif italic text-gold-bright/90 text-lg mt-4 leading-relaxed">
              „Tűzzel, szívvel, lélekkel.”
            </p>
            <p className="text-sm text-muted-foreground mt-4 max-w-md leading-relaxed">
              Egyedi tervezésű, kézzel készített tűzzománc ékszerek Budapestről. Minden darab a
              hagyományos ötvös technikák és a 820°C-os égetés eredménye.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-xs tracking-[0.25em] uppercase text-gold mb-5">Oldal</h2>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-sm text-foreground/70 hover:text-gold-bright transition-colors"
                    data-testid={`footer-link-${link.id}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xs tracking-[0.25em] uppercase text-gold mb-5">Kapcsolat</h2>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-gold-bright transition-colors break-all"
                >
                  {site.email}
                </a>
              </li>
              <li>Budapest, Magyarország</li>
            </ul>
            <div className="mt-8">
              <h2 className="text-xs tracking-[0.25em] uppercase text-gold mb-3">Kövess</h2>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-gold-bright transition-colors"
                data-testid="footer-link-facebook"
              >
                <Facebook size={16} strokeWidth={1.5} />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="gold-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p>© {new Date().getFullYear()} KLÁRA Tűzzománc — Minden jog fenntartva</p>
            <nav className="flex gap-5" aria-label="Jogi információk">
              <a href="#/impresszum" className="hover:text-gold-bright transition-colors">Impresszum</a>
              <a href="#/adatkezeles" className="hover:text-gold-bright transition-colors">Adatkezelési tájékoztató</a>
            </nav>
          </div>
          <p className="tracking-wider">Kézzel készítve Budapesten</p>
        </div>
      </div>
    </footer>
  );
}
