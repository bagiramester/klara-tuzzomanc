import klaraRolamImg from '@assets/klara-portre-2026.jpg';

export function About() {
  return (
    <section
      id="rolam"
      className="relative py-24 lg:py-32 px-6 overflow-hidden"
      data-testid="section-about"
    >
      {/* Soft background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 80% 40%, hsl(42 50% 25% / 0.18) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Real photo of Klara at work */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] relative overflow-hidden border border-gold/30">
              <img
                src={klaraRolamImg}
                alt="Klára portréja — Kovariné Bauer Klára, tűzzománc ékszerész"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%', filter: 'saturate(1.05) contrast(1.03)' }}
                data-testid="img-klara-rolam"
              />

              {/* Warm tone-tint overlay to harmonize with site palette */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-multiply"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(222 75% 14% / 0.5) 0%, hsl(25 50% 20% / 0.35) 100%)',
                }}
              />
              {/* Soft dark gradient overlay for caption legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-background/20 pointer-events-none" />

              {/* Gold corner accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-gold/60" />
              <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-gold/60" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-l border-b border-gold/60" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-gold/60" />

              {/* Caption */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="font-serif italic text-lg text-gold-bright px-6 drop-shadow-lg">
                  „A tűz formál, a kéz tanítja a fémet."
                </p>
              </div>
            </div>

            {/* Decorative offset frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/20 -z-10" />
          </div>

          {/* Text content */}
          <div className="order-1 lg:order-2">
            <p className="text-gold/70 tracking-[0.4em] text-xs uppercase mb-4">Rólam</p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-8 leading-tight">
              Klára vagyok,
              <span className="block italic gold-gradient-text mt-2">és szeretem a színeket</span>
            </h2>

            <div className="space-y-5 text-base sm:text-lg leading-relaxed text-foreground/85">
              <p>
                41 év számítástechnikában ledolgozott év után, 2016-ban nyugdíjas lettem — és akkor
                jött el az idő, hogy régi dédelgetett álmomat valóra válthassam. Kipróbálhattam,
                hogyan készülnek az addig csak megcsodált tűzzománc tárgyak, amik gyermekkorom
                óta rabul ejtettek.
              </p>
              <p>
                Az évtizedek pörgése után a kemence csendje, a 820 fokos hő alatt megolvadó
                zománc színei adták meg azt a nyugalmat, amit kerestem. Sokat köszönhetek
                tanáraimnak, akiktől a mai napig sokat tanulok:
              </p>
              <p className="text-gold-bright/90 font-serif italic text-base">
                Lizák Pálma · Török Ibolya · Vdovkina Anastasia · Meghan Salgaonkar ·
                Ötvös Nagy Ferenc
              </p>
              <p>
                Minden ékszer napokig készül. Először a fémet formázom — réz, ezüst vagy bronz
                lemezt fűrészelek, reszelek, csiszolok, forrasztok. Aztán jön a zománc: vékony
                rétegekben, türelemmel. Minden réteg új égetést jelent, és minden égetés egy
                kicsit más színt hoz. Sosem tudom biztosan, mi lesz a végeredmény — és pont ezt
                szeretem benne.
              </p>
              <p className="font-serif italic text-xl text-gold-bright">
                Hiszem, hogy egy szépen megmunkált tárgy érzelmet ad át. Hogy amit
                szívvel-lélekkel készítek, az tovább él, mint a divat — mert a szeretettel
                alkotott tárgyaknak lelkük van.
              </p>
            </div>

            {/* Personal stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-gold/20">
              <div>
                <div className="font-serif text-4xl text-gold-bright mb-1">10+</div>
                <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                  év tapasztalat
                </div>
              </div>
              <div>
                <div className="font-serif text-4xl text-gold-bright mb-1">820°C</div>
                <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                  égetési hőfok
                </div>
              </div>
              <div>
                <div className="font-serif text-4xl text-gold-bright mb-1">100%</div>
                <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                  kézzel készült
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
