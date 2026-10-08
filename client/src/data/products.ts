// KLÁRA tűzzománc — termékkatalógus
// Minden termék kézzel készített, 820°C-on égetett tűzzománc, ezüst/réz/bronz alapon

// A termékek a content/termekek/*.json fájlokból jönnek (ezeket az admin felület szerkeszti),
// lásd vite-plugin-products.ts. Az elkelt darabok ide már nem kerülnek be.
import rawProducts from 'virtual:products';

export type Category = 'medalok' | 'fulbevalok' | 'karkotok' | 'brossok' | 'szettek' | 'rez-ekszerek';

export interface Product {
  id: string;              // azonosító, pl. "m4-biloba" (a kiírt kód: M4)
  name: string;
  category: Category;
  price: number;
  description: string;      // rövid leírás a kártyán
  longDescription?: string; // részletes leírás a nagyításban
  colors: string[];
  size?: string;            // pl. "30×8 mm" vagy "50 mm"
  materialDetail?: string;  // pl. "Vörösréz, ékszerzománc"
  technique?: string;       // pl. "fűrészelt", "domborított"
  image: Picture;           // reszponzív WebP változatok (vite-imagetools, ?product)
  featured?: boolean;
  addedAt?: string;         // feltöltés dátuma (az admin tölti ki)
}

export const categories: { id: Category; label: string; description: string }[] = [
  { id: 'medalok', label: 'Medálok', description: 'Lánc nélküli és láncos medálok, a szív közelében' },
  { id: 'fulbevalok', label: 'Fülbevalók', description: 'Bedugós és lógós fülbevalók, finom mozdulatokra' },
  { id: 'karkotok', label: 'Karkötők', description: 'Karra simuló darabok, mindennapra és ünnepre' },
  { id: 'brossok', label: 'Brossok', description: 'Klasszikus kitűzők, kabátra és blúzra' },
  { id: 'szettek', label: 'Szettek', description: 'Összehangolt ékszerek — medál és fülbevaló párban' },
  { id: 'rez-ekszerek', label: 'Réz ékszerek', description: 'Kézzel készített rézékszerek, zománc nélkül' },
];

const categoryOrder = new Map(categories.map((c, i) => [c.id, i]));
const codeNumber = (id: string) => Number(id.match(/\d+/)?.[0] ?? 0);

export const products: Product[] = [...rawProducts].sort(
  (a, b) =>
    categoryOrder.get(a.category)! - categoryOrder.get(b.category)! ||
    a.id.replace(/\d.*/, '').localeCompare(b.id.replace(/\d.*/, '')) ||
    codeNumber(a.id) - codeNumber(b.id) ||
    a.id.localeCompare(b.id),
);

/** Az utóbbi 60 napban feltöltött darab "Új" jelölést kap. */
export const isNew = (p: Product) =>
  !!p.addedAt && Date.now() - new Date(p.addedAt).getTime() < 60 * 24 * 3600 * 1000;

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('hu-HU').format(price) + ' Ft';
};

// A termék azonosítójából csak a sorszámot mutatjuk: 'm4-biloba' → 'M4', 'br1-smaragd-ornament' → 'Br1'.
export function productCode(id: string): string {
  const base = id.split('-')[0];
  const parts = base.match(/^([a-z]+)(\d+)([a-z]*)$/i);
  if (!parts) return base.toUpperCase();
  const [, prefix, num, suffix] = parts;
  return prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase() + num + suffix;
}

export const categoryLabel = (id: Category): string =>
  categories.find((c) => c.id === id)?.label ?? id;
