import { useState, useEffect } from 'react';
import { Mail, MapPin, Facebook, CheckCircle2 } from 'lucide-react';
import { formatPrice, productCode, type Product } from '@/data/products';
import { site } from '@/data/site';
import { Img } from './Picture';

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
        `Kedves Klára,\n\nszeretnék érdeklődni a(z) "${selectedProduct.name}" (${productCode(selectedProduct.id)}) iránt. Kérlek, küldj információt az elérhetőségről és a vásárlás menetéről.\n\nKöszönöm,\n`
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
    <section id="kapcsolat" className="py-24 md:py-32 px-6" aria-labelledby="kapcsolat-title">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow text-xs tracking-[0.4em] uppercase text-gold mb-4">Kapcsolat</p>
        <h2 id="kapcsolat-title" className="section-title font-serif text-4xl md:text-5xl text-foreground mb-12">
          Írj nekem, örömmel várom
        </h2>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact form */}
          <div className="lg:col-span-3 min-w-0">
            {submitted ? (
              <div role="status" className="contact-form flex flex-col items-center justify-center text-center py-20 border border-gold/20">
                <CheckCircle2 className="text-gold mb-6" size={48} strokeWidth={1.5} />
                <h3 className="font-serif text-2xl text-gold-bright mb-3">Köszönöm az üzenetet</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Megkaptam az üzeneted, és hamarosan válaszolok. Addig is, kövess a Facebookon az újabb ékszerekért.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form space-y-6">
                {error && (
                  <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 text-sm leading-relaxed">
                    {error}
                  </div>
                )}

                {selectedProduct && (
                  <div className="flex items-center gap-4 p-3 pr-4 bg-gold/5 border border-gold/20">
                    <span className="w-14 h-14 shrink-0 overflow-hidden bg-white">
                      <Img picture={selectedProduct.image} sizes="56px" alt="" className="w-full h-full object-cover" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                        Érdeklődés tárgya
                      </p>
                      <p className="text-foreground truncate">
                        {selectedProduct.name}{' '}
                        <span className="text-muted-foreground text-sm">
                          · {productCode(selectedProduct.id)} · {formatPrice(selectedProduct.price)}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onClearProduct?.()}
                      className="text-xs tracking-wider uppercase text-muted-foreground hover:text-gold transition-colors"
                      data-testid="button-clear-product"
                    >
                      eltávolít
                    </button>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    Neved
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-background/60 border border-input text-foreground focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
                    placeholder="Pl. Kovács Anna"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-background/60 border border-input text-foreground focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
                    placeholder="anna@pelda.hu"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    Tárgy
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-background/60 border border-input text-foreground focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
                    placeholder="Pl. Egyedi rendelés"
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    Üzenet
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-background/60 border border-input text-foreground focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors resize-none"
                    placeholder="Mesélj, mit szeretnél..."
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
                  className="w-full gold-gradient text-background font-medium tracking-[0.2em] uppercase text-sm py-4 hover:shadow-[0_8px_32px_rgba(212,175,55,0.4)] transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  data-testid="button-submit-form"
                >
                  {submitting ? 'Küldés folyamatban...' : 'Üzenet küldése'}
                </button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Az adataidat bizalmasan kezelem, és csak a válasz küldésére használom. Részletek:{' '}
                  <a href="#/adatkezeles" className="underline decoration-gold/40 underline-offset-2 hover:text-gold-bright">
                    adatkezelési tájékoztató
                  </a>
                  .
                </p>
              </form>
            )}
          </div>

          {/* Contact info sidebar */}
          <aside className="contact-aside lg:col-span-2 space-y-8 min-w-0">
            <div>
              <h3 className="font-serif text-2xl text-gold-bright mb-6">Elérhetőség</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <Mail className="text-gold mt-1 shrink-0" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                      E-mail
                    </p>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-foreground hover:text-gold-bright transition-colors break-all"
                      data-testid="link-email"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin className="text-gold mt-1 shrink-0" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                      Személyes átvétel
                    </p>
                    <p className="text-foreground">
                      Budapest, Magyarország
                      <br />
                      <span className="text-muted-foreground text-sm">
                        Személyes átvételre lehetőség van — előzetes egyeztetéssel.
                      </span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-gold/20">
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                Kövess
              </p>
              <div className="flex gap-3">
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 h-12 border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold transition-all"
                  aria-label="Facebook"
                  data-testid="link-facebook"
                >
                  <Facebook size={20} strokeWidth={1.5} />
                  <span className="text-sm tracking-wider">Facebook</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
