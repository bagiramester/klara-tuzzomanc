import { useState, useEffect } from 'react';
import { Mail, MapPin, Facebook, CheckCircle2, Send, X } from 'lucide-react';
import { formatPrice, productCode, type Product } from '@/data/products';
import { Img } from './Picture';
import { site } from '@/data/site';

interface ContactProps {
  selectedProduct?: Product | null;
  onClearProduct?: () => void;
}

export function Contact({ selectedProduct, onClearProduct }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [gotcha, setGotcha] = useState(''); // spam-csapda (Formspree _gotcha)

  // When user clicks "Érdeklődöm" on a product, pre-fill the form
  useEffect(() => {
    if (selectedProduct) {
      setSubject(`Érdeklődés: ${selectedProduct.name} (${productCode(selectedProduct.id)})`);
      setMessage(
        `Kedves Klára,\n\nszeretnék érdeklődni a(z) "${selectedProduct.name}" iránt. Kérlek, küldj információt az elérhetőségről és a vásárlás menetéről.\n\nKöszönöm,\n`
      );
    }
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/xzdnpepn', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || 'Érdeklődés — Klára tűzzománc',
          message,
          product: selectedProduct?.name || '',
          _replyto: email,
          _gotcha: gotcha,
        }),
      });

      if (!response.ok) {
        throw new Error('Nem sikerült elküldeni az üzenetet.');
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      onClearProduct?.();

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch {
      setError('Sajnos az üzenet küldése nem sikerült. Kérlek, próbáld újra, vagy írj e-mailt közvetlenül.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="kapcsolat" className="grain relative isolate overflow-hidden py-24 md:py-32" aria-labelledby="kapcsolat-title">
      <div
        className="pointer-events-none absolute -left-40 top-10 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,hsl(224_85%_35%/0.35),transparent_65%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Kapcsolat</p>
          <h2 id="kapcsolat-title" className="section-title mt-5">
            Írj nekem, <span className="italic gold-gradient-text">örömmel várom</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-foreground/70 sm:text-lg">
            Kérdésed van egy ékszerrel kapcsolatban, vagy egyedi darabot szeretnél? Írj bátran, hamarosan
            válaszolok.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Űrlap */}
          <div className="reveal rounded-[1.75rem] border border-white/[0.08] bg-card/60 p-6 shadow-2xl sm:p-8 lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-gold-bright ring-1 ring-gold/30">
                  <CheckCircle2 size={30} strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-serif text-3xl text-gold-bright">Köszönöm az üzenetet!</h3>
                <p className="mt-3 max-w-md leading-relaxed text-foreground/70">
                  Megkaptam az üzeneted, és hamarosan válaszolok. Addig is kövess a Facebookon az újabb ékszerekért.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm leading-relaxed text-red-200" role="alert">
                    {error}
                  </div>
                )}

                {selectedProduct && (
                  <div className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-gold/[0.06] p-3 pr-4">
                    {selectedProduct.image && (
                      <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                        <Img picture={selectedProduct.image} sizes="56px" alt="" className="h-full w-full object-cover" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold/80">Érdeklődés tárgya</p>
                      <p className="truncate font-medium">
                        {selectedProduct.name}{' '}
                        <span className="text-foreground/50">· {productCode(selectedProduct.id)} · {formatPrice(selectedProduct.price)}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onClearProduct?.()}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground/60 transition hover:bg-white/5 hover:text-foreground"
                      aria-label="Termék eltávolítása"
                      data-testid="button-clear-product"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground/80">
                      Neved
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="field"
                      placeholder="Pl. Kovács Anna"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/80">
                      E-mail címed
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="field"
                      placeholder="anna@pelda.hu"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-foreground/80">
                    Tárgy
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="field"
                    placeholder="Pl. Egyedi rendelés"
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground/80">
                    Üzenet
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="field resize-y"
                    placeholder="Mesélj, mit szeretnél…"
                    data-testid="input-message"
                  />
                </div>

                {/* Spam-csapda: embereknek rejtett mező */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={gotcha}
                  onChange={(e) => setGotcha(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full !py-4"
                  data-testid="button-submit-form"
                >
                  <Send size={16} />
                  {submitting ? 'Küldés folyamatban…' : 'Üzenet küldése'}
                </button>

                <p className="text-center text-xs leading-relaxed text-foreground/50">
                  Az adataidat bizalmasan kezelem, és csak a válasz küldésére használom. Részletek:{' '}
                  <a href="#/adatkezeles" className="underline decoration-foreground/30 underline-offset-2 hover:text-gold-bright">
                    adatkezelési tájékoztató
                  </a>
                  .
                </p>
              </form>
            )}
          </div>

          {/* Elérhetőség */}
          <aside className="reveal space-y-4 lg:col-span-2" style={{ ['--reveal-delay' as string]: '120ms' }}>
            <a
              href={`mailto:${site.email}`}
              className="group flex items-start gap-4 rounded-3xl border border-white/[0.08] bg-card/40 p-6 transition hover:border-gold/30"
              data-testid="link-email"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/10 text-gold-bright ring-1 ring-gold/25">
                <Mail size={19} strokeWidth={1.6} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-foreground/50">E-mail</span>
                <span className="mt-1 block break-all font-medium transition group-hover:text-gold-bright">
                  {site.email}
                </span>
              </span>
            </a>

            <div className="flex items-start gap-4 rounded-3xl border border-white/[0.08] bg-card/40 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/10 text-gold-bright ring-1 ring-gold/25">
                <MapPin size={19} strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-foreground/50">
                  Személyes átvétel
                </span>
                <span className="mt-1 block font-medium">Budapest</span>
                <span className="mt-1 block text-sm leading-relaxed text-foreground/60">
                  Személyes átvételre lehetőség van — előzetes egyeztetéssel.
                </span>
              </span>
            </div>

            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-3xl border border-white/[0.08] bg-card/40 p-6 transition hover:border-gold/30"
              data-testid="link-facebook"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#1877f2]/15 text-[#6ea8ff] ring-1 ring-[#1877f2]/30">
                <Facebook size={19} strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-foreground/50">Kövess</span>
                <span className="mt-1 block font-medium transition group-hover:text-gold-bright">Facebook — újdonságok elsőként</span>
              </span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
