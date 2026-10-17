import React, { useState } from 'react';
import { useLang } from './LanguageContext';
import { LazyImage } from './LazyImage';
import { Reveal } from './Reveal';
import { Camera, X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  exhibitNo: string;
  titleEn: string;
  titleNe: string;
  descEn: string;
  descNe: string;
  image: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    exhibitNo: 'PHOTO 01',
    titleEn: '1-Day-Old Khaki Campbell Chicks',
    titleNe: '१ दिने उन्नत जातका खैरो हाँसका चल्ला',
    descEn: 'Active and vaccinated baby chicks kept warm and healthy, ready for safe night bus delivery.',
    descNe: 'खोप लगाइएका स्वस्थ र फुर्तिला चल्लाहरू—न्यानो बाकसमा राखी रात्री बसबाट सुरक्षित पठाउन तयार।',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'g2',
    exhibitNo: 'PHOTO 02',
    titleEn: 'Growing Ducks (2 to 4 Weeks Old)',
    titleNe: 'हुर्कँदै गरेका हाँस (२ देखि ४ हप्ता)',
    descEn: 'Fed with fresh green Azolla feed and raised in open clean space so they grow strong and active.',
    descNe: 'पोषिलो हरियो अजोला दाना खाएर खुला ठाउँमा हुर्केका बलिया र फुर्तिला हाँसहरू।',
    image: 'https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'g3',
    exhibitNo: 'PHOTO 03',
    titleEn: 'Adult Parent Ducks & Egg Layers',
    titleNe: 'अण्डा दिने ठूला माउ हाँसहरू',
    descEn: 'Original high-yield parent ducks that lay 300+ eggs per year, cared for at our Siraha farm.',
    descNe: 'वर्षमा ३०० भन्दा बढी अण्डा दिने ओरिजिनल माउ हाँस, हाम्रो सिराहा फार्ममा पालिएका।',
    image: 'https://images.unsplash.com/photo-1459682687441-7761439a709d?auto=format&fit=crop&w=1200&q=85'
  }
];

export const Gallery: React.FC = () => {
  const { lang } = useLang();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <section className="py-14 bg-white text-zinc-900 font-sans" id="farm-gallery">
      <div className="max-w-site mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-zinc-800 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest shadow-2xs">
            <Camera size={13} className="text-amber-500 shrink-0" />
            <span>{lang === 'ne' ? 'फार्मका फोटोहरू' : 'REAL FARM PHOTOS'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            {lang === 'ne' ? 'हाम्रो फार्म र हाँसका तस्बिरहरू' : 'Photo Gallery of Our Farm & Ducks'}
          </h2>

          <p className="text-sm sm:text-base font-semibold text-zinc-700 leading-relaxed">
            {lang === 'ne'
              ? 'हाम्रो सिराहा फार्ममा हुर्केका साना चल्ला, हुर्कँदै गरेका हाँस र माउ हाँसका वास्तविक तस्बिरहरू।'
              : 'Real pictures of our healthy ducklings, growing chicks, and parent ducks directly from our Siraha farm.'}
          </p>

          <div className="w-12 h-1 bg-amber-500 mx-auto mt-2" />
        </div>

        {/* 3-Column Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <Reveal key={item.id} delay={index * 120} className="h-full">
            <div
              tabIndex={0}
              onClick={() => setSelectedImage(item)}
              className="border-2 border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer text-left"
            >
              <div>
                {/* Image Frame */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                  <LazyImage
                    src={item.image}
                    alt={lang === 'ne' ? item.titleNe : item.titleEn}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#18181b]/95 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-zinc-700 shadow-sm">
                    {lang === 'ne' ? (item.exhibitNo === 'PHOTO 01' ? 'फोटो ०१' : item.exhibitNo === 'PHOTO 02' ? 'फोटो ०२' : 'फोटो ०३') : item.exhibitNo}
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/90 text-zinc-900 shadow-lg">
                      <ZoomIn size={18} />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 leading-snug group-hover:text-amber-700 transition">
                    {lang === 'ne' ? item.titleNe : item.titleEn}
                  </h3>

                  <p className="text-sm font-medium text-zinc-700 leading-relaxed">
                    {lang === 'ne' ? item.descNe : item.descEn}
                  </p>
                </div>
              </div>

              {/* Card Footer Callout */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-zinc-200 text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider group-hover:text-amber-700 group-hover:underline">
                  {lang === 'ne' ? 'तस्बिर हेर्नुहोस् →' : 'Click to View Photo →'}
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white max-w-3xl w-full border-2 border-zinc-200 overflow-hidden shadow-2xl cursor-default text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#18181b] p-4 text-white flex items-center justify-between border-b-2 border-amber-600/80">
              <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                {lang === 'ne' 
                  ? `${selectedImage.exhibitNo === 'PHOTO 01' ? 'फोटो ०१' : selectedImage.exhibitNo === 'PHOTO 02' ? 'फोटो ०२' : 'फोटो ०३'} • ${selectedImage.titleNe}` 
                  : `${selectedImage.exhibitNo} • ${selectedImage.titleEn}`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] bg-black overflow-hidden flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt="Enlarged Farm Photo"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-5 bg-zinc-50 border-t border-zinc-200 space-y-1">
              <h4 className="font-bold text-base text-zinc-900">
                {lang === 'ne' ? selectedImage.titleNe : selectedImage.titleEn}
              </h4>
              <p className="text-sm font-medium text-zinc-700 leading-relaxed">
                {lang === 'ne' ? selectedImage.descNe : selectedImage.descEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};