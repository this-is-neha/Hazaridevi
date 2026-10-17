import React, { useState, useEffect } from 'react';
import { useLang } from './LanguageContext';
import { ExternalLink, CheckCircle2, ShieldCheck, Video, Phone } from 'lucide-react';

export interface VideoData {
  videoUrl: string;
  recordId: string;
  titleEn: string;
  titleNe: string;
  descEn: string;
  descNe: string;
  badge1: string;
  badge2: string;
}

export const DEFAULT_VIDEOS: Record<'ducklings' | 'hatchery' | 'breeders', VideoData> = {
  ducklings: {
    videoUrl: '/farm-video.mp4',
    recordId: 'RECORD ID: KHAKI-01 • CERTIFIED AGRO FLOCK',
    titleEn: 'Original Khaki Campbell (300+ Annual Layers)',
    titleNe: 'वार्षिक ३००+ अण्डा दिने ओरिजिनल खाकी क्याम्पबेल',
    descEn: 'Healthy and active baby chicks from our farm, delivered safely across all 7 provinces by night bus.',
    descNe: 'हाम्रो फार्मका स्वस्थ र फुर्तिला हाँसका चल्लाहरू, रात्रि बसमार्फत ७ वटै प्रदेशमा सुरक्षित रूपमा पुर्‍याइन्छ।',
    badge1: '100% Vaccinated',
    badge2: 'Live Arrival Safety'
  },
  hatchery: {
    videoUrl: '/eggs-hatchery.mp4',
    recordId: 'RECORD ID: INCUB-02 • MODERN INCUBATION',
    titleEn: 'Automatic Egg Incubators & High Hatch Rate',
    titleNe: 'डिजिटल इन्क्युबेटर तथा ८५%+ फर्टिलिटी अण्डा',
    descEn: 'Modern temperature-controlled machines producing strong, healthy ducklings with high success rate.',
    descNe: 'निश्चित तापक्रम र आर्द्रतामा कोरलिएका उच्च गुणस्तरका अण्डा। साना तथा ठूला चल्ला उत्पादन केन्द्रका लागि उपयुक्त।',
    badge1: '85%+ Hatch Rate',
    badge2: 'Safe Crates'
  },
  breeders: {
    videoUrl: '/breeder-ducks.mp4',
    recordId: 'RECORD ID: BREED-03 • PARENT STOCK',
    titleEn: 'Healthy Parent Ducks & Fresh Farm Eggs',
    titleNe: 'अण्डा दिने वयस्क माउ हाँस र ताजा फार्म अण्डा',
    descEn: 'Strong breeder ducks raised naturally in open space, producing high quality fertile and table eggs daily.',
    descNe: 'प्राकृतिक वातावरणमा हुर्केका स्वस्थ माउ हाँसहरू। चल्ला कोरल्न तथा खानका लागि उच्च गुणस्तरका ताजा अण्डाहरू उपलब्ध।',
    badge1: 'Daily Fresh Eggs',
    badge2: 'Healthy Breed'
  }
};

