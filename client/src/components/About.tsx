import klaraPortrait from '@assets/klara-portre-2026.jpg?portrait';
import { Img } from './Picture';

const teachers = [
  'Lizák Pálma',
  'Török Ibolya',
  'Vdovkina Anastasia',
  'Meghan Salgaonkar',
  'Gergely Judit',
  'Ötvös Nagy Ferenc',
];

export function About() {
  return (
    <section
      id="rolam"
      className="grain relative isolate overflow-hidden py-24 lg:py-36"
      data-testid="section-about"
      aria-labelledby="rolam-title"
    >
      <div
        className="pointer-events-none absolute right-[-20%] top-1/4 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,hsl(40_70%_40%/0.14),transparent_62%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
        {/* Portré */}
        <figure className="reveal relative mx-auto w-full max-w-md">
          <div className="absolute -inset-3 -z-10 rounded-t-[999px] rounded-b-[2.25rem] border border-gold/20 translate-x-4 translate-y-4" aria-hidden="true" />
          <div className="overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-gold/30">
            <Img
              picture={klaraPortrait}
              sizes="(min-width: 1024px) 440px, (min-width: 480px) 448px, 92vw"
              alt="Klára portréja — Kovariné Bauer Klára, tűzzománc ékszerész"
              className="aspect-[4/5] h-auto w-full object-cover"
              style={{ objectPosition: 'center 22%' }}
              data-testid="img-klara-rolam"
            />
          </div>
          <figcaption className="glass absolute -bottom-6 left-1/2 w-[86%] -translate-x-1/2 rounded-2xl border border-white/10 px-5 py-4 text-center font-serif text-lg italic leading-snug text-gold-bright shadow-xl">
            „A tűz formál, a kéz tanítja a fémet.”
          </figcaption>
        </figure>

        {/* Szöveg */}
        <div className="reveal" style={{ ['--reveal-delay' as string]: '120ms' }}>
          <p className="eyebrow">Rólam</p>
          <h2 id="rolam-title" className="section-title mt-5">
            Klára vagyok,
            <span className="block italic gold-gradient-text pb-1">és szeretem a színeket</span>
          </h2>

          <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-foreground/80 sm:text-lg">
            <p>
              41 év számítástechnikában ledolgozott év után, 2016-ban nyugdíjas lettem — és akkor jött el az
              idő, hogy régi dédelgetett álmomat valóra válthassam. Kipróbálhattam, hogyan készülnek az addig
              csak megcsodált tűzzománc tárgyak, amik gyermekkorom óta rabul ejtettek.
            </p>
            <p>
              Az évtizedek pörgése után a kemence csendje, a 820 fokos hő alatt megolvadó zománc színei adták
              meg azt a nyugalmat, amit kerestem. Sokat köszönhetek tanáraimnak, akiktől a mai napig sokat
              tanulok:
            </p>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Tanáraim">
              {teachers.map((t) => (
                <li key={t} className="rounded-full border border-gold/25 bg-gold/5 px-3.5 py-1.5 text-sm text-gold-bright/90">
                  {t}
                </li>
              ))}
            </ul>
            <p>
              Minden ékszer napokig készül. Először a fémet formázom — réz, ezüst vagy bronz lemezt fűrészelek,
              reszelek, csiszolok, forrasztok. Aztán jön a zománc: vékony rétegekben, türelemmel. Minden réteg
              új égetést jelent, és minden égetés egy kicsit más színt hoz. Sosem tudom biztosan, mi lesz a
              végeredmény — és pont ezt szeretem benne.
            </p>
          </div>

          <blockquote className="mt-10 border-l-2 border-gold/60 pl-6 font-serif text-xl italic leading-relaxed text-gold-bright sm:text-2xl">
            Hiszem, hogy egy szépen megmunkált tárgy érzelmet ad át. Hogy amit szívvel-lélekkel készítek, az
            tovább él, mint a divat — mert a szeretettel alkotott tárgyaknak lelkük van.
          </blockquote>
        </div>
      </div>
    </section>
  );
}
