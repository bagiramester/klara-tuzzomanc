import { Logo } from './Logo';
import { Facebook } from 'lucide-react';

export function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

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
              <div className="font-serif text-gold/60 tracking-[0.2em] text-xs mt-1 uppercase">
                Tűzzománc
              </div>
            </div>
            <p className="font-serif italic text-gold-bright/90 text-lg mt-4 leading-relaxed">
              „Tűzzel, szívvel, lélekkel."
            </p>
            <p className="text-sm text-muted-foreground mt-4 max-w-md leading-relaxed">
              Egyedi tervezésű, kézzel készített tűzzománc ékszerek Budapestről. Minden darab a
              hagyományos ötvös technikák és a 820°C-os égetés eredménye.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase text-gold mb-5">Oldal</h4>
            <ul className="space-y-3">
              {[
                { id: 'kollekcio', label: 'Kollekció' },
                { id: 'rolam', label: 'Rólam' },
                { id: 'folyamat', label: 'A folyamat' },
                { id: 'kapcsolat', label: 'Kapcsolat' },
              ].map((link) => (
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
            <h4 className="text-xs tracking-[0.25em] uppercase text-gold mb-5">Kapcsolat</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li>
                <a
                  href="mailto:klara.fire.enamel@gmail.com"
                  className="hover:text-gold-bright transition-colors break-all"
                >
                  klara.fire.enamel@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+36204847050" className="hover:text-gold-bright transition-colors">
                  +36 20 484 7050
                </a>
              </li>
              <li>Budapest, Magyarország</li>
              <li>
                <a
                  href="https://klaratuzzomanc.hu"
                  className="hover:text-gold-bright transition-colors"
                >
                  klaratuzzomanc.hu
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <h4 className="text-xs tracking-[0.25em] uppercase text-gold mb-3">Kövess</h4>
              <a
                href="https://www.facebook.com/klara.kovarinebauer"
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
          <p>© {new Date().getFullYear()} KLÁRA Tűzzománc — Minden jog fenntartva</p>
          <p className="tracking-wider">Kézzel készítve Budapesten</p>
        </div>
      </div>
    </footer>
  );
}
