import { Landmark, CreditCard, Package, Gift, Truck, type LucideIcon } from 'lucide-react';
import foxpostLogo from '@assets/foxpost-logo.jpg?logo';
import mplLogo from '@assets/mpl-logo.jpg?logo';
import { Img } from './Picture';

interface Item {
  title: string;
  body: string;
  icon?: LucideIcon;
  logo?: Picture;
  badge?: string;
  price?: string;
}

const blocks: { id: string; icon: LucideIcon; title: string; items: Item[] }[] = [
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Fizetés',
    items: [
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
    ],
  },
  {
    id: 'shipping',
    icon: Truck,
    title: 'Szállítás',
    items: [
      { logo: foxpostLogo, title: 'FoxPost', body: 'Csomagautomata — országos hálózaton, 0–24 óra között átvehető.' },
      { logo: mplLogo, title: 'MPL', body: 'Magyar Posta — házhozszállítás vagy postaátvétel, ahogy neked kényelmesebb.' },
      { badge: 'GLS', title: 'GLS', body: 'GLS futárszolgálat — megbízható és gyors házhozszállítás vagy csomagpontra küldés.' },
    ],
  },
  {
    id: 'packaging',
    icon: Package,
    title: 'Csomagolás',
    items: [
      {
        icon: Package,
        title: 'Buborékos boríték',
        body: 'Alapértelmezett csomagolás: védő, buborékos fóliás boríték, amely biztonságosan megóvja az ékszert szállítás közben.',
      },
      {
        icon: Gift,
        title: 'Logózott ékszerdoboz',
        price: '+1 500 Ft',
        body: 'Klára tűzzománc logójával ellátott, elegáns ékszerdoboz — ajándéknak is tökéletes választás.',
      },
    ],
  },
];

function ItemMark({ item }: { item: Item }) {
  if (item.logo) {
    return (
      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white p-0.5 ring-1 ring-ink/10">
        <Img picture={item.logo} sizes="44px" alt={`${item.title} logó`} className="h-full w-full rounded-[0.6rem] object-contain" />
      </span>
    );
  }
  if (item.badge) {
    return (
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#061d5c] text-sm font-extrabold italic tracking-wide text-[#ffd100]">
        {item.badge}
      </span>
    );
  }
  const Icon = item.icon!;
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper-2 text-cobalt">
      <Icon size={19} strokeWidth={1.7} />
    </span>
  );
}

export function OrderInfo() {
  return (
    <section id="vasarlas" className="paper relative py-24 lg:py-32" data-testid="section-order-info" aria-labelledby="vasarlas-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-[hsl(32_70%_40%)] justify-center">Vásárlási információk</p>
          <h2 id="vasarlas-title" className="section-title mt-5">
            Fizetés, szállítás <em className="text-cobalt">és csomagolás</em>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
            Kézműves ékszereimet gondosan csomagolom, és a számodra legkényelmesebb módon juttatom el.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {blocks.map((b, i) => (
            <div
              key={b.id}
              className="reveal rounded-3xl bg-white p-7 shadow-[0_1px_0_hsl(224_45%_13%/0.04),0_24px_48px_-32px_hsl(224_45%_13%/0.3)] ring-1 ring-ink/[0.06] sm:p-8"
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
              data-testid={`block-${b.id}`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-gold-bright">
                  <b.icon size={18} strokeWidth={1.7} />
                </span>
                <h3 className="font-serif text-[1.7rem]">{b.title}</h3>
              </div>
              <ul className="mt-7 space-y-6">
                {b.items.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <ItemMark item={item} />
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-2 font-semibold">
                        {item.title}
                        {item.price && <span className="text-sm font-semibold text-[hsl(32_70%_38%)]">{item.price}</span>}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-ink-muted">
          A pontos szállítási díj a kiválasztott szolgáltatástól és a csomag méretétől függ — a visszaigazoló
          üzenetben mindig tájékoztatlak róla.
        </p>
      </div>
    </section>
  );
}
