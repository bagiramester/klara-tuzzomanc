import klaraLogoHero from '@assets/brand/klara-logo-hero.jpg?portrait';
import { scrollToSection } from '@/lib/scroll';
import { Img } from './Picture';

const highPriority = { fetchpriority: 'high' } as Record<string, string>;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-16"
      data-testid="section-hero"
    >
      {/* Háttér: finom arany és kobalt fény, apró csillogással */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, hsl(42 60% 30% / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, hsl(222 80% 22% / 0.45) 0%, transparent 60%)',
          }}
        />
        <div className="absolute top-[18%] left-[15%] w-1 h-1 rounded-full bg-gold/60 animate-shimmer" />
        <div className="absolute top-[35%] right-[20%] w-1.5 h-1.5 rounded-full bg-gold/40 animate-shimmer" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[28%] left-[22%] w-1 h-1 rounded-full bg-gold-bright/50 animate-shimmer" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[40%] right-[15%] w-2 h-2 rounded-full bg-gold/30 animate-shimmer" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* A nagy márkalogó */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="mx-auto w-[300px] sm:w-[380px] md:w-[440px]">
            <Img
              picture={klaraLogoHero}
              sizes="(min-width: 768px) 440px, (min-width: 640px) 380px, 300px"
              alt="KLÁRA Fire Enamel — Tűzzel, szívvel, lélekkel"
              loading="eager"
              className="block w-full aspect-[460/560] object-cover"
              style={{
                // a logó széle beleolvad a háttérbe
                WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 62%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 62%, transparent 100%)',
              }}
              data-testid="img-hero-logo"
              {...highPriority}
            />
          </div>
        </div>

        <div className="mt-2 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/60" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold-bright" />
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          <h1 className="sr-only">KLÁRA tűzzománc — kézzel készített tűzzománc ékszerek</h1>
          <p className="text-base sm:text-lg text-foreground/85 max-w-2xl mx-auto leading-relaxed mb-12">
            Egyedi tervezésű, kézzel készített tűzzománc ékszerek réz, ezüst és bronz alapon{' '}
            <span className="text-gold/90">820 fokon égetve</span>, napokon át tartó kézműves folyamattal.
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <button onClick={() => scrollToSection('kollekcio')} className="btn-gold group w-full max-w-[16rem] sm:w-auto" data-testid="button-view-collection">
            Kollekció
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </button>
          <button onClick={() => scrollToSection('rolam')} className="btn-outline w-full max-w-[16rem] sm:w-auto" data-testid="button-about-me">
            Ismerj meg
          </button>
        </div>
      </div>
    </section>
  );
}
