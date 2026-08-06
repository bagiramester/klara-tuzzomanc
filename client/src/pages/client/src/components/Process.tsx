import { Flame, Hammer, Sparkles, Layers } from 'lucide-react';

const steps = [
  {
    icon: Hammer,
    step: '01',
    title: 'Formázás & Előkészítés',
    description: 'Vörösréz, ezüst vagy bronz lemez kézi fűrészelése, reszelése, csiszolása és zsírtalanítása.',
  },
  {
    icon: Layers,
    step: '02',
    title: 'Zománc felvitele',
    description: 'Finomra őrölt üvegpor felvitele nedvesen vagy szitálva, rétegről rétegre, türelemmel.',
  },
  {
    icon: Flame,
    step: '03',
    title: '820°C-os égetés',
    description: 'A tárgyak égető kemencébe kerülnek, ahol a magas hőmérsékleten az üveg egybeolvad a fémmel.',
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Csiszolás & Végső felület',
    description: 'Többszöri égetés után a szélek csiszolása, polírozása és az szerelékek felhelyezése következik.',
  },
];

export function Process() {
  return (
    <section id="folyamat" className="py-24 md:py-32 px-6 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Műhely titkok</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            A tűzzománc készítés
            <span className="block italic gold-gradient-text mt-2">folyamata</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
            Az ékszerkészítés nem gyors folyamat. Minden darab mögött napok munkája, odaadása és az alkonyi kemence tüze áll.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-card/40 border border-card-border p-8 relative group hover:border-gold/40 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-gold/10 border border-gold/30 text-gold-bright">
                    <s.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="font-serif italic text-2xl text-gold/40">{s.step}</span>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