// Helper to open IndexedDB
const getDB = (): Promise<IDBDatabase> => {
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

export const YouTubeVideos: React.FC = () => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<'ducklings' | 'hatchery' | 'breeders'>('ducklings');
  const [videosConfig, setVideosConfig] = useState(DEFAULT_VIDEOS);
  const [blobVideos, setBlobVideos] = useState<Record<string, string>>({});
  const [ytChannelUrl, setYtChannelUrl] = useState('https://youtube.com/@duckfarmnepal?si=gFA9yz8f1naqcyG5');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hz_media_videos');
      if (saved) setVideosConfig(JSON.parse(saved));
      const savedChannel = localStorage.getItem('hz_yt_channel');
      if (savedChannel) setYtChannelUrl(savedChannel);
    } catch (e) {
      console.error(e);
    }

    getDB().then((db) => {
      const tx = db.transaction('videos', 'readonly');
      const store = tx.objectStore('videos');
      (['ducklings', 'hatchery', 'breeders'] as const).forEach((key) => {
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result instanceof Blob) {
            const url = URL.createObjectURL(req.result);
            setBlobVideos((prev) => ({ ...prev, [key]: url }));
          }
        };
      });
    }).catch(() => {});
  }, []);

  const current = videosConfig[activeTab] || DEFAULT_VIDEOS[activeTab];
  const videoSource = blobVideos[activeTab] || current.videoUrl;

  return (
    <section className="py-16 bg-white text-zinc-900 border-t border-zinc-200 font-sans" id="videos-section">
      <div className="max-w-site mx-auto px-4 sm:px-6">
        
        {/* Simple & Clean Header */}
        <div className="mb-6 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#1a3a2a] text-amber-300 border border-emerald-800 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-widest mb-2 shadow-xs">
            <Video size={12} className="text-amber-400" />
            <span>{lang === 'ne' ? 'फार्मका प्रत्यक्ष भिडियोहरू' : 'REAL FARM VIDEOS'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
            {lang === 'ne' 
              ? 'फार्म तथा चल्ला उत्पादन केन्द्रका प्रत्यक्ष भिडियोहरू' 
              : 'Real Farm Videos & Hatchery Look'}
          </h2>
          <p className="text-xs sm:text-sm font-serif text-zinc-600 max-w-2xl mt-1 font-normal leading-relaxed">
            {lang === 'ne'
              ? 'हाम्रो सिराहा फार्मका वास्तविक भिडियोहरू: शुद्ध जातका खाकी क्याम्पबेल चल्ला, अण्डा कोरल्ने आधुनिक मेसिन र माउ हाँसहरू।'
              : 'Direct videos from our farm: Pure Khaki Campbell ducklings, modern egg hatching machines, and healthy parent ducks.'}
          </p>
        </div>

        {/* 3 Tabs + YouTube Channel Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-zinc-200 pb-4">
          
          {/* Left: 3 Video Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('ducklings')}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer border uppercase tracking-wider rounded-xs ${
                activeTab === 'ducklings'
                  ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-[#1a3a2a] hover:text-[#1a3a2a]'
              }`}
            >
              <span>🦆 {lang === 'ne' ? '१. चल्ला ब्याच' : '1. Ducklings Batch'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hatchery')}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer border uppercase tracking-wider rounded-xs ${
                activeTab === 'hatchery'
                  ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-[#1a3a2a] hover:text-[#1a3a2a]'
              }`}
            >
              <span>🥚 {lang === 'ne' ? '२. चल्ला उत्पादन केन्द्र' : '2. Hatching Incubator'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('breeders')}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer border uppercase tracking-wider rounded-xs ${
                activeTab === 'breeders'
                  ? 'bg-[#1a3a2a] text-amber-300 border-amber-500 shadow-sm'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-[#1a3a2a] hover:text-[#1a3a2a]'
              }`}
            >
              <span>🌾 {lang === 'ne' ? '३. माउ हाँस' : '3. Breeder Flock'}</span>
            </button>
          </div>

          {/* Right: YouTube Link */}
          <a
            href={ytChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 hover:border-red-600 text-zinc-800 hover:text-red-600 transition rounded-xs cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <svg className="w-4 h-4 fill-[#FF0000]" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>@duckfarmnepal</span>
            <ExternalLink size={12} className="text-zinc-400" />
          </a>
        </div>

        {/* Video Player Card (DEEP FOREST GREEN THEME) */}
        <div className="bg-[#1a3a2a] border-2 border-amber-600/80 p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-white">
          
          {/* Left: Video Frame */}
          <div className="md:col-span-6 flex justify-center">
            <div className={`relative w-full overflow-hidden shadow-2xl border-2 border-emerald-900 bg-black ${
              activeTab === 'ducklings' ? 'max-w-[310px] aspect-[9/16]' : 'aspect-video'
            }`}>
              <video
                key={activeTab + videoSource}
                src={videoSource}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML video.
              </video>
            </div>
          </div>

          {/* Right: Info per Tab */}
          <div className="md:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-amber-300 font-mono font-bold text-[11px] uppercase tracking-widest">
                {current.recordId}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-white leading-snug">
                {lang === 'ne' ? current.titleNe : current.titleEn}
              </h3>
              <p className="text-zinc-100 font-sans text-xs sm:text-sm leading-relaxed font-normal">
                {lang === 'ne' ? current.descNe : current.descEn}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono font-bold text-white">
              <div className="flex items-center gap-2 bg-[#12271c] border border-emerald-800 p-3 shadow-inner">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>{current.badge1}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#12271c] border border-emerald-800 p-3 shadow-inner">
                <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                <span>{current.badge2}</span>
              </div>
            </div>

            {/* Direct Farm Inquiry & Verification Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="tel:+9779807760832"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 transition shadow-md rounded-xs cursor-pointer"
              >
                <Phone size={14} />
                <span>{lang === 'ne' ? 'फार्म सोधपुछ: ९८०७७६०८३२' : 'Direct Inquiry: 9807760832'}</span>
              </a>

              <div className="inline-flex items-center gap-2 border border-emerald-700 bg-[#12271c] text-emerald-100 font-mono text-xs px-4 py-3.5 rounded-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
                <span>{lang === 'ne' ? 'प्रमाणित फार्म भिडियो' : 'Verified Batch Video'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};