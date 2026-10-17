import React, { useState } from 'react';
import { WHATSAPP_URL } from './config';
import { useLang } from './LanguageContext';
import { X, Upload, CheckCircle2, Phone, MapPin, Tag, Package, DollarSign, Calendar, FileText } from 'lucide-react';

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellProductModal: React.FC<SellProductModalProps> = ({
  isOpen,
  onClose
}) => {
  const { lang } = useLang();

  const [formData, setFormData] = useState({
    sellerName: '',
    phone: '',
    category: 'खाकी क्याम्पबेल हाँस / चल्ला',
    productName: '',
    ageOrWeight: '',
    quantity: '',
    rate: '',
    location: '',
    description: '',
    imagePreview: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'ne' ? 'फोटोको साइज ५MB भन्दा सानो हुनुपर्छ।' : 'Photo size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Phone Number Validation (Must start with 9 and be exactly 10 digits)
    const phoneRegex = /^9[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      alert(lang === 'ne' 
        ? 'कृपया १० अंकको सही मोबाइल नम्बर लेख्नुहोस् (९ बाट सुरु हुने)।' 
        : 'Please enter a valid 10-digit mobile number starting with 9.');
      return;
    }

    // Strict Seller Name Validation (Valid text check)
    const nameRegex = /^[a-zA-Z\u0900-\u097F\s]{3,}$/;
    if (!nameRegex.test(formData.sellerName.trim())) {
      alert(lang === 'ne' 
        ? 'कृपया मान्य र पूरा नाम लेख्नुहोस् (कमसेकम ३ अक्षर)।' 
        : 'Please enter a valid seller name (at least 3 characters).');
      return;
    }

    if (!formData.quantity.trim() || !formData.productName.trim() || !formData.location.trim() || !formData.rate.trim()) {
      alert(lang === 'ne' ? 'कृपया सबै अनिवार्य (*) क्षेत्रहरू सही रूपमा भर्नुहोस्।' : 'Please fill all required fields properly.');
      return;
    }

    setIsSubmitting(true);

    try {
      const existing = JSON.parse(localStorage.getItem('hz_farmer_listings') || '[]');
      const newListing = {
        id: 'LST-' + Date.now(),
        ...formData,
        sellerName: formData.sellerName.trim(),
        phone: formData.phone.trim(),
        productName: formData.productName.trim(),
        quantity: formData.quantity.trim(),
        rate: formData.rate.trim(),
        location: formData.location.trim(),
        status: 'Pending',
        date: new Date().toLocaleDateString()
      };
      const updatedListings = [newListing, ...existing];
      localStorage.setItem('hz_farmer_listings', JSON.stringify(updatedListings));
      
      // Dispatch storage event so Admin Dashboard triggers live notification instantly
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }

    const message = `🌾 *नयाँ उत्पादन बिक्री अनुरोध (Farmer Sell Request)* 🌾%0A%0A` +
      `👤 *किसान / बिक्रेता:* ${formData.sellerName}%0A` +
      `📞 *सम्पर्क नं:* ${formData.phone}%0A` +
      `📍 *स्थान / जिल्ला:* ${formData.location}%0A%0A` +
      `🏷️ *वर्ग (Category):* ${formData.category}%0A` +
      `📦 *उत्पादन:* ${formData.productName}%0A` +
      `⏳ *उमेर / तौल:* ${formData.ageOrWeight || 'उल्लेख छैन'}%0A` +
      `🔢 *परिमाण (Quantity):* ${formData.quantity}%0A` +
      `💰 *माग मूल्य (Rate):* रु. ${formData.rate}%0A` +
      `📝 *थप विवरण:* ${formData.description || 'छैन'}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
    }, 600);
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setFormData({
      sellerName: '',
      phone: '',
      category: 'खाकी क्याम्पबेल हाँस / चल्ला',
      productName: '',
      ageOrWeight: '',
      quantity: '',
      rate: '',
      location: '',
      description: '',
      imagePreview: ''
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      onClick={handleResetAndClose}
    >
      <div 
        className="relative bg-white w-full max-w-3xl rounded-md shadow-2xl border border-emerald-900/40 overflow-hidden text-zinc-900 my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#1a3a2a] px-6 py-5 text-white flex items-center justify-between border-b-2 border-amber-500">
          <div>
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest bg-[#12271c] border border-emerald-800 px-2.5 py-1 rounded-xs inline-block">
              {lang === 'ne' ? '🌾 किसान बजार • उत्पादन बेच्नुहोस्' : '🌾 FARMER MARKETPLACE • SELL PRODUCE'}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white mt-1.5 leading-tight">
              {lang === 'ne' ? 'आफ्नो हाँस, अण्डा वा कृषि उत्पादन बेच्नुहोस्' : 'Sell Your Ducks, Eggs & Farm Produce'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="text-zinc-300 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer transition shrink-0"
            aria-label="Close modal"
          >
            <X size={26} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {success ? (
            <div className="text-center py-12 space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={46} />
              </div>
              <h4 className="text-2xl font-black text-zinc-900">
                {lang === 'ne' ? 'विवरण सफलतापूर्वक दर्ता भयो!' : 'Listing Sent Successfully!'}
              </h4>
              <p className="text-base text-zinc-600 max-w-md mx-auto">
                {lang === 'ne'
                  ? 'तपाईंको उत्पादनको विवरण हाम्रो फार्म टिमलाई ह्वाट्सएपमा गइसकेको छ। हामी छिट्टै सम्पर्क गर्नेछौं।'
                  : 'Your product details have been submitted. Our team will review and contact you shortly.'}
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="bg-[#1a3a2a] hover:bg-[#12271c] text-white font-bold text-base px-8 py-3 rounded-xs cursor-pointer shadow-lg"
              >
                {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close Window'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left">
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-xs text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                {lang === 'ne'
                  ? '💡 स्थानीय किसान तथा ग्राहकहरूले आफ्ना हाँस, चल्ला, अण्डा वा कृषि उत्पादन यहाँबाट सिधै बेच्न सक्नुहुन्छ।'
                  : '💡 Local farmers and customers can list their ducks, eggs, or agro products for direct purchase.'}
              </div>

              {/* 1. Seller Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'तपाईंको नाम *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    placeholder={lang === 'ne' ? 'उदा: राम बहादुर कार्की' : 'e.g. Ram Bahadur'}
                    className="w-full border border-zinc-300 px-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'सम्पर्क फोन नम्बर (१० अंक) *' : 'Phone Number (10 digits) *'}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="98XXXXXXXX"
                      className="w-full border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'उत्पादनको वर्ग (Category) *' : 'Product Category *'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-zinc-300 px-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs bg-white cursor-pointer font-medium"
                  >
                    <option value="खाकी क्याम्पबेल हाँस / चल्ला">{lang === 'ne' ? '🦆 हाँस / चल्ला (Ducks / Chicks)' : '🦆 Ducks / Chicks'}</option>
                    <option value="ताजा / ह्याचिङ अण्डा">{lang === 'ne' ? '🥚 ताजा / ह्याचिङ अण्डा (Eggs)' : '🥚 Duck Eggs'}</option>
                    <option value="फार्मको ताजा माछा">{lang === 'ne' ? '🐟 ताजा माछा (Fresh Fish)' : '🐟 Farm Fish'}</option>
                    <option value="दाना / अजोला / घाँस">{lang === 'ne' ? '🌾 दाना / अजोला (Feed / Azolla)' : '🌾 Duck Feed / Azolla'}</option>
                    <option value="अन्य उत्पादन">{lang === 'ne' ? '📦 अन्य कृषि उत्पादन (Other)' : '📦 Other Produce'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'स्थान / जिल्ला / ठेगाना *' : 'Location / District *'}
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={lang === 'ne' ? 'उदा: लहान, सिराहा' : 'e.g. Lahan, Siraha'}
                      className="w-full border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Product Name & Age/Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'उत्पादनको नाम वा जात *' : 'Product / Breed Name *'}
                  </label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder={lang === 'ne' ? 'उदा: ओरिजिनल खाकी क्याम्पबेल' : 'e.g. Pure Khaki Campbell'}
                      className="w-full border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'उमेर वा तौल (वैकल्पिक)' : 'Age / Weight (Optional)'}
                  </label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="text"
                      value={formData.ageOrWeight}
                      onChange={(e) => setFormData({ ...formData, ageOrWeight: e.target.value })}
                      placeholder={lang === 'ne' ? 'उदा: १५ दिन / २.५ केजी' : 'e.g. 15 days / 2.5 kg'}
                      className="w-full border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Quantity & Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'परिमाण (Quantity) *' : 'Quantity / Stock *'}
                  </label>
                  <div className="relative">
                    <Package size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder={lang === 'ne' ? 'उदा: ५० वटा / १०० पिस' : 'e.g. 50 pcs / 100 eggs'}
                      className="w-full border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                    {lang === 'ne' ? 'प्रति दर मूल्य (Rate in NPR) *' : 'Rate / Price per unit *'}
                  </label>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      placeholder={lang === 'ne' ? 'उदा: ८०० प्रति गोटा' : 'e.g. 800 each'}
                      className="w-full border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Additional Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                  {lang === 'ne' ? 'थप विवरण / भ्याक्सिन आदि (वैकल्पिक)' : 'Additional Notes / Vaccines (Optional)'}
                </label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={lang === 'ne' ? 'उदा: सबै खोप लगाइएको, स्वास्थ्य राम्रो छ।' : 'e.g. Vaccinated, healthy condition.'}
                    className="w-full border border-zinc-300 pl-10 pr-3.5 py-2 text-sm sm:text-base focus:border-emerald-700 focus:outline-none rounded-xs resize-none"
                  />
                </div>
              </div>

              {/* 6. Product Image Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1">
                  {lang === 'ne' ? 'उत्पादनको तस्बिर (Photo) *' : 'Product Photo *'}
                </label>
                <div className="border-2 border-dashed border-zinc-300 hover:border-emerald-600 rounded-sm p-4 text-center transition cursor-pointer relative bg-zinc-50 hover:bg-emerald-50/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {formData.imagePreview ? (
                    <div className="flex items-center justify-center gap-4">
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded-sm border border-zinc-300 shadow-sm" 
                      />
                      <span className="text-sm text-emerald-800 font-bold">
                        {lang === 'ne' ? '✓ तस्बिर छनोट गरियो (फेर्न क्लिक गर्नुहोस्)' : '✓ Photo Selected (Click to change)'}
                      </span>
                    </div>
                  ) : (
                    <div className="py-2 space-y-1">
                      <Upload size={24} className="mx-auto text-zinc-400" />
                      <p className="text-xs sm:text-sm font-semibold text-zinc-700">
                        {lang === 'ne' ? 'यहाँ क्लिक गरी मोबाइल वा कम्प्युटरबाट फोटो राख्नुहोस्' : 'Click to upload photo from your device'}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-zinc-950 font-black text-sm sm:text-base uppercase tracking-wider py-3.5 rounded-xs transition shadow-lg cursor-pointer mt-2"
              >
                {isSubmitting 
                  ? (lang === 'ne' ? 'पठाउँदैछ...' : 'Submitting...') 
                  : (lang === 'ne' ? '📤 बिक्रीको लागि पठाउनुहोस्' : '📤 Submit for Sale')}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};