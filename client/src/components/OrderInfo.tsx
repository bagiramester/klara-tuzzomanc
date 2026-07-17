import { Landmark, CreditCard, Package, Gift, Truck } from 'lucide-react';
import foxpostLogo from '@assets/foxpost-logo.png';
import mplLogo from '@assets/mpl-logo.jpg';

const payments = [
  {
    icon: Landmark,
    title: 'Előre utalás',
    body: 'A rendelés visszaigazolása után banki átutalással fizetheted ki az összeget. A csomagot az összeg megérkezése után adom fel.',
  },
  {
    icon: CreditCard,
    title: 'Bankkártya',
    body: 'Online bankkártyás fizetés a megrendelés során — biztonságos, azonnal visszaigazolt tranzakció.',
  },
];

const shippers = [
  {
    logo: foxpostLogo,
    alt: 'FoxPost csomagautomata',
    title: 'FoxPost',
    body: 'Csomagautomata — országos hálózaton, 0–24 óra között átvehető.',
  },
  {
    logo: mplLogo,
    alt: 'MPL – Magyar Posta Logisztika',
    title: 'MPL',
    body: 'Magyar Posta — házhozszállítás vagy postaátvétel, ahogy neked kényelmesebb.',
  },
];

const packagings = [
  {
    icon: Package,
    title: 'Buborékos boríték',
    body: 'Alapértelmezett csomagolás: védő, buborékos fóliás boríték, amely biztonságosan megóvja az ékszert szállítás közben.',
    price: null,
  },
  {
    icon: Gift,
    title: 'Logózott ékszerdoboz',
    body: 'Klára tűzzománc logójával ellátott, elegáns ékszerdoboz — ajándéknak is tökéletes választás.',
    price: '+1 500 Ft',
  },
];

export function OrderInfo() {
  return (
    <section
      id="vasarlas"
      className="relative py-24 lg:py-32 px-6"
      data-testid="section-order-info"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold/70 tracking-[0.4em] text-xs uppercase mb-4">Vásárlási információk</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Fizetés, szállítás
            <span className="block italic gold-gradient-text mt-2">és csomagolás</span>
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Kézműves ékszereimet gondosan csomagolom és a számodra legkényelmesebb
            módon juttatom el. Válaszd a neked megfelelő fizetési és szállítási módot.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Fizetés */}
          <div className="bg-card/60 border border-card-border p-8" data-testid="block-payment">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 flex items-center justify-center bg-gold/10 border border-gold/30">
                <CreditCard className="text-gold-bright" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-foreground">Fizetési lehetőségek</h3>
            </div>
            <div className="space-y-6">
              {payments.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-gold/5 border border-gold/20">
                    <p.icon className="text-gold-bright" size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-foreground mb-1">{p.title}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Szállítás */}
          <div className="bg-card/60 border border-card-border p-8" data-testid="block-shipping">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 flex items-center justify-center bg-gold/10 border border-gold/30">
                <Truck className="text-gold-bright" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-foreground">Szállítás</h3>
            </div>
            <div className="space-y-6">
              {shippers.map((s) => (
                <div key={s.title} className="flex gap-4 items-start">
                  <div className="shrink-0 w-24 h-14 bg-white rounded p-1.5 flex items-center justify-center">
                    <img
                      src={s.logo}
                      alt={s.alt}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-0.5">
                    <p className="font-serif text-lg text-foreground mb-1">{s.title}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Csomagolás */}
          <div className="bg-card/60 border border-card-border p-8" data-testid="block-packaging">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 flex items-center justify-center bg-gold/10 border border-gold/30">
                <Package className="text-gold-bright" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-foreground">Csomagolás</h3>
            </div>
            <div className="space-y-6">
              {packagings.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-gold/5 border border-gold/20">
                    <p.icon className="text-gold-bright" size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <p className="font-serif text-lg text-foreground">{p.title}</p>
                      {p.price && (
                        <span className="text-sm font-medium text-gold-bright tracking-wide">{p.price}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-foreground/50 mt-12 leading-relaxed max-w-2xl mx-auto">
          A pontos szállítási díj a kiválasztott szolgáltatástól és a csomag méretétől függ —
          a visszaigazoló üzenetben mindig tájékoztatlak róla.
        </p>
      </div>
    </section>
  );
}
