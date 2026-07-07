import klaraLogoFull from '@assets/klara-logo.jpg';

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
      data-testid="section-hero"
    >
      {/* Atmospheric background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, hsl(42 60% 30% / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, hsl(222 80% 22% / 0.45) 0%, transparent 60%)',
          }}
        />
        {/* Subtle gold sparkles */}
        <div className="absolute top-[18%] left-[15%] w-1 h-1 rounded-full bg-gold/60 animate-shimmer" />
        <div
          className="absolute top-[35%] right-[20%] w-1.5 h-1.5 rounded-full bg-gold/40 animate-shimmer"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-[28%] left-[22%] w-1 h-1 rounded-full bg-gold-bright/50 animate-shimmer"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[40%] right-[15%] w-2 h-2 rounded-full bg-gold/30 animate-shimmer"
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Real brand logo — cropped via object-fit to hide black bars */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div
            className="mx-auto overflow-hidden w-[300px] h-[360px] sm:w-[380px] sm:h-[460px] md:w-[460px] md:h-[560px] flex items-center justify-center"
            aria-hidden="false"
          >
            <img
              src={klaraLogoFull}
              alt="KLÁRA tűzzománc — Tűzzel, szívvel, lélekkel"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 50%' }}
              data-testid="img-hero-logo"
            />
          </div>
        </div>

        <div className="mt-2 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {/* Gold divider with diamond */}
          <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/60" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold-bright" />
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          <p className="text-base sm:text-lg text-foreground/85 max-w-2xl mx-auto leading-relaxed mb-12">
            Egyedi tervezésű, kézzel készített tűzzománc ékszerek réz, ezüst és bronz alapon
            — <span className="text-gold/90">820 fokon égetve</span>, napokon át tartó
            kézműves folyamattal.
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <button
            onClick={() => scrollTo('kollekcio')}
            className="group px-10 py-4 gold-gradient text-background font-medium tracking-[0.2em] uppercase text-sm hover:shadow-[0_8px_32px_rgba(212,175,55,0.4)] transition-all duration-500"
            data-testid="button-view-collection"
          >
            <span className="inline-flex items-center gap-3">
              Kollekció
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </button>
          <button
            onClick={() => scrollTo('rolam')}
            className="px-10 py-4 border border-gold/40 text-gold-bright tracking-[0.2em] uppercase text-sm hover:bg-gold/5 hover:border-gold transition-all duration-300"
            data-testid="button-about-me"
          >
            Ismerj meg
          </button>
        </div>
      </div>


    </section>
  );
}
