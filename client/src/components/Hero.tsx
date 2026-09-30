import { ArrowRight } from 'lucide-react';
import klaraLogoHero from '@assets/brand/klara-logo-hero.jpg?portrait';
import { products, type Product } from '@/data/products';
import { scrollToSection } from '@/lib/scroll';
import { Img } from './Picture';

// Két kiemelt darab "lebeg" a logó mellett (ha ezek elkelnek, más kiemelt darab kerül a helyükre)
const floating = [
  ...new Set([
    ...['sz1', 'k4'].map((id) => products.find((p) => p.id === id)),
    ...products.filter((p) => p.featured),
  ]),
]
  .filter((p): p is Product => !!p)
  .slice(0, 2);

const highPriority = { fetchpriority: 'high' } as Record<string, string>;

export function Hero() {
  return (
    <section
      id="hero"
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20 md:pt-32"
      data-testid="section-hero"
    >
      {/* Háttér: tűz- és kobaltfény */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-40 right-[-10%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,hsl(24_85%_45%/0.22),transparent_62%)] animate-glow" />
        <div className="absolute bottom-[-30%] left-[-15%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle,hsl(224_85%_35%/0.35),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-10">
        {/* Szöveg */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="eyebrow animate-fade-up justify-center lg:justify-start" style={{ animationDelay: '0.05s' }}>
            Kézműves ékszerek · Budapest
          </p>

          <h1
            className="mt-6 font-serif text-[3.1rem] leading-[0.98] sm:text-7xl lg:text-[5.6rem] animate-fade-up"
            style={{ animationDelay: '0.15s' }}
          >
            Tűzzel, szívvel,
            <span className="block italic gold-gradient-text pb-2">lélekkel.</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg lg:mx-0 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            Egyedi tervezésű, kézzel készített tűzzománc ékszerek réz, ezüst és bronz alapon,{' '}
            <span className="text-gold-bright">820 °C-on égetve</span> — minden darabból csak egy készül.
          </p>

          <div
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: '0.45s' }}
          >
            <button
              onClick={() => scrollToSection('kollekcio')}
              className="btn-gold group w-full sm:w-auto"
              data-testid="button-view-collection"
            >
              A kollekció megtekintése
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('rolam')}
              className="btn-ghost w-full sm:w-auto"
              data-testid="button-about-me"
            >
              Ismerj meg
            </button>
          </div>

          <dl
            className="mx-auto mt-14 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-8 text-left lg:mx-0 animate-fade-up"
            style={{ animationDelay: '0.6s' }}
          >
            {[
              { value: `${products.length}`, label: 'egyedi darab' },
              { value: '820 °C', label: 'égetési hőfok' },
              { value: '100%', label: 'kézműves' },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-3xl text-gold-bright sm:text-4xl">{s.value}</dd>
                <dd className="mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-foreground/55">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Logó ív-keretben + lebegő termékek */}
        <div className="relative order-1 mx-auto w-full max-w-[210px] sm:max-w-[320px] lg:order-2 lg:max-w-[400px] animate-fade-up">
          <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,hsl(30_90%_50%/0.25),transparent_65%)] blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-gold/30 p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
            <div className="overflow-hidden rounded-t-[999px] rounded-b-[1.6rem]">
              <Img
                picture={klaraLogoHero}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 320px, 210px"
                alt="KLÁRA Fire Enamel — Tűzzel, szívvel, lélekkel"
                loading="eager"
                className="block h-auto w-full"
                data-testid="img-hero-logo"
                {...highPriority}
              />
            </div>
          </div>

          {floating.map((p, i) => (
            <button
              key={p.id}
              onClick={() => scrollToSection('kollekcio')}
              className={`absolute hidden sm:block h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-white shadow-2xl ring-1 ring-gold/40 lg:h-28 lg:w-28 animate-float ${
                i === 0 ? '-left-10 top-[38%] lg:-left-16' : '-right-8 bottom-[12%] lg:-right-12'
              }`}
              style={{ animationDelay: `${i * 1.8}s` }}
              aria-label={`${p.name} — ugrás a kollekcióhoz`}
            >
              <Img picture={p.image} sizes="112px" alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
