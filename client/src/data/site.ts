// Az oldal és a jogi oldalak (Impresszum, Adatkezelési tájékoztató) közös adatai.
// ⚠️ Élesítés előtt töltsd ki a [KITÖLTENDŐ] mezőket! (lásd docs/ELESITES.md)

export const site = {
  name: 'KLÁRA tűzzománc',
  url: 'https://klaratuzzomanc.hu',
  email: 'fire.enamel.klara@gmail.com',
  facebook: 'https://www.facebook.com/klara.kovarinebauer',
  city: 'Budapest',

  // Üzemeltető / adatkezelő (magánszemély vagy egyéni vállalkozó adatai)
  owner: {
    name: 'Kovariné Bauer Klára',
    address: '[KITÖLTENDŐ: postázási cím vagy székhely]',
    phone: '[KITÖLTENDŐ: telefonszám, pl. +36 20 …]',
    // Egyéni vállalkozó / őstermelő esetén; ha nincs, hagyd üresen ('')
    taxNumber: '[KITÖLTENDŐ: adószám — vagy üres, ha nincs]',
    registration: '[KITÖLTENDŐ: nyilvántartási szám — vagy üres, ha nincs]',
  },

  hosting: {
    name: 'Cloudflare, Inc.',
    address: '101 Townsend St, San Francisco, CA 94107, USA',
    web: 'https://www.cloudflare.com',
  },

  // Az üzenetküldő űrlap szolgáltatója
  formProvider: {
    name: 'Formspree, Inc.',
    web: 'https://formspree.io',
    privacy: 'https://formspree.io/legal/privacy-policy',
  },

  legalUpdated: '2026. október 1.',
};
