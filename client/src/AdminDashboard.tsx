import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from './config';
import { useAuth } from './AuthContext';
import { 
  Package, Settings, RefreshCw, LogOut, ExternalLink, 
  Phone, MessageSquare, Clock, 
  MapPin, Search, Globe, Calendar, Eye, Plus, Trash2, Edit3, CheckCircle2, XCircle, Upload, Image as ImageIcon, Loader2,
  Bus, Check, Code, ShieldCheck, History, Video, Save, Tag, Mail, AlertTriangle, Bell
} from 'lucide-react';
import { DEFAULT_VIDEOS, type VideoData } from './YouTubeVideos';

interface OrderItem {
  _id?: string;
  id?: string;
  customerName: string;
  phone: string;
  customerEmail?: string;
  province?: string;
  district?: string;
  municipality?: string;
  busCounter?: string;
  addressText: string;
  location: {
    latitude: number;
    longitude: number;
    mapUrl?: string;
  };
  productName: string;
  quantity: number;
  totalPrice: number;
  paymentMethod?: string;
  paymentDetails: {
    transactionId: string;
    receiptScreenshotUrl?: string;
  };
  status: string;
  busNumber?: string;
  driverPhone?: string;
  biltyNumber?: string;
  estimatedArrival?: string;
  counterName?: string;
  createdAt: string;
}

interface VisitItem {
  id: number | string;
  fullName: string;
  phone: string;
  visitDate: string;
  visitorCount: number;
  purpose?: string;
  status: string;
  createdAt: string;
}

interface ProductItem {
  id: string | number;
  title: string;
  category: string;
  badge?: string;
  description: string;
  minOrder: string;
  price: number;
  unit: string;
  imageUrl: string;
  inStock: boolean;
}

