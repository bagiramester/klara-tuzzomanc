import { Flame, Hammer, Sparkles, Layers } from 'lucide-react';

const steps = [
  {
    icon: Hammer,
    title: 'Formázás és előkészítés',
    description: 'Vörösréz, ezüst vagy bronz lemez kézi fűrészelése, reszelése, csiszolása és zsírtalanítása.',
  },
  {
    icon: Layers,
    title: 'A zománc felvitele',
    description: 'Finomra őrölt üvegpor felvitele nedvesen vagy szitálva, rétegről rétegre, türelemmel.',
  },
  {
    icon: Flame,
    title: 'Égetés 820 °C-on',
    description: 'A tárgyak égetőkemencébe kerülnek, ahol a magas hőmérsékleten az üveg egybeolvad a fémmel.',
  },
  {
    icon: Sparkles,
    title: 'Csiszolás és befejezés',
    description: 'Többszöri égetés után a szélek csiszolása, polírozása és a szerelékek felhelyezése következik.',
  },
];

export function Process() {
  return (
    <section id="folyamat" className="relative py-24 md:py-32" aria-labelledby="folyamat-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">Műhelytitkok</p>
          <h2 id="folyamat-title" className="section-title mt-5">
            Így születik egy
            <span className="block italic gold-gradient-text pb-1">tűzzománc ékszer</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
            Az ékszerkészítés nem gyors folyamat. Minden darab mögött napok munkája, odaadás és a kemence tüze áll.
          </p>
        </div>

        <ol className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="reveal group relative rounded-3xl border border-white/[0.07] bg-card/50 p-7 transition-colors duration-500 hover:border-gold/30 hover:bg-card/80"
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold/25 to-accent/10 text-gold-bright ring-1 ring-gold/30">
                  <s.icon size={22} strokeWidth={1.6} />
                </span>
                <span className="font-serif text-4xl italic text-white/10 transition-colors group-hover:text-gold/30">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
