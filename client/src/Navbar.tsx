import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { Phone, Menu, X, Globe, Home, Sun, Moon, User, LogIn, Mail, ShoppingCart, Search, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenVisitModal: () => void;
  onOpenTrackModal: () => void;
  onOpenSellModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenVisitModal, 
  onOpenTrackModal,
  onOpenSellModal 
}) => {
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { customer, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const firstName = customer?.fullName.split(' ')[0] || '';
  const { cart, totalItems, totalPrice } = useCart();
  const productCount = cart.length;
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchText.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
    setIsOpen(false);
  };
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const PRIMARY_PHONE = '9807760832';

  const toggleLanguage = () => {
    setLang(lang === 'ne' ? 'en' : 'ne');
  };

  const closeMenu = () => { setIsOpen(false); setAccountOpen(false); };
  const handleLogout = () => { logout(); closeMenu(); navigate('/'); };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setAccountOpen(false);
      }
    };
    if (isOpen || accountOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, accountOpen]);

  const isActive = (path: string) => location.pathname === path;

  // Main navigation (the same list is used in the desktop bar and the mobile drawer)
  const navLinks = [
    { path: '/', labelEn: 'Home', labelNe: 'गृहपृष्ठ' },
    { path: '/products', labelEn: 'Products', labelNe: 'उत्पादन' },
    { path: '/about', labelEn: 'About', labelNe: 'हाम्रो बारेमा' }
  ];
  const contactLink = { path: '/contact', labelEn: 'Contact', labelNe: 'सम्पर्क' };
  const desktopNavLinks = [...navLinks, contactLink];
  const mobileNavLinks = [...navLinks, contactLink];

  return (
    <header ref={menuContainerRef} className="sticky top-0 z-50 w-full shadow-md font-sans">
      
      {/* 1. TOP OFFICIAL GOVERNMENT CERTIFICATION STRIP */}
      <div className="bg-[#12271c] text-zinc-200 text-xs py-1.5 px-3 sm:px-8 border-b border-emerald-900/60">
        <div className="max-w-site mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0"></span>
            <span className="font-bold text-zinc-100 tracking-tight text-[10px] sm:text-xs truncate">
              {lang === 'ne' 
                ? 'नेपाल सरकार प्रमाणित व्यावसायिक वाटरफाउल ह्याचरी' 
                : 'Govt. Registered Commercial Agro-Hatchery Facility of Nepal'}
            </span>
            <span className="inline-block text-[9px] sm:text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1 sm:px-1.5 py-0.5 rounded-xs tracking-wider shrink-0">
              {lang === 'ne' ? 'दर्ता: ११३३२-०७७/०७८' : 'Regd: 11332-077/078'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-zinc-200 shrink-0">
            <button 
              type="button"
              onClick={onOpenTrackModal} 
              className="hover:text-amber-400 transition cursor-pointer font-bold"
            >
              {lang === 'ne' ? 'डेलिभरी ट्र्याकिङ' : 'Dispatch Tracking'}
            </button>
            <span className="text-emerald-800">|</span>
            <button 
              type="button"
              onClick={onOpenVisitModal} 
              className="hover:text-amber-400 transition cursor-pointer font-bold"
            >
              {lang === 'ne' ? 'फार्म अवलोकन' : 'Farm Visit'}
            </button>
            <span className="text-emerald-800">|</span>
            <button 
              type="button"
              onClick={toggleLanguage} 
              className="hover:text-amber-200 text-amber-300 font-extrabold flex items-center gap-1.5 cursor-pointer bg-[#0d1e15] border border-emerald-700/80 px-2 py-0.5 rounded-xs"
            >
              <Globe size={13} className="text-amber-300" />
              <span>{lang === 'ne' ? 'English (EN)' : 'नेपाली (NE)'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER (DEEP FOREST GREEN) */}
      <div className="bg-[#1a3a2a] border-b border-amber-600/70 text-white px-3 sm:px-8">
        <div className="max-w-site mx-auto flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand Name */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 sm:gap-3 group shrink-0" title="Return to Home">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-white p-0.5 shadow-sm group-hover:scale-105 transition shrink-0">
              <img src="/logo.png" alt="Emblem" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <h1 className="text-sm sm:text-base xl:text-lg font-serif font-bold tracking-tight text-white leading-tight group-hover:text-amber-300 transition whitespace-nowrap">
                {t?.brandName || (lang === 'ne' ? 'हजारीदेवी बहुउद्देश्यीय कृषि फार्म' : 'Hazaridevi Multipurpose Agriculture Farm')}
              </h1>
              <p className="text-[8.5px] sm:text-[9.5px] xl:text-[10px] tracking-wider text-amber-300 uppercase font-sans font-semibold mt-0.5 whitespace-nowrap">
                {t?.brandSub || (lang === 'ne' ? 'व्यावसायिक हाँस प्रजनन तथा चल्ला उत्पादन केन्द्र' : 'Commercial Duck Breeding & Hatchery')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-10 text-sm font-bold tracking-wide">
            {desktopNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-2 border-b-2 transition-all uppercase whitespace-nowrap drop-shadow-xs ${
                  isActive(item.path)
                    ? 'border-amber-400 text-amber-300 font-black'
                    : 'border-transparent text-white hover:text-amber-300 hover:border-amber-400'
                }`}
              >
                {lang === 'ne' ? item.labelNe : item.labelEn}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Product search */}
          <form onSubmit={handleSearch} role="search" className="hidden md:flex items-center relative w-44 xl:w-60 mr-1 xl:mr-3">
            <Search size={15} className="absolute left-3 text-zinc-400 pointer-events-none" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={lang === 'ne' ? 'उत्पादन खोज्नुहोस्...' : 'Search products...'}
              aria-label={lang === 'ne' ? 'उत्पादन खोज्नुहोस्' : 'Search products'}
              className="w-full h-10 pl-9 pr-3 text-sm text-white placeholder:text-zinc-400 bg-[#12271c] border border-emerald-700/80 rounded-full focus:border-amber-400 focus:outline-none"
            />
          </form>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={lang === 'ne' ? (isDark ? 'उज्यालो मोड' : 'अँध्यारो मोड') : (isDark ? 'Light mode' : 'Dark mode')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full border border-emerald-700/80 bg-[#12271c] text-amber-300 hover:text-amber-200 hover:border-amber-400 transition cursor-pointer overflow-hidden"
            >
              <Sun
                size={18}
                className={`absolute transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
              />
              <Moon
                size={18}
                className={`absolute transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
              />
            </button>

            {/* Cart: product count badge + total, opens the order page */}
            <Link
              to="/order"
              onClick={closeMenu}
              aria-label={
                lang === 'ne'
                  ? `कार्ट: ${productCount} उत्पादन, रु. ${totalPrice.toLocaleString('en-IN')}`
                  : `Cart: ${productCount} products, Rs. ${totalPrice.toLocaleString('en-IN')}`
              }
              title={
                productCount
                  ? (lang === 'ne'
                      ? `${productCount} उत्पादन (${totalItems} वटा) • रु. ${totalPrice.toLocaleString('en-IN')}`
                      : `${productCount} products (${totalItems} units) • Rs. ${totalPrice.toLocaleString('en-IN')}`)
                  : (lang === 'ne' ? 'कार्ट खाली छ' : 'Your cart is empty')
              }
              className={`relative h-10 inline-flex items-center gap-2 rounded-full border px-2.5 xl:px-3.5 text-xs font-bold transition ${
                isActive('/order')
                  ? 'border-amber-400 text-amber-300 bg-[#12271c]'
                  : 'border-emerald-700/80 text-white bg-[#12271c] hover:border-amber-400 hover:text-amber-300'
              }`}
            >
              <span className="relative">
                <ShoppingCart size={18} />
                {productCount > 0 && (
                  <span
                    key={`${productCount}-${totalItems}`}
                    className="animate-cart-bump absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black leading-none flex items-center justify-center ring-2 ring-[#12271c]"
                  >
                    {productCount > 99 ? '99+' : productCount}
                  </span>
                )}
              </span>
              {productCount > 0 && (
                <span className="hidden xl:inline font-mono whitespace-nowrap">
                  Rs. {totalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </Link>

            {/* Account / Login */}
            {customer ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  title={lang === 'ne' ? 'मेरो खाता' : 'My Account'}
                  className={`h-10 inline-flex items-center gap-2 rounded-full border px-2.5 sm:px-3.5 text-xs font-bold transition cursor-pointer ${
                    accountOpen || isActive('/account')
                      ? 'border-amber-400 text-amber-300 bg-[#12271c]'
                      : 'border-emerald-700/80 text-white bg-[#12271c] hover:border-amber-400 hover:text-amber-300'
                  }`}
                >
                  <User size={17} />
                  <span className="hidden xl:inline max-w-[7rem] truncate">{firstName}</span>
                  <ChevronDown size={14} className={`transition ${accountOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-48 bg-[#12271c] border border-emerald-700/80 rounded-md shadow-xl py-1 z-50">
                    <Link
                      to={customer.isAdmin ? '/admin' : '/account'}
                      role="menuitem"
                      onClick={closeMenu}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900/60 hover:text-amber-300"
                    >
                      <User size={15} />
                      {customer.isAdmin
                        ? (lang === 'ne' ? 'एडमिन ड्यासबोर्ड' : 'Admin Dashboard')
                        : (lang === 'ne' ? 'मेरो खाता' : 'My Account')}
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900/60 hover:text-amber-300 cursor-pointer"
                    >
                      <LogOut size={15} />
                      {lang === 'ne' ? 'लग आउट' : 'Log out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                title={lang === 'ne' ? 'लगइन' : 'Log in'}
                className={`h-10 inline-flex items-center gap-2 rounded-full border px-2.5 sm:px-3.5 text-xs font-bold transition ${
                  isActive('/login')
                    ? 'border-amber-400 text-amber-300 bg-[#12271c]'
                    : 'border-emerald-700/80 text-white bg-[#12271c] hover:border-amber-400 hover:text-amber-300'
                }`}
              >
                <LogIn size={17} />
                <span className="hidden xl:inline max-w-[7rem] truncate">{lang === 'ne' ? 'लगइन' : 'Log in'}</span>
              </Link>
            )}

            {/* Contact Us Phone Button */}
            <Link
              to="/contact"
              onClick={closeMenu}
              className="lg:hidden inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider px-3 sm:px-5 py-2.5 rounded-sm shadow-md transition cursor-pointer whitespace-nowrap"
            >
              <Mail size={14} className="stroke-[2.5]" />
              <span className="hidden sm:inline">{lang === 'ne' ? 'हामीलाई सम्पर्क' : 'Contact Us'}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-1.5 text-white hover:text-amber-400 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="lg:hidden bg-[#1a3a2a] border-b border-emerald-900 px-5 py-4 text-left shadow-2xl">
          <form onSubmit={handleSearch} role="search" className="md:hidden relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={lang === 'ne' ? 'उत्पादन खोज्नुहोस्...' : 'Search products...'}
              className="w-full h-11 pl-9 pr-3 text-sm text-white placeholder:text-zinc-400 bg-[#12271c] border border-emerald-700/80 rounded-full focus:border-amber-400 focus:outline-none"
            />
          </form>
          <div className="space-y-1 text-sm uppercase tracking-wider font-semibold">
            {mobileNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`py-3 border-b border-emerald-900/60 flex items-center justify-between transition ${
                  isActive(item.path)
                    ? 'text-amber-300 font-extrabold'
                    : 'text-white hover:text-amber-300'
                }`}
              >
                <span>{lang === 'ne' ? item.labelNe : item.labelEn}</span>
                {item.path === '/' && <Home size={16} className="text-amber-400" />}
              </Link>
            ))}
            
            <div className="pt-3 flex flex-col gap-2.5">
              <Link
                to={customer?.isAdmin ? '/admin' : customer ? '/account' : '/login'}
                onClick={closeMenu}
                className="w-full text-left py-2 text-white hover:text-amber-300 font-bold border-b border-emerald-900/60 flex items-center gap-2"
              >
                {customer ? <User size={15} /> : <LogIn size={15} />}
                <span>
                  {customer
                    ? (customer.isAdmin
                      ? (lang === 'ne' ? 'एडमिन ड्यासबोर्ड' : 'Admin Dashboard')
                      : `${lang === 'ne' ? 'मेरो खाता' : 'My Account'} (${firstName})`)
                    : (lang === 'ne' ? 'लगइन / खाता खोल्नुहोस्' : 'Log in / Register')}
                </span>
              </Link>
              {customer && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-white hover:text-amber-300 font-bold border-b border-emerald-900/60 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>{lang === 'ne' ? 'लग आउट' : 'Log out'}</span>
                </button>
              )}
              <a
                href={`tel:+977${PRIMARY_PHONE}`}
                onClick={closeMenu}
                className="w-full text-left py-2 text-amber-300 font-bold border-b border-emerald-900/60 flex items-center gap-2"
              >
                <Phone size={15} />
                <span>{lang === 'ne' ? 'हामीलाई सम्पर्क गर्नुहोस्' : 'Contact Us'}</span>
              </a>
              <button
                type="button"
                onClick={() => { onOpenTrackModal(); closeMenu(); }}
                className="w-full text-left py-1 text-zinc-100 hover:text-amber-300 font-medium cursor-pointer"
              >
                📦 {lang === 'ne' ? 'डेलिभरी ट्र्याकिङ' : 'Dispatch Tracking'}
              </button>
              <button
                type="button"
                onClick={() => { onOpenVisitModal(); closeMenu(); }}
                className="w-full text-left py-1 text-zinc-100 hover:text-amber-300 font-medium cursor-pointer"
              >
                🗓️ {lang === 'ne' ? 'फार्म अवलोकन बुक गर्नुहोस्' : 'Schedule Farm Visit'}
              </button>
              {onOpenSellModal && (
                <button
                  type="button"
                  onClick={() => { onOpenSellModal(); closeMenu(); }}
                  className="w-full text-left py-1 text-amber-300 hover:text-white font-bold cursor-pointer"
                >
                  🌾 {lang === 'ne' ? 'उत्पादन बेच्नुहोस् (किसान बजार)' : 'Sell Your Produce'}
                </button>
              )}
              <button
                type="button"
                onClick={() => { toggleLanguage(); closeMenu(); }}
                className="w-full text-left py-2.5 text-amber-300 font-bold border-t border-emerald-900/60 mt-1 cursor-pointer"
              >
                🌐 Language: {lang === 'ne' ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};