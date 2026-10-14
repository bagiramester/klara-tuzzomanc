// Az oldal és a jogi oldalak (Impresszum, Adatkezelési tájékoztató) közös adatai.
// Az Impresszumban a törvény (Ektv. 4. §) által előírt minimum szerepel; telefonszámot Klára kérésére nem teszünk ki.

export const site = {
  name: 'KLÁRA tűzzománc',
  url: 'https://klaratuzzomanc.hu',
  email: 'fire.enamel.klara@gmail.com',
  facebook: 'https://www.facebook.com/klara.kovarinebauer',
  city: 'Budapest',

  // Üzemeltető / adatkezelő (magánszemély vagy egyéni vállalkozó adatai)
  owner: {
    name: 'Kőváriné Bauer Klára',
    address: '1181 Budapest, Kinizsi Pál u. 5.',
    phone: '', // szándékosan üres — nem jelenik meg az oldalon
    // Egyéni vállalkozó / őstermelő esetén; ha nincs, hagyd üresen ('')
    taxNumber: '54861266-1-43',
    registration: '',
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

  legalUpdated: '2026. október 14.',
};
