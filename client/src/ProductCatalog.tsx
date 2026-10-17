import React, { useState, useEffect } from 'react';
import { useLang } from './LanguageContext';
import { useCart } from './CartContext';
import { API_BASE_URL } from './config';
import { useInView } from './Reveal';
import { LazyImage } from './LazyImage';
import { ShoppingBag, Check, ShieldCheck, Plus, Minus, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface CategoryFilter {
  id: string;
  nameEn: string;
  nameNe: string;
}

export interface ProductItem {
  id: string;
  categoryId: string;
  titleEn: string;
  titleNe: string;
  categoryTagEn: string;
  categoryTagNe: string;
  descriptionEn: string;
  descriptionNe: string;
  price: number;
  unitEn: string;
  unitNe: string;
  minOrderEn: string;
  minOrderNe: string;
  minOrderQty: number;
  badgeEn: string;
  badgeNe: string;
  image: string;
  inStock?: boolean;
}

export const CATEGORIES: CategoryFilter[] = [
  { id: 'all', nameEn: 'All Products', nameNe: 'सबै उत्पादनहरू' },
  { id: 'pure-kc', nameEn: 'Pure Khaki Campbell Ducklings', nameNe: 'शुद्ध खाकी क्याम्पबेल हाँसका चल्लाहरू' },
  { id: 'white-pekin', nameEn: 'White Pekin Meat Ducklings', nameNe: 'ह्वाइट पेकिन हाँसका चल्लाहरू' },
  { id: 'runner-ducklings', nameEn: 'Runner Ducklings', nameNe: 'रनर जातका हाँसका चल्लाहरू' },
  { id: 'hk-cross', nameEn: 'Hong Kong Cross Ducklings', nameNe: 'हङकङ क्रस जातका हाँसका चल्लाहरू' },
  { id: 'meat-male', nameEn: 'Male Ducks for Meat Production', nameNe: 'मासु उत्पादनका लागि भाले हाँसहरू' },
  { id: 'layer-female', nameEn: 'Female Ducks for Egg Production', nameNe: 'अण्डा उत्पादनका लागि पोथी हाँसहरू' },
  { id: 'table-eggs', nameEn: 'Duck Eggs for Consumption', nameNe: 'खानका लागि हाँसका अण्डाहरू' },
  { id: 'hatching-eggs', nameEn: 'Fertile Duck Eggs for Hatching', nameNe: 'चल्ला कोरल्नका लागि निषेचित हाँसका अण्डाहरू' },
  { id: 'farm-fish', nameEn: 'Fish for Consumption and Sale', nameNe: 'बिक्री तथा उपभोगका लागि माछा' }
];

export const INITIAL_DEFAULT_PRODUCTS = [
  {
    id: 'kc-day-old',
    category: 'pure-kc',
    title: 'Day-Old Pure Khaki Campbell Ducklings',
    titleNe: '१ दिनको शुद्ध खाकी क्याम्पबेल हाँसको चल्ला',
    description: 'High pedigree 300+ annual egg layers. Vaccinated, active, and temperature stabilized for dispatch.',
    descriptionNe: 'वार्षिक ३००+ अण्डा उत्पादन गर्ने उच्च गुणस्तरीय शुद्ध जातका चल्लाहरू। भ्याक्सिन लगाइएको।',
    price: 130,
    unit: '/chick',
    minOrder: '25 chicks',
    badge: 'High Yield 300+',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'white-pekin-day-old',
    category: 'white-pekin',
    title: 'Day-Old White Pekin Ducklings',
    titleNe: '१ दिनको शुद्ध ह्वाइट पेकिन हाँसको चल्ला',
    description: 'Fast-growing commercial meat breed reaching 3.2 kg+ in 7–8 weeks. Excellent feed conversion and hardy vigor.',
    descriptionNe: 'छिटो तौल बढ्ने व्यावसायिक मासु जातको हाँस (७–८ हप्तामा ३.२ केजी+)। दाना रूपान्तरण क्षमता उच्च।',
    price: 160,
    unit: '/chick',
    minOrder: '20 chicks',
    badge: 'Fast 3kg+ Meat Gain',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'kc-2week',
    category: 'pure-kc',
    title: '2-Week Brooded Khaki Campbell Ducklings',
    titleNe: '२ हप्ताको ब्रुडिङ गरिएका खाकी क्याम्पबेल चल्लाहरू',
    description: 'Hardy ducklings already through the delicate heating stage. Zero mortality risk for new farmers.',
    descriptionNe: 'शुरुवाती तापक्रम पार गरेका बलिया चल्ला। नयाँ किसानका लागि मर्न सक्ने जोखिम शून्य।',
    price: 240,
    unit: '/chick',
    minOrder: '15 chicks',
    badge: 'Zero Mortality Risk',
    imageUrl: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'runner-chicks',
    category: 'runner-ducklings',
    title: 'Indian Runner Ducklings (Day-Old & 2-Week)',
    titleNe: 'रनर जातका हाँसका चल्लाहरू (१ दिन र २ हप्ताका)',
    description: 'Fast-moving upright ducklings, superb natural foragers for paddy fields and organic pest control.',
    descriptionNe: 'खेतबारीमा कीरा-फट्याङ्ग्रा खान उत्कृष्ट, ठाडो जिउडाल भएका सक्रिय रनर हाँसका चल्लाहरू।',
    price: 150,
    unit: '/chick',
    minOrder: '20 chicks',
    badge: 'Pest Hunter',
    imageUrl: 'https://images.unsplash.com/photo-1549471013-3364d7220b75?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'hong-kong-cross',
    category: 'hk-cross',
    title: 'Hong Kong Cross Heavy-Weight Ducklings',
    titleNe: 'हङकङ क्रस जातका हाँसका चल्लाहरू (द्रुत वृद्धि)',
    description: 'Fast muscle weight development. Ideal for commercial meat growers looking for quick 65-day turnaround.',
    descriptionNe: 'छोटो समयमा तीव्र तौल बढ्ने, व्यावसायिक मासु उत्पादनका लागि सर्वाधिक रुचाइएको हङकङ क्रस।',
    price: 140,
    unit: '/chick',
    minOrder: '20 chicks',
    badge: 'Fast Weight Gain',
    imageUrl: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'male-meat-ducks',
    category: 'meat-male',
    title: 'Mature Heavy Male Ducks for Meat Production',
    titleNe: 'मासु उत्पादनका लागि तयारी भाले हाँसहरू (२.२ - २.६ केजी)',
    description: 'Naturally pasture-raised mature drakes. Rich lean protein meat, weighing 2.2 kg to 2.6 kg live.',
    descriptionNe: 'प्राकृतिक वातावरणमा हुर्केका स्वस्थ भाले हाँस। उच्च पौष्टिक मासुका लागि तयारी २.२-२.६ केजी।',
    price: 1450,
    unit: '/duck',
    minOrder: '5 ducks',
    badge: 'Heavy 2.5kg+',
    imageUrl: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'layer-female-ducks',
    category: 'layer-female',
    title: 'Point-of-Lay Female Ducks for Egg Production',
    titleNe: 'अण्डा उत्पादनका लागि तयार पोथी हाँसहरू (पोइन्ट-अफ-ले)',
    description: 'Fully developed healthy young female ducks ready to lay eggs immediately. Fully dewormed.',
    descriptionNe: 'अण्डा पार्ने उमेर पुगेका स्वस्थ पोथी हाँसहरू। अण्डा फार्म तुरुन्त सुरु गर्नका लागि उत्तम।',
    price: 1600,
    unit: '/duck',
    minOrder: '5 ducks',
    badge: 'Ready Layer',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'table-duck-eggs',
    category: 'table-eggs',
    title: 'Fresh Organic Duck Eggs for Consumption',
    titleNe: 'खानका लागि ताजा अर्गानिक हाँसका अण्डाहरू (क्यारेट)',
    description: 'Farm fresh pasture eggs with golden deep yolk. Packed with proteins, vitamins, and minerals.',
    descriptionNe: 'दैनिक उपभोगका लागि फार्मबाट सिधै संकलन गरिएका गाढा पहेँलो भाग भएका ताजा अण्डाहरू।',
    price: 750,
    unit: '/crate',
    minOrder: '1 crate',
    badge: 'Fresh Daily',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'fertile-hatching-eggs',
    category: 'hatching-eggs',
    title: 'High-Fertility Duck Eggs for Hatching (Incubation)',
    titleNe: 'चल्ला कोरल्नका लागि ९०%+ निषेचित (Fertile) हाँसका अण्डाहरू',
    description: 'Selected candled fertile eggs with proven 90%+ fertility rate from healthy 1:5 drake-to-duck mating ratio.',
    descriptionNe: 'वैज्ञानिक १:५ भाले-पोथी अनुपातबाट उत्पादित ९०%+ ह्याचिङ सम्भावना भएका सफा निषेचित अण्डाहरू।',
    price: 1100,
    unit: '/crate',
    minOrder: '1 crate',
    badge: '90%+ Fertility Rate',
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80',
    inStock: true
  },
  {
    id: 'farm-fish',
    category: 'farm-fish',
    title: 'Live Fresh Pond Fish for Consumption and Sale',
    titleNe: 'बिक्री तथा उपभोगका लागि पोखरीका ताजा माछा (रोहु/नैनी/कमन कार्प)',
    description: 'Naturally integrated duck-cum-fish pond cultured fresh carp (Rohu, Naini, Grass Carp, Common Carp).',
    descriptionNe: 'हाँस फार्मको प्राकृतिक पोखरीमा अर्गानिक रुपमा हुर्काइएका स्वादिला र ताजा माछाहरू।',
    price: 380,
    unit: '/kg',
    minOrder: '5 kg',
    badge: 'Live Harvest',
    imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=800&q=80',
    inStock: true
  }
];

/** Placeholder with the same shape as a product card, shown while it "loads". */
const ProductCardSkeleton: React.FC = () => (
  <div aria-hidden="true" className="border border-zinc-200 bg-white overflow-hidden rounded-xs flex flex-col h-full">
    <div className="skeleton aspect-[16/10] rounded-none" />
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton h-5 w-20" />
      </div>
      <div className="skeleton h-5 w-4/5" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
    </div>
    <div className="p-5 pt-0 space-y-3 mt-auto">
      <div className="skeleton h-12 w-full" />
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-7 w-24" />
        <div className="skeleton h-10 w-32" />
      </div>
    </div>
  </div>
);

/**
 * Shows a skeleton until the card scrolls into view, then reveals the real card
 * after a short staggered delay - so products appear to be fetched as you scroll.
 */
const LazyProductCard: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => {
  const { ref, inView } = useInView<HTMLDivElement>('0px 0px -5% 0px');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setReady(true), reduceMotion ? 0 : 320 + (index % 3) * 140);
    return () => window.clearTimeout(timer);
  }, [inView, index]);

  return (
    <div ref={ref} className="h-full">
      {ready ? <div className="animate-fetch-in h-full">{children}</div> : <ProductCardSkeleton />}
    </div>
  );
};

