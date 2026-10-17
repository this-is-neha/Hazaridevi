export interface ProductItem {
  id: string;
  nameEn: string;
  nameNe: string;
  price: number;
  unit: string;
  minOrder?: number;
}

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'kc-day-old',
    nameEn: 'Day-Old Pure Khaki Campbell Ducklings',
    nameNe: '१ दिनको शुद्ध खाकी क्याम्पबेल हाँसको चल्ला',
    price: 130,
    unit: 'chick',
    minOrder: 25
  },
  {
    id: 'kc-2week',
    nameEn: '2-Week Brooded Khaki Campbell Ducklings',
    nameNe: '२ हप्ताको ब्रुडिङ गरिएका खाकी क्याम्पबेल चल्लाहरू',
    price: 240,
    unit: 'chick',
    minOrder: 15
  },
  {
    id: 'runner-chicks',
    nameEn: 'Indian Runner Ducklings (Day-Old & 2-Week)',
    nameNe: 'रनर जातका हाँसका चल्लाहरू (१ दिन र २ हप्ताका)',
    price: 150,
    unit: 'chick',
    minOrder: 20
  },
  {
    id: 'hong-kong-cross',
    nameEn: 'Hong Kong Cross Heavy-Weight Ducklings',
    nameNe: 'हङकङ क्रस जातका हाँसका चल्लाहरू (द्रुत वृद्धि)',
    price: 140,
    unit: 'chick',
    minOrder: 20
  },
  {
    id: 'male-meat-ducks',
    nameEn: 'Mature Heavy Male Ducks for Meat Production',
    nameNe: 'मासु उत्पादनका लागि तयारी भाले हाँसहरू (२.२ - २.६ केजी)',
    price: 1450,
    unit: 'duck',
    minOrder: 5
  },
  {
    id: 'layer-female-ducks',
    nameEn: 'Point-of-Lay Female Ducks for Egg Production',
    nameNe: 'अण्डा उत्पादनका लागि तयार पोथी हाँसहरू (पोइन्ट-अफ-ले)',
    price: 1600,
    unit: 'duck',
    minOrder: 5
  },
  {
    id: 'table-duck-eggs',
    nameEn: 'Fresh Organic Duck Eggs for Consumption',
    nameNe: 'खानका लागि ताजा अर्गानिक हाँसका अण्डाहरू (क्यारेट)',
    price: 750,
    unit: 'crate',
    minOrder: 1
  },
  {
    id: 'fertile-hatching-eggs',
    nameEn: 'High-Fertility Duck Eggs for Hatching (Incubation)',
    nameNe: 'चल्ला कोरल्नका लागि ९०%+ निषेचित (Fertile) हाँसका अण्डाहरू',
    price: 1100,
    unit: 'crate',
    minOrder: 1
  },
  {
    id: 'farm-fish',
    nameEn: 'Live Fresh Pond Fish for Consumption and Sale',
    nameNe: 'बिक्री तथा उपभोगका लागि पोखरीका ताजा माछा (रोहु/नैनी/कमन कार्प)',
    price: 380,
    unit: 'kg',
    minOrder: 5
  }
];

export const getStoredProducts = (): ProductItem[] => {
  try {
    const raw = localStorage.getItem('hz_products');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading stored products:', err);
  }
  return DEFAULT_PRODUCTS;
};

export const saveStoredProducts = (products: ProductItem[]) => {
  localStorage.setItem('hz_products', JSON.stringify(products));
};