interface FarmerListing {
  id: string;
  sellerName: string;
  phone: string;
  category: string;
  productName: string;
  ageOrWeight?: string;
  quantity: string;
  rate: string;
  location: string;
  description?: string;
  imagePreview?: string;
  date?: string;
  status?: string;
}

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export const ADMIN_CATEGORIES = [
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

const DEFAULT_CATALOG_PRODUCTS: ProductItem[] = [
  {
    id: 'kc-day-old',
    category: 'pure-kc',
    title: 'Day-Old Pure Khaki Campbell Ducklings',
    description: 'High pedigree 300+ annual egg layers. Vaccinated, active, and temperature stabilized for dispatch.',
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
    description: 'Fast-growing commercial meat breed reaching 3.2 kg+ in 7–8 weeks. Excellent feed conversion and hardy vigor.',
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
    description: 'Hardy ducklings already through the delicate heating stage. Zero mortality risk for new farmers.',
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
    description: 'Fast-moving upright ducklings, superb natural foragers for paddy fields and organic pest control.',
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
    description: 'Fast muscle weight development. Ideal for commercial meat growers looking for quick 65-day turnaround.',
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
    description: 'Naturally pasture-raised mature drakes. Rich lean protein meat, weighing 2.2 kg to 2.6 kg live.',
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
    description: 'Fully developed healthy young female ducks ready to lay eggs immediately. Fully dewormed.',
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
    description: 'Farm fresh pasture eggs with golden deep yolk. Packed with proteins, vitamins, and minerals.',
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
    description: 'Selected candled fertile eggs with proven 90%+ fertility rate from healthy 1:5 drake-to-duck mating ratio.',
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
    description: 'Naturally integrated duck-cum-fish pond cultured fresh carp (Rohu, Naini, Grass Carp, Common Carp).',
    price: 380,
    unit: '/kg',
    minOrder: '5 kg',
    badge: 'Live Harvest',
    imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=800&q=80',
    inStock: true
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'history' | 'visits' | 'products' | 'farmer_sales' | 'settings'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [adminLang, setAdminLang] = useState<'ne' | 'en'>('en');
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);

  const [lastViewedVisitsCount, setLastViewedVisitsCount] = useState<number>(() => {
    const saved = localStorage.getItem('hz_last_viewed_visits_count');
    return saved !== null ? Number(saved) : 0;
  });

  const unreadVisitsCount = Math.max(0, (visits || []).filter(v => (v.status || 'Pending').toLowerCase() === 'pending').length - Math.min(lastViewedVisitsCount, (visits || []).filter(v => (v.status || 'Pending').toLowerCase() === 'pending').length));

  const handleTabClick = (tab: 'orders' | 'history' | 'visits' | 'products' | 'farmer_sales' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'visits') {
      const currentPendingCount = (visits || []).filter(v => (v.status || 'Pending').toLowerCase() === 'pending').length;
      setLastViewedVisitsCount(currentPendingCount);
      localStorage.setItem('hz_last_viewed_visits_count', String(currentPendingCount));
    }
  };

  const [isMetricsClearedView, setIsMetricsClearedView] = useState<boolean>(() => {
    return localStorage.getItem('hz_admin_metrics_view_reset') === 'true';
  });

  const [dispatchOrder, setDispatchOrder] = useState<OrderItem | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string>('IN_TRANSIT');
  const [dispatchBusNo, setDispatchBusNo] = useState<string>('');
  const [dispatchDriverPhone, setDispatchDriverPhone] = useState<string>('');
  const [dispatchBiltyNo, setDispatchBiltyNo] = useState<string>('');
  const [dispatchCounter, setDispatchCounter] = useState<string>('');
  const [dispatchArrival, setDispatchArrival] = useState<string>('');
  const [dispatchEmail, setDispatchEmail] = useState<string>('');
  const [isSavingDispatch, setIsSavingDispatch] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('pure-kc');
  const [formBadge, setFormBadge] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMinOrder, setFormMinOrder] = useState('20 ducklings');
  const [formPrice, setFormPrice] = useState('');
  const [formUnit, setFormUnit] = useState('/duckling');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formInStock, setFormInStock] = useState<boolean>(true);

  const [videoConfigs, setVideoConfigs] = useState<Record<'ducklings' | 'hatchery' | 'breeders', VideoData>>(() => {
    try {
      const saved = localStorage.getItem('hz_media_videos');
      return saved ? JSON.parse(saved) : DEFAULT_VIDEOS;
    } catch {
      return DEFAULT_VIDEOS;
    }
  });
  const [selectedVideoTab, setSelectedVideoTab] = useState<'ducklings' | 'hatchery' | 'breeders'>('ducklings');
  const [channelUrl, setChannelUrl] = useState<string>(() => {
    return localStorage.getItem('hz_yt_channel') || 'https://youtube.com/@duckfarmnepal?si=gFA9yz8f1naqcyG5';
  });
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [savedVideoSuccess, setSavedVideoSuccess] = useState(false);

  const [heroBannerUrl, setHeroBannerUrl] = useState<string>(() => {
    return localStorage.getItem('hz_hero_banner_image') || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=85';
  });
  const [savedHeroSuccess, setSavedHeroSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const prevVisitsLenRef = useRef<number>(0);

  const getMediaDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('HDF_MediaDB', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('videos')) {
          request.result.createObjectStore('videos');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getApiBaseUrl = () => {
    return API_BASE_URL;
  };

  const syncProductsToStorage = (updatedList: ProductItem[]) => {
    setProducts(updatedList);
    localStorage.setItem('hz_live_products', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('storage'));
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();

    try {
      const storedSales = JSON.parse(localStorage.getItem('hz_farmer_listings') || '[]');
      if (storedSales.length > 0) {
        setFarmerListings(storedSales);
      } else {
        const sampleListings: FarmerListing[] = [
          {
            id: 'LST-101',
            sellerName: 'Bishnu Prasad Yadav',
            phone: '9812345678',
            category: 'खाकी क्याम्पबेल हाँस / चल्ला',
            productName: 'Original Khaki Campbell 25-Day Brooded',
            ageOrWeight: '25 Days',
            quantity: '80 Ducklings',
            rate: '190',
            location: 'Golbazar, Siraha',
            description: 'Fully vaccinated with Duck Plague. Ready for delivery.',
            date: '10/12/2026',
            status: 'Pending'
          },
          {
            id: 'LST-102',
            sellerName: 'Santosh Kumar',
            phone: '9845671230',
            category: 'ताजा / ह्याचिङ अण्डा',
            productName: 'Fertile Hatching Duck Eggs',
            ageOrWeight: 'Fresh (2 Days)',
            quantity: '300 pcs',
            rate: '35',
            location: 'Mirchaiya, Siraha',
            description: '90%+ fertility guaranteed from parent stock.',
            date: '10/11/2026',
            status: 'Approved'
          }
        ];
        setFarmerListings(sampleListings);
        localStorage.setItem('hz_farmer_listings', JSON.stringify(sampleListings));
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const resOrders = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataOrders = await resOrders.json();
      if (dataOrders.success) {
        const savedDispatches = JSON.parse(localStorage.getItem('hz_dispatches') || '{}');
        const mergedOrders = dataOrders.orders.map((o: OrderItem) => {
          const id = (o.id || o._id) as string;
          return savedDispatches[id] ? { ...o, ...savedDispatches[id] } : o;
        });
        setOrders(mergedOrders);
      }
    } catch (err) {
      console.warn('Orders fetch notice:', err);
    }

    try {
      let remoteVisits: VisitItem[] = [];
      try {
        const resVisits = await fetch(`${API_BASE_URL}/api/admin/visits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataVisits = await resVisits.json();
        if (dataVisits.success && Array.isArray(dataVisits.visits)) {
          remoteVisits = dataVisits.visits;
        }
      } catch (e) {
        console.warn('Remote visits fetch offline');
      }

      const localVisits: VisitItem[] = JSON.parse(localStorage.getItem('hz_farm_visits') || '[]');
      const localIds = new Set(localVisits.map(v => String(v.id)));
      const mergedVisits = [
        ...localVisits,
        ...remoteVisits.filter(rv => !localIds.has(String(rv.id)))
      ];

      setVisits(mergedVisits);
      prevVisitsLenRef.current = mergedVisits.length;
    } catch (err) {
      console.error('Error handling visits sync:', err);
    }

    try {
      const resProducts = await fetch(`${API_BASE_URL}/api/products`);
      const dataProducts = await resProducts.json();

      if (dataProducts.success && Array.isArray(dataProducts.products) && dataProducts.products.length > 0) {
        const backendIds = new Set(dataProducts.products.map((p: any) => String(p.id || p._id)));
        const missingDefaults = DEFAULT_CATALOG_PRODUCTS.filter(def => !backendIds.has(String(def.id)));
        const combined = [...dataProducts.products, ...missingDefaults];
        syncProductsToStorage(combined);
      } else {
        const local = JSON.parse(localStorage.getItem('hz_live_products') || '[]');
        if (local.length > 0) {
          setProducts(local);
        } else {
          syncProductsToStorage(DEFAULT_CATALOG_PRODUCTS);
        }
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('hz_live_products') || '[]');
      if (local.length > 0) {
        setProducts(local);
      } else {
        syncProductsToStorage(DEFAULT_CATALOG_PRODUCTS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      // 1. Check Farm Visits
      const localVisits: VisitItem[] = JSON.parse(localStorage.getItem('hz_farm_visits') || '[]');
      const pendingVisitsCount = localVisits.filter(v => (v.status || 'Pending').toLowerCase() === 'pending').length;
      const prevPendingCount = JSON.parse(localStorage.getItem('hz_prev_pending_count') || String(pendingVisitsCount));

      if (pendingVisitsCount > prevPendingCount) {
        const newcomer = localVisits[0]?.fullName || 'Visitor';
        setLiveNotification(`🔔 नयाँ फार्म भिजिट बुकिङ प्राप्त भयो: ${newcomer}!`);
        setTimeout(() => setLiveNotification(null), 7000);
      }
      localStorage.setItem('hz_prev_pending_count', String(pendingVisitsCount));
      setVisits(localVisits);

      // 2. Check Farmer Marketplace Listings
      const localListings: FarmerListing[] = JSON.parse(localStorage.getItem('hz_farmer_listings') || '[]');
      const pendingListingsCount = localListings.filter(f => (f.status || 'Pending').toLowerCase() === 'pending').length;
      const prevListingsCount = JSON.parse(localStorage.getItem('hz_prev_listing_count') || String(pendingListingsCount));

      if (pendingListingsCount > prevListingsCount) {
        const seller = localListings[0]?.sellerName || 'Farmer';
        setLiveNotification(`🌾 नयाँ किसान बजार (Sell Produce) अनुरोध प्राप्त भयो: ${seller}!`);
        setTimeout(() => setLiveNotification(null), 7000);
      }
      localStorage.setItem('hz_prev_listing_count', String(pendingListingsCount));
      setFarmerListings(localListings);

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDispatchOrder(null);
        setIsProductModalOpen(false);
        setPreviewReceipt(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => {
          const currentId = o.id || o._id;
          return currentId === orderId ? { ...o, status: newStatus.toUpperCase() } : o;
        }));

        const savedDispatches = JSON.parse(localStorage.getItem('hz_dispatches') || '{}');
        if (savedDispatches[orderId]) {
          savedDispatches[orderId].status = newStatus.toLowerCase();
          localStorage.setItem('hz_dispatches', JSON.stringify(savedDispatches));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVisitStatusChange = (visitId: number | string, newStatus: string) => {
    const updated = visits.map(v => String(v.id) === String(visitId) ? { ...v, status: newStatus } : v);
    setVisits(updated);
    localStorage.setItem('hz_farm_visits', JSON.stringify(updated));
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmMsg = adminLang === 'ne'
      ? 'के तपाईं यो अर्डर साँच्चै मेटाउन चाहनुहुन्छ? (यो डेटा सधैंका लागि हट्नेछ)'
      : 'Are you sure you want to permanently delete this order?';
    if (!window.confirm(confirmMsg)) return;

    setOrders(prev => prev.filter(o => (o.id || o._id) !== orderId));

    const savedDispatches = JSON.parse(localStorage.getItem('hz_dispatches') || '{}');
    if (savedDispatches[orderId]) {
      delete savedDispatches[orderId];
      localStorage.setItem('hz_dispatches', JSON.stringify(savedDispatches));
    }

    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();
    try {
      await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('Backend delete sync offline, order deleted locally.');
    }
  };

  const handleClearAllHistory = () => {
    const confirmMsg = adminLang === 'ne' 
      ? 'के तपाईं सबै सम्पन्न अर्डर इतिहासहरू सधैंका लागि मेटाउन चाहनुहुन्छ?' 
      : 'Are you sure you want to delete all completed order history?';
    if (!window.confirm(confirmMsg)) return;

    const activeOnly = orders.filter(o => !isOrderCompleted(o.status));
    setOrders(activeOnly);

    const savedDispatches = JSON.parse(localStorage.getItem('hz_dispatches') || '{}');
    completedOrders.forEach(o => {
      const id = (o.id || o._id) as string;
      if (savedDispatches[id]) delete savedDispatches[id];
    });
    localStorage.setItem('hz_dispatches', JSON.stringify(savedDispatches));
  };

  const handleDeleteVisit = async (visitId: number | string) => {
    const confirmMsg = adminLang === 'ne'
      ? 'के तपाईं यो फार्म भिजिट रेकर्ड मेटाउन चाहनुहुन्छ?'
      : 'Are you sure you want to delete this farm visit record?';
    if (!window.confirm(confirmMsg)) return;

    const updatedVisits = visits.filter(v => String(v.id) !== String(visitId));
    setVisits(updatedVisits);
    localStorage.setItem('hz_farm_visits', JSON.stringify(updatedVisits));

    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();
    try {
      await fetch(`${API_BASE_URL}/api/admin/visits/${visitId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('Backend delete sync offline, visit deleted locally.');
    }
  };

  const handleOpenDispatchModal = (order: OrderItem) => {
    setDispatchOrder(order);
    setDispatchStatus((order.status || 'IN_TRANSIT').toUpperCase());
    setDispatchBusNo(order.busNumber || '');
    setDispatchDriverPhone(order.driverPhone || '');
    setDispatchBiltyNo(order.biltyNumber || '');
    setDispatchCounter(order.counterName || order.busCounter || '');
    setDispatchArrival(order.estimatedArrival || 'भोलि बिहान ६:०० बजे');
    setDispatchEmail(order.customerEmail || '');
  };

  const handleDirectSendEmail = async () => {
    if (!dispatchOrder) return;
    if (!dispatchEmail || !dispatchEmail.includes('@')) {
      alert(adminLang === 'ne' ? 'कृपया मान्य इमेल ठेगाना लेख्नुहोस्।' : 'Please enter a valid email address.');
      return;
    }

    const orderId = (dispatchOrder.id || dispatchOrder._id) as string;
    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();

    setIsSendingEmail(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerEmail: dispatchEmail.trim(),
          customerName: dispatchOrder.customerName,
          productName: dispatchOrder.productName,
          quantity: dispatchOrder.quantity,
          busNumber: dispatchBusNo.trim(),
          driverPhone: dispatchDriverPhone.trim(),
          biltyNumber: dispatchBiltyNo.trim(),
          counterName: dispatchCounter.trim(),
          estimatedArrival: dispatchArrival.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(adminLang === 'ne' ? `✅ इमेल स्लिप सफलतापूर्वक ${dispatchEmail} मा पठाइयो!` : `✅ Dispatch slip sent successfully to ${dispatchEmail}!`);
      } else {
        alert(data.message || 'Failed to send email. Check backend SMTP settings.');
      }
    } catch (err: any) {
      alert(`Email Service Error: ${err.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchOrder) return;

    const orderId = (dispatchOrder.id || dispatchOrder._id) as string;
    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();
    setIsSavingDispatch(true);

    const dispatchData = {
      status: dispatchStatus.toLowerCase(),
      busNumber: dispatchBusNo.trim(),
      driverPhone: dispatchDriverPhone.trim(),
      biltyNumber: dispatchBiltyNo.trim(),
      counterName: dispatchCounter.trim(),
      estimatedArrival: dispatchArrival.trim(),
      customerEmail: dispatchEmail.trim()
    };

    try {
      await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dispatchData)
      });

      const savedDispatches = JSON.parse(localStorage.getItem('hz_dispatches') || '{}');
      savedDispatches[orderId] = dispatchData;
      const phoneClean = dispatchOrder.phone.replace(/[^0-9]/g, '');
      savedDispatches[phoneClean] = {
        orderId: `HDF-${orderId.slice(-4).toUpperCase()}`,
        customerName: dispatchOrder.customerName,
        phone: dispatchOrder.phone,
        item: dispatchOrder.productName,
        quantity: `${dispatchOrder.quantity} units`,
        ...dispatchData
      };
      localStorage.setItem('hz_dispatches', JSON.stringify(savedDispatches));

      setOrders(prev => prev.map(o => {
        const id = (o.id || o._id) as string;
        return id === orderId ? { ...o, ...dispatchData, status: dispatchStatus.toUpperCase() } : o;
      }));

      setDispatchOrder(null);
      alert(adminLang === 'ne' ? 'बस डेलिभरी विवरण सफलतापूर्वक अपडेट भयो!' : 'Bus delivery details updated successfully!');
    } catch (err: any) {
      console.error('Error saving dispatch:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSavingDispatch(false);
    }
  };

  const generateWhatsAppUrl = (order: OrderItem) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
    const farmName = adminLang === 'ne' ? 'हजारीदेवी डक फार्म' : 'Hazaridevi Duck Farm';

    let message = '';
    const st = (order.status || '').toUpperCase();
    if (st === 'IN_TRANSIT' || st === 'ARRIVED') {
      message = adminLang === 'ne'
        ? `नमस्ते ${order.customerName} जी, ${farmName} बाट तपाईंको अर्डर (${order.productName} ${order.quantity} units) डिलक्स बसमा लोड भई काउन्टर पुगेको छ!\n\n🚌 बस नं: ${order.busNumber || 'अपडेट गरिएको'}\n📞 चालक नं: ${order.driverPhone || '-'}\n🧾 बिल्टी नं: ${order.biltyNumber || '-'}\n📍 काउन्टर: ${order.counterName || order.busCounter || 'काउन्टर'}\n\nधन्यवाद!`
        : `Hello ${order.customerName}, your order from ${farmName} (${order.productName} ${order.quantity} units) is ready for pickup!\n\nBus No: ${order.busNumber || 'Updated'}\nCounter: ${order.counterName || order.busCounter || 'Counter'}\nBilty: ${order.biltyNumber || '-'}\nThank you!`;
    } else if (st === 'DELIVERED') {
      message = adminLang === 'ne'
        ? `नमस्ते ${order.customerName} जी, ${farmName} बाट तपाईंको अर्डर सफलतापूर्वक डेलिभर भएको छ। हजारीदेवी डक फार्म छान्नुभएकोमा धन्यवाद!`
        : `Hello ${order.customerName}, your order has been successfully marked as DELIVERED. Thank you for choosing Hazaridevi Duck Farm!`;
    } else if (st === 'TERMINATED' || st === 'LOST_IN_TRANSIT') {
      message = adminLang === 'ne'
        ? `नमस्ते ${order.customerName} जी, ${farmName} बाट तपाईंको अर्डरमा भएको समस्या (दूर्घटना/क्षति) का कारण अर्डर टर्मिनेट/रद्द गरिएको छ। थप जानकारीका लागि सम्पर्क गर्नुहोला।`
        : `Hello ${order.customerName}, your order has been terminated/cancelled due to transit issues. Please contact farm support.`;
    } else {
      message = adminLang === 'ne'
        ? `नमस्ते ${order.customerName} जी, ${farmName} बाट तपाईंको अर्डर स्वीकृत भएको छ।`
        : `Hello ${order.customerName}, order confirmed at ${farmName}.`;
    }

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert(adminLang === 'ne' ? 'फोटोको साइज १५MB भन्दा सानो हुनुपर्छ।' : 'Image size must be under 15MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert(adminLang === 'ne' ? 'फोटोको साइज १५MB भन्दा सानो हुनुपर्छ।' : 'Image size must be under 15MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setHeroBannerUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHeroBanner = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hz_hero_banner_image', heroBannerUrl);
    window.dispatchEvent(new Event('storage'));
    setSavedHeroSuccess(true);
    setTimeout(() => setSavedHeroSuccess(false), 2500);
    alert(adminLang === 'ne' ? 'वेबसाइटको मुख्य (Hero) फोटो सफलतापूर्वक अपडेट भयो!' : 'Hero banner photo updated successfully!');
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert(adminLang === 'ne' ? 'कृपया मान्य भिडियो फाइल (.mp4, .mov, .webm) मात्र छान्नुहोस्।' : 'Please choose a valid video file (.mp4, .mov, etc.)');
        return;
      }
      setSelectedVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormCategory('pure-kc');
    setFormBadge('');
    setFormDescription('');
    setFormMinOrder('20 ducklings');
    setFormPrice('');
    setFormUnit('/duckling');
    setFormImageUrl('');
    setFormInStock(true);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormCategory(product.category);
    setFormBadge(product.badge || '');
    setFormDescription(product.description);
    setFormMinOrder(product.minOrder);
    setFormPrice(product.price.toString());
    setFormUnit(product.unit);
    setFormImageUrl(product.imageUrl || '');
    setFormInStock(product.inStock !== false);
    setIsProductModalOpen(true);
  };

  const handleToggleStock = async (product: ProductItem) => {
    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();
    const newStockState = !product.inStock;

    const updated = products.map(p => String(p.id) === String(product.id) ? { ...p, inStock: newStockState } : p);
    syncProductsToStorage(updated);

    try {
      await fetch(`${API_BASE_URL}/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inStock: newStockState })
      });
    } catch (err) {
      console.log('Backend sync offline, updated in synchronized store.');
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    const confirmMsg = adminLang === 'ne' 
      ? 'के तपाईं यो उत्पादन साँच्चै मेटाउन चाहनुहुन्छ?' 
      : 'Are you sure you want to delete this product?';
    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();

    const updated = products.filter(p => String(p.id) !== String(id));
    syncProductsToStorage(updated);

    try {
      await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log('Backend sync offline, deleted from synchronized store.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('hz_customer_token');
    const API_BASE_URL = getApiBaseUrl();

    const priceNum = Number(formPrice);
    if (!priceNum || priceNum <= 0) {
      alert(adminLang === 'ne' ? 'कृपया मान्य मूल्य (Price) राख्नुहोस्' : 'Please enter a valid price');
      return;
    }

    setIsSubmittingProduct(true);

    const payload: ProductItem = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      badge: formBadge.trim() || undefined,
      description: formDescription.trim(),
      minOrder: formMinOrder.trim() || '1 unit',
      price: priceNum,
      unit: formUnit,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      inStock: formInStock
    };

    let updatedList: ProductItem[];
    if (editingProduct) {
      updatedList = products.map(p => String(p.id) === String(editingProduct.id) ? { ...p, ...payload } : p);
    } else {
      updatedList = [payload, ...products];
    }
    syncProductsToStorage(updatedList);
    setIsProductModalOpen(false);

    try {
      const url = editingProduct 
        ? `${API_BASE_URL}/api/admin/products/${editingProduct.id}`
        : `${API_BASE_URL}/api/admin/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log('Saved to synchronized store, backend offline.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleSaveVideoSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('hz_media_videos', JSON.stringify(videoConfigs));
      localStorage.setItem('hz_yt_channel', channelUrl.trim());

      if (selectedVideoFile) {
        const db = await getMediaDB();
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');
        store.put(selectedVideoFile, selectedVideoTab);
        await new Promise((resolve) => {
          tx.oncomplete = resolve;
        });
      }

      setSavedVideoSuccess(true);
      setTimeout(() => setSavedVideoSuccess(false), 2500);
      alert(adminLang === 'ne' ? 'ग्यालेरी भिडियो तथा विवरण सफलतापूर्वक अपडेट भयो!' : 'Gallery video & details updated successfully!');
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Failed to save settings.');
    }
  };

  const deleteFarmerListing = (id: string) => {
    if (!window.confirm('Delete this farmer listing?')) return;
    const updated = farmerListings.filter((item) => item.id !== id);
    setFarmerListings(updated);
    localStorage.setItem('hz_farmer_listings', JSON.stringify(updated));
  };

  const toggleListingStatus = (id: string) => {
    const updated = farmerListings.map((item) => {
      if (item.id === id) {
        return { ...item, status: item.status === 'Approved' ? 'Pending' : 'Approved' };
      }
      return item;
    });
    setFarmerListings(updated);
    localStorage.setItem('hz_farmer_listings', JSON.stringify(updated));
  };

  const toggleMetricsView = () => {
    const nextState = !isMetricsClearedView;
    setIsMetricsClearedView(nextState);
    localStorage.setItem('hz_admin_metrics_view_reset', String(nextState));
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '';
    onBackToHome();
  };

  const isOrderCompleted = (status: string) => {
    const s = (status || '').toUpperCase();
    return s === 'ARRIVED' || s === 'DELIVERED' || s === 'TERMINATED' || s === 'LOST_IN_TRANSIT';
  };

  const activeOrders = orders.filter(o => !isOrderCompleted(o.status));
  const completedOrders = orders.filter(o => isOrderCompleted(o.status));
  const pendingOrders = orders.filter((o) => (o.status || '').toUpperCase() === 'PENDING').length;
  const pendingVisitsCount = (visits || []).filter(v => (v.status || 'Pending').toLowerCase() === 'pending').length;

  const totalRevenue = isMetricsClearedView 
    ? 0 
    : orders
        .filter(o => !['TERMINATED', 'LOST_IN_TRANSIT'].includes((o.status || '').toUpperCase()))
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const displayedActiveOrdersCount = isMetricsClearedView ? 0 : activeOrders.length;
  const displayedPendingCount = isMetricsClearedView ? 0 : pendingOrders;
  const displayedFarmerSalesCount = isMetricsClearedView ? 0 : farmerListings.filter(f => (f.status || 'Pending').toLowerCase() === 'pending').length;
  const displayedCompletedCount = isMetricsClearedView ? 0 : completedOrders.length;
  const displayedVisitsCount = isMetricsClearedView ? 0 : pendingVisitsCount;

  const filterMatches = (o: OrderItem) => {
    const currentStatus = (o.status || '').toUpperCase();
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.addressText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.busCounter && o.busCounter.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.busNumber && o.busNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.paymentDetails?.transactionId && o.paymentDetails.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  };

  const displayedActiveOrders = activeOrders.filter(filterMatches);
  const displayedHistoryOrders = completedOrders.filter(filterMatches);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans flex flex-col justify-between">
      <div>
        {/* LIVE NOTIFICATION TOAST BANNER */}
        {liveNotification && (
          <div className="bg-amber-500 text-zinc-950 font-mono font-black text-xs sm:text-sm py-3 px-4 text-center sticky top-0 z-50 shadow-lg flex items-center justify-center gap-2 animate-bounce">
            <Bell size={18} className="animate-spin" />
            <span>{liveNotification}</span>
          </div>
        )}

        {/* Header - Deep Forest Green Theme */}
        <header className="bg-[#1a3a2a] text-white border-b-2 border-amber-500 sticky top-0 z-30 shadow-md">
          <div className="max-w-site mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 bg-white flex items-center justify-center shrink-0 p-0.5 shadow-sm">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h1 className="text-base sm:text-lg font-serif font-black text-white tracking-tight leading-tight">
                  {adminLang === 'ne' ? 'हजारीदेवी डक फार्म - व्यवस्थापन प्यानल' : 'Hazaridevi Duck Farm - Admin Panel'}
                </h1>
                <p className="text-[11px] font-mono text-amber-300 font-bold tracking-wider uppercase mt-0.5">
                  {adminLang === 'ne' ? 'अर्डर, बस काउन्टर ट्र्याकिङ, किसान बजार र भुक्तानी' : 'Orders, Bus Dispatch Tracking, Farmer Marketplace & Payments'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleMetricsView}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  isMetricsClearedView
                    ? 'bg-emerald-700 hover:bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600 text-zinc-200'
                }`}
                title="Database will NOT be deleted, only display is cleared to 0"
              >
                <Eye size={13} className="text-amber-400" />
                <span>
                  {isMetricsClearedView 
                    ? (adminLang === 'ne' ? 'तथ्याङ्क देखाउनुहोस्' : 'Restore Metrics') 
                    : (adminLang === 'ne' ? 'तथ्याङ्क ० बनाउनुहोस्' : 'Zero Metrics (Display)')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminLang(adminLang === 'ne' ? 'en' : 'ne')}
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xs shadow-sm transition cursor-pointer"
              >
                <Globe size={13} />
                <span>{adminLang === 'ne' ? 'English' : 'नेपाली'}</span>
              </button>

              <button
                type="button"
                onClick={fetchDashboardData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 bg-[#12271c] hover:bg-black/50 border border-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xs transition cursor-pointer"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin text-amber-400' : 'text-amber-400'} />
                <span>{adminLang === 'ne' ? 'रिफ्रेस' : 'Refresh'}</span>
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className="bg-[#12271c] hover:bg-black/50 border border-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xs transition cursor-pointer"
              >
                {adminLang === 'ne' ? 'वेबसाइट हेर्नुहोस्' : 'View Site'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xs shadow transition cursor-pointer"
              >
                <LogOut size={13} />
                <span>{adminLang === 'ne' ? 'लगआउट' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="max-w-site mx-auto px-4 py-8 space-y-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-left">
            <div className="bg-white p-4 border border-zinc-200 shadow-sm flex items-center justify-between rounded-xs">
              <div>
                <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  {adminLang === 'ne' ? 'सक्रिय अर्डरहरू' : 'Active Orders'}
                </p>
                <p className="text-xl font-serif font-black text-zinc-900 mt-1">
                  {displayedActiveOrdersCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center rounded-xs shrink-0">
                <Package size={18} />
              </div>
            </div>

            <div className="bg-white p-4 border border-zinc-200 shadow-sm flex items-center justify-between rounded-xs">
              <div>
                <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  {adminLang === 'ne' ? 'पेन्डिङ अर्डर' : 'Pending Orders'}
                </p>
                <p className="text-xl font-serif font-black text-amber-600 mt-1">
                  {displayedPendingCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center rounded-xs shrink-0">
                <Clock size={18} />
              </div>
            </div>

            <div className="bg-white p-4 border border-zinc-200 shadow-sm flex items-center justify-between rounded-xs">
              <div>
                <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  {adminLang === 'ne' ? 'किसान बिक्री' : 'Farmer Sales'}
                </p>
                <p className="text-xl font-serif font-black text-emerald-800 mt-1">
                  {displayedFarmerSalesCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center rounded-xs shrink-0">
                <Tag size={18} />
              </div>
            </div>

            {/* FARM VISITS METRIC CARD */}
            <div 
              onClick={() => handleTabClick('visits')}
              className="bg-white p-4 border border-emerald-700/60 hover:border-emerald-700 shadow-sm flex items-center justify-between rounded-xs cursor-pointer group transition relative"
            >
              {unreadVisitsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  +{unreadVisitsCount} New
                </span>
              )}
              <div>
                <p className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wider group-hover:underline">
                  {adminLang === 'ne' ? 'फार्म भिजिट्स' : 'Farm Visits'}
                </p>
                <p className="text-xl font-serif font-black text-zinc-900 mt-1">
                  {displayedVisitsCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-50 text-amber-700 border border-amber-300 flex items-center justify-center rounded-xs shrink-0">
                <Calendar size={18} />
              </div>
            </div>

            <div className="bg-white p-4 border border-zinc-200 shadow-sm flex items-center justify-between rounded-xs">
              <div>
                <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  {adminLang === 'ne' ? 'इतिहास/सम्पन्न' : 'Completed'}
                </p>
                <p className="text-xl font-serif font-black text-zinc-900 mt-1">
                  {displayedCompletedCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center justify-center rounded-xs shrink-0">
                <CheckCircle2 size={18} className="text-emerald-700" />
              </div>
            </div>

            <div className="bg-white p-4 border border-zinc-200 shadow-sm flex items-center justify-between rounded-xs">
              <div>
                <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  {adminLang === 'ne' ? 'कुल आम्दानी' : 'Total Revenue'}
                </p>
                <p className="text-lg font-mono font-bold text-zinc-900 mt-1 truncate max-w-[110px]">
                  Rs.{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-base select-none rounded-xs shrink-0">
                रू
              </div>
            </div>
          </div>

          {/* Tab Switcher Bar */}
          <div className="bg-white p-4 border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 rounded-xs">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => handleTabClick('orders')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap rounded-xs border ${
                  activeTab === 'orders' 
                    ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm' 
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <Package size={14} />
                <span>{adminLang === 'ne' ? 'सक्रिय अर्डर' : 'Active Orders'} ({activeOrders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('farmer_sales')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap rounded-xs border ${
                  activeTab === 'farmer_sales' 
                    ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm' 
                    : 'bg-zinc-50 text-emerald-800 border-zinc-200 hover:bg-emerald-50'
                }`}
              >
                <Tag size={14} />
                <span>🌾 {adminLang === 'ne' ? 'किसान बजार (विक्री)' : 'Farmer Sales'} ({farmerListings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('history')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap rounded-xs border ${
                  activeTab === 'history' 
                    ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm' 
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <History size={14} />
                <span>{adminLang === 'ne' ? 'डेलिभरी इतिहास / सम्पन्न' : 'Order History'} ({completedOrders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('visits')}
                className={`relative flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap rounded-xs border ${
                  activeTab === 'visits' 
                    ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm' 
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <Calendar size={14} />
                <span>{adminLang === 'ne' ? 'फार्म भिजिटहरू' : 'Farm Visits'} ({visits.length})</span>
                {unreadVisitsCount > 0 && (
                  <span className="bg-red-600 text-white font-mono font-black text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                    +{unreadVisitsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('products')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap rounded-xs border ${
                  activeTab === 'products' 
                    ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm' 
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <Edit3 size={14} />
                <span>{adminLang === 'ne' ? 'उत्पादनहरू' : 'Products'} ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('settings')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap rounded-xs border ${
                  activeTab === 'settings' 
                    ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm' 
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <Settings size={14} />
                <span>{adminLang === 'ne' ? 'मिडिया र सेटिङ' : 'Media & Settings'}</span>
              </button>
            </div>

            {(activeTab === 'orders' || activeTab === 'history' || activeTab === 'farmer_sales') && (
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder={adminLang === 'ne' ? 'खोज्नुहोस्...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 text-xs font-mono text-zinc-900 focus:border-emerald-700 outline-none rounded-xs"
                  />
                </div>

                {activeTab === 'orders' && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-zinc-50 border border-zinc-300 text-xs font-mono font-bold px-3 py-2 focus:border-emerald-700 outline-none cursor-pointer rounded-xs"
                  >
                    <option value="ALL">All Active Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PACKED">Packed</option>
                    <option value="IN_TRANSIT">In Transit (बाटोमा छ)</option>
                  </select>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider px-4 py-2 transition shadow-sm cursor-pointer rounded-xs"
              >
                <Plus size={15} />
                <span>{adminLang === 'ne' ? '+ नयाँ उत्पादन थप्नुहोस्' : '+ Add New Product'}</span>
              </button>
            )}
          </div>

          {/* Tab 1: ACTIVE ORDERS QUEUE */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {displayedActiveOrders.length === 0 ? (
                <div className="bg-white p-12 text-center border border-zinc-200 shadow-sm space-y-2 rounded-xs">
                  <Package size={38} className="mx-auto text-zinc-300" />
                  <p className="font-serif font-bold text-zinc-800 text-base">
                    {adminLang === 'ne' ? 'कुनै सक्रिय अर्डर छैन (सबै डेलिभर भइसकेका छन्)' : 'No active orders in queue!'}
                  </p>
                  <p className="text-xs font-serif text-zinc-500">
                    {adminLang === 'ne' ? 'सम्पन्न भइसकेका अर्डरहरू "डेलिभरी इतिहास" ट्याबमा हेर्न सक्नुहुन्छ।' : 'Delivered & Arrived orders have moved to the "Order History" tab.'}
                  </p>
                </div>
              ) : (
                displayedActiveOrders.map((order) => {
                  const orderId = (order.id || order._id) as string;
                  const mapLink = order.location?.mapUrl || `https://www.google.com/maps?q=${order.location?.latitude},${order.location?.longitude}`;
                  const whatsappUrl = generateWhatsAppUrl(order);
                  const payMethod = (order.paymentMethod || 'esewa').toLowerCase();
                  const normalizedStatus = (order.status || 'PENDING').toUpperCase();

                  return (
                    <div
                      key={orderId}
                      className="bg-white border border-zinc-200 shadow-xs hover:shadow-md transition p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-left rounded-xs"
                    >
                      <div className="lg:col-span-7 space-y-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-serif font-bold text-zinc-900 text-lg leading-tight">{order.customerName}</h3>
                          
                          <select
                            value={normalizedStatus}
                            disabled={updatingId === orderId}
                            onChange={(e) => handleStatusChange(orderId, e.target.value)}
                            className={`text-[11px] font-mono font-bold uppercase px-2.5 py-1 border outline-none cursor-pointer transition rounded-xs ${
                              normalizedStatus === 'PENDING'
                                ? 'bg-amber-50 text-amber-800 border-amber-400'
                                : normalizedStatus === 'CONFIRMED'
                                ? 'bg-blue-50 text-blue-800 border-blue-400'
                                : normalizedStatus === 'PACKED'
                                ? 'bg-zinc-100 text-zinc-800 border-zinc-400'
                                : normalizedStatus === 'IN_TRANSIT'
                                ? 'bg-purple-50 text-purple-800 border-purple-400'
                                : normalizedStatus === 'TERMINATED' || normalizedStatus === 'LOST_IN_TRANSIT'
                                ? 'bg-red-50 text-red-800 border-red-400'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-400'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PACKED">PACKED</option>
                            <option value="IN_TRANSIT">IN TRANSIT (बाटोमा)</option>
                            <option value="ARRIVED">ARRIVED (काउन्टरमा पुग्यो)</option>
                            <option value="DELIVERED">DELIVERED (डेलिभर भयो)</option>
                            <option value="TERMINATED">🚨 TERMINATED / LOST (रद्द / क्षति)</option>
                          </select>

                          {payMethod.includes('esewa') && (
                            <span className="bg-[#60bb46] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                              eSewa
                            </span>
                          )}
                          {payMethod.includes('khalti') && (
                            <span className="bg-[#5c2d91] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                              Khalti
                            </span>
                          )}
                          {payMethod.includes('rbb') && (
                            <span className="bg-[#1a3a2a] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                              RBB Bank
                            </span>
                          )}

                          <span className="text-[11px] font-mono text-zinc-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600">
                          <p className="flex items-center gap-2">
                            <Phone size={13} className="text-amber-600 shrink-0" />
                            <span className="font-mono font-bold text-zinc-900">{order.phone}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin size={13} className="text-amber-600 shrink-0" />
                            <span className="font-serif truncate">{order.addressText}</span>
                          </p>
                        </div>

                        {order.busNumber && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 text-xs text-zinc-800 flex flex-wrap items-center gap-3 rounded-xs">
                            <span className="font-bold flex items-center gap-1 text-amber-900">
                              <Bus size={13} className="text-amber-600" />
                              <span>बस: {order.busNumber}</span>
                            </span>
                            {order.driverPhone && (
                              <span className="text-zinc-600 font-mono">
                                चालक: <strong className="text-zinc-900">{order.driverPhone}</strong>
                              </span>
                            )}
                            {order.biltyNumber && (
                              <span className="text-zinc-600 font-mono">
                                बिल्टी: <code className="text-amber-800 font-bold">{order.biltyNumber}</code>
                              </span>
                            )}
                            {order.estimatedArrival && (
                              <span className="text-[11px] text-zinc-700 font-medium">
                                ⏰ {order.estimatedArrival}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs flex flex-wrap items-center justify-between gap-2 rounded-xs">
                          <div>
                            <span className="text-zinc-500">{adminLang === 'ne' ? 'उत्पादन: ' : 'Product: '}</span>
                            <span className="font-serif font-bold text-zinc-900">{order.productName}</span>
                            <span className="text-zinc-400"> | </span>
                            <span className="text-zinc-500">{adminLang === 'ne' ? 'संख्या: ' : 'Qty: '}</span>
                            <span className="font-mono font-bold text-zinc-900">{order.quantity} units</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">{adminLang === 'ne' ? 'कुल रकम: ' : 'Total: '}</span>
                            <span className="font-mono font-bold text-amber-600 text-sm">Rs. {order.totalPrice}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <div>
                            <span className="text-zinc-500 font-mono">Txn / UTR: </span>
                            <code className="bg-zinc-100 text-zinc-900 font-mono font-bold px-2 py-0.5 border border-zinc-300 rounded-xs">
                              {order.paymentDetails?.transactionId}
                            </code>
                          </div>

                          {order.paymentDetails?.receiptScreenshotUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewReceipt(order.paymentDetails.receiptScreenshotUrl!)}
                              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-800 hover:text-amber-600 bg-white px-2 py-1 border border-zinc-300 transition cursor-pointer rounded-xs"
                            >
                              <Eye size={12} />
                              <span>{adminLang === 'ne' ? 'रसिद हेर्नुहोस्' : 'View Receipt'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-2.5 bg-zinc-50 p-4 border border-zinc-200 rounded-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenDispatchModal(order)}
                          className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider py-2.5 shadow-sm transition cursor-pointer rounded-xs"
                        >
                          <Bus size={14} />
                          <span>{adminLang === 'ne' ? '🚌 डिलक्स बस ट्र्याकिङ अपडेट' : '🚌 Update Bus & Dispatch'}</span>
                        </button>

                        <a
                          href={mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#1a3a2a] hover:bg-[#12271c] text-white font-mono text-xs py-2 shadow-sm transition rounded-xs"
                        >
                          <MapPin size={13} className="text-amber-400" />
                          <span>{adminLang === 'ne' ? 'Google Map मा हेर्नुहोस्' : 'Open in Google Maps'}</span>
                          <ExternalLink size={12} />
                        </a>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href={`tel:${order.phone}`}
                            className="flex items-center justify-center gap-1.5 bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-900 font-mono text-xs py-2 transition rounded-xs"
                          >
                            <Phone size={13} className="text-amber-600" />
                            <span>{adminLang === 'ne' ? 'फोन गर्नुहोस्' : 'Call Customer'}</span>
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs py-2 transition shadow-xs rounded-xs"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp Alert</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: FARMER MARKETPLACE / SALES SUBMISSIONS */}
          {activeTab === 'farmer_sales' && (
            <div className="space-y-4 text-left">
              <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">
                    🌾 Farmer Marketplace Inquiries & Direct Sell Requests
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Local farmers and customers who submitted their ducklings, eggs, and farm produce for sale.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#1a3a2a] text-amber-300 px-3 py-1 rounded-xs">
                  Total Listings: {farmerListings.length}
                </span>
              </div>

              {farmerListings.length === 0 ? (
                <div className="bg-white border border-zinc-200 p-12 text-center text-zinc-500 rounded-xs">
                  No farmer produce listings recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {farmerListings
                    .filter((item) => 
                      (item.sellerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (item.phone || '').includes(searchQuery) ||
                      (item.productName || '').toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((listing) => (
                      <div
                        key={listing.id}
                        className="bg-white border border-zinc-200 rounded-xs shadow-xs p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center hover:border-emerald-600/60 transition"
                      >
                        <div className="lg:col-span-2 flex justify-center">
                          {listing.imagePreview ? (
                            <img
                              src={listing.imagePreview}
                              alt="Produce"
                              className="w-24 h-24 object-cover rounded-xs border border-zinc-300"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-zinc-100 border border-dashed border-zinc-300 rounded-xs flex flex-col items-center justify-center text-zinc-400 text-[10px] font-mono">
                              <span>🌾</span>
                              <span>No Photo</span>
                            </div>
                          )}
                        </div>

                        <div className="lg:col-span-6 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-zinc-500">{listing.id}</span>
                            <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-xs border border-zinc-300">
                              {listing.category || 'Duck Produce'}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              listing.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {listing.status || 'Pending'}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-zinc-950">{listing.productName}</h4>

                          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-zinc-700 pt-1">
                            <p><strong className="text-zinc-900">Seller:</strong> {listing.sellerName}</p>
                            <p><strong className="text-zinc-900">Phone:</strong> <span className="font-mono font-bold">{listing.phone}</span></p>
                            <p><strong className="text-zinc-900">Location:</strong> {listing.location}</p>
                            <p><strong className="text-zinc-900">Age/Weight:</strong> {listing.ageOrWeight || 'N/A'}</p>
                            <p><strong className="text-zinc-900">Quantity:</strong> <span className="font-bold text-emerald-800">{listing.quantity}</span></p>
                            <p><strong className="text-zinc-900">Asking Rate:</strong> <span className="font-mono font-black text-amber-600">Rs. {listing.rate}</span></p>
                          </div>

                          {listing.description && (
                            <p className="text-xs text-zinc-600 bg-zinc-50 p-2 border border-zinc-200 rounded-xs mt-1">
                              <strong>Note:</strong> {listing.description}
                            </p>
                          )}
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-2">
                          <a
                            href={`tel:+977${listing.phone}`}
                            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition shadow-xs"
                          >
                            <Phone size={14} />
                            <span>Call Seller ({listing.phone})</span>
                          </a>

                          <a
                            href={`https://wa.me/977${listing.phone}?text=${encodeURIComponent(
                              `नमस्ते ${listing.sellerName} जी, हजारीदेवी डक फार्मबाट सम्पर्क गर्दैछौं। तपाईंको उत्पादन (${listing.productName}) बारे थप बुझ्न खोजेका हौं।`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition shadow-xs"
                          >
                            <MessageSquare size={14} />
                            <span>WhatsApp Seller</span>
                          </a>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => toggleListingStatus(listing.id)}
                              className="flex-1 py-1.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xs transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check size={13} className="text-emerald-600" />
                              <span>{listing.status === 'Approved' ? 'Mark Pending' : 'Approve'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteFarmerListing(listing.id)}
                              className="p-2 border border-zinc-300 hover:bg-red-50 text-red-600 rounded-xs transition cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: ORDER HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {displayedHistoryOrders.length > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase px-3 py-2 rounded-xs shadow transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>{adminLang === 'ne' ? 'सबै इतिहास मेटाउनुहोस्' : 'Clear All History'}</span>
                  </button>
                </div>
              )}

              {displayedHistoryOrders.length === 0 ? (
                <div className="bg-white p-12 text-center border border-zinc-200 shadow-sm space-y-2 rounded-xs">
                  <History size={38} className="mx-auto text-zinc-300" />
                  <p className="font-serif font-bold text-zinc-800 text-base">
                    {adminLang === 'ne' ? 'कुनै पनि सम्पन्न अर्डर इतिहास छैन' : 'No completed orders in history yet'}
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-zinc-200 overflow-hidden shadow-sm rounded-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#1a3a2a] text-white font-mono uppercase tracking-wider text-[11px] border-b border-emerald-900">
                          <th className="p-3.5">Customer & Phone</th>
                          <th className="p-3.5">Product & Units</th>
                          <th className="p-3.5">Amount & Payment</th>
                          <th className="p-3.5">Delivery & Bus Info</th>
                          <th className="p-3.5">Completed Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-serif">
                        {displayedHistoryOrders.map((order) => {
                          const orderId = (order.id || order._id) as string;
                          const whatsappUrl = generateWhatsAppUrl(order);
                          const st = (order.status || '').toUpperCase();
                          const isTerminated = st === 'TERMINATED' || st === 'LOST_IN_TRANSIT';

                          return (
                            <tr key={orderId} className="hover:bg-zinc-50 transition">
                              <td className="p-3.5">
                                <p className="font-bold text-zinc-900 text-sm leading-tight">{order.customerName}</p>
                                <p className="text-zinc-600 font-mono text-xs flex items-center gap-1 mt-0.5">
                                  <Phone size={11} className="text-amber-600" />
                                  <span>{order.phone}</span>
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[180px]">
                                  {order.addressText}
                                </p>
                              </td>

                              <td className="p-3.5">
                                <p className="font-bold text-zinc-900">{order.productName}</p>
                                <p className="font-mono text-zinc-600">{order.quantity} units</p>
                                <p className="text-[10px] font-mono text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </td>

                              <td className="p-3.5">
                                <p className="font-mono font-bold text-zinc-900 text-sm">Rs. {order.totalPrice}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="uppercase text-[10px] font-mono font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-300 rounded-xs">
                                    {order.paymentMethod || 'eSewa'}
                                  </span>
                                  <code className="text-[10px] font-mono bg-zinc-50 px-1 py-0.5 border border-zinc-200 text-zinc-600 rounded-xs">
                                    {order.paymentDetails?.transactionId}
                                  </code>
                                </div>
                              </td>

                              <td className="p-3.5 text-zinc-600">
                                <p className="flex items-center gap-1 font-mono font-bold text-zinc-900">
                                  <Bus size={12} className="text-amber-600" />
                                  <span>{order.busNumber || 'Delivered'}</span>
                                </p>
                                {order.biltyNumber && (
                                  <p className="text-[11px] font-mono text-zinc-600">
                                    Bilty: <code className="font-bold text-zinc-900">{order.biltyNumber}</code>
                                  </p>
                                )}
                                {order.counterName && (
                                  <p className="text-[11px] font-serif text-zinc-500 truncate max-w-[150px]">
                                    {order.counterName}
                                  </p>
                                )}
                              </td>

                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 border rounded-xs ${
                                  isTerminated
                                    ? 'bg-red-50 text-red-800 border-red-300'
                                    : st === 'DELIVERED'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                                }`}>
                                  {isTerminated ? <AlertTriangle size={11} className="text-red-600" /> : <CheckCircle2 size={11} />}
                                  <span>{st}</span>
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {order.paymentDetails?.receiptScreenshotUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setPreviewReceipt(order.paymentDetails.receiptScreenshotUrl!)}
                                      className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300 transition rounded-xs"
                                      title="View Receipt"
                                    >
                                      <Eye size={13} />
                                    </button>
                                  )}

                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white transition shadow-xs rounded-xs"
                                    title="WhatsApp Message"
                                  >
                                    <MessageSquare size={13} />
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(orderId, 'in_transit')}
                                    className="px-2 py-1 text-[11px] font-mono font-bold text-amber-800 hover:bg-amber-100 border border-amber-300 bg-amber-50 rounded-xs transition cursor-pointer"
                                    title="Move back to Active"
                                  >
                                    Reopen
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(orderId)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-300 transition rounded-xs cursor-pointer"
                                    title={adminLang === 'ne' ? 'अर्डर मेटाउनुहोस्' : 'Delete Order'}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Farm Visits with Status Selector & Confirmation */}
          {activeTab === 'visits' && (
            <div className="space-y-4 text-left">
              {visits.length === 0 ? (
                <div className="bg-white p-12 text-center border border-zinc-200 shadow-sm space-y-2 rounded-xs">
                  <Calendar size={38} className="mx-auto text-zinc-300" />
                  <p className="font-serif font-bold text-zinc-800 text-base">
                    {adminLang === 'ne' ? 'कुनै पनि फार्म भिजिट अनुरोध छैन' : 'No farm visit requests found'}
                  </p>
                </div>
              ) : (
                visits.map((visit) => {
                  const cleanPhone = String(visit.phone || '').replace(/[^0-9]/g, '');
                  const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
                  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(
                    adminLang === 'ne'
                      ? `नमस्ते ${visit.fullName} जी, हजारीदेवी डक फार्मबाट तपाईंको मिति ${visit.visitDate} को फार्म भिजिट सफलतापूर्वक कन्फर्म भएको छ! हामी तपाईंलाई स्वागत गर्न उत्सुक छौं।`
                      : `Hello ${visit.fullName}, your farm visit at Hazaridevi Duck Farm scheduled for ${visit.visitDate} is successfully CONFIRMED! We look forward to welcoming you.`
                  )}`;

                  const handleSendEmailConfirmation = () => {
                    const userEmail = prompt(
                      adminLang === 'ne' 
                        ? `${visit.fullName} को इमेल ठेगाना लेख्नुहोस्:` 
                        : `Enter email address for ${visit.fullName}:`
                    );
                    if (!userEmail || !userEmail.includes('@')) return;

                    const subject = encodeURIComponent('Hazaridevi Duck Farm - Farm Visit Confirmed');
                    const body = encodeURIComponent(
                      `Dear ${visit.fullName},\n\nYour farm visit request for ${visit.visitorCount} visitor(s) on ${visit.visitDate} has been CONFIRMED by Hazaridevi Multipurpose Agriculture Farm (Owner: Sharan Dev Yadav).\n\nLocation: Bariyarpatti, Siraha, Nepal\nPrimary Phone: 9807760832\n\nWe look forward to your visit!\n\nBest regards,\nHazaridevi Duck Farm Team`
                    );
                    window.open(`mailto:${userEmail}?subject=${subject}&body=${body}`);
                  };

                  const currentVisitStatus = visit.status || 'Pending';

                  return (
                    <div
                      key={visit.id}
                      className="bg-white border border-zinc-200 shadow-xs p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xs hover:border-emerald-700/50 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-serif font-bold text-zinc-900 text-base">{visit.fullName}</h4>
                          <span className="bg-zinc-100 text-zinc-800 border border-zinc-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                            {visit.visitorCount} {adminLang === 'ne' ? 'जना' : 'Visitors'}
                          </span>

                          <select
                            value={currentVisitStatus}
                            onChange={(e) => handleVisitStatusChange(visit.id, e.target.value)}
                            className={`text-[11px] font-mono font-bold uppercase px-2 py-1 border outline-none cursor-pointer rounded-xs ${
                              currentVisitStatus.toLowerCase() === 'pending' 
                                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                          <span className="flex items-center gap-1.5 font-mono font-bold text-zinc-900">
                            <Phone size={12} className="text-amber-600" />
                            {visit.phone}
                          </span>
                          <span className="flex items-center gap-1.5 font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-xs">
                            <Calendar size={12} />
                            {adminLang === 'ne' ? 'भिजिट मिति: ' : 'Visit Date: '}{visit.visitDate}
                          </span>
                        </div>

                        {visit.purpose && (
                          <p className="text-xs font-serif text-zinc-600 bg-zinc-50 border border-zinc-200 p-2 rounded-xs mt-1">
                            <strong>{adminLang === 'ne' ? 'उद्देश्य/नोट: ' : 'Purpose/Note: '}</strong>
                            {visit.purpose}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto flex-wrap">
                        <a
                          href={`tel:${visit.phone}`}
                          className="inline-flex items-center justify-center gap-1.5 bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-900 font-mono text-xs px-3.5 py-2 transition rounded-xs"
                        >
                          <Phone size={13} className="text-amber-600" />
                          <span>{adminLang === 'ne' ? 'फोन' : 'Call'}</span>
                        </a>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-3.5 py-2 transition shadow-xs rounded-xs"
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp Confirm</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleSendEmailConfirmation}
                          className="inline-flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2 transition shadow-xs rounded-xs cursor-pointer"
                        >
                          <Mail size={13} />
                          <span>Email Confirm</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVisit(visit.id)}
                          className="p-2 border border-zinc-300 hover:bg-red-50 text-red-600 rounded-xs transition cursor-pointer"
                          title="Delete Visit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 5: Products Management */}
          {activeTab === 'products' && (
            <div className="space-y-4 text-left">
              {products.length === 0 ? (
                <div className="bg-white p-12 text-center border border-zinc-200 shadow-sm space-y-3 rounded-xs">
                  <Package size={38} className="mx-auto text-zinc-300" />
                  <p className="font-serif font-bold text-zinc-800 text-base">
                    {adminLang === 'ne' ? 'कुनै पनि उत्पादन फेला परेन' : 'No products found'}
                  </p>
                  <button
                    onClick={handleOpenAddModal}
                    className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 transition shadow cursor-pointer rounded-xs"
                  >
                    {adminLang === 'ne' ? '+ पहिलो उत्पादन थप्नुहोस्' : '+ Add First Product'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between rounded-xs"
                    >
                      <div>
                        <div className="h-52 w-full overflow-hidden bg-zinc-50 relative flex items-center justify-center p-3 border-b border-zinc-200">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-1 bg-zinc-50">
                              <ImageIcon size={28} />
                              <span className="text-[11px] font-mono">{adminLang === 'ne' ? 'फोटो छैन' : 'No Photo'}</span>
                            </div>
                          )}
                          {p.badge && (
                            <span className="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 shadow rounded-xs">
                              {p.badge}
                            </span>
                          )}
                          <span
                            className={`absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 shadow rounded-xs ${
                              p.inStock ? 'bg-[#1a3a2a] text-white border border-emerald-700' : 'bg-red-600 text-white'
                            }`}
                          >
                            {p.inStock 
                              ? (adminLang === 'ne' ? 'उपलब्ध (In Stock)' : 'In Stock') 
                              : (adminLang === 'ne' ? 'सकियो (Out of Stock)' : 'Out of Stock')}
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <h4 className="font-serif font-bold text-zinc-900 text-base leading-snug">{p.title}</h4>
                          <p className="text-xs font-serif text-zinc-600 line-clamp-2 leading-relaxed font-light">{p.description}</p>
                          
                          <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-600 border-t border-zinc-100">
                            <span>
                              {adminLang === 'ne' ? 'न्यूनतम:' : 'Min Order:'} <strong className="text-zinc-900">{p.minOrder}</strong>
                            </span>
                            <span>
                              {adminLang === 'ne' ? 'वर्ग:' : 'Category:'} <strong className="capitalize text-zinc-900">{p.category}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                          <div>
                            <span className="text-[11px] font-mono text-zinc-500">
                              {adminLang === 'ne' ? 'बिक्री मूल्य: ' : 'Price: '}
                            </span>
                            <span className="text-lg font-mono font-bold text-amber-600">Rs. {p.price}</span>
                            <span className="text-xs font-mono text-zinc-500"> {p.unit}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`flex items-center justify-center gap-1 text-[11px] font-mono font-bold uppercase py-2 transition cursor-pointer border rounded-xs ${
                              p.inStock
                                ? 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                            }`}
                          >
                            {p.inStock ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                            <span>
                              {p.inStock 
                                ? (adminLang === 'ne' ? 'आउट' : 'Mark Out') 
                                : (adminLang === 'ne' ? 'इन स्टक' : 'Mark In')}
                            </span>
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="flex items-center justify-center gap-1 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-mono font-bold text-[11px] uppercase py-2 transition cursor-pointer rounded-xs"
                          >
                            <Edit3 size={12} />
                            <span>{adminLang === 'ne' ? 'सम्पादन' : 'Edit'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-mono font-bold text-[11px] uppercase py-2 transition cursor-pointer rounded-xs"
                          >
                            <Trash2 size={12} />
                            <span>{adminLang === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 6: Settings - Media & Hero Banner Manager */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* HERO BANNER PHOTO SETTINGS */}
              <div className="bg-white border border-zinc-200 p-6 md:p-8 shadow-xs text-left space-y-5 rounded-xs">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a3a2a] border border-emerald-800 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest mb-2 rounded-xs">
                    <ImageIcon size={12} className="text-amber-400" />
                    <span>HOMEPAGE HERO BANNER PHOTO</span>
                  </div>
                  <h3 className="font-serif font-black text-zinc-900 text-xl tracking-tight">
                    {adminLang === 'ne' ? 'वेबसाइटको मुख्य (Hero) फोटो बदल्नुहोस्' : 'Change Homepage Main Banner Photo'}
                  </h3>
                  <p className="text-xs font-serif text-zinc-600 font-light mt-1 leading-relaxed">
                    {adminLang === 'ne' 
                      ? 'गृहपृष्ठ (Homepage) को दाहिने तर्फ देखिने मुख्य हाँसको फोटोलाई यहाँबाट ग्यालेरी वा फाइल छानेर परिवर्तन गर्न सक्नुहुन्छ।' 
                      : 'Upload or paste a new image to instantly replace the main hero duck specimen photo on the homepage.'}
                  </p>
                </div>

                <form onSubmit={handleSaveHeroBanner} className="space-y-4 text-xs font-sans">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-48 h-36 bg-zinc-900 border-2 border-zinc-300 overflow-hidden flex items-center justify-center relative shrink-0 rounded-xs shadow-inner">
                      <img src={heroBannerUrl} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-3 flex-1 text-left">
                      <input
                        type="file"
                        ref={heroFileInputRef}
                        onChange={handleHeroBannerFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black uppercase tracking-wider px-4 py-3 transition shadow cursor-pointer text-xs rounded-xs"
                      >
                        <Upload size={15} />
                        <span>{adminLang === 'ne' ? 'ग्यालेरीबाट मुख्य फोटो छान्नुहोस्' : 'Choose Hero Photo from Gallery'}</span>
                      </button>

                      <div>
                        <label className="block font-mono text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Or Paste Image URL:
                        </label>
                        <input
                          type="url"
                          value={heroBannerUrl}
                          onChange={(e) => setHeroBannerUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 font-mono text-zinc-900 bg-white focus:border-emerald-700 outline-none rounded-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 flex items-center gap-3">
                    <button
                      type="submit"
                      className="py-3 px-6 bg-[#1a3a2a] hover:bg-[#12271c] text-amber-300 font-bold uppercase tracking-wider text-xs transition shadow-sm cursor-pointer flex items-center gap-2 rounded-xs border border-emerald-800"
                    >
                      <Save size={14} />
                      <span>Update Hero Banner Live</span>
                    </button>

                    {savedHeroSuccess && (
                      <span className="text-emerald-700 font-mono font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 size={14} /> Hero Photo Updated Successfully!
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* GALLERY VIDEO UPLOADER & ARCHIVE */}
              <div className="bg-white border border-zinc-200 p-6 md:p-8 shadow-xs text-left space-y-6 rounded-xs">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a3a2a] border border-emerald-800 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest mb-2 rounded-xs">
                    <Video size={12} className="text-amber-400" />
                    <span>GALLERY VIDEO UPLOADER & ARCHIVE</span>
                  </div>
                  <h3 className="font-serif font-black text-zinc-900 text-xl tracking-tight">
                    {adminLang === 'ne' ? 'फार्म प्रत्यक्ष भिडियो ग्यालेरीबाट सिधै अपलोड गर्नुहोस्' : 'Upload Live Footage From Gallery / Device'}
                  </h3>
                  <p className="text-xs font-serif text-zinc-600 font-light mt-1 leading-relaxed">
                    {adminLang === 'ne' 
                      ? 'कुनै बाहिरी लिङ्क चाहिंदैन! आफ्नो फोन वा कम्प्युटरको ग्यालेरीबाट सिधै भिडियो (.mp4, .mov) छानेर अपलोड गर्नुहोस्।' 
                      : 'No external links required! Pick and upload high-resolution farm clips directly from your local device/gallery.'}
                  </p>
                </div>

                <form onSubmit={handleSaveVideoSettings} className="space-y-6 text-xs font-sans">
                  <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2 rounded-xs">
                    <label className="block font-mono font-bold text-zinc-800 uppercase tracking-wider text-[11px]">
                      Official YouTube Channel Link (Top Right Red Button)
                    </label>
                    <input
                      type="url"
                      required
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      placeholder="https://youtube.com/@duckfarmnepal"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 font-mono text-zinc-900 bg-white focus:border-emerald-700 outline-none rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-2 text-[11px]">
                      Select Video Slot to Update:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['ducklings', 'hatchery', 'breeders'] as const).map((tabKey) => (
                        <button
                          key={tabKey}
                          type="button"
                          onClick={() => {
                            setSelectedVideoTab(tabKey);
                            setSelectedVideoFile(null);
                            setVideoPreviewUrl(null);
                          }}
                          className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer rounded-xs border ${
                            selectedVideoTab === tabKey
                              ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm'
                              : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                          }`}
                        >
                          {tabKey === 'ducklings' && '🦆 1. Ducklings Batch'}
                          {tabKey === 'hatchery' && '🥚 2. Hatching Incubator'}
                          {tabKey === 'breeders' && '🌾 3. Breeder Flock'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 border-2 border-dashed border-zinc-300 bg-zinc-50 space-y-4 rounded-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-44 h-40 bg-zinc-900 border border-zinc-700 overflow-hidden flex items-center justify-center relative shrink-0 rounded-xs">
                        {videoPreviewUrl ? (
                          <video src={videoPreviewUrl} controls className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-center p-3 text-zinc-400 font-mono text-[10px] space-y-1">
                            <Video size={28} className="mx-auto text-amber-400" />
                            <p>Current Active Video</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 flex-1 text-left">
                        <input
                          type="file"
                          ref={videoFileInputRef}
                          onChange={handleVideoFileSelect}
                          accept="video/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => videoFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black uppercase tracking-wider px-4 py-3 transition shadow cursor-pointer text-xs rounded-xs"
                        >
                          <Upload size={15} />
                          <span>{adminLang === 'ne' ? 'ग्यालेरीबाट भिडियो फाइल छान्नुहोस्' : 'Choose Video From Device / Gallery'}</span>
                        </button>

                        {selectedVideoFile && (
                          <p className="font-mono text-emerald-700 font-bold text-xs">
                            Selected: {selectedVideoFile.name} ({(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                        )}

                        <p className="text-[11px] font-serif text-zinc-500 font-light">
                          MP4, MOV, WebM formats supported. Direct local storage in your browser IndexedDB.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Title (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={videoConfigs[selectedVideoTab].titleEn}
                          onChange={(e) =>
                            setVideoConfigs({
                              ...videoConfigs,
                              [selectedVideoTab]: {
                                ...videoConfigs[selectedVideoTab],
                                titleEn: e.target.value
                              }
                            })
                          }
                          className="w-full px-3.5 py-2 border border-zinc-300 text-zinc-900 bg-white focus:border-emerald-700 outline-none rounded-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Title (Nepali) *
                        </label>
                        <input
                          type="text"
                          required
                          value={videoConfigs[selectedVideoTab].titleNe}
                          onChange={(e) =>
                            setVideoConfigs({
                              ...videoConfigs,
                              [selectedVideoTab]: {
                                ...videoConfigs[selectedVideoTab],
                                titleNe: e.target.value
                              }
                            })
                          }
                          className="w-full px-3.5 py-2 border border-zinc-300 text-zinc-900 bg-white focus:border-emerald-700 outline-none rounded-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Description (English)
                        </label>
                        <textarea
                          rows={2}
                          value={videoConfigs[selectedVideoTab].descEn}
                          onChange={(e) =>
                            setVideoConfigs({
                              ...videoConfigs,
                              [selectedVideoTab]: {
                                ...videoConfigs[selectedVideoTab],
                                descEn: e.target.value
                              }
                            })
                          }
                          className="w-full px-3.5 py-2 border border-zinc-300 text-zinc-900 bg-white focus:border-emerald-700 outline-none resize-none font-serif rounded-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                          Description (Nepali)
                        </label>
                        <textarea
                          rows={2}
                          value={videoConfigs[selectedVideoTab].descNe}
                          onChange={(e) =>
                            setVideoConfigs({
                              ...videoConfigs,
                              [selectedVideoTab]: {
                                ...videoConfigs[selectedVideoTab],
                                descNe: e.target.value
                              }
                            })
                          }
                          className="w-full px-3.5 py-2 border border-zinc-300 text-zinc-900 bg-white focus:border-emerald-700 outline-none resize-none font-serif rounded-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="py-3 px-6 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black uppercase tracking-wider text-xs transition shadow-sm cursor-pointer flex items-center gap-2 rounded-xs"
                    >
                      <Save size={14} />
                      <span>Upload & Publish Video</span>
                    </button>

                    {savedVideoSuccess && (
                      <span className="text-emerald-700 font-mono font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 size={14} /> Video Saved & Live on Site!
                      </span>
                    )}
                  </div>
                </form>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Corporate Admin Footer */}
      <footer className="bg-white border-t border-zinc-200 py-4 px-4 mt-12">
        <div className="max-w-site mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 font-serif">
              {adminLang === 'ne' ? 'हजारीदेवी डक फार्म पोर्टल' : 'Hazaridevi Duck Farm Management Portal'}
            </span>
            <span className="text-zinc-300">|</span>
            <span className="bg-zinc-100 border border-zinc-300 text-zinc-800 font-bold px-2 py-0.5 text-[10px] rounded-xs">
              v1.0.4 Production
            </span>
            <span className="text-zinc-300 hidden md:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-zinc-700 text-[11px]">
              <ShieldCheck size={13} className="text-emerald-700" />
              <span>{adminLang === 'ne' ? 'प्रमाणित प्रशासक पहुँच' : 'Authenticated Admin Access'}</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a3a2a] border border-emerald-800 text-[11px] text-zinc-200 rounded-xs">
            <Code size={12} className="text-amber-400" />
            <span>Engineered & Maintained by</span>
            <span className="text-white font-bold font-sans">
              Ujjawal Kumar Sah
            </span>
          </div>
        </div>
      </footer>

      {/* MODAL: UPDATE BUS DISPATCH & TRACKING */}
      {dispatchOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setDispatchOrder(null)}
        >
          <div 
            className="bg-white max-w-lg w-full border border-emerald-900/40 rounded-md overflow-hidden shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1a3a2a] text-white p-5 flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-400 text-zinc-950 flex items-center justify-center font-bold rounded-xs">
                  <Bus size={18} />
                </div>
                <div className="text-left">
                  <h3 className="font-serif font-black text-base text-white">
                    {adminLang === 'ne' ? 'डिलक्स बस ढुवानी विवरण तथा इमेल स्लिप' : 'Update Bus Dispatch & Email Slip'}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-200">
                    {dispatchOrder.customerName} ({dispatchOrder.phone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchOrder(null)}
                className="text-zinc-300 hover:text-white p-1 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="p-6 space-y-4 text-xs text-left max-h-[82vh] overflow-y-auto">
              <div>
                <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  {adminLang === 'ne' ? 'ढुवानी अवस्था (Delivery Status) *' : 'Delivery Status *'}
                </label>
                <select
                  value={dispatchStatus}
                  onChange={(e) => setDispatchStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-300 bg-white font-mono font-bold text-zinc-900 outline-none focus:border-emerald-700 cursor-pointer rounded-xs"
                >
                  <option value="CONFIRMED">अर्डर स्वीकृत (Confirmed)</option>
                  <option value="PACKED">बक्स प्याक भयो (Packed)</option>
                  <option value="IN_TRANSIT">बसमा लोड भई बाटोमा छ (In Transit via Bus)</option>
                  <option value="ARRIVED">काउन्टरमा आइपुग्यो (Arrived - Completed)</option>
                  <option value="DELIVERED">डेलिभरी सम्पन्न (Delivered - Completed)</option>
                  <option value="TERMINATED">🚨 TERMINATED / LOST IN TRANSIT (रद्द / क्षति)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'डिलक्स बस नम्बर *' : 'Bus Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. ना ५ ख ८९२०"
                    value={dispatchBusNo}
                    onChange={(e) => setDispatchBusNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 focus:border-emerald-700 outline-none font-bold text-zinc-900 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'चालक / सहयोगी फोन' : 'Driver / Contact Phone'}
                  </label>
                  <input
                    type="text"
                    placeholder="९८०..."
                    value={dispatchDriverPhone}
                    onChange={(e) => setDispatchDriverPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 outline-none font-mono focus:border-emerald-700 text-zinc-900 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'बिल्टी नम्बर (Bilty No)' : 'Bilty Receipt No'}
                  </label>
                  <input
                    type="text"
                    placeholder="BL-8842"
                    value={dispatchBiltyNo}
                    onChange={(e) => setDispatchBiltyNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 font-mono outline-none focus:border-emerald-700 text-zinc-900 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'डेलिभरी काउन्टर' : 'Pickup Counter'}
                  </label>
                  <input
                    type="text"
                    placeholder="गोंगबु नयाँ बसपार्क"
                    value={dispatchCounter}
                    onChange={(e) => setDispatchCounter(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 outline-none focus:border-emerald-700 text-zinc-900 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  {adminLang === 'ne' ? 'पुग्ने अनुमानित समय (Estimated Time)' : 'Estimated Arrival Time'}
                </label>
                <input
                  type="text"
                  placeholder="भोलि बिहान ६:०० बजे"
                  value={dispatchArrival}
                  onChange={(e) => setDispatchArrival(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-300 outline-none focus:border-emerald-700 text-zinc-900 rounded-xs"
                />
              </div>

              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 font-mono font-bold text-blue-950 uppercase tracking-wider text-[11px]">
                    <Mail size={13} className="text-blue-600" />
                    <span>{adminLang === 'ne' ? 'ग्राहकको इमेल ठेगाना (Email Slip)' : 'Customer Email for Slip'}</span>
                  </label>
                  <span className="text-[10px] font-mono text-blue-700 font-semibold">
                    {adminLang === 'ne' ? 'सिधै इनबक्समा स्लिप पठाउनुहोस्' : 'Direct Dispatch Slip'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="customer@gmail.com"
                    value={dispatchEmail}
                    onChange={(e) => setDispatchEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2 border border-blue-300 outline-none focus:border-blue-700 bg-white text-zinc-900 font-mono text-xs rounded-xs"
                  />

                  <button
                    type="button"
                    disabled={isSendingEmail || !dispatchEmail}
                    onClick={handleDirectSendEmail}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-blue-300 text-white font-mono font-bold uppercase tracking-wider text-xs rounded-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={13} />
                        <span>Send Slip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSavingDispatch}
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black uppercase tracking-wider transition shadow cursor-pointer text-xs flex items-center justify-center gap-2 rounded-xs"
                >
                  {isSavingDispatch ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{adminLang === 'ne' ? 'अपडेट गर्दैछ...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      <span>{adminLang === 'ne' ? 'डेलिभरी विवरण सेभ गर्नुहोस्' : 'Save & Publish Live Tracking'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchOrder(null)}
                  className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono font-bold uppercase tracking-wider transition cursor-pointer text-xs border border-zinc-300 rounded-xs"
                >
                  {adminLang === 'ne' ? 'रद्द' : 'Cancel'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div 
            className="bg-white max-w-xl w-full border border-emerald-900/40 rounded-md overflow-hidden shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1a3a2a] text-white p-5 flex items-center justify-between border-b-2 border-amber-500">
              <div className="text-left">
                <h3 className="font-serif font-black text-base text-white">
                  {editingProduct 
                    ? (adminLang === 'ne' ? 'उत्पादन सम्पादन गर्नुहोस् (Edit Product)' : 'Edit Product') 
                    : (adminLang === 'ne' ? 'नयाँ उत्पादन थप्नुहोस् (Add New Product)' : 'Add New Product')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-zinc-300 hover:text-white p-1 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs text-left max-h-[82vh] overflow-y-auto font-sans">
              <div>
                <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  {adminLang === 'ne' ? 'उत्पादनको फोटो (Product Photo)' : 'Product Photo'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-zinc-300 overflow-hidden bg-zinc-50 flex items-center justify-center relative shrink-0 p-1 rounded-xs">
                    {formImageUrl ? (
                      <img src={formImageUrl} alt="Preview" className="max-h-full max-w-full w-auto h-auto object-contain" />
                    ) : (
                      <ImageIcon className="text-zinc-300" size={28} />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 font-mono font-bold uppercase tracking-wider px-3 py-2 transition cursor-pointer text-xs rounded-xs"
                    >
                      <Upload size={13} />
                      <span>{adminLang === 'ne' ? 'ग्यालेरीबाट फोटो छान्नुहोस्' : 'Choose Photo from Gallery'}</span>
                    </button>
                    <input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 border border-zinc-300 text-zinc-800 text-[11px] font-mono outline-none focus:border-emerald-700 rounded-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  {adminLang === 'ne' ? 'उत्पादनको नाम (Product Title) *' : 'Product Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-300 focus:border-emerald-700 outline-none text-zinc-900 rounded-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'वर्ग (Category) *' : 'Category *'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-300 outline-none bg-white font-medium text-zinc-900 focus:border-emerald-700 cursor-pointer rounded-xs"
                  >
                    {ADMIN_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {adminLang === 'ne' ? cat.nameNe : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'ब्याच / ब्याज (Badge Tag)' : 'Badge Tag'}
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 outline-none focus:border-emerald-700 text-zinc-900 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'मूल्य (रू) *' : 'Price (Rs.) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 outline-none font-mono font-bold text-amber-600 focus:border-emerald-700 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'एकाइ (Unit) *' : 'Unit *'}
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-300 outline-none bg-white font-medium text-zinc-900 focus:border-emerald-700 cursor-pointer rounded-xs"
                  >
                    <option value="/duckling">/duckling</option>
                    <option value="/duck">/duck</option>
                    <option value="/egg">/egg</option>
                    <option value="/crate">/crate</option>
                    <option value="/kg">/kg</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    {adminLang === 'ne' ? 'न्यूनतम अर्डर' : 'Min Order'}
                  </label>
                  <input
                    type="text"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 outline-none focus:border-emerald-700 text-zinc-900 font-mono rounded-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-300 rounded-xs flex items-center justify-between">
                <div>
                  <span className="block font-mono font-bold text-xs uppercase tracking-wider text-zinc-900">
                    {adminLang === 'ne' ? 'स्टक अवस्था' : 'Stock Availability'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormInStock(!formInStock)}
                  className={`px-4 py-2 font-mono font-bold text-xs uppercase tracking-wider rounded-xs border transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    formInStock ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-red-600 text-white border-red-700'
                  }`}
                >
                  {formInStock ? <Check size={14} /> : <XCircle size={14} />}
                  <span>{formInStock ? 'In Stock' : 'Out of Stock'}</span>
                </button>
              </div>

              <div>
                <label className="block font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  {adminLang === 'ne' ? 'विवरण (Description) *' : 'Description *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-300 outline-none focus:border-emerald-700 text-zinc-900 resize-none font-serif rounded-xs"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black uppercase tracking-wider transition shadow cursor-pointer text-xs flex items-center justify-center gap-2 rounded-xs"
                >
                  {isSubmittingProduct ? <Loader2 size={15} className="animate-spin" /> : <span>Save Product</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono font-bold uppercase tracking-wider transition cursor-pointer text-xs border border-zinc-300 rounded-xs"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW RECEIPT SCREENSHOT */}
      {previewReceipt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setPreviewReceipt(null)}
        >
          <div 
            className="bg-white border border-emerald-900/40 rounded-md overflow-hidden max-w-lg w-full p-4 space-y-3 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <h4 className="font-serif font-bold text-sm text-zinc-900">
                {adminLang === 'ne' ? 'भुक्तानी रसिद' : 'Payment Receipt'}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewReceipt(null)}
                className="text-zinc-400 hover:text-zinc-900 text-sm font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <img
              src={previewReceipt}
              alt="Receipt Preview"
              className="max-h-[70vh] w-full object-contain border border-zinc-200 rounded-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};