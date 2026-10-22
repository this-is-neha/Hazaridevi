import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useLang } from './LanguageContext';
import { useCart } from './CartContext';
import { useAuth, apiRequest } from './AuthContext';
import { LoginRequired } from './LoginRequired';
import { NEPAL_ADMIN_DATA } from './nepalData';
import { API_BASE_URL } from './config';
import {
  ShoppingBag, Plus, Trash2, ShieldCheck, Truck,
  CreditCard, CheckCircle2, Copy, Check, ExternalLink, Zap, Building2, Mail, Loader2, AlertCircle, MapPin
} from 'lucide-react';

export const OrderForm: React.FC = () => {
  const { lang } = useLang();
  
  const cartContext = useCart() as any;
  const rawItems: any[] = cartContext.cartItems || cartContext.items || cartContext.cart || [];
  const updateQuantity = cartContext.updateQuantity || cartContext.updateQty || (() => {});
  const removeFromCart = cartContext.removeFromCart || cartContext.removeItem || (() => {});
  const addToCart = cartContext.addToCart || (() => {});

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedProvinceKey, setSelectedProvinceKey] = useState('');
  const [selectedDistrictKey, setSelectedDistrictKey] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [busCounter, setBusCounter] = useState('');

  // Cart helper states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addQty, setAddQty] = useState(25);

  // Payment Gateway Modal State
  // Checkout steps: 1 = items, 2 = delivery details, 3 = payment (shown inline, not as a popup)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [latitudeText, setLatitudeText] = useState('');
  const [longitudeText, setLongitudeText] = useState('');
  const parsedLat = latitudeText.trim() === '' ? NaN : Number(latitudeText);
  const parsedLng = longitudeText.trim() === '' ? NaN : Number(longitudeText);
  const coords =
    Number.isFinite(parsedLat) && Number.isFinite(parsedLng) && Math.abs(parsedLat) <= 90 && Math.abs(parsedLng) <= 180
      ? { latitude: parsedLat, longitude: parsedLng }
      : null;
  const [locStatus, setLocStatus] = useState<'idle' | 'asking' | 'done' | 'error'>('idle');
  const [locMessage, setLocMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'esewa' | 'khalti' | 'bank'>('esewa');
  const [transactionCode, setTransactionCode] = useState('');
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // Saving the order to the server
  const { customer, token, loading: authLoading } = useAuth();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<{ ref: string; total: number; txn: string } | null>(null);

  // Logged-in customers don't have to retype their details
  useEffect(() => {
    if (!customer) return;
    setFullName((v) => v || customer.fullName);
    setCustomerEmail((v) => v || customer.email);
    setPhoneNumber((v) => v || customer.phone || '');
  }, [customer]);

  const AVAILABLE_PRODUCTS = [
    { id: 'kc-day-old', nameEn: 'Day-Old Pure Khaki Campbell Ducklings', nameNe: '१ दिनको शुद्ध खाकी क्याम्पबेल हाँसको चल्ला', price: 130, unitEn: '/chick', unitNe: '/चल्ला', min: 25 },
    { id: 'kc-2week', nameEn: '2-Week Brooded Khaki Campbell Ducklings', nameNe: '२ हप्ताको ब्रुडिङ गरिएका खाकी क्याम्पबेल चल्लाहरू', price: 240, unitEn: '/chick', unitNe: '/चल्ला', min: 15 },
    { id: 'runner-chicks', nameEn: 'Indian Runner Ducklings (Day-Old & 2-Week)', nameNe: 'रनर जातका हाँसका चल्लाहरू (१ दिन र २ हप्ताका)', price: 150, unitEn: '/chick', unitNe: '/चल्ला', min: 20 },
    { id: 'hong-kong-cross', nameEn: 'Hong Kong Cross Heavy-Weight Ducklings', nameNe: 'हङकङ क्रस जातका हाँसका चल्लाहरू (द्रुत वृद्धि)', price: 140, unitEn: '/chick', unitNe: '/चल्ला', min: 20 },
    { id: 'male-meat-ducks', nameEn: 'Mature Heavy Male Ducks for Meat Production', nameNe: 'मासु उत्पादनका लागि तयारी भाले हाँसहरू (२.२-२.६ केजी)', price: 1450, unitEn: '/duck', unitNe: '/हाँस', min: 5 },
    { id: 'layer-female-ducks', nameEn: 'Point-of-Lay Female Ducks for Egg Production', nameNe: 'अण्डा उत्पादनका लागि तयार पोथी हाँसहरू', price: 1600, unitEn: '/duck', unitNe: '/हाँस', min: 5 },
    { id: 'table-duck-eggs', nameEn: 'Fresh Organic Duck Eggs for Consumption', nameNe: 'खानका लागि ताजा अर्गानिक हाँसका अण्डाहरू (क्यारेट)', price: 750, unitEn: '/crate', unitNe: '/क्यारेट', min: 1 },
    { id: 'fertile-hatching-eggs', nameEn: 'High-Fertility Duck Eggs for Hatching (Incubation)', nameNe: 'चल्ला कोरल्नका लागि ९०%+ निषेचित हाँसका अण्डाहरू', price: 1100, unitEn: '/crate', unitNe: '/क्यारेट', min: 1 },
    { id: 'farm-fish', nameEn: 'Live Fresh Pond Fish for Consumption and Sale', nameNe: 'बिक्री तथा उपभोगका लागि पोखरीका ताजा माछा', price: 380, unitEn: '/kg', unitNe: '/केजी', min: 5 }
  ];

  const totalAmount: number = cartContext.totalAmount ?? rawItems.reduce((acc: number, item: any) => {
    const p = item.price || 0;
    const q = item.qty || item.quantity || 1;
    return acc + p * q;
  }, 0);

  const totalItems: number = cartContext.totalItems ?? rawItems.reduce((acc: number, item: any) => {
    return acc + (item.qty || item.quantity || 1);
  }, 0);

  const currentProvince = useMemo(() => {
    if (!selectedProvinceKey || !(NEPAL_ADMIN_DATA as any)[selectedProvinceKey]) return null;
    return (NEPAL_ADMIN_DATA as any)[selectedProvinceKey];
  }, [selectedProvinceKey]);

  const currentDistrict = useMemo(() => {
    if (!currentProvince || !selectedDistrictKey || !currentProvince.districts[selectedDistrictKey]) return null;
    return currentProvince.districts[selectedDistrictKey];
  }, [currentProvince, selectedDistrictKey]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceKey(e.target.value);
    setSelectedDistrictKey('');
    setSelectedMunicipality('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictKey(e.target.value);
    setSelectedMunicipality('');
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    const prod = AVAILABLE_PRODUCTS.find((p) => p.id === selectedProductId);
    if (!prod) return;

    if (addToCart) {
      addToCart(prod, addQty);
    } else {
      updateQuantity(prod.id, addQty);
    }
    setSelectedProductId('');
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawItems.length === 0) {
      alert(lang === 'ne' ? 'कृपया कम्तिमा एउटा सामान छान्नुहोस्।' : 'Please select at least one item.');
      return;
    }
    if (!customerEmail || !customerEmail.includes('@') || !customerEmail.includes('.')) {
      alert(lang === 'ne' ? 'कृपया मान्य इमेल ठेगाना लेख्नुहोस्।' : 'Please enter a valid email address.');
      return;
    }

    goToStep(3);
  };

  const goToStep = (next: 1 | 2 | 3) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Asks the browser for permission, then stores the coordinates with the order
  // and does a best-effort fill of the address fields from the reverse-geocoded place
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('error');
      setLocMessage(lang === 'ne' ? 'तपाईंको ब्राउजरले लोकेसन सपोर्ट गर्दैन।' : 'Your browser does not support location.');
      return;
    }
    setLocStatus('asking');
    setLocMessage('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLatitudeText(latitude.toFixed(6));
        setLongitudeText(longitude.toFixed(6));
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=16&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const geo = await r.json();
          const haystack = JSON.stringify(geo.address || {}).toLowerCase();
          let matched = false;
          for (const [pKey, prov] of Object.entries(NEPAL_ADMIN_DATA as any) as [string, any][]) {
            for (const [dKey, dist] of Object.entries(prov.districts) as [string, any][]) {
              const dName = String(dist.nameEn || '').replace(/ district$/i, '').toLowerCase();
              if (!dName || !haystack.includes(dName)) continue;
              setSelectedProvinceKey(pKey);
              setSelectedDistrictKey(dKey);
              const muni = (dist.municipalities || []).find((m: any) => {
                const n = String(m.nameEn || m).toLowerCase().replace(/ (metropolitan city|sub-metropolitan city|municipality|rural municipality)$/i, '');
                return n && haystack.includes(n);
              });
              setSelectedMunicipality(muni ? (muni.nameEn || muni) : '');
              matched = true;
              break;
            }
            if (matched) break;
          }
        } catch {
          // Coordinates are still saved; the customer just fills the address by hand
        }
        setLocStatus('done');
        setLocMessage(lang === 'ne' ? 'हालको लोकेसन सुरक्षित भयो। कृपया ठेगाना जाँच गर्नुहोस्।' : 'Current location saved. Please check the address below.');
      },
      (err) => {
        setLocStatus('error');
        setLocMessage(
          err.code === err.PERMISSION_DENIED
            ? (lang === 'ne' ? 'लोकेसनको अनुमति दिइएन। तपाईं ठेगाना आफैँ भर्न सक्नुहुन्छ।' : 'Location permission was denied. You can fill in the address manually.')
            : (lang === 'ne' ? 'लोकेसन पत्ता लगाउन सकिएन।' : 'Could not determine your location.')
        );
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 1500);
  };

  const handleFinalPaymentConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placingOrder) return;
    setOrderError('');
    setPlacingOrder(true);

    const provinceName = currentProvince?.nameEn || selectedProvinceKey;
    const districtName = currentDistrict?.nameEn || selectedDistrictKey;
    const items = rawItems.map((item: any) => {
      const qty = item.qty || item.quantity || 1;
      return {
        productName: item.nameEn || item.titleEn || item.nameNe || 'Farm Product',
        quantity: qty,
        totalPrice: (item.price || 0) * qty
      };
    });

    // Saves the order; the server then emails the customer and the farm admin
    const res = await apiRequest<{ orderRef: string; transactionId: string; totalAmount: number }>('/api/orders', {
      token,
      body: {
        customerName: fullName.trim(),
        phone: phoneNumber.trim(),
        customerEmail: customerEmail.trim(),
        province: provinceName,
        district: districtName,
        municipality: selectedMunicipality,
        busCounter: busCounter.trim(),
        addressText: [busCounter.trim(), selectedMunicipality, districtName, provinceName].filter(Boolean).join(', '),
        items,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        paymentMethod: selectedPaymentMethod,
        transactionId: transactionCode.trim() || undefined
      }
    });
    setPlacingOrder(false);

    if (!res.ok) {
      setOrderError(
        res.data.message ||
          (lang === 'ne' ? 'अर्डर पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोस्।' : 'Could not place the order. Please try again.')
      );
      return;
    }

    setPlacedOrder({ ref: res.data.orderRef, total: res.data.totalAmount, txn: res.data.transactionId });
    cartContext.clearCart?.();
    setOrderFinalized(true);
  };

  const handleDirectEsewaCheckout = () => {
    const productCode = 'EPAYTEST';
    const secretKey = '8gBm/:&EnhH.1/q';
    const txnId = `${Date.now()}`;
    const cleanAmount = String(Math.round(totalAmount));

    const hashData = `total_amount=${cleanAmount},transaction_uuid=${txnId},product_code=${productCode}`;
    const hash = CryptoJS.HmacSHA256(hashData, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    const fields: Record<string, string> = {
      amount: cleanAmount,
      tax_amount: '0',
      total_amount: cleanAmount,
      transaction_uuid: txnId,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${window.location.origin}/order?status=success&gateway=esewa`,
      failure_url: `${window.location.origin}/order?status=failed&gateway=esewa`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: signature
    };

    Object.entries(fields).forEach(([key, val]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleDirectKhaltiCheckout = async () => {
    const txnId = `hz-${Date.now()}`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/khalti/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          transactionUuid: txnId,
          purchaseOrderName: 'Hazaridevi Duck Farm Requisition',
          customerInfo: {
            name: fullName || 'Customer',
            phone: phoneNumber || '9807760832',
            email: customerEmail || 'customer@gmail.com'
          }
        })
      });

      const data = await res.json();

      if (res.ok && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert(`Khalti Error: ${data.message || data.details || 'Initiation failed'}`);
      }
    } catch (err) {
      console.error('Khalti checkout connection error:', err);
      alert(
        lang === 'ne' 
          ? 'Khalti अनलाइन गेटवे सर्भरसँग कनेक्ट हुन सकेन। कृपया सर्भर चालु छ कि छैन जाँच गर्नुहोस्।'
          : 'Connecting to Khalti backend failed. Please ensure the backend server is running.'
      );
    }
  };

  const handleDirectBankCheckout = () => {
    const txnId = `RBB-${Date.now()}`;
    const cleanAmount = Math.round(totalAmount);

    const bankCheckoutUrl = `https://uat.connectips.com/connectipswebgw/loginpage?MERCHANTID=394&APPID=HDF&APPNAME=HazarideviDuckFarm&TXNID=${txnId}&TXNAMT=${cleanAmount}&REFERENCEID=${txnId}&REMARKS=OrderPayment&PARTICULARS=HazarideviFarm`;

    window.open(bankCheckoutUrl, '_blank');
  };

  // Browsing and the cart are open to everyone, but placing an order needs a login
  if (authLoading) {
    return <div className="bg-zinc-50/50 min-h-screen" />;
  }
  if (!customer) {
    return (
      <div className="bg-zinc-50/50 min-h-screen py-12 px-4">
        <div className="max-w-xl mx-auto bg-white border border-emerald-900/30 rounded-md shadow-md overflow-hidden">
          <div className="bg-[#1a3a2a] px-6 py-4 border-b-2 border-amber-500 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            {lang === 'ne' ? 'अर्डर पूरा गर्नुहोस्' : 'Complete your order'}
          </div>
          <LoginRequired actionEn="place an order" actionNe="अर्डर गर्न" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50/50 min-h-screen text-zinc-900 font-sans py-8">
      <div className={`mx-auto px-4 sm:px-6 grid grid-cols-1 gap-8 items-start ${orderFinalized ? 'max-w-4xl' : 'max-w-site lg:grid-cols-[minmax(0,1fr)_440px]'}`}>
      <div className="min-w-0 space-y-8">
        
        {/* 1. SECTION BANNER - DEEP FOREST GREEN THEME */}
        <div className="bg-[#1a3a2a] p-6 sm:p-8 text-white text-left border-b-2 border-amber-500 shadow-md rounded-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12271c] border border-emerald-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-3 rounded-xs">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>OFFICIAL REQUISITION & DISPATCH ORDER</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
            {lang === 'ne' ? 'अनलाइन अर्डर फारम' : 'Place Your Order'}
          </h1>

          <p className="text-sm sm:text-base font-normal text-zinc-100 mt-2 max-w-2xl leading-relaxed">
            {lang === 'ne'
              ? 'प्रमाणित जातका चल्ला, अण्डा तथा मासु छान्नुहोस्। नेपालका सबै प्रदेश तथा जिल्लाहरूमा रात्रि बसमार्फत सुरक्षित ढुवानी।'
              : 'Select certified waterfowl breeds, organic table eggs and dispatch terminal with real-time billing.'}
          </p>
        </div>

        {/* STEP INDICATOR */}
        <ol className="grid grid-cols-3 gap-2 text-center">
          {[
            { n: 1, en: 'Items', ne: 'सामान' },
            { n: 2, en: 'Delivery', ne: 'डेलिभरी' },
            { n: 3, en: 'Payment', ne: 'भुक्तानी' }
          ].map((s) => (
            <li
              key={s.n}
              className={`py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs border-2 ${
                step === s.n
                  ? 'bg-[#1a3a2a] border-[#1a3a2a] text-amber-300'
                  : step > s.n
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-white border-zinc-200 text-zinc-400'
              }`}
            >
              {step > s.n ? '✓ ' : `${s.n}. `}
              {lang === 'ne' ? s.ne : s.en}
            </li>
          ))}
        </ol>

        {/* 2. REQUISITION MANIFEST */}
        {step === 1 && (
        <div className="border border-emerald-900/20 bg-white p-6 sm:p-7 shadow-sm text-left space-y-6 rounded-xs">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm sm:text-base">
              <ShoppingBag size={18} className="text-emerald-800" />
              <span>{lang === 'ne' ? 'छनोट गरिएका उत्पादनहरू (Requisition Manifest)' : 'Requisition Manifest'}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 px-3 py-1 rounded-xs border border-emerald-300">
              {rawItems.length} {lang === 'ne' ? 'वस्तुहरू' : 'Items Staged'}
            </span>
          </div>

          {rawItems.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-sm font-medium">
              {lang === 'ne' ? 'हाल कुनै सामान छानिएको छैन। तलबाट थप्नुहोस्।' : 'No items staged yet. Add items below.'}
            </div>
          ) : (
            <div className="space-y-3">
              {rawItems.map((item: any) => {
                const itemQty = item.qty ?? item.quantity ?? 1;
                const itemPrice = item.price ?? 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xs"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-base font-bold text-zinc-950">
                        {lang === 'ne' ? (item.nameNe || item.titleNe || item.nameEn) : (item.nameEn || item.titleEn)}
                      </h4>
                      <p className="text-xs font-mono font-bold text-emerald-800">
                        Rs. {itemPrice.toLocaleString()} {lang === 'ne' ? (item.unitNe || '/गोटा') : (item.unitEn || '/unit')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="flex items-center border border-zinc-300 bg-white rounded-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, itemQty - 1))}
                          className="px-3 py-1.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={itemQty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-14 text-center text-sm font-mono font-bold text-zinc-900 border-x border-zinc-300 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, itemQty + 1)}
                          className="px-3 py-1.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-base font-black text-zinc-950 font-mono min-w-[90px] text-right">
                        Rs. {(itemPrice * itemQty).toLocaleString()}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-600 transition p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ADD MORE CONTROLS */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = AVAILABLE_PRODUCTS.find((x) => x.id === e.target.value);
                if (p) setAddQty(p.min);
              }}
              className="flex-1 px-4 py-3 text-sm font-semibold text-zinc-900 bg-white border border-zinc-300 rounded-xs focus:border-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="">+ {lang === 'ne' ? 'थप उत्पादन छान्नुहोस्...' : 'Choose product to add...'}</option>
              {AVAILABLE_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {lang === 'ne' ? prod.nameNe : prod.nameEn} (Rs. {prod.price})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={addQty}
              onChange={(e) => setAddQty(parseInt(e.target.value) || 1)}
              className="w-full sm:w-24 px-3 py-3 text-sm font-mono font-bold text-zinc-900 bg-white border border-zinc-300 rounded-xs focus:border-emerald-700 focus:outline-none text-center"
            />

            <button
              type="button"
              onClick={handleAddCustom}
              className="px-6 py-3 bg-[#1a3a2a] hover:bg-[#12271c] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0 border border-emerald-800"
            >
              <Plus size={15} />
              <span>{lang === 'ne' ? 'थप्नुहोस्' : 'ADD'}</span>
            </button>
          </div>

          {/* TOTAL BANNER - DEEP FOREST GREEN */}
          <div className="p-5 bg-[#1a3a2a] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xs border-t-2 border-amber-400 shadow-inner">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                {lang === 'ne' ? 'कुल परिमाण' : 'TOTAL DISPATCHED VOLUME:'}
              </p>
              <p className="text-sm font-bold text-zinc-100 mt-0.5">
                {totalItems} {lang === 'ne' ? 'वटा' : 'units'} ({rawItems.length} {lang === 'ne' ? 'जात/क्याटगोरी' : 'categories'})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                {lang === 'ne' ? 'जम्मा रकम' : 'NET INVOICE TOTAL:'}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-0.5">
                Rs. {totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={rawItems.length === 0}
            onClick={() => goToStep(2)}
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-black text-sm sm:text-base uppercase tracking-wider rounded-xs shadow-md transition cursor-pointer"
          >
            {lang === 'ne' ? 'अर्को: डेलिभरी विवरण →' : 'NEXT: DELIVERY DETAILS →'}
          </button>
        </div>
        )}

        {/* 3. DISPATCH FORM */}
        {step === 2 && (
        <form onSubmit={handleOrderSubmit} className="border border-emerald-900/20 bg-white p-6 sm:p-8 shadow-sm text-left space-y-6 rounded-xs">
          <h3 className="text-lg sm:text-xl font-serif font-black text-zinc-950 border-b border-zinc-200 pb-3 flex items-center gap-2">
            <Truck size={18} className="text-emerald-800" />
            <span>{lang === 'ne' ? 'डेलिभरी तथा ग्राहक विवरण' : 'Delivery & Client Details'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={lang === 'ne' ? 'उदा. राम बहादुर श्रेष्ठ' : 'e.g. Ram Bahadur Shrestha'}
                className="w-full px-4 py-3 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'सम्पर्क मोबाइल नम्बर *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full px-4 py-3 text-sm sm:text-base font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* EMAIL ADDRESS FIELD */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
              <Mail size={15} className="text-emerald-800" />
              <span>{lang === 'ne' ? 'इमेल ठेगाना (Email Address) *' : 'Email Address (For Dispatch Slip) *'}</span>
            </label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@gmail.com"
              className="w-full px-4 py-3 text-sm sm:text-base font-mono text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
            />
            <p className="text-xs text-zinc-500 font-serif">
              {lang === 'ne' 
                ? 'बसको बिल्टी र ट्र्याकिङ स्लिप सिधै इमेलमा प्राप्त गर्नको लागि।' 
                : 'Required to receive live bus dispatch tracking and delivery slips directly via email.'}
            </p>
          </div>

          {/* USE CURRENT LOCATION - the browser shows its own allow/deny prompt */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xs space-y-2">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locStatus === 'asking'}
              className="w-full sm:w-auto px-5 py-3 bg-[#1a3a2a] hover:bg-[#12271c] disabled:opacity-60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {locStatus === 'asking' ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
              <span>{lang === 'ne' ? 'हालको लोकेसन प्रयोग गर्नुहोस्' : 'Use my current location'}</span>
            </button>
            <p className="text-xs text-zinc-500">
              {lang === 'ne'
                ? 'तपाईंको ब्राउजरले अनुमति मागेछ। अनुमति दिएमा ठेगाना स्वतः भरिनेछ र लोकेसन अर्डरसँग सुरक्षित हुनेछ।'
                : 'Your browser will ask for permission. If you allow it, we fill in the address and save the location with your order.'}
            </p>
            {locMessage && (
              <p className={`text-xs font-semibold ${locStatus === 'error' ? 'text-red-700' : 'text-emerald-800'}`}>{locMessage}</p>
            )}
          </div>

          {/* CASCADING NEPAL LOCATIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'प्रदेश (Province) *' : 'Province *'}
              </label>
              <select
                required
                value={selectedProvinceKey}
                onChange={handleProvinceChange}
                className="w-full px-4 py-3 text-sm sm:text-base font-semibold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition cursor-pointer"
              >
                <option value="">-- {lang === 'ne' ? 'प्रदेश छान्नुहोस्' : 'Select Province'} --</option>
                {Object.entries(NEPAL_ADMIN_DATA as any).map(([key, prov]: [string, any]) => (
                  <option key={key} value={key}>
                    {lang === 'ne' ? prov.nameNe : prov.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'जिल्ला (District) *' : 'District *'}
              </label>
              <select
                required
                disabled={!selectedProvinceKey}
                value={selectedDistrictKey}
                onChange={handleDistrictChange}
                className="w-full px-4 py-3 text-sm sm:text-base font-semibold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition cursor-pointer disabled:bg-zinc-100 disabled:text-zinc-400"
              >
                <option value="">
                  {!selectedProvinceKey 
                    ? `-- ${lang === 'ne' ? 'पहिले प्रदेश छान्नुहोस्' : 'Select Province First'} --` 
                    : `-- ${lang === 'ne' ? 'जिल्ला छान्नुहोस्' : 'Select District'} --`}
                </option>
                {currentProvince &&
                  Object.entries(currentProvince.districts).map(([dKey, dist]: [string, any]) => (
                    <option key={dKey} value={dKey}>
                      {lang === 'ne' ? dist.nameNe : dist.nameEn}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'नगरपालिका / गाउँपालिका *' : 'Municipality / Palika *'}
              </label>
              <select
                required
                disabled={!selectedDistrictKey}
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base font-semibold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition cursor-pointer disabled:bg-zinc-100 disabled:text-zinc-400"
              >
                <option value="">
                  {!selectedDistrictKey 
                    ? `-- ${lang === 'ne' ? 'पहिले जिल्ला छान्नुहोस्' : 'Select District First'} --` 
                    : `-- ${lang === 'ne' ? 'पालिका छान्नुहोस्' : 'Select Municipality'} --`}
                </option>
                {currentDistrict &&
                  (currentDistrict.municipalities || []).map((muni: any, idx: number) => (
                    <option key={idx} value={muni.nameEn || muni}>
                      {lang === 'ne' ? (muni.nameNe || muni) : (muni.nameEn || muni)}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'नजिकको ल्यान्डमार्क *' : 'Nearest Landmark *'}
              </label>
              <input
                type="text"
                required
                value={busCounter}
                onChange={(e) => setBusCounter(e.target.value)}
                placeholder={lang === 'ne' ? 'उदा. मन्दिर, स्कुल, चोक, बसपार्क' : 'e.g. Temple, school, chowk, bus park'}
                className="w-full px-4 py-3 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* NOTICE */}
          <div className="p-4 bg-emerald-50/60 border-l-4 border-emerald-600 rounded-xs flex items-start gap-3">
            <CreditCard className="text-emerald-800 shrink-0 mt-0.5" size={20} />
            <div className="text-xs sm:text-sm font-medium text-zinc-800">
              <strong className="text-emerald-950 font-bold">
                {lang === 'ne' ? 'आधिकारिक भुक्तानी गेटवे: ' : 'Official Payment Settlement: '}
              </strong>
              {lang === 'ne'
                ? 'फर्म बुझाउनासाथ eSewa, Khalti तथा RBB बैंक ट्रान्सफर पोर्टल खुल्नेछ।'
                : 'Submitting launches the direct eSewa/Khalti checkout and Bank Transfer terminal.'}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="sm:w-40 py-4 bg-white hover:bg-zinc-100 border-2 border-zinc-300 text-zinc-800 font-bold text-sm uppercase tracking-wider rounded-xs transition cursor-pointer"
            >
              ← {lang === 'ne' ? 'पछाडि' : 'Back'}
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-zinc-950 font-black text-sm sm:text-base uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard size={18} />
              <span>{lang === 'ne' ? 'अर्को: भुक्तानी →' : 'NEXT: PAYMENT →'}</span>
            </button>
          </div>
        </form>
        )}

      {/* 4. PAYMENT STEP (inline page section, no popup) */}
      {step === 3 && (
        <div>
          <div className="bg-white w-full rounded-md border border-emerald-900/40 shadow-md overflow-hidden text-left relative">
            {/* MODAL HEADER - DEEP FOREST GREEN */}
            <div className="bg-[#1a3a2a] p-6 sm:p-7 text-white border-b-2 border-amber-500 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12271c] border border-emerald-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2.5 rounded-xs">
                <CreditCard size={14} className="text-amber-400" />
                <span>OFFICIAL PAYMENT GATEWAY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                {lang === 'ne' ? 'रकम भुक्तानी तथा प्रमाणीकरण' : 'Payment Settlement Terminal'}
              </h3>
              <p className="text-sm text-zinc-100 mt-1 font-normal leading-relaxed">
                {lang === 'ne'
                  ? 'eSewa, Khalti वा RBB अनलाइन बैंकिङमार्फत तत्काल पे गर्नुहोस् वा QR स्क्यान गरी भौचर बुझाउनुहोस्।'
                  : 'Pay directly via eSewa / Khalti / RBB Bank online gateway or scan the QR code to submit verification.'}
              </p>

              {!orderFinalized && (
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="absolute top-6 right-6 text-zinc-300 hover:text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-white/10 transition cursor-pointer"
                >
                  ← {lang === 'ne' ? 'पछाडि' : 'Back'}
                </button>
              )}
            </div>

            {/* ORDER CONFIRMED SCREEN */}
            {orderFinalized ? (
              <div className="p-8 sm:p-12 text-center space-y-5 bg-white">
                <div className="w-18 h-18 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={42} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950">
                    {lang === 'ne' ? 'अर्डर तथा भुक्तानी दर्ता भयो!' : 'Order & Payment Logged!'}
                  </h4>
                  <p className="text-sm sm:text-base font-medium text-zinc-700 mt-2">
                    {lang === 'ne'
                      ? `धन्यवाद ${fullName}! ट्रान्ज्याक्सन कोड [${placedOrder?.txn || transactionCode}] प्रमाणीकरणका लागि पेश गरिएको छ।`
                      : `Thank you ${fullName}! Transaction reference [${placedOrder?.txn || transactionCode}] recorded for priority dispatch.`}
                  </p>
                  <p className="text-sm text-emerald-800 font-semibold mt-2 flex items-center justify-center gap-1.5">
                    <Mail size={15} />
                    {lang === 'ne'
                      ? `पुष्टि इमेल ${customerEmail} मा पठाइयो।`
                      : `A confirmation email has been sent to ${customerEmail}.`}
                  </p>
                </div>

                <div className="p-5 bg-zinc-50 border border-zinc-200 text-left text-sm space-y-2 font-sans rounded-xs">
                  <div className="flex justify-between border-b border-zinc-200 pb-2">
                    <span className="text-zinc-500 font-bold uppercase text-xs">{lang === 'ne' ? 'अर्डर नम्बर:' : 'Order Ref:'}</span>
                    <span className="font-mono font-black text-zinc-950">{placedOrder?.ref}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 pb-2">
                    <span className="text-zinc-500 font-bold uppercase text-xs">Total Billed:</span>
                    <span className="font-mono font-black text-zinc-950 text-base">Rs. {(placedOrder?.total ?? totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 pb-2">
                    <span className="text-zinc-500 font-bold uppercase text-xs">Contact Email:</span>
                    <span className="font-mono font-bold text-zinc-950">{customerEmail}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-zinc-500 font-bold uppercase text-xs">Landmark:</span>
                    <span className="font-bold text-zinc-950">{busCounter}, {selectedMunicipality}</span>
                  </div>
                </div>

                {/* The farm is notified automatically by the server (email + WhatsApp) - nothing for the customer to send */}
                <p className="text-sm text-zinc-700">
                  {lang === 'ne'
                    ? 'फार्मलाई तपाईंको अर्डरको जानकारी स्वतः पठाइएको छ। बसमा पठाएपछि बस नम्बर र बिल्टी इमेल गरिनेछ।'
                    : "The farm has been notified of your order automatically. We'll email you the bus number and bilty once it's dispatched."}
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderFinalized(false);
                      setStep(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-4 bg-[#1a3a2a] hover:bg-[#12271c] text-white font-bold text-sm uppercase tracking-wider rounded-xs transition cursor-pointer"
                  >
                    {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
                  </button>
                </div>

                <p className="text-sm text-zinc-600">
                  {customer ? (
                    <Link to="/account" className="font-bold text-emerald-800 hover:text-amber-700 underline underline-offset-4">
                      {lang === 'ne' ? 'मेरो खातामा अर्डर हेर्नुहोस् →' : 'View this order in My Account →'}
                    </Link>
                  ) : (
                    <>
                      {lang === 'ne' ? 'अर्को पटक छिटो अर्डर गर्न ' : 'Order faster next time — '}
                      <Link to="/register" className="font-bold text-emerald-800 hover:text-amber-700 underline underline-offset-4">
                        {lang === 'ne' ? 'खाता खोल्नुहोस्' : 'create an account'}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            ) : (
              /* PAYMENT DETAILS SELECTION */
              <div className="p-6 sm:p-8 space-y-6 bg-white font-sans">
                
                {/* Total Invoice Header */}
                <div className="p-5 bg-emerald-50/50 border border-emerald-900/20 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-emerald-900 tracking-wider">
                      {lang === 'ne' ? 'भुक्तानी गर्नुपर्ने कुल रकम' : 'PAYABLE INVOICE TOTAL'}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-zinc-600 mt-0.5">
                      {totalItems} {lang === 'ne' ? 'वटा वस्तुहरू' : 'items staged in requisition'}
                    </p>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-950 font-mono tracking-tight">
                    Rs. {totalAmount.toLocaleString()}
                  </div>
                </div>

                {/* 3 Payment Tabs */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('esewa')}
                    className={`py-3 px-3 rounded-xs border-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer text-center ${
                      selectedPaymentMethod === 'esewa'
                        ? 'bg-[#60bb46] border-[#60bb46] text-white shadow-md font-black'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    eSewa Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('khalti')}
                    className={`py-3 px-3 rounded-xs border-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer text-center ${
                      selectedPaymentMethod === 'khalti'
                        ? 'bg-[#5c2d91] border-[#5c2d91] text-white shadow-md font-black'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    Khalti Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('bank')}
                    className={`py-3 px-3 rounded-xs border-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer text-center ${
                      selectedPaymentMethod === 'bank'
                        ? 'bg-[#1a3a2a] border-[#1a3a2a] text-white shadow-md font-black'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    RBB Bank Pay
                  </button>
                </div>

                {/* Dynamic Payment Tab Box */}
                <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-xs">
                  {selectedPaymentMethod === 'esewa' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                        <span className="font-extrabold text-base text-[#41852e]">eSewa Official Merchant Account</span>
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-xs">
                          VERIFIED
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleDirectEsewaCheckout}
                        className="w-full py-4 bg-[#60bb46] hover:bg-[#52a13b] active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap size={18} className="fill-current" />
                        <span>
                          {lang === 'ne' ? 'eSewa अनलाइन पोर्टलबाट सिधै तिर्नुहोस् →' : 'Pay via eSewa Online Checkout →'}
                        </span>
                        <ExternalLink size={15} />
                      </button>

                      <div className="flex items-center gap-3 my-2 text-zinc-400">
                        <div className="h-px bg-zinc-300 flex-1"></div>
                        <span className="text-xs font-bold uppercase text-zinc-500">OR SCAN QR / TRANSFER ID</span>
                        <div className="h-px bg-zinc-300 flex-1"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white border border-emerald-300 rounded-xs shadow-xs">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=eSewa:9807760832;Name:Hazaridevi%20Duck%20Farm"
                            alt="eSewa QR Code"
                            className="w-36 h-36 object-contain"
                          />
                          <span className="text-[11px] font-mono font-bold text-emerald-900 mt-2 uppercase tracking-wide">
                            Scan to Pay (eSewa)
                          </span>
                        </div>

                        <div className="md:col-span-8 space-y-3">
                          <div className="p-3.5 bg-white border border-zinc-200 rounded-xs flex items-center justify-between">
                            <div>
                              <p className="text-xs text-zinc-500 font-bold uppercase">eSewa ID (Mobile Number)</p>
                              <p className="font-mono font-black text-zinc-950 text-xl sm:text-2xl mt-0.5">9807760832</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('9807760832', 'esewa')}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded text-xs font-bold text-emerald-900 flex items-center gap-1.5 cursor-pointer transition"
                            >
                              {copiedText === 'esewa' ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                              <span>{copiedText === 'esewa' ? 'Copied' : 'Copy ID'}</span>
                            </button>
                          </div>
                          <div className="p-3.5 bg-white border border-zinc-200 rounded-xs">
                            <p className="text-xs text-zinc-500 font-bold uppercase">Registered Merchant Name</p>
                            <p className="font-bold text-zinc-950 text-base mt-0.5">Hazaridevi Duck Farm</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'khalti' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                        <span className="font-extrabold text-base text-[#5c2d91]">Khalti Official Primary ID</span>
                        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-xs">
                          VERIFIED
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleDirectKhaltiCheckout}
                        className="w-full py-4 bg-[#5c2d91] hover:bg-[#4d257a] active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap size={18} className="fill-current" />
                        <span>
                          {lang === 'ne' ? 'Khalti अनलाइन पोर्टलबाट सिधै तिर्नुहोस् →' : 'Pay via Khalti Online Checkout →'}
                        </span>
                        <ExternalLink size={15} />
                      </button>

                      <div className="flex items-center gap-3 my-2 text-zinc-400">
                        <div className="h-px bg-zinc-300 flex-1"></div>
                        <span className="text-xs font-bold uppercase text-zinc-500">OR SCAN QR / TRANSFER ID</span>
                        <div className="h-px bg-zinc-300 flex-1"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white border border-purple-300 rounded-xs shadow-xs">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Khalti:9807760832;Name:Sharan%20Dev%20Yadav"
                            alt="Khalti QR Code"
                            className="w-36 h-36 object-contain"
                          />
                          <span className="text-[11px] font-mono font-bold text-purple-800 mt-2 uppercase tracking-wide">
                            Scan to Pay (Khalti)
                          </span>
                        </div>

                        <div className="md:col-span-8 space-y-3">
                          <div className="p-3.5 bg-white border border-zinc-200 rounded-xs flex items-center justify-between">
                            <div>
                              <p className="text-xs text-zinc-500 font-bold uppercase">Khalti Number / ID</p>
                              <p className="font-mono font-black text-zinc-950 text-xl sm:text-2xl mt-0.5">9807760832</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('9807760832', 'khalti')}
                              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded text-xs font-bold text-purple-800 flex items-center gap-1.5 cursor-pointer transition"
                            >
                              {copiedText === 'khalti' ? <Check size={14} className="text-purple-700" /> : <Copy size={14} />}
                              <span>{copiedText === 'khalti' ? 'Copied' : 'Copy ID'}</span>
                            </button>
                          </div>
                          <div className="p-3.5 bg-white border border-zinc-200 rounded-xs">
                            <p className="text-xs text-zinc-500 font-bold uppercase">Account Holder</p>
                            <p className="font-bold text-zinc-950 text-base mt-0.5">Sharan Dev Yadav</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'bank' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                        <div className="flex items-center gap-2">
                          <Building2 size={18} className="text-emerald-900" />
                          <span className="font-black text-base text-zinc-900">
                            Rastriya Banijya Bank (RBB) Settlement
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-xs">
                          CONNECT IPS / RBB SMART
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleDirectBankCheckout}
                        className="w-full py-4 bg-[#1a3a2a] hover:bg-[#12271c] active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap size={18} className="fill-amber-400" />
                        <span>
                          {lang === 'ne' 
                            ? 'ConnectIPS / RBB अनलाइन पोर्टलबाट तिर्नुहोस् →' 
                            : 'Pay via ConnectIPS / RBB Online Banking →'}
                        </span>
                        <ExternalLink size={15} />
                      </button>

                      <div className="flex items-center gap-3 my-2 text-zinc-400">
                        <div className="h-px bg-zinc-300 flex-1"></div>
                        <span className="text-xs font-bold uppercase text-zinc-500">OR SCAN BANK QR / A/C TRANSFER</span>
                        <div className="h-px bg-zinc-300 flex-1"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white border border-emerald-300 rounded-xs shadow-xs text-center">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                              `RBB:1340100028491001|Name:Hazaridevi Duck Farm|Amount:${totalAmount}`
                            )}`}
                            alt="RBB Bank QR Code"
                            className="w-36 h-36 object-contain"
                          />
                          <span className="text-[11px] font-mono font-bold text-emerald-950 mt-2 uppercase tracking-wide">
                            Scan via Any Banking App
                          </span>
                        </div>

                        <div className="md:col-span-8 space-y-2.5">
                          <div className="p-3 bg-white border border-zinc-200 rounded-xs flex items-center justify-between">
                            <div>
                              <p className="text-[11px] text-zinc-500 font-bold uppercase">RBB Current Account Number</p>
                              <p className="font-mono font-black text-zinc-950 text-xl sm:text-2xl mt-0.5">
                                1340100028491001
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('1340100028491001', 'bank')}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded text-xs font-bold text-emerald-900 flex items-center gap-1.5 cursor-pointer transition"
                            >
                              {copiedText === 'bank' ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                              <span>{copiedText === 'bank' ? 'Copied' : 'Copy A/C'}</span>
                            </button>
                          </div>

                          <div className="p-3 bg-white border border-zinc-200 rounded-xs">
                            <p className="text-[11px] text-zinc-500 font-bold uppercase">Account Name</p>
                            <p className="font-bold text-zinc-950 text-sm mt-0.5">Hazaridevi Duck Farm</p>
                          </div>

                          <div className="p-3 bg-white border border-zinc-200 rounded-xs">
                            <p className="text-[11px] text-zinc-500 font-bold uppercase">Designated Branch & Code</p>
                            <p className="font-medium text-zinc-900 text-xs sm:text-sm mt-0.5">
                              Lahan Branch, Siraha (Branch Code: 134)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xs text-xs text-amber-950 leading-relaxed font-medium">
                        💡 <strong>भुक्तानी प्रक्रिया:</strong> मोबाइल बैंकिङ वा ConnectIPS बाट रकम ट्रान्सफर गरी कारोबार भौचर वा Reference ID तल प्रविष्ट गर्नुहोस्।
                      </div>
                    </div>
                  )}
                </div>

                {/* TRANSACTION ID INPUT & CONFIRM BUTTON */}
                <form onSubmit={handleFinalPaymentConfirm} className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                      {lang === 'ne' ? 'ट्रान्ज्याक्सन आइडी / भौचर नम्बर (ऐच्छिक)' : 'Transaction ID / Reference Number (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value)}
                      placeholder={lang === 'ne' ? 'उदा. 9807760832-TXN वा भौचर नम्बर' : 'e.g. 7839201948 or Voucher Ref'}
                      className="w-full px-4 py-3.5 text-sm sm:text-base font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  {orderError && (
                    <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-300 text-red-800 px-3 py-2.5 text-sm font-semibold rounded-xs">
                      <AlertCircle size={17} className="shrink-0 mt-0.5" />
                      <span>{orderError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full py-4.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-wait active:scale-[0.99] text-zinc-950 font-black text-sm sm:text-base uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {placingOrder ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    <span>
                      {lang === 'ne'
                        ? 'भुक्तानी पुष्टि तथा अर्डर फाइनल गर्नुहोस्'
                        : 'CONFIRM PAYMENT & FINALIZE DISPATCH'}
                    </span>
                  </button>
                </form>

              </div>
            )}
          </div>
        </div>
      )}

      </div>

      {/* ORDER SUMMARY SIDEBAR */}
      {!orderFinalized && (
        <aside className="lg:sticky lg:top-28 border border-emerald-900/20 bg-white shadow-sm text-left rounded-xs overflow-hidden">
          <div className="bg-[#1a3a2a] px-6 py-5 border-b-2 border-amber-500 flex items-center gap-2 text-white">
            <ShoppingBag size={17} className="text-amber-400" />
            <h3 className="font-serif font-black text-xl">{lang === 'ne' ? 'अर्डर सारांश' : 'Order Summary'}</h3>
          </div>

          <div className="p-6 space-y-5">
            {rawItems.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">
                {lang === 'ne' ? 'कार्ट खाली छ।' : 'Your cart is empty.'}
              </p>
            ) : (
              <ul className="divide-y divide-zinc-200">
                {rawItems.map((item: any) => {
                  const q = item.qty ?? item.quantity ?? 1;
                  return (
                    <li key={item.id} className="py-3.5 flex items-start justify-between gap-3 text-base">
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-900 leading-snug">
                          {lang === 'ne' ? (item.nameNe || item.titleNe || item.nameEn) : (item.nameEn || item.titleEn)}
                        </p>
                        <p className="text-sm font-mono text-zinc-500 mt-0.5">
                          {q} × Rs. {(item.price ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-zinc-900 shrink-0">Rs. {((item.price ?? 0) * q).toLocaleString()}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex items-center justify-between border-t-2 border-zinc-900 pt-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
                {lang === 'ne' ? 'जम्मा' : 'Total'}
              </span>
              <span className="text-3xl font-black font-mono text-emerald-950">Rs. {totalAmount.toLocaleString()}</span>
            </div>

            {step >= 2 && (fullName || selectedMunicipality || busCounter) && (
              <div className="border-t border-zinc-200 pt-4 text-sm space-y-1 text-zinc-700">
                <p className="font-bold uppercase tracking-wider text-zinc-500">{lang === 'ne' ? 'डेलिभरी' : 'Deliver to'}</p>
                {fullName && <p className="font-semibold text-zinc-900">{fullName}</p>}
                {phoneNumber && <p className="font-mono">{phoneNumber}</p>}
                <p>{[busCounter, selectedMunicipality, currentDistrict?.nameEn, currentProvince?.nameEn].filter(Boolean).join(', ')}</p>
              </div>
            )}

            <div className="flex items-start gap-2 bg-emerald-50/70 border-l-4 border-emerald-600 px-4 py-3 text-sm text-zinc-700">
              <Truck size={15} className="text-emerald-800 shrink-0 mt-0.5" />
              <span>
                {lang === 'ne'
                  ? 'दैनिक रात्री बसमार्फत ७ वटै प्रदेशमा सुरक्षित ढुवानी।'
                  : 'Daily night-bus dispatch to all 7 provinces.'}
              </span>
            </div>
          </div>
        </aside>
      )}
      </div>

    </div>
  );
};
