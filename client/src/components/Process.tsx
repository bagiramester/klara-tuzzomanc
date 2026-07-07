import { Hammer, Flame, Layers, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Hammer,
    title: 'Tervezés és fémmunka',
    body: 'Először a forma születik meg papíron, majd a fémben. Réz, ezüst vagy bronz lemezt fúrok, fűrészelek, reszelek, csiszolok, drótot hajlítok és forrasztok a végleges sziluettre.',
  },
  {
    icon: Layers,
    title: 'Zománcrétegek',
    body: 'Vékony rétegekben viszem fel a finom, porított zománcot. Minden réteg új színt, új mélységet ad — a vastagság teszi életszerűvé a felületet.',
  },
  {
    icon: Flame,
    title: 'Égetés 820°C-on',
    body: 'A munkadarabot 820°C-on égetem ki, ahol a zománc megolvad és fényes, üvegszerű felületet alkot a vörösrézen. Minden égetés után a széleket lecsiszolom, szükség esetén savazom, majd a felületet semlegesítem.',
  },
  {
    icon: Sparkles,
    title: 'Befejezés és összeállítás',
    body: 'A peremek finom csiszolása után felszerelem az antiallergén akasztókat és kapcsokat, majd kiválasztom a medálhoz illő láncot vagy bőrszálat. Az ékszer ekkor nyeri el végleges megjelenését, karakterét.',
  },
];

export function Process() {
  return (
    <section
      id="folyamat"
      className="relative py-24 lg:py-32 px-6 bg-card/30"
      data-testid="section-process"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold/70 tracking-[0.4em] text-xs uppercase mb-4">A folyamat</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Napokig tartó
            <span className="block italic gold-gradient-text mt-2">kézműves munka</span>
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Egy-egy ékszer elkészítése több napos folyamat eredménye. Nincs sietség, csak
            türelem — mert a tűz csak így dolgozik együtt az emberrel.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative bg-card/60 border border-card-border p-8 group hover:border-gold/40 transition-all duration-500"
              data-testid={`step-process-${idx + 1}`}
            >
              {/* Step number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-background border border-gold/40 flex items-center justify-center font-serif text-gold-bright text-xl">
                {idx + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 mb-6 flex items-center justify-center bg-gold/10 border border-gold/30 group-hover:bg-gold/15 transition-colors">
                <step.icon className="text-gold-bright" size={24} strokeWidth={1.5} />
              </div>

              <h3 className="font-serif text-2xl text-foreground mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
