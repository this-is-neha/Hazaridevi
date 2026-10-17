import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ProductCatalog } from './ProductCatalog';
import { LanguageProvider, useLang } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { YouTubeVideos } from './YouTubeVideos';
import { AdminLoginModal } from './AdminLoginModal';
import { WhatsAppButton } from './WhatsAppButton';
import { FarmVisitModal } from './FarmVisitModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { SellProductModal } from './SellProductModal';
import { PageSkeleton } from './PageSkeleton';
import { Reveal, CountUp } from './Reveal';

// Pages other than Home are downloaded only when visited (smaller first load).
// React.lazy needs a default export, so map each named export onto `default`.
const DeliveryProcess = lazy(() => import('./DeliveryProcess').then((m) => ({ default: m.DeliveryProcess })));
const Gallery = lazy(() => import('./Gallery').then((m) => ({ default: m.Gallery })));
const LegalDocs = lazy(() => import('./LegalDocs').then((m) => ({ default: m.LegalDocs })));
const OrderForm = lazy(() => import('./OrderForm').then((m) => ({ default: m.OrderForm })));
const BreakEvenGuideSection = lazy(() => import('./FarmGuide').then((m) => ({ default: m.BreakEvenGuideSection })));
const AdminDashboard = lazy(() => import('./AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const LoginPage = lazy(() => import('./AuthPages').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./AuthPages').then((m) => ({ default: m.RegisterPage })));
const VerifyEmailPage = lazy(() => import('./AuthPages').then((m) => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import('./AuthPages').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./AuthPages').then((m) => ({ default: m.ResetPasswordPage })));
const AccountPage = lazy(() => import('./AuthPages').then((m) => ({ default: m.AccountPage })));
const ContactPage = lazy(() => import('./ContactPage').then((m) => ({ default: m.ContactPage })));
import { WhyChooseUs, HowItWorks, FaqSection, CtaBand } from './HomeSections';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  onOpenSellModal: () => void;
  onOpenVisitModal: () => void;
}

const HomePage = ({ onOpenSellModal, onOpenVisitModal }: HomePageProps) => {
  const { lang } = useLang();
  const navigate = useNavigate();

  // Dynamic Hero Banner State (Synced with Admin Panel)
  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('hz_hero_banner_image') || '/duck-hero.png';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedImg = localStorage.getItem('hz_hero_banner_image');
      if (updatedImg) {
        setHeroImage(updatedImg);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-white text-zinc-900 font-sans">

      {/* 1. HERO HEADER (DEEP FOREST GREEN THEME) */}
      <section className="relative overflow-hidden bg-[#1a3a2a] text-white pt-14 pb-28 sm:pt-20 sm:pb-32 px-4 sm:px-8 border-b-2 border-amber-600/80">
        {/* subtle decorative glow */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 w-[24rem] h-[24rem] rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative max-w-site mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="animate-hero flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
              <span className="w-5 h-px bg-amber-500"></span>
              <span>OCTOBER 2026 • OFFICIAL COMMUNIQUE</span>
            </div>

            <h1
              className="animate-hero text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight tracking-normal text-white"
              style={{ '--hero-delay': '120ms' } as React.CSSProperties}
            >
              {lang === 'ne' ? (
                <>
                  उच्च गुणस्तरका <span className="italic font-normal text-amber-400">खाकी क्याम्पबेल</span> हाँस र अण्डा: प्रमाणित फार्म गुणस्तर।
                </>
              ) : (
                <>
                  High-Quality <span className="italic font-normal text-amber-400">Khaki Campbell</span> Ducks & Eggs: Certified Farm Quality.
                </>
              )}
            </h1>

            <p
              className="animate-hero text-sm sm:text-base font-serif text-zinc-200 leading-relaxed max-w-xl font-normal"
              style={{ '--hero-delay': '240ms' } as React.CSSProperties}
            >
              {lang === 'ne'
                ? 'वार्षिक ३००+ अण्डा दिने ओरिजिनल ब्रिड, भ्याक्सिन लगाइएका स्वस्थ चल्ला तथा ताजा अण्डा। नेपालका ७ वटै प्रदेशमा डिलक्स बसबाट सुरक्षित ढुवानी।'
                : 'Certified Farm Quality: High-yield 300+ annual layers, healthy vaccinated chicks, and fresh eggs delivered safely across all 7 provinces.'}
            </p>

            {/* DIRECT ACTION BUTTONS (CLEAN & BALANCED) */}
            <div
              className="animate-hero pt-4 flex flex-wrap items-center gap-3 sm:gap-4"
              style={{ '--hero-delay': '360ms' } as React.CSSProperties}
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-7 py-3.5 transition shadow-lg rounded-xs cursor-pointer"
              >
                <span>{lang === 'ne' ? 'अहिले अर्डर गर्नुहोस्' : 'ORDER NOW'}</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/guide"
                className="inline-flex items-center gap-2 bg-black/30 border border-white/20 hover:border-amber-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-6 py-3.5 transition shadow-sm rounded-xs cursor-pointer"
              >
                <span>{lang === 'ne' ? 'फार्म गाइड हेर्नुहोस्' : 'VIEW FARM GUIDE'}</span>
              </Link>

              <button
                type="button"
                onClick={onOpenSellModal}
                className="inline-flex items-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-6 py-3.5 transition shadow-sm rounded-xs cursor-pointer"
              >
                <span>🌾 {lang === 'ne' ? 'उत्पादन बेच्नुहोस्' : 'SELL PRODUCE'}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC KHAKI CAMPBELL DUCK PHOTO */}
          <div
            className="animate-hero lg:col-span-5 flex justify-center lg:justify-end"
            style={{ '--hero-delay': '300ms' } as React.CSSProperties}
          >
            <div className="group relative w-full max-w-md aspect-[4/3] border-4 border-white shadow-2xl overflow-hidden bg-zinc-900 rounded-xs rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src={heroImage}
                alt="Khaki Campbell Breed Duck Specimen"
                className="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 inset-x-0 bg-[#12281d]/95 text-[11px] font-mono text-amber-400 py-1.5 px-3 uppercase tracking-wider text-left border-t border-amber-600/60 font-semibold">
                FIG. 1.0 — CERTIFIED DUCK FLOCK SPECIMEN
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. OVERLAPPING 3-COLUMN DISPATCH CARDS */}
      <section className="relative -mt-14 max-w-site mx-auto px-4 sm:px-8 z-10">
        <Reveal delay={350}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white border-2 border-zinc-200 shadow-2xl divide-y md:divide-y-0 md:divide-x-2 divide-zinc-200 text-left">
          
          {/* Card 1: Ducks & Eggs */}
          <div 
            onClick={() => navigate('/products')}
            className="p-7 hover:bg-zinc-50 transition cursor-pointer group"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-amber-700 mb-1.5 font-bold">
              {lang === 'ne' ? 'वर्ग ०१ • हाम्रा हाँस तथा अण्डाहरू' : 'CATEGORY 01 • OUR DUCKS & EGGS'}
            </div>
            <h3 className="font-extrabold text-lg text-zinc-950 group-hover:text-amber-700 transition leading-snug">
              {lang === 'ne' ? 'स्वस्थ हाँस र ताजा अण्डा' : 'Healthy Ducks & Fresh Eggs'}
            </h3>
            <p className="text-sm font-medium text-zinc-700 mt-2.5 leading-relaxed">
              {lang === 'ne'
                ? 'सक्कली जातका खाकी क्याम्पबेल हाँस, साना चल्ला, कोरल्न मिल्ने ताजा अण्डा र फार्मको ताजा माछा।'
                : 'Real Khaki Campbell ducks, baby chicks, fresh eggs for hatching, and fresh farm fish.'}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 mt-5 uppercase tracking-wider group-hover:text-amber-700 group-hover:underline">
              {lang === 'ne' ? 'सबै उत्पादनहरू हेर्नुहोस् →' : 'See All Products →'}
            </span>
          </div>

          {/* Card 2: Hatchery & Health */}
          <div 
            onClick={() => navigate('/gallery')}
            className="p-7 hover:bg-zinc-50 transition cursor-pointer group"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-amber-700 mb-1.5 font-bold">
              {lang === 'ne' ? 'वर्ग ०२ • स्वास्थ्य तथा हेरचाह' : 'CATEGORY 02 • HEALTH & CARE'}
            </div>
            <h3 className="font-extrabold text-lg text-zinc-950 group-hover:text-amber-700 transition leading-snug">
              {lang === 'ne' ? 'खोप लगाएका चल्ला र आधुनिक मेसिनबाट उत्पादन' : 'Vaccinated Chicks & Machine Hatching'}
            </h3>
            <p className="text-sm font-medium text-zinc-700 mt-2.5 leading-relaxed">
              {lang === 'ne'
                ? 'आधुनिक मेसिनमा सुरक्षित रूपमा कोरलिएका र रोग नलागोस् भनेर पूरा खोप (भ्याक्सिन) लगाइएका बलिया चल्लाहरू।'
                : 'Chicks hatched in modern machines with full vaccines so they stay strong, active, and disease-free.'}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 mt-5 uppercase tracking-wider group-hover:text-amber-700 group-hover:underline">
              {lang === 'ne' ? 'ह्याचरीका तस्बिरहरू हेर्नुहोस् →' : 'See Hatchery Photos →'}
            </span>
          </div>

          {/* Card 3: Safe Delivery */}
          <div 
            onClick={() => navigate('/delivery')}
            className="p-7 hover:bg-zinc-50 transition cursor-pointer group"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-amber-700 mb-1.5 font-bold">
              {lang === 'ne' ? 'वर्ग ०३ • सुरक्षित ढुवानी' : 'CATEGORY 03 • SAFE DELIVERY'}
            </div>
            <h3 className="font-extrabold text-lg text-zinc-950 group-hover:text-amber-700 transition leading-snug">
              {lang === 'ne' ? 'नेपालभर छिटो रात्रि बस ढुवानी सेवा' : 'Fast Night Bus Delivery Across Nepal'}
            </h3>
            <p className="text-sm font-medium text-zinc-700 mt-2.5 leading-relaxed">
              {lang === 'ne'
                ? 'हावा वारपार हुने बलियो बाकसमा राखी दैनिक रात्रि बसमार्फत ७ वटै प्रदेशमा १००% सकुशल पुग्ने ग्यारेन्टी।'
                : 'Safe and airy boxes sent daily by night bus to all 7 provinces with a 100% safe arrival guarantee.'}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 mt-5 uppercase tracking-wider group-hover:text-amber-700 group-hover:underline">
              {lang === 'ne' ? 'ढुवानी प्रक्रिया हेर्नुहोस् →' : 'How Delivery Works →'}
            </span>
          </div>

        </div>
        </Reveal>
      </section>

      {/* 3. FEATURED PRODUCTS (skeletons "load in" as you scroll) */}
      <ProductCatalog variant="featured" limit={6} />

      {/* 4. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 5. METRICS BANNER */}
      <section className="pt-20 pb-10 text-center font-sans">
        <Reveal className="inline-flex items-center gap-3 text-zinc-400">
          <span className="w-16 h-0.5 bg-zinc-300"></span>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-900 font-bold">
            ★ ★ ★ &nbsp; OFFICIAL FARM METRICS &nbsp; ★ ★ ★
          </span>
          <span className="w-16 h-0.5 bg-zinc-300"></span>
        </Reveal>

        <div className="max-w-site mx-auto px-4 sm:px-8 mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left border-y-2 border-zinc-200 py-8">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono"><CountUp end={300} suffix="+" /></p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 mt-1">
                {lang === 'ne' ? 'वार्षिक अण्डा उत्पादन' : 'Annual Egg Yield'}
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono"><CountUp end={7} duration={900} /></p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 mt-1">
                {lang === 'ne' ? 'प्रदेशमा ढुवानी सेवा' : 'Provinces Transit'}
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono"><CountUp end={100} suffix="%" /></p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 mt-1">
                {lang === 'ne' ? 'भ्याक्सिनेटेड बथान' : 'Vaccinated Flock'}
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono"><CountUp end={5000} suffix="+" duration={2000} /></p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 mt-1">
                {lang === 'ne' ? 'व्यावसायिक किसानहरू' : 'Commercial Clients'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW ORDERING WORKS */}
      <HowItWorks />

      {/* 7. YOUTUBE FOOTAGE */}
      <Reveal>
        <YouTubeVideos />
      </Reveal>

      {/* 8. FAQ */}
      <FaqSection onOpenVisitModal={onOpenVisitModal} />

      {/* 9. CALL TO ACTION */}
      <CtaBand onOpenVisitModal={onOpenVisitModal} />

    </div>
  );
};

const MainAppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const token = localStorage.getItem('hz_admin_token');
        if (token) setIsAdminLoggedIn(true);
        else setShowLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (isAdminLoggedIn) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <AdminDashboard onBackToHome={() => setIsAdminLoggedIn(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-amber-400 selection:text-zinc-950 flex flex-col justify-between">
      
      <Navbar 
        onOpenVisitModal={() => setIsVisitModalOpen(true)} 
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenSellModal={() => setIsSellModalOpen(true)}
      />

      <main className="grow">
        <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route 
            path="/"
            element={
              <HomePage
                onOpenSellModal={() => setIsSellModalOpen(true)}
                onOpenVisitModal={() => setIsVisitModalOpen(true)}
              />
            }
          />
          <Route path="/products" element={<div className="py-6"><ProductCatalog /></div>} />
          <Route path="/order" element={<div className="py-6"><OrderForm /></div>} />
          <Route path="/delivery" element={<div className="py-6"><DeliveryProcess /></div>} />
          <Route path="/guide" element={<div className="py-6"><BreakEvenGuideSection /></div>} />
          <Route path="/gallery" element={<div className="py-6"><Gallery /><YouTubeVideos /></div>} />
          <Route path="/legal" element={<div className="py-6"><LegalDocs /></div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route 
            path="*"
            element={
              <HomePage
                onOpenSellModal={() => setIsSellModalOpen(true)}
                onOpenVisitModal={() => setIsVisitModalOpen(true)}
              />
            }
          />
        </Routes>
        </Suspense>
      </main>

      {/* STANDARDIZED FOOTER */}
      <Footer 
        onOpenVisitModal={() => setIsVisitModalOpen(true)}
        onOpenLegalModal={() => navigate('/legal')}
      />

      <WhatsAppButton />
      <FarmVisitModal isOpen={isVisitModalOpen} onClose={() => setIsVisitModalOpen(false)} />
      <OrderTrackingModal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} />
      <SellProductModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />
      {showLoginModal && (
        <AdminLoginModal
          onSuccess={() => {
            setShowLoginModal(false);
            setIsAdminLoggedIn(true);
          }}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <MainAppLayout />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}