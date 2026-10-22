import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from './config';
import { useAuth } from './AuthContext';
import { 
  Package, Settings, RefreshCw, LogOut, ExternalLink, 
  Phone, MessageSquare, Clock, 
  MapPin, Search, Globe, Calendar, Eye, Plus, Trash2, Edit3, CheckCircle2, XCircle, Upload, Image as ImageIcon, Loader2,
  Bus, Check, Code, ShieldCheck, History, Video, Save, Tag, Mail, AlertTriangle, Bell, Banknote, Download, FileSpreadsheet
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

interface MessageItem {
  id: number;
  ref: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface VisitItem {
  id: number | string;
  fullName: string;
  phone: string;
  email?: string | null;
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
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [msgFilter, setMsgFilter] = useState<'ALL' | 'NEW' | 'REPLIED' | 'CLOSED'>('ALL');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'history' | 'visits' | 'messages' | 'products' | 'farmer_sales' | 'settings'>('orders');
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

  const handleTabClick = (tab: 'orders' | 'history' | 'visits' | 'messages' | 'products' | 'farmer_sales' | 'settings') => {
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
      // Drop the demo listings (LST-101 / LST-102) that older versions stored in this browser
      const storedAll: FarmerListing[] = JSON.parse(localStorage.getItem('hz_farmer_listings') || '[]');
      const storedSales = storedAll.filter((l) => l.id !== 'LST-101' && l.id !== 'LST-102');
      if (storedSales.length !== storedAll.length) {
        localStorage.setItem('hz_farmer_listings', JSON.stringify(storedSales));
      }
      setFarmerListings(storedSales);
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
      const resMsgs = await fetch(`${API_BASE_URL}/api/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataMsgs = await resMsgs.json();
      if (dataMsgs.success && Array.isArray(dataMsgs.messages)) setMessages(dataMsgs.messages);
    } catch (err) {
      console.warn('Messages fetch notice:', err);
    }

    try {
      const resProducts = await fetch(`${API_BASE_URL}/api/products`);
      const dataProducts = await resProducts.json();

      if (dataProducts.success && Array.isArray(dataProducts.products)) {
        // The database is the source of truth: show exactly what is stored there.
        syncProductsToStorage(dataProducts.products);
      } else {
        const local = JSON.parse(localStorage.getItem('hz_live_products') || '[]');
        setProducts(local);
      }
    } catch (err) {
      // Server unreachable: fall back to the last list we cached
      const local = JSON.parse(localStorage.getItem('hz_live_products') || '[]');
      setProducts(local);
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

  const handleMessageStatus = async (id: number, status: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    const token = localStorage.getItem('hz_customer_token');
    try {
      await fetch(`${getApiBaseUrl()}/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
    } catch {
      console.warn('Could not save message status');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm(adminLang === 'ne' ? 'यो सन्देश मेटाउने?' : 'Delete this message permanently?')) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const token = localStorage.getItem('hz_customer_token');
    try {
      await fetch(`${getApiBaseUrl()}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      console.warn('Could not delete message on the server');
    }
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

  // ---------- BULK PRODUCT UPLOAD (Excel) ----------
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ added: number; skipped: number; errors: string[] } | null>(null);

  const TEMPLATE_COLUMNS = ['title', 'category', 'badge', 'description', 'minOrder', 'price', 'unit', 'imageUrl', 'inStock'];

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const rows = [
      {
        title: 'EXAMPLE - delete this row',
        category: 'pure-kc',
        badge: 'Best Seller',
        description: 'Short description shown on the product card',
        minOrder: '25 ducklings',
        price: 130,
        unit: '/duckling',
        imageUrl: '',
        inStock: 'yes'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(rows, { header: TEMPLATE_COLUMNS });
    ws['!cols'] = [{ wch: 40 }, { wch: 18 }, { wch: 16 }, { wch: 50 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 40 }, { wch: 10 }];

    const help = [
      ['Column', 'What to enter', 'Required'],
      ['title', 'Product name', 'Yes'],
      ['category', 'One of the category codes listed below', 'Yes'],
      ['badge', 'Small label on the card, e.g. Best Seller (optional)', 'No'],
      ['description', 'Short description', 'Yes'],
      ['minOrder', 'Minimum order, e.g. 25 ducklings', 'No (default: 1 unit)'],
      ['price', 'Number only, e.g. 130', 'Yes'],
      ['unit', 'e.g. /duckling, /egg, /kg', 'No (default: /duckling)'],
      ['imageUrl', 'Direct link to a photo (a web address ending in .jpg, .png or .webp). Leave empty for no photo, then use Edit on the product to upload a photo from your device.', 'No'],
      ['inStock', 'yes or no', 'No (default: yes)'],
      [],
      ['Category code', 'Meaning'],
      ...ADMIN_CATEGORIES.map((c) => [c.id, c.nameEn]),
      [],
      ['Rows whose title starts with EXAMPLE are skipped on upload.']
    ];
    const wsHelp = XLSX.utils.aoa_to_sheet(help);
    wsHelp['!cols'] = [{ wch: 20 }, { wch: 60 }, { wch: 22 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.utils.book_append_sheet(wb, wsHelp, 'Instructions');
    XLSX.writeFile(wb, 'hazaridevi-products-template.xlsx');
  };

  const handleBulkFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setBulkBusy(true);
    setBulkResult(null);
    const errors: string[] = [];
    let added = 0;
    let skipped = 0;

    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const sheet = wb.Sheets['Products'] || wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

      const token = localStorage.getItem('hz_customer_token');
      const apiBase = getApiBaseUrl();
      const categoryIds = ADMIN_CATEGORIES.map((c) => c.id);
      const str = (v: unknown) => String(v ?? '').trim();

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const line = i + 2; // header is row 1
        const title = str(r.title);
        if (!title && !str(r.description) && !str(r.price)) continue; // blank row
        if (title.toUpperCase().startsWith('EXAMPLE')) { skipped++; continue; }

        const price = Number(str(r.price).replace(/[^0-9.]/g, ''));
        const rawCat = str(r.category).toLowerCase();
        const cat = categoryIds.find((id) => id === rawCat)
          || ADMIN_CATEGORIES.find((c) => c.nameEn.toLowerCase() === rawCat)?.id;

        if (!title) { errors.push(`Row ${line}: title is missing`); continue; }
        if (!str(r.description)) { errors.push(`Row ${line} (${title}): description is missing`); continue; }
        if (!price || price <= 0) { errors.push(`Row ${line} (${title}): price must be a number above 0`); continue; }
        if (!cat) { errors.push(`Row ${line} (${title}): unknown category "${str(r.category)}" (see Instructions sheet)`); continue; }

        const stockText = str(r.inStock).toLowerCase();
        const payload = {
          title,
          category: cat,
          badge: str(r.badge) || undefined,
          description: str(r.description),
          minOrder: str(r.minOrder) || '1 unit',
          price,
          unit: str(r.unit) || '/duckling',
          imageUrl: str(r.imageUrl),
          inStock: !['no', 'n', 'false', '0', 'out'].includes(stockText)
        };

        try {
          const res = await fetch(`${apiBase}/api/admin/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
          });
          if (res.ok) added++;
          else {
            const body = await res.json().catch(() => ({}));
            errors.push(`Row ${line} (${title}): ${body.message || 'server rejected it'}`);
          }
        } catch {
          errors.push(`Row ${line} (${title}): could not reach the server`);
        }
      }
    } catch {
      errors.push('Could not read this file. Please use the downloaded template (.xlsx).');
    }

    setBulkResult({ added, skipped, errors });
    setBulkBusy(false);
    if (added > 0) fetchDashboardData();
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

  const T = (en: string, ne: string) => (adminLang === 'ne' ? ne : en);
  const newMessagesCount = messages.filter((m) => (m.status || 'NEW').toUpperCase() === 'NEW').length;
  const money = (n: number) => 'Rs. ' + Number(n || 0).toLocaleString('en-IN');

  const navItems: { key: typeof activeTab; label: string; count: number | null; Icon: React.ElementType }[] = [
    { key: 'orders', label: T('Active orders', 'सक्रिय अर्डर'), count: activeOrders.length, Icon: Package },
    { key: 'farmer_sales', label: T('Farmer sales', 'किसान बिक्री'), count: farmerListings.length, Icon: Tag },
    { key: 'history', label: T('Order history', 'अर्डर इतिहास'), count: completedOrders.length, Icon: History },
    { key: 'visits', label: T('Farm visits', 'फार्म भ्रमण'), count: visits.length, Icon: Calendar },
    { key: 'messages', label: T('Messages', 'सन्देश'), count: messages.length, Icon: Mail },
    { key: 'products', label: T('Products', 'उत्पादन'), count: products.length, Icon: Edit3 },
    { key: 'settings', label: T('Media & settings', 'मिडिया र सेटिङ'), count: null, Icon: Settings }
  ];

  const pageTitles: Record<typeof activeTab, [string, string]> = {
    orders: [T('Active orders', 'सक्रिय अर्डर'), T('Track payments, dispatch buses and keep buyers updated.', 'भुक्तानी, बस पठाउने र खरिदकर्तालाई जानकारी दिनुहोस्।')],
    farmer_sales: [T('Farmer marketplace', 'किसान बजार'), T('Local farmers and customers who submitted ducklings, eggs and farm produce for sale.', 'बिक्रीका लागि हाँसका चल्ला, अण्डा र उत्पादन पठाउने किसान तथा ग्राहक।')],
    history: [T('Order history', 'अर्डर इतिहास'), T('Completed orders live here.', 'सम्पन्न अर्डरहरू यहाँ हुन्छन्।')],
    visits: [T('Farm visits', 'फार्म भ्रमण'), T('Visit requests from buyers.', 'खरिदकर्ताका भ्रमण अनुरोध।')],
    messages: [T('Messages', 'सन्देश'), T('Messages sent from the Contact page on your website.', 'वेबसाइटको सम्पर्क पृष्ठबाट आएका सन्देश।')],
    products: [T('Products', 'उत्पादन'), T('Everything that shows in your public shop.', 'तपाईंको सार्वजनिक पसलमा देखिने सबै उत्पादन।')],
    settings: [T('Media & settings', 'मिडिया र सेटिङ'), T('Homepage banner, gallery footage and channel link.', 'होमपेज ब्यानर, ग्यालरी भिडियो र च्यानल लिङ्क।')]
  };

  const kpis: { label: string; value: string; Icon: React.ElementType; bg: string; fg: string; onClick?: () => void; badge?: number }[] = [
    { label: T('Active orders', 'सक्रिय अर्डर'), value: String(displayedActiveOrdersCount), Icon: Package, bg: '#E3EFE6', fg: '#17553A' },
    { label: T('Pending orders', 'पर्खिरहेका'), value: String(displayedPendingCount), Icon: Clock, bg: '#FCE9BE', fg: '#7A4A00' },
    { label: T('Farmer sales', 'किसान बिक्री'), value: String(displayedFarmerSalesCount), Icon: Tag, bg: '#E3EFE6', fg: '#17553A' },
    { label: T('Farm visits', 'फार्म भ्रमण'), value: String(displayedVisitsCount), Icon: Calendar, bg: '#FCE9BE', fg: '#7A4A00', onClick: () => handleTabClick('visits'), badge: unreadVisitsCount },
    { label: T('Completed', 'सम्पन्न'), value: String(displayedCompletedCount), Icon: CheckCircle2, bg: '#EFE9D8', fg: '#5E6B62' },
    { label: T('Total revenue', 'कुल आम्दानी'), value: 'Rs.' + totalRevenue.toLocaleString('en-IN'), Icon: Banknote, bg: '#FBE3D3', fg: '#9A3F10' }
  ];

  const btnGhost = 'inline-flex items-center justify-center gap-2 h-11 box-border px-4 rounded-xl border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold text-sm cursor-pointer hover:brightness-95 transition';

  const orderSteps: { key: string; label: string }[] = [
    { key: 'PENDING', label: T('Pending', 'पेन्डिङ') },
    { key: 'CONFIRMED', label: T('Confirmed', 'पक्का') },
    { key: 'PACKED', label: T('Packed', 'प्याक') },
    { key: 'IN_TRANSIT', label: T('On bus', 'बाटोमा') },
    { key: 'ARRIVED', label: T('Arrived', 'पुग्यो') },
    { key: 'DELIVERED', label: T('Delivered', 'डेलिभर') }
  ];
  const stepClass = (state: 'current' | 'done' | 'future') =>
    'inline-flex items-center gap-1.5 min-h-[40px] box-border px-4 rounded-full text-[13px] font-bold border transition cursor-pointer disabled:opacity-60 disabled:cursor-wait ' +
    (state === 'current'
      ? 'border-[#1D4A38] bg-[#1D4A38] text-white'
      : state === 'done'
      ? 'border-[#BFD9C8] bg-[#E3EFE6] text-[#17553A]'
      : 'border-[#DDD5BF] bg-white text-[#5E6B62] hover:bg-[#F5F1E6]');

  return (
    <div
      className="min-h-screen flex flex-wrap bg-[#F5F1E6] text-[#1A2A21] text-[15px] leading-snug text-left"
      style={{ fontFamily: "'Figtree','Noto Sans Devanagari',system-ui,sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700&family=Figtree:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap');
        .hz-display{font-family:'Bricolage Grotesque','Noto Sans Devanagari',sans-serif}
        .hz-admin button:focus-visible,.hz-admin a:focus-visible,.hz-admin input:focus-visible,.hz-admin select:focus-visible{outline:2px solid #1D6B4C;outline-offset:2px}`}</style>

      {/* SIDEBAR */}
      <aside className="hz-admin w-full md:w-[260px] md:shrink-0 box-border bg-[#12301F] text-[#D7E4DA] px-[18px] py-7 flex flex-col gap-7 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="flex items-center gap-3 px-1.5">
          <div className="hz-display w-11 h-11 rounded-[14px] bg-[#F4B63B] text-[#2A1B00] flex items-center justify-center font-bold text-lg">HD</div>
          <div className="hz-display font-bold text-lg text-white leading-tight">
            {adminLang === 'ne' ? <>हजारीदेवी<br />डक फार्म</> : <>Hazaridevi<br />Duck Farm</>}
          </div>
        </div>

        <nav aria-label="Admin sections" className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
          {navItems.map(({ key, label, count, Icon }) => {
            const on = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTabClick(key)}
                aria-current={on ? 'page' : undefined}
                className={`flex items-center gap-3 md:w-full box-border px-3.5 min-h-[46px] border-0 rounded-xl text-[15px] font-semibold text-left cursor-pointer whitespace-nowrap transition ${
                  on ? 'bg-[#F4B63B] text-[#2A1B00]' : 'bg-transparent text-[#D7E4DA] hover:bg-[#1F4A36]'
                }`}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {count !== null && (
                  <span className={`min-w-[24px] box-border px-2 py-0.5 rounded-full text-xs font-bold text-center ${on ? 'bg-[#2A1B00] text-[#F4B63B]' : 'bg-[#1F4A36] text-[#D7E4DA]'}`}>
                    {count}
                  </span>
                )}
                {key === 'visits' && unreadVisitsCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-1.5 rounded-full">+{unreadVisitsCount}</span>
                )}
                {key === 'messages' && newMessagesCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-1.5 rounded-full">{newMessagesCount} {T('new', 'नयाँ')}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="md:mt-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2.5 min-h-[44px] box-border px-3.5 rounded-xl border border-[#2F5A45] bg-transparent text-white font-semibold text-sm cursor-pointer hover:bg-[#1F4A36] transition"
          >
            <Eye size={18} strokeWidth={1.8} />
            {T('View site', 'साइट हेर्नुहोस्')}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 min-h-[44px] box-border px-3.5 rounded-xl border-0 bg-[#C8402A] text-white font-semibold text-sm text-left cursor-pointer hover:brightness-110 transition"
          >
            <LogOut size={18} strokeWidth={1.8} />
            {T('Log out', 'लगआउट')}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="hz-admin flex-1 basis-[560px] min-w-0 box-border px-4 sm:px-8 pt-7 flex flex-col gap-6">
        {liveNotification && (
          <div className="bg-[#F4B63B] text-[#2A1B00] font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow">
            <Bell size={18} />
            <span>{liveNotification}</span>
          </div>
        )}

        {/* Top bar */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="hz-display m-0 font-bold text-[34px] leading-[1.1] tracking-tight">{pageTitles[activeTab][0]}</h1>
            <p className="mt-1.5 mb-0 text-[15px] text-[#5E6B62]">{pageTitles[activeTab][1]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="flex items-center gap-2 h-11 box-border px-3.5 bg-white border border-[#DDD5BF] rounded-xl min-w-[200px]">
              <Search size={18} className="text-[#5E6B62] shrink-0" />
              <input
                type="search"
                aria-label="Search"
                placeholder={T('Search', 'खोज्नुहोस्')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 outline-none bg-transparent w-full text-sm text-[#1A2A21]"
              />
            </label>
            <button
              type="button"
              onClick={toggleMetricsView}
              aria-pressed={isMetricsClearedView}
              title="Database will NOT be deleted, only display is cleared to 0"
              className={`inline-flex items-center gap-2 h-11 box-border px-4 rounded-xl font-semibold text-sm cursor-pointer transition border ${
                isMetricsClearedView ? 'border-[#12301F] bg-[#12301F] text-white' : 'border-[#DDD5BF] bg-white text-[#1A2A21]'
              }`}
            >
              <Eye size={18} strokeWidth={1.8} />
              {isMetricsClearedView ? T('Restore metrics', 'तथ्याङ्क देखाउनुहोस्') : T('Zero metrics (display)', 'मेट्रिक्स शून्य (प्रदर्शन)')}
            </button>
            <button
              type="button"
              onClick={() => setAdminLang(adminLang === 'ne' ? 'en' : 'ne')}
              className="inline-flex items-center gap-2 h-11 box-border px-4 rounded-xl border-0 bg-[#F4B63B] text-[#2A1B00] font-bold text-sm cursor-pointer hover:brightness-95 transition"
            >
              <Globe size={18} strokeWidth={1.8} />
              {adminLang === 'ne' ? 'English' : 'नेपाली'}
            </button>
            <button type="button" onClick={fetchDashboardData} disabled={loading} aria-label="Refresh" className={btnGhost}>
              <RefreshCw size={18} strokeWidth={1.8} className={loading ? 'animate-spin' : ''} />
              {T('Refresh', 'रिफ्रेस')}
            </button>
          </div>
        </header>

        {/* KPIs */}
        <section aria-label="Summary" className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))' }}>
          {kpis.map((k) => {
            const body = (
              <>
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-[0.06em] uppercase text-[#5E6B62]">{k.label}</div>
                  <div className="hz-display mt-1 font-bold text-[30px] leading-[1.1]">{k.value}</div>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: k.bg, color: k.fg }}>
                  <k.Icon size={20} strokeWidth={1.8} />
                </div>
              </>
            );
            const cls = 'relative bg-white border border-[#E4DDCB] rounded-2xl px-[18px] py-4 flex items-center justify-between gap-3 text-left';
            return k.onClick ? (
              <button key={k.label} type="button" onClick={k.onClick} className={cls + ' cursor-pointer hover:border-[#1D4A38] transition'}>
                {k.badge ? <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">+{k.badge} New</span> : null}
                {body}
              </button>
            ) : (
              <div key={k.label} className={cls}>{body}</div>
            );
          })}
        </section>

          {/* Tab 1: ACTIVE ORDERS QUEUE */}
          {activeTab === 'orders' && (
            <section aria-label="Active orders" className="flex flex-col gap-[18px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-[#5E6B62]">
                  {displayedActiveOrders.length} {T('of', 'मध्ये')} {activeOrders.length} {T('active orders', 'सक्रिय अर्डर')}
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  {T('Status', 'स्थिति')}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 box-border px-3 rounded-xl border border-[#DDD5BF] bg-white text-[#1A2A21] text-sm cursor-pointer"
                  >
                    <option value="ALL">{T('All active statuses', 'सबै सक्रिय स्थिति')}</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PACKED">Packed</option>
                    <option value="IN_TRANSIT">On bus (बाटोमा)</option>
                  </select>
                </label>
              </div>

              {displayedActiveOrders.length === 0 ? (
                <div className="bg-white border border-dashed border-[#CFC6AD] rounded-[18px] py-12 px-6 text-center text-[#5E6B62]">
                  {activeOrders.length === 0
                    ? T('No active orders in the queue. Delivered orders move to Order history.', 'कुनै सक्रिय अर्डर छैन। डेलिभर भएका अर्डर इतिहासमा जान्छन्।')
                    : T('No orders match this search or status.', 'यो खोज वा स्थितिसँग मिल्ने अर्डर छैन।')}
                </div>
              ) : (
                displayedActiveOrders.map((order) => {
                  const orderId = (order.id || order._id) as string;
                  const hasCoords = typeof order.location?.latitude === 'number' && typeof order.location?.longitude === 'number';
                  const mapLink = order.location?.mapUrl || (hasCoords
                    ? `https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}`
                    : `https://www.google.com/maps?q=${encodeURIComponent(order.addressText || '')}`);
                  const mapEmbed = hasCoords
                    ? `https://maps.google.com/maps?q=${order.location.latitude},${order.location.longitude}&z=15&output=embed`
                    : null;
                  const whatsappUrl = generateWhatsAppUrl(order);
                  const payMethod = (order.paymentMethod || 'esewa').toLowerCase();
                  const normalizedStatus = (order.status || 'PENDING').toUpperCase();
                  const isTerminated = normalizedStatus === 'TERMINATED' || normalizedStatus === 'LOST_IN_TRANSIT';
                  const curIdx = orderSteps.findIndex((st) => st.key === normalizedStatus);
                  const busy = updatingId === orderId;

                  return (
                    <article key={orderId} className="bg-white border border-[#E4DDCB] rounded-[18px] overflow-hidden flex flex-wrap">
                      {/* LEFT: details */}
                      <div className="flex-[1_1_440px] min-w-0 box-border p-6 flex flex-col gap-[18px]">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="hz-display m-0 font-bold text-[22px]">{order.customerName}</h3>
                          {payMethod.includes('esewa') && <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-xs font-bold bg-[#D9EEDF] text-[#17553A]">eSewa</span>}
                          {payMethod.includes('khalti') && <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-xs font-bold bg-[#E9DDF7] text-[#5c2d91]">Khalti</span>}
                          {payMethod.includes('rbb') && <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-xs font-bold bg-[#12301F] text-white">RBB Bank</span>}
                          <span className="text-[13px] text-[#5E6B62]">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="bg-[#F5F1E6] rounded-[14px] px-[18px] py-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-bold text-base">{order.productName}</div>
                            <div className="mt-0.5 text-sm text-[#5E6B62]">{order.quantity} {T('units', 'वटा')}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-semibold tracking-[0.06em] uppercase text-[#5E6B62]">{T('Total', 'कुल')}</div>
                            <div className="hz-display font-bold text-2xl text-[#9A3F10]">{money(order.totalPrice)}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-semibold tracking-[0.06em] uppercase text-[#5E6B62] mb-2">{T('Order status', 'अर्डर स्थिति')}</div>
                          <div role="group" aria-label="Order status" className="flex flex-wrap gap-2">
                            {orderSteps.map((st, i) => {
                              const state = isTerminated ? 'future' : i === curIdx ? 'current' : i < curIdx ? 'done' : 'future';
                              return (
                                <button
                                  key={st.key}
                                  type="button"
                                  disabled={busy}
                                  aria-pressed={state === 'current'}
                                  onClick={() => handleStatusChange(orderId, st.key)}
                                  className={stepClass(state)}
                                >
                                  {st.label}
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              disabled={busy}
                              aria-pressed={isTerminated}
                              onClick={() => handleStatusChange(orderId, 'TERMINATED')}
                              className={`inline-flex items-center gap-1.5 min-h-[40px] box-border px-4 rounded-full text-[13px] font-bold border transition cursor-pointer disabled:opacity-60 ${
                                isTerminated ? 'border-[#B0301B] bg-[#B0301B] text-white' : 'border-[#E7B9AE] bg-[#FFF1EE] text-[#B0301B] hover:brightness-95'
                              }`}
                            >
                              {T('Cancel / lost', 'रद्द / क्षति')}
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3.5 text-sm" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
                          <div className="flex items-start gap-2.5">
                            <Phone size={18} className="shrink-0 mt-0.5 text-[#9A3F10]" strokeWidth={1.8} />
                            <div><div className="text-xs text-[#5E6B62]">{T('Buyer phone', 'खरिदकर्ता फोन')}</div><div className="font-semibold">{order.phone}</div></div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <MapPin size={18} className="shrink-0 mt-0.5 text-[#9A3F10]" strokeWidth={1.8} />
                            <div className="min-w-0"><div className="text-xs text-[#5E6B62]">{T('Deliver to', 'डेलिभरी ठेगाना')}</div><div className="font-semibold break-words">{order.addressText}</div></div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <Banknote size={18} className="shrink-0 mt-0.5 text-[#9A3F10]" strokeWidth={1.8} />
                            <div className="min-w-0">
                              <div className="text-xs text-[#5E6B62]">Txn / UTR</div>
                              <div className="font-semibold font-mono break-all">{order.paymentDetails?.transactionId || '—'}</div>
                              {order.paymentDetails?.receiptScreenshotUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewReceipt(order.paymentDetails.receiptScreenshotUrl!)}
                                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#1D4A38] hover:underline cursor-pointer bg-transparent border-0 p-0"
                                >
                                  <Eye size={13} />
                                  {T('View receipt', 'रसिद हेर्नुहोस्')}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {order.busNumber && (
                          <div className="bg-[#FFF6DC] border border-[#EBCB78] rounded-[14px] px-[18px] py-3.5 text-sm flex flex-wrap items-center gap-x-5 gap-y-2">
                            <span className="font-bold flex items-center gap-1.5 text-[#7A4A00]">
                              <Bus size={16} /> {T('Bus', 'बस')}: {order.busNumber}
                            </span>
                            {order.driverPhone && <span className="text-[#5E6B62]">{T('Driver', 'चालक')}: <strong className="text-[#1A2A21]">{order.driverPhone}</strong></span>}
                            {order.biltyNumber && <span className="text-[#5E6B62]">{T('Bilty', 'बिल्टी')}: <strong className="text-[#9A3F10]">{order.biltyNumber}</strong></span>}
                            {order.estimatedArrival && <span className="text-[#5E6B62]">⏰ {order.estimatedArrival}</span>}
                          </div>
                        )}
                      </div>

                      {/* RIGHT: map + actions */}
                      <div className="flex-[0_1_380px] min-w-[280px] box-border bg-[#EFE9D8] p-5 flex flex-col gap-3.5">
                        <div className="relative h-[170px] rounded-[14px] overflow-hidden bg-[#DDE8D6] flex items-center justify-center">
                          {mapEmbed ? (
                            <iframe
                              title={`Delivery location ${orderId}`}
                              src={mapEmbed}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              className="absolute inset-0 w-full h-full border-0"
                            />
                          ) : (
                            <div className="text-center text-[13px] text-[#5E6B62] px-4">
                              <MapPin size={28} className="mx-auto mb-1 text-[#B4411E]" />
                              {T('No GPS pin saved for this order', 'यो अर्डरमा GPS पिन छैन')}
                            </div>
                          )}
                          {hasCoords && (
                            <div className="absolute left-2.5 bottom-2.5 bg-white/90 rounded-lg px-2.5 py-1 text-xs font-semibold font-mono">
                              {order.location.latitude.toFixed(6)}, {order.location.longitude.toFixed(6)}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDispatchModal(order)}
                          className="flex items-center justify-center gap-2.5 h-12 border-0 rounded-xl bg-[#F4B63B] text-[#2A1B00] font-bold text-sm tracking-[0.02em] cursor-pointer hover:brightness-95 transition"
                        >
                          <Bus size={20} strokeWidth={1.8} />
                          {T('Update bus and dispatch', 'बस र डिस्प्याच अपडेट')}
                        </button>

                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))' }}>
                          <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 h-11 rounded-[10px] bg-[#12301F] text-white font-semibold text-[13px] hover:brightness-110 transition">
                            <ExternalLink size={16} strokeWidth={1.8} />
                            {T('Maps', 'नक्सा')}
                          </a>
                          <a href={`tel:${order.phone}`} className="flex items-center justify-center gap-1.5 h-11 rounded-[10px] bg-white border border-[#DDD5BF] text-[#1A2A21] font-semibold text-[13px] hover:brightness-95 transition">
                            <Phone size={16} strokeWidth={1.8} />
                            {T('Call', 'फोन')}
                          </a>
                          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 h-11 rounded-[10px] bg-[#1E8E4A] text-white font-semibold text-[13px] hover:brightness-110 transition">
                            <MessageSquare size={16} strokeWidth={1.8} />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          )}

          {/* Tab 2: FARMER MARKETPLACE / SALES SUBMISSIONS */}
          {activeTab === 'farmer_sales' && (
            <section aria-label="Farmer marketplace" className="flex flex-col gap-[18px]">
              <div className="bg-[#E3EFE6] border border-[#BFD9C8] rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-[#17553A] max-w-[640px]">
                  {T('Inquiries and direct-sell requests. Approve a listing to show it on the public marketplace.', 'सोधपुछ र प्रत्यक्ष बिक्री अनुरोध। स्वीकृत गरेपछि सार्वजनिक बजारमा देखिन्छ।')}
                </div>
                <span className="inline-flex px-3.5 py-1.5 rounded-full bg-[#12301F] text-white font-bold text-[13px]">
                  {farmerListings.length} {farmerListings.length === 1 ? T('listing', 'सूची') : T('listings', 'सूचीहरू')}
                </span>
              </div>

              {(() => {
                const sq = searchQuery.toLowerCase();
                const shown = farmerListings.filter((item) =>
                  (item.sellerName || '').toLowerCase().includes(sq) ||
                  (item.phone || '').includes(searchQuery) ||
                  (item.productName || '').toLowerCase().includes(sq)
                );
                if (shown.length === 0) {
                  return (
                    <div className="bg-white border border-dashed border-[#CFC6AD] rounded-[18px] py-12 px-6 text-center text-[#5E6B62]">
                      {T('No farmer listings to show.', 'देखाउन कुनै किसान सूची छैन।')}
                    </div>
                  );
                }
                return shown.map((listing) => {
                  const approved = listing.status === 'Approved';
                  return (
                    <article key={listing.id} className="bg-white border border-[#E4DDCB] rounded-[18px] p-[22px] flex flex-wrap gap-[22px]">
                      {listing.imagePreview ? (
                        <img src={listing.imagePreview} alt="Produce" className="shrink-0 w-[120px] h-[120px] object-cover rounded-[14px] border border-[#E4DDCB]" />
                      ) : (
                        <div className="shrink-0 w-[120px] h-[120px] rounded-[14px] bg-[#F0EAD8] border border-dashed border-[#CFC6AD] flex flex-col items-center justify-center gap-1.5 text-[#5E6B62] text-xs">
                          <ImageIcon size={26} strokeWidth={1.6} />
                          {T('No photo', 'फोटो छैन')}
                        </div>
                      )}

                      <div className="flex-[1_1_360px] min-w-0 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-[#5E6B62] tracking-wide">{listing.id}</span>
                          <span className="inline-flex px-2.5 py-[3px] rounded-lg bg-[#F0EAD8] text-[13px] font-semibold">{listing.category || 'Duck Produce'}</span>
                          <span className={`inline-flex px-2.5 py-[3px] rounded-full text-xs font-bold ${approved ? 'bg-[#D9EEDF] text-[#17553A]' : 'bg-[#FCE9BE] text-[#7A4A00]'}`}>
                            {approved ? T('Approved', 'स्वीकृत') : T('Pending', 'पेन्डिङ')}
                          </span>
                        </div>
                        <h3 className="hz-display m-0 font-bold text-[22px]">{listing.productName}</h3>
                        <div className="grid gap-x-5 gap-y-3 text-sm" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))' }}>
                          <div><div className="text-xs text-[#5E6B62]">{T('Seller', 'विक्रेता')}</div><div className="font-semibold">{listing.sellerName}</div></div>
                          <div><div className="text-xs text-[#5E6B62]">{T('Phone', 'फोन')}</div><div className="font-semibold">{listing.phone}</div></div>
                          <div><div className="text-xs text-[#5E6B62]">{T('Location', 'स्थान')}</div><div className="font-semibold">{listing.location}</div></div>
                          <div><div className="text-xs text-[#5E6B62]">{T('Age / weight', 'उमेर / तौल')}</div><div className="font-semibold">{listing.ageOrWeight || 'N/A'}</div></div>
                          <div><div className="text-xs text-[#5E6B62]">{T('Quantity', 'संख्या')}</div><div className="font-bold text-[#17553A]">{listing.quantity}</div></div>
                          <div><div className="text-xs text-[#5E6B62]">{T('Asking rate', 'माग मूल्य')}</div><div className="font-bold text-[#9A3F10]">Rs. {listing.rate}</div></div>
                        </div>
                        {listing.description && (
                          <div className="bg-[#F5F1E6] rounded-xl px-3.5 py-2.5 text-sm"><span className="font-bold">{T('Note', 'टिप्पणी')}: </span>{listing.description}</div>
                        )}
                      </div>

                      <div className="flex-[0_1_270px] min-w-[220px] flex flex-col gap-2 justify-center">
                        <a href={`tel:+977${listing.phone}`} className="flex items-center justify-center gap-2 h-[46px] rounded-xl bg-[#F4B63B] text-[#2A1B00] font-bold text-sm hover:brightness-95 transition">
                          <Phone size={18} strokeWidth={1.8} />
                          {T('Call seller', 'विक्रेतालाई फोन')}
                        </a>
                        <a
                          href={`https://wa.me/977${listing.phone}?text=${encodeURIComponent(
                            `नमस्ते ${listing.sellerName} जी, हजारीदेवी डक फार्मबाट सम्पर्क गर्दैछौं। तपाईंको उत्पादन (${listing.productName}) बारे थप बुझ्न खोजेका हौं।`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 h-[46px] rounded-xl bg-[#1E8E4A] text-white font-bold text-sm hover:brightness-110 transition"
                        >
                          <MessageSquare size={18} strokeWidth={1.8} />
                          {T('WhatsApp seller', 'WhatsApp गर्नुहोस्')}
                        </a>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => toggleListingStatus(listing.id)}
                            className={`flex-1 h-11 rounded-xl text-sm cursor-pointer transition ${
                              approved ? 'border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold' : 'border-0 bg-[#1D4A38] text-white font-bold'
                            }`}
                          >
                            {approved ? T('Mark pending', 'पेन्डिङ बनाउनुहोस्') : T('Approve', 'स्वीकृत गर्नुहोस्')}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteFarmerListing(listing.id)}
                            aria-label="Delete listing"
                            className="shrink-0 w-11 h-11 rounded-xl border border-[#E7B9AE] bg-[#FFF1EE] text-[#B0301B] flex items-center justify-center cursor-pointer hover:brightness-95 transition"
                          >
                            <Trash2 size={18} strokeWidth={1.8} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                });
              })()}
            </section>
          )}

          {/* Tab 3: ORDER HISTORY */}
          {activeTab === 'history' && (
            <section aria-label="Order history" className="flex flex-col gap-[18px]">
              {displayedHistoryOrders.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-[#5E6B62]">
                    {displayedHistoryOrders.length} {T('completed orders', 'सम्पन्न अर्डर')}
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-[#E7B9AE] bg-[#FFF1EE] text-[#B0301B] font-semibold text-sm cursor-pointer hover:brightness-95 transition"
                  >
                    <Trash2 size={16} strokeWidth={1.8} />
                    {T('Clear all history', 'सबै इतिहास मेटाउनुहोस्')}
                  </button>
                </div>
              )}

              {displayedHistoryOrders.length === 0 ? (
                <div className="bg-white border border-dashed border-[#CFC6AD] rounded-[18px] py-[72px] px-6 flex flex-col items-center gap-3.5 text-center">
                  <div className="w-16 h-16 rounded-[20px] bg-[#F0EAD8] text-[#5E6B62] flex items-center justify-center">
                    <History size={30} strokeWidth={1.6} />
                  </div>
                  <div className="hz-display font-bold text-[22px]">{T('No completed orders yet', 'कुनै सम्पन्न अर्डर छैन')}</div>
                  <div className="text-[#5E6B62] max-w-[380px]">{T('Orders you mark as delivered move here, so the active list stays short.', 'डेलिभर भएको चिनो लगाएका अर्डर यहाँ सर्छन्, सक्रिय सूची छोटो रहन्छ।')}</div>
                </div>
              ) : (
                displayedHistoryOrders.map((order) => {
                  const orderId = (order.id || order._id) as string;
                  const whatsappUrl = generateWhatsAppUrl(order);
                  const st = (order.status || '').toUpperCase();
                  const isTerminated = st === 'TERMINATED' || st === 'LOST_IN_TRANSIT';

                  return (
                    <article key={orderId} className="bg-white border border-[#E4DDCB] rounded-[18px] p-[22px] flex flex-wrap items-center gap-x-6 gap-y-4">
                      <div className="flex-[1_1_260px] min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="hz-display m-0 font-bold text-xl">{order.customerName}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-xs font-bold ${
                            isTerminated ? 'bg-[#FFF1EE] text-[#B0301B]' : st === 'DELIVERED' ? 'bg-[#D9EEDF] text-[#17553A]' : 'bg-[#EFE9D8] text-[#5E6B62]'
                          }`}>
                            {isTerminated ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                            {st}
                          </span>
                          <span className="text-[13px] text-[#5E6B62]">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-1.5 text-sm text-[#5E6B62]">{order.phone} · {order.addressText}</div>
                      </div>

                      <div className="flex-[1_1_220px] min-w-0 text-sm">
                        <div className="font-bold">{order.productName}</div>
                        <div className="text-[#5E6B62]">{order.quantity} {T('units', 'वटा')}</div>
                        {(order.busNumber || order.biltyNumber) && (
                          <div className="mt-1 text-xs text-[#5E6B62] flex items-center gap-1.5">
                            <Bus size={13} className="text-[#9A3F10]" />
                            {order.busNumber}{order.biltyNumber ? ` · ${T('Bilty', 'बिल्टी')} ${order.biltyNumber}` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex-[0_1_170px] text-right">
                        <div className="hz-display font-bold text-[22px] text-[#9A3F10]">{money(order.totalPrice)}</div>
                        <div className="text-xs text-[#5E6B62] font-mono break-all">
                          {(order.paymentMethod || 'eSewa')} · {order.paymentDetails?.transactionId}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {order.paymentDetails?.receiptScreenshotUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewReceipt(order.paymentDetails.receiptScreenshotUrl!)}
                            aria-label="View receipt"
                            className="w-11 h-11 rounded-xl border border-[#DDD5BF] bg-white text-[#1A2A21] flex items-center justify-center cursor-pointer hover:brightness-95 transition"
                          >
                            <Eye size={18} strokeWidth={1.8} />
                          </button>
                        )}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="WhatsApp"
                          className="w-11 h-11 rounded-xl bg-[#1E8E4A] text-white flex items-center justify-center hover:brightness-110 transition"
                        >
                          <MessageSquare size={18} strokeWidth={1.8} />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(orderId, 'in_transit')}
                          className="h-11 px-4 rounded-xl border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold text-sm cursor-pointer hover:brightness-95 transition"
                        >
                          {T('Reopen', 'फेरि खोल्नुहोस्')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(orderId)}
                          aria-label={T('Delete order', 'अर्डर मेटाउनुहोस्')}
                          className="w-11 h-11 rounded-xl border border-[#E7B9AE] bg-[#FFF1EE] text-[#B0301B] flex items-center justify-center cursor-pointer hover:brightness-95 transition"
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          )}

          {/* Tab 4: Farm Visits with Status Selector & Confirmation */}
          {activeTab === 'visits' && (
            <section aria-label="Farm visits" className="flex flex-col gap-[18px]">
              {(() => {
                const vq = searchQuery.toLowerCase();
                const shownVisits = visits.filter((v) =>
                  (v.fullName || '').toLowerCase().includes(vq) || String(v.phone || '').includes(searchQuery)
                );
                if (shownVisits.length === 0) {
                  return (
                    <div className="bg-white border border-dashed border-[#CFC6AD] rounded-[18px] py-[72px] px-6 flex flex-col items-center gap-3.5 text-center">
                      <div className="w-16 h-16 rounded-[20px] bg-[#F0EAD8] text-[#5E6B62] flex items-center justify-center">
                        <Calendar size={30} strokeWidth={1.6} />
                      </div>
                      <div className="hz-display font-bold text-[22px]">{T('No farm visits booked', 'कुनै फार्म भ्रमण बुक छैन')}</div>
                      <div className="text-[#5E6B62] max-w-[380px]">{T('When a buyer asks to visit the farm, the request and preferred date will show up here.', 'खरिदकर्ताले फार्म भ्रमण माग्दा अनुरोध र मिति यहाँ देखिन्छ।')}</div>
                    </div>
                  );
                }
                return shownVisits.map((visit) => {
                  const cleanPhone = String(visit.phone || '').replace(/[^0-9]/g, '');
                  const phoneWithCountry = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
                  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(
                    adminLang === 'ne'
                      ? `नमस्ते ${visit.fullName} जी, हजारीदेवी डक फार्मबाट तपाईंको मिति ${visit.visitDate} को फार्म भिजिट सफलतापूर्वक कन्फर्म भएको छ! हामी तपाईंलाई स्वागत गर्न उत्सुक छौं।`
                      : `Hello ${visit.fullName}, your farm visit at Hazaridevi Duck Farm scheduled for ${visit.visitDate} is successfully CONFIRMED! We look forward to welcoming you.`
                  )}`;

                  const handleSendEmailConfirmation = () => {
                    const userEmail = visit.email || prompt(
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
                  const isPending = currentVisitStatus.toLowerCase() === 'pending';

                  return (
                    <article key={visit.id} className="bg-white border border-[#E4DDCB] rounded-[18px] p-[22px] flex flex-wrap items-center gap-x-6 gap-y-4">
                      <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-2.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="hz-display m-0 font-bold text-xl">{visit.fullName}</h3>
                          <span className="inline-flex px-2.5 py-[3px] rounded-lg bg-[#F0EAD8] text-[13px] font-semibold">
                            {visit.visitorCount} {T('visitors', 'जना')}
                          </span>
                          <select
                            value={currentVisitStatus}
                            onChange={(e) => handleVisitStatusChange(visit.id, e.target.value)}
                            aria-label="Visit status"
                            className={`h-9 px-3 rounded-full border text-xs font-bold cursor-pointer ${
                              isPending ? 'bg-[#FCE9BE] text-[#7A4A00] border-[#EBCB78]' : 'bg-[#D9EEDF] text-[#17553A] border-[#BFD9C8]'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
                          <span className="flex items-center gap-2 font-semibold"><Phone size={16} className="text-[#9A3F10]" strokeWidth={1.8} />{visit.phone}</span>
                          {visit.email && <span className="flex items-center gap-2 font-semibold"><Mail size={16} className="text-[#9A3F10]" strokeWidth={1.8} />{visit.email}</span>}
                          <span className="flex items-center gap-2 font-semibold"><Calendar size={16} className="text-[#9A3F10]" strokeWidth={1.8} />{T('Visit date', 'भिजिट मिति')}: {visit.visitDate}</span>
                        </div>
                        {visit.purpose && (
                          <div className="bg-[#F5F1E6] rounded-xl px-3.5 py-2.5 text-sm"><span className="font-bold">{T('Purpose / note', 'उद्देश्य / नोट')}: </span>{visit.purpose}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <a href={`tel:${visit.phone}`} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold text-sm hover:brightness-95 transition">
                          <Phone size={16} strokeWidth={1.8} />{T('Call', 'फोन')}
                        </a>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-[#1E8E4A] text-white font-semibold text-sm hover:brightness-110 transition">
                          <MessageSquare size={16} strokeWidth={1.8} />{T('WhatsApp confirm', 'WhatsApp कन्फर्म')}
                        </a>
                        <button type="button" onClick={handleSendEmailConfirmation} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl border-0 bg-[#1D4A38] text-white font-semibold text-sm cursor-pointer hover:brightness-110 transition">
                          <Mail size={16} strokeWidth={1.8} />{T('Email confirm', 'इमेल कन्फर्म')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVisit(visit.id)}
                          aria-label="Delete visit"
                          className="w-11 h-11 rounded-xl border border-[#E7B9AE] bg-[#FFF1EE] text-[#B0301B] flex items-center justify-center cursor-pointer hover:brightness-95 transition"
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </div>
                    </article>
                  );
                });
              })()}
            </section>
          )}

          {/* Tab: Contact page messages */}
          {activeTab === 'messages' && (
            <section aria-label="Messages" className="flex flex-col gap-[18px]">
              {(() => {
                const mq = searchQuery.toLowerCase();
                const stOf = (m: MessageItem) => (m.status || 'NEW').toUpperCase();
                const searched = messages.filter((m) =>
                  (m.fullName + ' ' + m.email + ' ' + m.subject + ' ' + m.message + ' ' + m.phone).toLowerCase().includes(mq)
                );
                const shownMsgs = searched.filter((m) => msgFilter === 'ALL' || stOf(m) === msgFilter);
                const filters: { key: typeof msgFilter; label: string; n: number }[] = [
                  { key: 'ALL', label: T('All', 'सबै'), n: searched.length },
                  { key: 'NEW', label: T('New', 'नयाँ'), n: searched.filter((m) => stOf(m) === 'NEW').length },
                  { key: 'REPLIED', label: T('Replied', 'जवाफ दिइयो'), n: searched.filter((m) => stOf(m) === 'REPLIED').length },
                  { key: 'CLOSED', label: T('Closed', 'बन्द'), n: searched.filter((m) => stOf(m) === 'CLOSED').length }
                ];
                return (
                  <>
                    <div role="group" aria-label="Filter messages" className="flex flex-wrap gap-2">
                      {filters.map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          aria-pressed={msgFilter === f.key}
                          onClick={() => setMsgFilter(f.key)}
                          className={`inline-flex items-center gap-2 min-h-[40px] box-border px-4 rounded-full text-[13px] font-bold border cursor-pointer transition ${
                            msgFilter === f.key ? 'border-[#1D4A38] bg-[#1D4A38] text-white' : 'border-[#DDD5BF] bg-white text-[#5E6B62] hover:bg-[#F5F1E6]'
                          }`}
                        >
                          {f.label}
                          <span className={`text-xs px-1.5 rounded-full ${msgFilter === f.key ? 'bg-white/20' : 'bg-[#EFE9D8]'}`}>{f.n}</span>
                        </button>
                      ))}
                    </div>

                    {shownMsgs.length === 0 ? (
                      <div className="bg-white border border-dashed border-[#CFC6AD] rounded-[18px] py-[72px] px-6 flex flex-col items-center gap-3.5 text-center">
                        <div className="w-16 h-16 rounded-[20px] bg-[#F0EAD8] text-[#5E6B62] flex items-center justify-center">
                          <Mail size={30} strokeWidth={1.6} />
                        </div>
                        <div className="hz-display font-bold text-[22px]">{T('No messages here', 'यहाँ कुनै सन्देश छैन')}</div>
                        <div className="text-[#5E6B62] max-w-[380px]">{T('Messages from the website Contact page will show up here.', 'वेबसाइटको सम्पर्क पृष्ठबाट आएका सन्देश यहाँ देखिन्छन्।')}</div>
                      </div>
                    ) : (
                      shownMsgs.map((m) => {
                        const st = stOf(m);
                        const digits = String(m.phone || '').replace(/[^0-9]/g, '');
                        const waPhone = digits ? (digits.startsWith('977') ? digits : `977${digits}`) : '';
                        const mailto = `mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject + ' [' + m.ref + ']')}&body=${encodeURIComponent(`Hello ${m.fullName},\n\n\n\n---\nYour message:\n${m.message}`)}`;
                        return (
                          <article key={m.id} className={`bg-white border rounded-[18px] p-[22px] flex flex-col gap-3.5 ${st === 'NEW' ? 'border-[#EBCB78]' : 'border-[#E4DDCB]'}`}>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="hz-display m-0 font-bold text-xl">{m.fullName}</h3>
                              <span className="inline-flex px-2.5 py-[3px] rounded-lg bg-[#F0EAD8] text-[13px] font-semibold">{m.subject}</span>
                              <select
                                value={st}
                                onChange={(e) => handleMessageStatus(m.id, e.target.value)}
                                aria-label="Message status"
                                className={`h-9 px-3 rounded-full border text-xs font-bold cursor-pointer ${
                                  st === 'NEW' ? 'bg-[#FCE9BE] text-[#7A4A00] border-[#EBCB78]' : st === 'REPLIED' ? 'bg-[#D9EEDF] text-[#17553A] border-[#BFD9C8]' : 'bg-[#EFE9D8] text-[#5E6B62] border-[#DDD5BF]'
                                }`}
                              >
                                <option value="NEW">New</option>
                                <option value="REPLIED">Replied</option>
                                <option value="CLOSED">Closed</option>
                              </select>
                              <span className="text-[13px] text-[#5E6B62] ml-auto">{m.ref} · {new Date(m.createdAt).toLocaleString()}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
                              <span className="flex items-center gap-2 font-semibold"><Mail size={16} className="text-[#9A3F10]" strokeWidth={1.8} />{m.email}</span>
                              {m.phone && <span className="flex items-center gap-2 font-semibold"><Phone size={16} className="text-[#9A3F10]" strokeWidth={1.8} />{m.phone}</span>}
                            </div>

                            <div className="bg-[#F5F1E6] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap break-words">{m.message}</div>

                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={mailto}
                                onClick={() => st === 'NEW' && handleMessageStatus(m.id, 'REPLIED')}
                                className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#F4B63B] text-[#2A1B00] font-bold text-sm hover:brightness-95 transition"
                              >
                                <Mail size={16} strokeWidth={1.8} />{T('Reply by email', 'इमेलबाट जवाफ')}
                              </a>
                              {m.phone && (
                                <>
                                  <a href={`tel:${m.phone}`} className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold text-sm hover:brightness-95 transition">
                                    <Phone size={16} strokeWidth={1.8} />{T('Call', 'फोन')}
                                  </a>
                                  <a
                                    href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${m.fullName}, this is Hazaridevi Duck Farm replying to your message "${m.subject}".`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#1E8E4A] text-white font-semibold text-sm hover:brightness-110 transition"
                                  >
                                    <MessageSquare size={16} strokeWidth={1.8} />WhatsApp
                                  </a>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(m.id)}
                                aria-label="Delete message"
                                className="ml-auto w-11 h-11 rounded-xl border border-[#E7B9AE] bg-[#FFF1EE] text-[#B0301B] flex items-center justify-center cursor-pointer hover:brightness-95 transition"
                              >
                                <Trash2 size={18} strokeWidth={1.8} />
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </>
                );
              })()}
            </section>
          )}

          {/* Tab 5: Products Management */}
          {activeTab === 'products' && (
            <section aria-label="Products" className="flex flex-col gap-[18px]">
              {(() => {
                const pq = searchQuery.toLowerCase();
                const shownProducts = products.filter((p) => (p.title + ' ' + p.category).toLowerCase().includes(pq));
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-[#5E6B62]">
                        {T('Showing', 'देखाइँदै')} {shownProducts.length} {T('of', 'मध्ये')} {products.length} {T('products', 'उत्पादन')}
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-2 h-[46px] px-5 border-0 rounded-xl bg-[#F4B63B] text-[#2A1B00] font-bold text-sm cursor-pointer hover:brightness-95 transition"
                      >
                        <Plus size={18} strokeWidth={2} />
                        {T('Add new product', 'नयाँ उत्पादन थप्नुहोस्')}
                      </button>
                    </div>

                    <div className="bg-white border border-[#E4DDCB] rounded-[18px] p-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-[#E3EFE6] text-[#17553A] flex items-center justify-center">
                        <FileSpreadsheet size={24} strokeWidth={1.8} />
                      </div>
                      <div className="flex-[1_1_280px] min-w-0">
                        <div className="hz-display font-bold text-lg">{T('Add many products at once', 'एकैपटक धेरै उत्पादन थप्नुहोस्')}</div>
                        <div className="text-sm text-[#5E6B62]">
                          {T('Download the Excel template, fill one product per row, then upload it here.', 'एक्सेल टेम्प्लेट डाउनलोड गर्नुहोस्, प्रति लाइन एक उत्पादन भर्नुहोस्, अनि यहाँ अपलोड गर्नुहोस्।')}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button type="button" onClick={handleDownloadTemplate} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold text-sm cursor-pointer hover:brightness-95 transition">
                          <Download size={18} strokeWidth={1.8} />
                          {T('Download Excel template', 'एक्सेल टेम्प्लेट डाउनलोड')}
                        </button>
                        <input type="file" ref={bulkFileInputRef} onChange={handleBulkFile} accept=".xlsx,.xls,.csv" className="hidden" />
                        <button
                          type="button"
                          disabled={bulkBusy}
                          onClick={() => bulkFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 h-11 px-4 border-0 rounded-xl bg-[#1D4A38] text-white font-bold text-sm cursor-pointer hover:brightness-110 transition disabled:opacity-60 disabled:cursor-wait"
                        >
                          {bulkBusy ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} strokeWidth={1.8} />}
                          {bulkBusy ? T('Uploading...', 'अपलोड हुँदैछ...') : T('Upload filled file', 'भरिएको फाइल अपलोड')}
                        </button>
                      </div>

                      {bulkResult && (
                        <div className={`basis-full rounded-xl px-4 py-3 text-sm border ${bulkResult.errors.length ? 'bg-[#FFF6DC] border-[#EBCB78]' : 'bg-[#E3EFE6] border-[#BFD9C8]'}`}>
                          <div className="font-bold flex items-center justify-between gap-3">
                            <span>
                              {T('Added', 'थपियो')} {bulkResult.added} {T('products', 'उत्पादन')}
                              {bulkResult.skipped > 0 ? ` · ${T('skipped example rows', 'उदाहरण लाइन छोडियो')}: ${bulkResult.skipped}` : ''}
                              {bulkResult.errors.length > 0 ? ` · ${bulkResult.errors.length} ${T('rows need fixing', 'लाइन सच्याउनुपर्छ')}` : ''}
                            </span>
                            <button type="button" onClick={() => setBulkResult(null)} aria-label="Dismiss" className="bg-transparent border-0 cursor-pointer text-[#5E6B62] text-base">✕</button>
                          </div>
                          {bulkResult.errors.length > 0 && (
                            <ul className="mt-2 mb-0 pl-5 text-[13px] text-[#7A4A00] list-disc">
                              {bulkResult.errors.slice(0, 20).map((er) => <li key={er}>{er}</li>)}
                              {bulkResult.errors.length > 20 && <li>…and {bulkResult.errors.length - 20} more</li>}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    {shownProducts.length === 0 ? (
                      <div className="bg-white border border-dashed border-[#CFC6AD] rounded-[18px] py-12 px-6 text-center text-[#5E6B62]">
                        {products.length === 0 ? T('No products yet. Add your first one.', 'अहिलेसम्म उत्पादन छैन। पहिलो थप्नुहोस्।') : T('No products match this search.', 'यो खोजसँग मिल्ने उत्पादन छैन।')}
                      </div>
                    ) : (
                      <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))' }}>
                        {shownProducts.map((p) => (
                          <article key={p.id} className="bg-white border border-[#E4DDCB] rounded-[18px] overflow-hidden flex flex-col">
                            <div className="relative h-[170px] bg-[#F6E3A1] flex items-center justify-center">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={44} strokeWidth={1.3} className="text-[#12301F] opacity-45" />
                              )}
                              {p.badge && (
                                <span className="absolute left-3 top-3 px-2.5 py-1 rounded-lg bg-[#F4B63B] text-[#2A1B00] text-[11px] font-bold tracking-[0.05em] uppercase">{p.badge}</span>
                              )}
                              <span className={`absolute right-3 top-3 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-[0.05em] uppercase text-white ${p.inStock ? 'bg-[#12301F]' : 'bg-[#B0301B]'}`}>
                                {p.inStock ? T('In stock', 'उपलब्ध') : T('Out of stock', 'सकियो')}
                              </span>
                            </div>
                            <div className="p-[18px] flex flex-col gap-2.5 flex-1">
                              <h3 className="hz-display m-0 font-bold text-lg leading-tight">{p.title}</h3>
                              <p className="m-0 text-sm text-[#5E6B62] flex-1 line-clamp-3">{p.description}</p>
                              <div className="flex justify-between gap-2 text-[13px] text-[#5E6B62] border-t border-[#EFE9D8] pt-2.5">
                                <span>{T('Min order', 'न्यूनतम')}: <b className="text-[#1A2A21]">{p.minOrder}</b></span>
                                <span className="capitalize">{p.category}</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="hz-display font-bold text-[26px] text-[#9A3F10]">{money(p.price)}</span>
                                <span className="text-[13px] text-[#5E6B62]">{p.unit}</span>
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => handleToggleStock(p)} className="flex-1 h-[42px] rounded-[10px] border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold text-[13px] cursor-pointer hover:brightness-95 transition">
                                  {p.inStock ? T('Mark out', 'आउट') : T('Mark in', 'इन स्टक')}
                                </button>
                                <button type="button" onClick={() => handleOpenEditModal(p)} className="flex-1 h-[42px] rounded-[10px] border border-[#DDD5BF] bg-white text-[#1A2A21] font-semibold text-[13px] cursor-pointer hover:brightness-95 transition">
                                  {T('Edit', 'सम्पादन')}
                                </button>
                                <button type="button" onClick={() => handleDeleteProduct(p.id)} aria-label="Delete product" className="shrink-0 w-[42px] h-[42px] rounded-[10px] border border-[#E7B9AE] bg-[#FFF1EE] text-[#B0301B] flex items-center justify-center cursor-pointer hover:brightness-95 transition">
                                  <Trash2 size={17} strokeWidth={1.8} />
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </section>
          )}

          {/* Tab 6: Settings - Media & Hero Banner Manager */}
          {activeTab === 'settings' && (
            <section aria-label="Media and settings">
              {(() => {
                const badge = 'inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-lg bg-[#12301F] text-white text-[11px] font-bold tracking-[0.06em] uppercase';
                const field = 'w-full h-[46px] box-border px-3.5 rounded-xl border border-[#DDD5BF] bg-white text-sm text-[#1A2A21] outline-none focus:border-[#1D4A38] font-normal';
                const area = 'w-full box-border px-3.5 py-2.5 rounded-xl border border-[#DDD5BF] bg-white text-sm text-[#1A2A21] outline-none focus:border-[#1D4A38] resize-none font-normal';
                const lbl = 'flex flex-col gap-1.5 text-[13px] font-semibold';
                const card = 'bg-white border border-[#E4DDCB] rounded-[18px] p-6 flex flex-col gap-5';
                const patchVideo = (patch: Partial<VideoData>) =>
                  setVideoConfigs({ ...videoConfigs, [selectedVideoTab]: { ...videoConfigs[selectedVideoTab], ...patch } });
                const slotLabel = (k: 'ducklings' | 'hatchery' | 'breeders') =>
                  k === 'ducklings' ? '🦆 ' + T('Ducklings batch', 'चल्ला ब्याच')
                  : k === 'hatchery' ? '🥚 ' + T('Hatching incubator', 'ह्याचिङ इन्क्युबेटर')
                  : '🌾 ' + T('Breeder flock', 'प्रजनन बथान');
                const ok = (msg: string) => (
                  <span className="text-[#17553A] font-semibold text-sm flex items-center gap-1.5"><CheckCircle2 size={16} />{msg}</span>
                );

                return (
                  <form onSubmit={handleSaveVideoSettings} className="grid gap-[18px] grid-cols-1 xl:grid-cols-12 items-start">
                    {/* HERO BANNER */}
                    <div className={card + ' xl:col-span-7'}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className={badge}><ImageIcon size={12} />{T('Homepage banner', 'होमपेज ब्यानर')}</span>
                          <h2 className="hz-display mt-2.5 mb-1 font-bold text-[22px]">{T('Main banner photo', 'मुख्य ब्यानर फोटो')}</h2>
                          <p className="m-0 text-sm text-[#5E6B62] max-w-[440px]">
                            {T('Upload a new image or paste a link. It replaces the hero photo on your homepage.', 'नयाँ फोटो अपलोड गर्नुहोस् वा लिङ्क राख्नुहोस्। यसले होमपेजको मुख्य फोटो बदल्छ।')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-5 items-stretch">
                        <div className="flex-[1_1_260px] min-h-[190px] rounded-2xl overflow-hidden bg-[#F6E3A1] flex items-center justify-center">
                          {heroBannerUrl ? (
                            <img src={heroBannerUrl} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={44} strokeWidth={1.4} className="text-[#12301F] opacity-60" />
                          )}
                        </div>
                        <div className="flex-[1_1_260px] min-w-0 flex flex-col justify-between gap-4">
                          <div className="flex flex-col gap-3">
                            <input type="file" ref={heroFileInputRef} onChange={handleHeroBannerFileChange} accept="image/*" className="hidden" />
                            <button
                              type="button"
                              onClick={() => heroFileInputRef.current?.click()}
                              className="inline-flex items-center justify-center gap-2 h-[46px] px-5 border-0 rounded-xl bg-[#F4B63B] text-[#2A1B00] font-bold text-sm cursor-pointer hover:brightness-95 transition"
                            >
                              <Upload size={18} strokeWidth={1.8} />
                              {T('Choose photo from gallery', 'ग्यालेरीबाट फोटो छान्नुहोस्')}
                            </button>
                            <label className={lbl}>
                              {T('Or paste image link', 'वा फोटोको लिङ्क राख्नुहोस्')}
                              <input
                                type="url"
                                value={heroBannerUrl}
                                onChange={(e) => setHeroBannerUrl(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                placeholder="https://"
                                className={field}
                              />
                            </label>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => handleSaveHeroBanner(e as unknown as React.FormEvent)}
                              className="inline-flex items-center gap-2 h-[46px] px-[22px] border-0 rounded-xl bg-[#1D4A38] text-white font-bold text-sm cursor-pointer hover:brightness-110 transition"
                            >
                              <Save size={16} />
                              {T('Update banner live', 'ब्यानर लाइभ अपडेट गर्नुहोस्')}
                            </button>
                            {savedHeroSuccess && ok(T('Banner updated', 'ब्यानर अपडेट भयो'))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: channel link + where things show */}
                    <div className="xl:col-span-5 flex flex-col gap-[18px]">
                      <div className={card}>
                        <div>
                          <span className={badge}>{T('Channel link', 'च्यानल लिङ्क')}</span>
                          <h2 className="hz-display mt-2.5 mb-1 font-bold text-[22px]">{T('YouTube channel', 'YouTube च्यानल')}</h2>
                          <p className="m-0 text-sm text-[#5E6B62]">{T('This powers the red YouTube button at the top right of your site.', 'यसले साइटको माथि दायाँको रातो YouTube बटन चलाउँछ।')}</p>
                        </div>
                        <label className={lbl}>
                          {T('Official channel link', 'आधिकारिक च्यानल लिङ्क')}
                          <input type="url" required value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} placeholder="https://youtube.com/@duckfarmnepal" className={field} />
                        </label>
                        <p className="m-0 text-[13px] text-[#5E6B62]">{T('Saved together with the video below when you press Upload & publish.', 'तलको भिडियोसँगै "अपलोड र प्रकाशित" थिच्दा सेभ हुन्छ।')}</p>
                      </div>

                      <div className="rounded-[18px] bg-[#12301F] text-[#D7E4DA] p-6 flex flex-col gap-4">
                        <div className="hz-display font-bold text-lg text-white">{T('Where changes show up', 'परिवर्तन कहाँ देखिन्छ')}</div>
                        {[
                          { Icon: ImageIcon, title: T('Banner photo', 'ब्यानर फोटो'), text: T('Hero image on the homepage', 'होमपेजको मुख्य फोटो') },
                          { Icon: Video, title: T('Gallery videos', 'ग्यालेरी भिडियो'), text: T('Video section, three slots', 'भिडियो खण्ड, तीन स्लट') },
                          { Icon: ExternalLink, title: T('Channel link', 'च्यानल लिङ्क'), text: T('Red YouTube button, top right', 'माथि दायाँको रातो YouTube बटन') }
                        ].map(({ Icon, title, text }) => (
                          <div key={title} className="flex items-center gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1F4A36] text-[#F4B63B] flex items-center justify-center">
                              <Icon size={18} strokeWidth={1.8} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white text-sm">{title}</div>
                              <div className="text-[13px] text-[#D7E4DA]">{text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* GALLERY VIDEOS: full width, two columns inside */}
                    <div className={card + ' xl:col-span-12'}>
                      <div>
                        <span className={badge}><Video size={12} />{T('Gallery videos', 'ग्यालेरी भिडियो')}</span>
                        <h2 className="hz-display mt-2.5 mb-1 font-bold text-[22px]">{T('Live footage from your device', 'तपाईंको डिभाइसबाट प्रत्यक्ष भिडियो')}</h2>
                        <p className="m-0 text-sm text-[#5E6B62]">{T('Pick and upload farm clips straight from your phone or computer. No links needed.', 'फोन वा कम्प्युटरबाट सिधै फार्मका क्लिप अपलोड गर्नुहोस्। लिङ्क चाहिँदैन।')}</p>
                      </div>

                      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                        {/* left: slot + preview + file */}
                        <div className="flex flex-col gap-4">
                          <div>
                            <div className="text-xs font-semibold tracking-[0.06em] uppercase text-[#5E6B62] mb-2">{T('Video slot to update', 'अपडेट गर्ने भिडियो स्लट')}</div>
                            <div className="flex flex-wrap gap-2">
                              {(['ducklings', 'hatchery', 'breeders'] as const).map((tabKey) => {
                                const on = selectedVideoTab === tabKey;
                                return (
                                  <button
                                    key={tabKey}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => {
                                      setSelectedVideoTab(tabKey);
                                      setSelectedVideoFile(null);
                                      setVideoPreviewUrl(null);
                                    }}
                                    className={`inline-flex items-center min-h-[40px] box-border px-4 rounded-full text-[13px] font-bold border cursor-pointer transition ${
                                      on ? 'border-[#1D4A38] bg-[#1D4A38] text-white' : 'border-[#DDD5BF] bg-white text-[#5E6B62] hover:bg-[#F5F1E6]'
                                    }`}
                                  >
                                    {slotLabel(tabKey)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#12301F] flex items-center justify-center">
                            {videoPreviewUrl ? (
                              <video src={videoPreviewUrl} controls className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-center text-sm text-[#D7E4DA] flex flex-col items-center gap-2">
                                <Video size={34} className="text-[#F4B63B]" strokeWidth={1.6} />
                                {T('Current active video', 'हालको सक्रिय भिडियो')}
                              </div>
                            )}
                          </div>

                          <input type="file" ref={videoFileInputRef} onChange={handleVideoFileSelect} accept="video/*" className="hidden" />
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-1.5 min-h-[110px] border-2 border-dashed border-[#CFC6AD] rounded-2xl bg-[#FBF8EF] text-[#1A2A21] font-semibold text-[15px] cursor-pointer hover:bg-[#F5F1E6] transition"
                          >
                            <Upload size={26} strokeWidth={1.6} className="text-[#1D4A38]" />
                            {T('Choose video files to upload', 'अपलोड गर्न भिडियो छान्नुहोस्')}
                            <span className="font-normal text-[13px] text-[#5E6B62]">
                              {selectedVideoFile
                                ? `${selectedVideoFile.name} (${(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB)`
                                : T('MP4 or MOV, high resolution is fine', 'MP4 वा MOV, उच्च रिजोलुसन ठीक छ')}
                            </span>
                          </button>
                        </div>

                        {/* right: titles, descriptions, publish */}
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 text-sm text-[#5E6B62]">
                            {T('Editing slot', 'सम्पादन स्लट')}: <b className="text-[#1A2A21]">{slotLabel(selectedVideoTab)}</b>
                          </div>
                          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
                            <label className={lbl}>
                              {T('Title (English)', 'शीर्षक (अंग्रेजी)')} *
                              <input type="text" required value={videoConfigs[selectedVideoTab].titleEn} onChange={(e) => patchVideo({ titleEn: e.target.value })} className={field} />
                            </label>
                            <label className={lbl}>
                              {T('Title (Nepali)', 'शीर्षक (नेपाली)')} *
                              <input type="text" required value={videoConfigs[selectedVideoTab].titleNe} onChange={(e) => patchVideo({ titleNe: e.target.value })} className={field} />
                            </label>
                          </div>
                          <label className={lbl}>
                            {T('Description (English)', 'विवरण (अंग्रेजी)')}
                            <textarea rows={3} value={videoConfigs[selectedVideoTab].descEn} onChange={(e) => patchVideo({ descEn: e.target.value })} className={area} />
                          </label>
                          <label className={lbl}>
                            {T('Description (Nepali)', 'विवरण (नेपाली)')}
                            <textarea rows={3} value={videoConfigs[selectedVideoTab].descNe} onChange={(e) => patchVideo({ descNe: e.target.value })} className={area} />
                          </label>
                          <div className="border-t border-[#EFE9D8] pt-4 flex flex-wrap items-center gap-3">
                            <button type="submit" className="inline-flex items-center gap-2 h-[46px] px-[22px] border-0 rounded-xl bg-[#1D4A38] text-white font-bold text-sm cursor-pointer hover:brightness-110 transition">
                              <Save size={16} />
                              {T('Upload & publish video', 'भिडियो अपलोड र प्रकाशित')}
                            </button>
                            {savedVideoSuccess && ok(T('Saved and live on site', 'सेभ भयो र साइटमा लाइभ छ'))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                );
              })()}
            </section>
          )}

        {/* FOOTER */}
        <footer className="mt-auto border-t border-[#DDD5BF] pt-5 pb-6 flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#5E6B62]">
          <div className="flex flex-wrap items-center gap-3">
            <b className="hz-display text-sm text-[#1A2A21]">
              {T('Hazaridevi Duck Farm Management Portal', 'हजारीदेवी डक फार्म पोर्टल')}
            </b>
            <span className="px-2 py-0.5 rounded-md bg-[#E9E3D0] font-semibold">v1.0.4 Production</span>
            <span className="hidden md:inline-flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#1D4A38]" />
              {T('Authenticated admin access', 'प्रमाणित प्रशासक पहुँच')}
            </span>
          </div>
        </footer>
      </main>

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