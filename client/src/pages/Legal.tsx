import { useEffect, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { site } from '@/data/site';

function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = `${title} — ${site.name}`;
    return () => {
      document.title = prev;
    };
  }, [title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6">
        <a href="#/" className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-gold-bright">
          <ArrowLeft size={15} /> Vissza a főoldalra
        </a>
        <h1 className="section-title mt-6">{title}</h1>
        <p className="mt-3 text-sm text-foreground/50">Utolsó módosítás: {site.legalUpdated}</p>
        <div className="legal mt-10 space-y-6 text-[0.98rem] leading-relaxed text-foreground/80">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

/** Csak akkor jelenik meg, ha ki van töltve (üres mezőt nem írunk ki). */
const Row = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="grid gap-1 border-b border-white/[0.07] py-3 sm:grid-cols-[14rem_1fr]">
      <dt className="text-foreground/55">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  ) : null;

export function Impresszum() {
  const o = site.owner;
  return (
    <LegalLayout title="Impresszum">
      <p>
        A <strong>{site.url.replace('https://', '')}</strong> weboldal üzemeltetőjének adatai (az elektronikus
        kereskedelmi szolgáltatásokról szóló 2001. évi CVIII. törvény 4. §-a alapján):
      </p>
      <dl>
        <Row label="Üzemeltető" value={o.name} />
        <Row label="Cím" value={o.address} />
        <Row label="E-mail" value={site.email} />
        <Row label="Telefon" value={o.phone} />
        <Row label="Adószám" value={o.taxNumber} />
        <Row label="Nyilvántartási szám" value={o.registration} />
      </dl>
      <h2>Tárhelyszolgáltató</h2>
      <dl>
        <Row label="Név" value={site.hosting.name} />
        <Row label="Cím" value={site.hosting.address} />
        <Row label="Weboldal" value={site.hosting.web} />
      </dl>
      <h2>Szerzői jog</h2>
      <p>
        Az oldalon található fotók, szövegek és ékszertervek {o.name} szellemi tulajdonát képezik. Engedély nélküli
        felhasználásuk, másolásuk nem megengedett.
      </p>
    </LegalLayout>
  );
}

export function Adatkezeles() {
  const o = site.owner;
  const f = site.formProvider;
  return (
    <LegalLayout title="Adatkezelési tájékoztató">
      <p>
        Ez a tájékoztató bemutatja, hogyan kezeljük a {site.name} weboldal ({site.url.replace('https://', '')})
        látogatóinak személyes adatait, az Európai Unió általános adatvédelmi rendelete (GDPR) és a 2011. évi CXII.
        törvény (Infotv.) szerint.
      </p>

      <h2>1. Az adatkezelő</h2>
      <dl>
        <Row label="Név" value={o.name} />
        <Row label="Cím" value={o.address} />
        <Row label="E-mail" value={site.email} />
        <Row label="Telefon" value={o.phone} />
      </dl>

      <h2>2. Milyen adatokat kezelünk és miért?</h2>
      <h3>Kapcsolatfelvételi / érdeklődő űrlap</h3>
      <ul>
        <li><strong>Kezelt adatok:</strong> név, e-mail cím, az üzenet tárgya és szövege, az érdeklődés tárgyát képező ékszer.</li>
        <li><strong>Cél:</strong> az érdeklődés megválaszolása, ajánlatadás, a vásárlás és a kézbesítés egyeztetése.</li>
        <li>
          <strong>Jogalap:</strong> a GDPR 6. cikk (1) bekezdés b) pontja (szerződés megkötését megelőző lépések az
          érintett kérésére), illetve f) pontja (jogos érdek: a megkeresés megválaszolása).
        </li>
        <li>
          <strong>Időtartam:</strong> a megkeresés lezárásától számított legfeljebb 1 év; vásárlás esetén a
          számviteli és adójogi kötelezettségekhez szükséges ideig.
        </li>
      </ul>
      <h3>E-mailes és Facebook-os kapcsolattartás</h3>
      <p>
        Ha közvetlenül e-mailben vagy Facebookon keresel meg, az üzenetben megadott adatokat ugyanezen célból és
        ideig kezeljük. A Facebook saját adatkezelésére a Meta Platforms tájékoztatója vonatkozik.
      </p>

      <h2>3. Adatfeldolgozók</h2>
      <ul>
        <li>
          <strong>{f.name}</strong> ({f.web}) — az űrlapon elküldött üzenetek továbbítása e-mailben. Adatkezelési
          tájékoztatója: <a href={f.privacy} target="_blank" rel="noopener noreferrer">{f.privacy}</a>.
        </li>
        <li>
          <strong>{site.hosting.name}</strong> ({site.hosting.web}) — a weboldal tárhelye. A kiszolgálás során
          technikai adatokat (pl. IP-cím, böngésző típusa) rövid ideig, biztonsági célból kezelhet.
        </li>
        <li>
          <strong>Google LLC (Gmail)</strong> — a beérkező e-mailek tárolása.
        </li>
      </ul>
      <p>
        Az Egyesült Államokban működő adatfeldolgozók az EU–USA adatvédelmi keretrendszer (Data Privacy Framework)
        vagy az Európai Bizottság általános szerződési feltételei alapján biztosítják az adatok megfelelő védelmét.
      </p>

      <h2>4. Sütik (cookie-k)</h2>
      <p>
        A weboldal <strong>nem használ</strong> nyomkövető, statisztikai vagy marketing célú sütiket, és nem jelenít
        meg hirdetéseket. A betűtípusok és képek saját tárhelyről töltődnek be, harmadik fél nem kap adatot a
        látogatásodról.
      </p>

      <h2>5. Az adatok biztonsága</h2>
      <p>
        Az oldal kizárólag titkosított (HTTPS) kapcsolaton érhető el. Az adatokat nem adjuk át harmadik félnek, és
        nem használjuk fel hírlevélhez vagy reklámcélra.
      </p>

      <h2>6. Jogaid</h2>
      <ul>
        <li>tájékoztatást és hozzáférést kérhetsz a rólad kezelt adatokhoz;</li>
        <li>kérheted az adataid helyesbítését, törlését vagy kezelésük korlátozását;</li>
        <li>tiltakozhatsz a jogos érdeken alapuló adatkezelés ellen;</li>
        <li>kérheted az adataid géppel olvasható formában történő kiadását (adathordozhatóság).</li>
      </ul>
      <p>
        Kérésedet a <a href={`mailto:${site.email}`}>{site.email}</a> címre küldheted; legfeljebb 30 napon belül
        válaszolunk.
      </p>

      <h2>7. Jogorvoslat</h2>
      <p>
        Ha úgy érzed, hogy az adatkezelés sérti a jogaidat, panaszt tehetsz a Nemzeti Adatvédelmi és
        Információszabadság Hatóságnál (NAIH): 1055 Budapest, Falk Miksa utca 9–11.; postacím: 1363 Budapest, Pf. 9.;
        telefon: +36 1 391 1400; e-mail: ugyfelszolgalat@naih.hu; web:{' '}
        <a href="https://naih.hu" target="_blank" rel="noopener noreferrer">naih.hu</a>. Bírósághoz is fordulhatsz; a
        per — választásod szerint — a lakóhelyed szerinti törvényszék előtt is megindítható.
      </p>
    </LegalLayout>
  );
}