interface ProductCatalogProps {
  /** "featured" = compact home-page version: no filters, no sticky cart bar */
  variant?: 'page' | 'featured';
  /** Max number of products to show */
  limit?: number;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ variant = 'page', limit }) => {
  const { lang } = useLang();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const isFeatured = variant === 'featured';

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [addedTracker, setAddedTracker] = useState<Record<string, boolean>>({});
  const [warningTracker, setWarningTracker] = useState<Record<string, string | null>>({});
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number | string>>({});

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getApiBaseUrl = () => {
    return API_BASE_URL;
  };

  const mapRawToProductItem = (p: any): ProductItem => {
    const rawMin = p.minOrder || '1';
    const parsedMin = parseInt(rawMin.toString().replace(/[^0-9]/g, ''), 10) || 1;
    return {
      id: String(p.id || p._id),
      categoryId: p.category || 'pure-kc',
      titleEn: p.title || p.titleEn || 'Farm Product',
      titleNe: p.titleNe || p.title || 'फार्म उत्पादन',
      categoryTagEn: `FARM BREED • ${(p.category || 'PRODUCE').toUpperCase()}`,
      categoryTagNe: 'प्रमाणित फार्म उत्पादन',
      descriptionEn: p.description || p.descriptionEn || '',
      descriptionNe: p.descriptionNe || p.description || '',
      price: Number(p.price) || 0,
      unitEn: p.unit || p.unitEn || '/unit',
      unitNe: p.unitNe || p.unit || '/गोटा',
      minOrderEn: `Min Order: ${rawMin}`,
      minOrderNe: `न्यूनतम: ${rawMin}`,
      minOrderQty: parsedMin,
      badgeEn: p.badge || '',
      badgeNe: p.badge || '',
      image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      inStock: p.inStock !== false
    };
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/products`);
      const data = await res.json();

      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        const backendIds = new Set(data.products.map((p: any) => String(p.id || p._id)));
        const missingDefaults = INITIAL_DEFAULT_PRODUCTS.filter(def => !backendIds.has(String(def.id)));
        const combined = [...data.products, ...missingDefaults];
        const mapped = combined.map(mapRawToProductItem);

        setProducts(mapped);
        localStorage.setItem('hz_live_products', JSON.stringify(mapped));
        return;
      }
    } catch (err) {
      console.warn('Backend fetch failed, using local synchronized cache.');
    }

    const saved = localStorage.getItem('hz_live_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const fallback = INITIAL_DEFAULT_PRODUCTS.map(mapRawToProductItem);
    setProducts(fallback);
    localStorage.setItem('hz_live_products', JSON.stringify(fallback));
  };

  useEffect(() => {
    loadProducts().finally(() => setLoading(false));

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hz_live_products' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setSelectedQuantities((prev) => {
      const updated = { ...prev };
      products.forEach((p) => {
        if (!updated[p.id]) {
          updated[p.id] = p.minOrderQty;
        }
      });
      return updated;
    });
  }, [products]);

  const categoryProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === activeCategory);
  const filteredProducts = limit ? categoryProducts.slice(0, limit) : categoryProducts;
  const skeletonCount = limit ?? 6;

  const handleQtyStep = (productId: string, delta: number) => {
    setSelectedQuantities((prev) => {
      const raw = prev[productId];
      const current = typeof raw === 'number' ? raw : (parseInt(raw, 10) || 1);
      const nextVal = current + delta;
      return {
        ...prev,
        [productId]: nextVal >= 1 ? nextVal : 1
      };
    });
  };

  const handleQtyInputChange = (productId: string, valueStr: string) => {
    if (valueStr === '') {
      setSelectedQuantities((prev) => ({ ...prev, [productId]: '' }));
      return;
    }
    const parsed = parseInt(valueStr, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setSelectedQuantities((prev) => ({ ...prev, [productId]: parsed }));
    }
  };

  const handleQtyBlur = (product: ProductItem) => {
    setSelectedQuantities((prev) => {
      const val = prev[product.id];
      if (val === '' || typeof val !== 'number' || val < 1) {
        return { ...prev, [product.id]: product.minOrderQty };
      }
      return prev;
    });
  };

  const handleAddProduct = (product: ProductItem) => {
    const rawVal = selectedQuantities[product.id];
    const qty = typeof rawVal === 'number' ? rawVal : (parseInt(rawVal, 10) || product.minOrderQty);

    if (qty < product.minOrderQty) {
      setWarningTracker((prev) => ({
        ...prev,
        [product.id]: lang === 'ne' 
          ? `न्यूनतम ${product.minOrderQty} अर्डर गर्नुपर्छ` 
          : `Min order required: ${product.minOrderQty}`
      }));

      setSelectedQuantities((prev) => ({
        ...prev,
        [product.id]: product.minOrderQty
      }));

      setTimeout(() => {
        setWarningTracker((prev) => ({ ...prev, [product.id]: null }));
      }, 2500);
      return;
    }

    addToCart(
      {
        id: product.id,
        nameEn: product.titleEn,
        nameNe: product.titleNe,
        price: product.price,
        unitEn: product.unitEn,
        unitNe: product.unitNe
      },
      qty
    );

    setAddedTracker((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedTracker((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section
      className={`${isFeatured ? 'py-20' : 'py-14 pb-28'} px-4 sm:px-6 max-w-site mx-auto font-sans relative`}
      id={isFeatured ? 'featured-products' : 'products'}
    >

      {/* SECTION HEADER */}
      {isFeatured ? (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-700 font-bold">
              <span className="w-6 h-px bg-amber-600"></span>
              <span>{lang === 'ne' ? 'लोकप्रिय उत्पादनहरू' : 'Featured Stock'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-zinc-950 leading-tight">
              {lang === 'ne' ? 'अहिले उपलब्ध चल्ला, हाँस र अण्डा' : 'Ducklings, Ducks & Eggs Available Now'}
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 self-start sm:self-auto border-2 border-zinc-900 text-zinc-900 hover:bg-[#1a3a2a] hover:border-[#1a3a2a] hover:text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xs transition shrink-0"
          >
            <span>{lang === 'ne' ? 'सबै उत्पादन हेर्नुहोस्' : 'View All Products'}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#1a3a2a] border border-emerald-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
          <ShieldCheck size={14} className="text-amber-400 shrink-0" />
          <span>{lang === 'ne' ? 'प्रमाणित व्यावसायिक फार्म उत्पादन' : 'Commercial Farm Products'}</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-zinc-950 leading-tight">
          {lang === 'ne' ? 'उत्पादन तथा जात अनुसार छान्नुहोस्' : 'Explore by Farm Category'}
        </h2>
        
        <p className="text-sm sm:text-base font-normal text-zinc-700 leading-relaxed max-w-2xl mx-auto">
          {lang === 'ne'
            ? 'सबै उत्पादनहरू स्वास्थ्य परीक्षण गरिएका, भ्याक्सिनेटेड र सुरक्षित ढुवानीका लागि उपलब्ध छन्।'
            : 'All stock is strictly health-inspected, vaccinated, and packed for safe nationwide transport.'}
        </p>
      </div>
      )}

      {/* CATEGORY FILTER PILLS */}
      {!isFeatured && (
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 pt-1 mb-10 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 rounded-xs border ${
                isActive
                  ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-md font-extrabold'
                  : 'bg-white text-zinc-800 border-zinc-300 hover:border-emerald-800 hover:text-emerald-950 shadow-2xs'
              }`}
            >
              {lang === 'ne' ? cat.nameNe : cat.nameEn}
            </button>
          );
        })}
      </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && Array.from({ length: skeletonCount }, (_, i) => <ProductCardSkeleton key={`sk-${i}`} />)}
        {!loading && filteredProducts.map((product, index) => {
          const isJustAdded = addedTracker[product.id];
          const rawQty = selectedQuantities[product.id];
          const currentQty = rawQty !== undefined ? rawQty : product.minOrderQty;
          const warning = warningTracker[product.id];
          const numericQty = typeof currentQty === 'number' ? currentQty : (parseInt(currentQty, 10) || 1);
          const isStock = product.inStock !== false;

          return (
            <LazyProductCard key={product.id} index={index}>
            <div
              className="h-full border border-emerald-900/20 dark:border-zinc-200 bg-white shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group text-left rounded-xs hover:-translate-y-1"
            >
              <div>
                {/* 1. CLEAN PRODUCT PHOTO */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 flex items-center justify-center p-2 border-b border-zinc-200">
                  <LazyImage
                    src={product.image}
                    alt={lang === 'ne' ? product.titleNe : product.titleEn}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80"
                  />
                  {product.badgeEn && (
                    <div className="absolute top-3 left-3 bg-[#1a3a2a]/90 text-amber-300 text-[11px] font-bold px-2.5 py-1 shadow-xs border border-emerald-800 rounded-xs font-mono">
                      {lang === 'ne' ? product.badgeNe : product.badgeEn}
                    </div>
                  )}
                </div>

                {/* 2. PRODUCT DETAILS */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black tracking-wide uppercase text-emerald-800 truncate">
                      {lang === 'ne' ? product.categoryTagNe : product.categoryTagEn}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-xs border shrink-0 ${
                        isStock
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                          : 'bg-red-50 text-red-800 border-red-400 font-extrabold'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`}></span>
                      <span>
                        {isStock
                          ? (lang === 'ne' ? 'स्टकमा उपलब्ध' : 'In Stock')
                          : (lang === 'ne' ? 'स्टक सकियो (अर्डर बन्द)' : 'Out of Stock')}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-black leading-snug line-clamp-1 text-zinc-950 group-hover:text-amber-600 transition">
                    {lang === 'ne' ? product.titleNe : product.titleEn}
                  </h3>

                  <p className="text-sm font-medium leading-relaxed line-clamp-2 text-zinc-700">
                    {lang === 'ne' ? product.descriptionNe : product.descriptionEn}
                  </p>
                </div>
              </div>

              {/* 3. CONTROLS & ADD TO CART BAR */}
              <div className="p-5 pt-0 space-y-3">
                
                <div className={`flex items-center justify-between bg-zinc-50 border border-zinc-300 p-2 rounded-xs ${!isStock ? 'opacity-60' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
                      {lang === 'ne' ? 'मात्रा (संख्या):' : 'Enter Quantity:'}
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold">
                      {lang === 'ne' ? product.minOrderNe : product.minOrderEn}
                    </span>
                  </div>
                  
                  <div className="flex items-center bg-white border border-zinc-300 focus-within:border-emerald-700 rounded-xs overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      disabled={numericQty <= 1 || !isStock}
                      onClick={() => handleQtyStep(product.id, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-800 font-bold transition cursor-pointer border-r border-zinc-200"
                      title="Decrease by 1"
                    >
                      <Minus size={13} />
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      disabled={!isStock}
                      value={currentQty}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => handleQtyBlur(product)}
                      onChange={(e) => handleQtyInputChange(product.id, e.target.value)}
                      placeholder="Qty"
                      className="w-14 h-8 text-center font-mono font-extrabold text-sm text-zinc-950 focus:outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-zinc-100 disabled:text-zinc-400"
                    />
                    
                    <button
                      type="button"
                      disabled={!isStock}
                      onClick={() => handleQtyStep(product.id, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition cursor-pointer border-l border-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Increase by 1"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {warning && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1.5 font-bold rounded-xs">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{warning}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">
                      {lang === 'ne' ? 'प्रति एकाइ मूल्य' : 'Unit Price'}
                    </p>
                    <p className="text-lg sm:text-xl font-mono font-black text-zinc-950 leading-tight">
                      Rs. {product.price.toLocaleString()}
                      <span className="text-xs font-normal text-zinc-600 font-sans">
                        {' '}{lang === 'ne' ? product.unitNe : product.unitEn}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!isStock}
                    onClick={() => handleAddProduct(product)}
                    className={`inline-flex items-center gap-1.5 px-4.5 py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm rounded-xs active:scale-95 disabled:bg-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-500 disabled:border disabled:border-zinc-300 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : isStock
                        ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 hover:shadow-md'
                        : 'bg-zinc-200 text-zinc-500'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>Added ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>
                          {isStock 
                            ? (lang === 'ne' ? 'कार्टमा थप्नुहोस्' : 'Add to Cart') 
                            : (lang === 'ne' ? 'स्टक सकियो' : 'Out of Stock')}
                        </span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
            </LazyProductCard>
          );
        })}
      </div>

      {/* FLOATING STICKY CHECKOUT BAR AT THE BOTTOM */}
      {!isFeatured && (
      <div className="fixed bottom-0 inset-x-0 bg-[#12281d]/95 border-t-2 border-amber-500 py-3.5 px-6 sm:px-12 z-50 shadow-2xl backdrop-blur-md flex items-center justify-between max-w-4xl mx-auto rounded-t-lg">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-amber-500 text-zinc-950 flex items-center justify-center font-black font-mono rounded-xs shadow-inner text-base">
            🛒
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              {lang === 'ne' ? `तपाईको कार्टमा ${totalCartItems} वस्तुहरू छन्` : `Shopping Cart: ${totalCartItems} items selected`}
            </p>
            <p className="text-xs text-zinc-200 font-serif">
              {lang === 'ne' ? 'अर्डर पूरा गर्न तुरुन्त चेकआउट गर्नुहोस्' : 'Proceed to fast nationwide bus checkout'}
            </p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate('/order')}
            className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ne' ? 'अहिले चेकआउट गर्नुहोस्' : 'Proceed to Checkout'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      )}

    </section>
  );
};