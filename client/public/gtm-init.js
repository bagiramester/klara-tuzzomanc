// Google Tag Manager (GTM-WZGKJLGQ) előkészítése.
// Külön fájlban van, mert a CSP (client/public/_headers) nem enged beágyazott szkriptet.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Consent Mode v2: amíg nincs sütibanner és hozzájárulás, a Google nem ír és nem olvas sütit.
// Ha lesz banner, elfogadáskor: gtag('consent', 'update', { analytics_storage: 'granted' })
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
});

gtag('js', new Date());
dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
