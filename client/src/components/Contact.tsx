import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, CheckCircle2 } from 'lucide-react';
import type { Product } from '@/data/products';

interface ContactProps {
  selectedProduct?: Product | null;
  onClearProduct?: () => void;
}

export function Contact({ selectedProduct, onClearProduct }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // When user clicks "Érdeklődöm" on a product, pre-fill the form
  useEffect(() => {
    if (selectedProduct) {
      setSubject(`Érdeklődés: ${selectedProduct.name}`);
      setMessage(
        `Kedves Klára,\n\nszeretnék érdeklődni a(z) "${selectedProduct.name}" iránt. Kérlek, küldj információt az elérhetőségről és a vásárlás menetéről.\n\nKöszönöm,\n`
      );
    }
  }, [selectedProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      onClearProduct?.();
    }, 4000);
  };

  return (
    <section id="kapcsolat" className="relative py-24 lg:py-32 px-6" data-testid="section-contact">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold/70 tracking-[0.4em] text-xs uppercase mb-4">Kapcsolat</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            Írj nekem,
            <span className="block italic gold-gradient-text mt-2">örömmel várom</span>
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Amennyiben valamelyik terméket más színben szeretnéd, örömmel készítek Neked
            egyedi változatot is — írj nekem bizalommal.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Contact form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="bg-card/60 border border-gold/40 p-12 text-center animate-fade-in"
                data-testid="message-form-success"
              >
                <CheckCircle2 className="text-gold-bright mx-auto mb-6" size={56} strokeWidth={1.2} />
                <h3 className="font-serif text-3xl text-gold-bright mb-4">Köszönöm az üzenetet</h3>
                <p className="text-foreground/85 leading-relaxed max-w-md mx-auto">
                  Megkaptam az üzeneted, és hamarosan visszaírok. Addig is, kövess a Facebookon
                  az újabb ékszerekért.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card/40 border border-card-border p-8 lg:p-10 space-y-6"
                data-testid="form-contact"
              >
                {selectedProduct && (
                  <div className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/30">
                    <div className="flex-1">
                      <p className="text-xs tracking-[0.15em] uppercase text-gold/70 mb-1">
                        Érdeklődés tárgya
                      </p>
                      <p className="font-serif text-lg text-gold-bright">{selectedProduct.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={onClearProduct}
                      className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2"
                      data-testid="button-clear-product"
                    >
                      eltávolít
                    </button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs tracking-[0.15em] uppercase text-gold/70 mb-3"
                    >
                      Neved
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-background/60 border border-input text-foreground focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
                      placeholder="Pl. Kovács Anna"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs tracking-[0.15em] uppercase text-gold/70 mb-3"
                    >
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-background/60 border border-input text-foreground focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
                      placeholder="anna@pelda.hu"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs tracking-[0.15em] uppercase text-gold/70 mb-3"
                    >
                      Telefon <span className="normal-case text-muted-foreground">(opcionális)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-background/60 border border-input text-foreground focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors"
                      placeholder="+36 20 123 4567"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs tracking-[0.15em] uppercase text-gold/70 mb-3"
                    >
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
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs tracking-[0.15em] uppercase text-gold/70 mb-3"
                  >
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

                <button
                  type="submit"
                  className="w-full gold-gradient text-background font-medium tracking-[0.2em] uppercase text-sm py-4 hover:shadow-[0_8px_32px_rgba(212,175,55,0.4)] transition-all duration-500"
                  data-testid="button-submit-form"
                >
                  Üzenet küldése
                </button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Az adataidat bizalmasan kezelem, és csak a válasz küldésére használom.
                </p>
              </form>
            )}
          </div>

          {/* Contact info sidebar */}
          <aside className="lg:col-span-2 space-y-8">
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
                      href="mailto:klara.fire.enamel@gmail.com"
                      className="text-foreground hover:text-gold-bright transition-colors break-all"
                      data-testid="link-email"
                    >
                      klara.fire.enamel@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="text-gold mt-1 shrink-0" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                      Telefon
                    </p>
                    <a
                      href="tel:+36204847050"
                      className="text-foreground hover:text-gold-bright transition-colors"
                      data-testid="link-phone"
                    >
                      +36 20 484 7050
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
                  href="https://www.facebook.com/klara.kovarinebauer"
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
