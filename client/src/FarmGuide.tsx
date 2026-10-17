import React, { useState } from 'react';
import { TrendingUp, Calendar, CheckCircle2, BookOpen } from 'lucide-react';

export const BreakEvenGuideSection: React.FC = () => {
  const [lang, setLang] = useState<'ne' | 'en'>('ne');

  return (
    <div className="bg-white border border-zinc-200 shadow-sm rounded-xs p-6 md:p-8 max-w-4xl mx-auto my-6 text-left font-sans">
      
      {/* BREAK-EVEN GRAPH / BANNER IMAGE */}
      <div className="mb-8 border-2 border-zinc-300 rounded-xs overflow-hidden shadow-md bg-zinc-900">
        <img 
          src="/break-even-graph.jpeg" 
          alt="Break Even Point in Duck Farming & Guarantee" 
          className="w-full h-auto object-cover"
        />
        <div className="bg-[#1a3a2a] text-amber-400 py-2 px-4 text-xs font-mono uppercase tracking-wider font-bold border-t border-amber-600/60 flex items-center justify-between">
          <span>FIG. 2.0 — HAZARIDEVI DUCK FARM BREAK-EVEN & RISK-FREE ANALYSIS</span>
          <span className="text-white text-[10px]">9-Month Projection</span>
        </div>
      </div>

      {/* Header with Language Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-700 border border-amber-300 flex items-center justify-center rounded-xs">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-xs">
              {lang === 'ne' ? 'फार्म गाइड तथा आर्थिक विश्लेषण' : 'Farm Guide & Financial Analysis'}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 mt-1">
              {lang === 'ne' ? 'हाँसपालन व्यवसायको ब्रेक–इभेन पोइन्ट' : 'Duck Farming Break-Even Point'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLang(lang === 'ne' ? 'en' : 'ne')}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-mono text-xs font-bold uppercase border border-zinc-700 transition cursor-pointer rounded-xs shadow-xs"
        >
          {lang === 'ne' ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्'}
        </button>
      </div>

      {/* Content Body */}
      {lang === 'ne' ? (
        <div className="space-y-4 text-xs md:text-sm text-zinc-700 leading-relaxed font-sans">
          <p className="text-sm md:text-base text-zinc-900 font-medium leading-relaxed">
            हजारीदेवी डक फार्मको अनुमानअनुसार, हाँसपालन व्यवसाय सञ्चालन गरेको करिब <strong className="text-amber-700 font-bold">९ महिनामा</strong> ब्रेक–इभेन पोइन्ट (Break-Even Point) हासिल गर्न सकिन्छ। यस गणनामा हाँसका बच्चा खरिद गर्न गरिएको प्रारम्भिक लगानीका साथै दाना, औषधि, हेरचाह तथा अन्य सञ्चालन खर्चहरू पनि समावेश गरिएका छन्।
          </p>

          <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xs space-y-3">
            <h4 className="font-bold text-zinc-900 text-xs md:text-sm uppercase tracking-wide flex items-center gap-2 border-b border-zinc-200 pb-2 font-mono">
              <BookOpen size={16} className="text-amber-600" />
              <span>सरल भाषामा बुझौँ:</span>
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-zinc-700 font-normal">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">•</span>
                <span><strong className="text-zinc-900 font-bold">पहिलोदेखि आठौँ महिनासम्म:</strong> हाँसका बच्चा खरिद गर्न गरिएको प्रारम्भिक लगानीसहित दाना, औषधि, हेरचाह तथा अन्य खर्चहरू आम्दानीभन्दा बढी हुन सक्छन्।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">•</span>
                <span><strong className="text-zinc-900 font-bold">करिब नवौँ महिनामा:</strong> हाँसका बच्चा खरिद गर्न गरिएको सुरुवाती लगानी र अन्य सबै खर्च आम्दानीबाट उठ्ने अनुमान छ। यस अवस्थामा कुल आम्दानी र कुल खर्च बराबर हुन्छन्। यसलाई <strong className="text-amber-700 font-bold">ब्रेक–इभेन पोइन्ट</strong> भनिन्छ।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">•</span>
                <span><strong className="text-zinc-900 font-bold">नवौँ महिनापछि:</strong> प्रारम्भिक लगानीसहितका सबै खर्च उठिसकेपछि आम्दानी खर्चभन्दा बढी भएमा व्यवसायले नाफा कमाउन थाल्छ।</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xs flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-emerald-950 block font-bold text-xs uppercase font-mono">निष्कर्ष (Conclusion):</strong>
              <p className="text-xs md:text-sm text-emerald-900 font-medium">
                हाँसका बच्चा खरिद गर्न गरिएको प्रारम्भिक लगानीसमेत समावेश गर्दा, हजारीदेवी डक फार्मले करिब ९ महिनामा आफ्नो कुल लगानी तथा खर्च उठाउने लक्ष्य राखेको छ। त्यसपछि आम्दानी र खर्चको अवस्थाअनुसार व्यवसायबाट आकर्षक नाफा प्राप्त हुन सक्छ।
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs md:text-sm text-zinc-700 leading-relaxed font-sans">
          <p className="text-sm md:text-base text-zinc-900 font-medium leading-relaxed">
            According to Hazaridevi Duck Farm projections, the <strong className="text-amber-700 font-bold">Break-Even Point</strong> for commercial duck farming can be achieved in approximately <strong className="text-amber-700 font-bold">9 months</strong> of operation. This calculation includes initial investment in ducklings, feed, medication, labor, and operational overheads.
          </p>

          <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xs space-y-3">
            <h4 className="font-bold text-zinc-900 text-xs md:text-sm uppercase tracking-wide flex items-center gap-2 border-b border-zinc-200 pb-2 font-mono">
              <BookOpen size={16} className="text-amber-600" />
              <span>Key Timeline Breakdown:</span>
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-zinc-700 font-normal">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">•</span>
                <span><strong className="text-zinc-900 font-bold">Months 1 to 8:</strong> Initial investment, feed, and brooding expenses may exceed initial returns during the growth and startup phase.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">•</span>
                <span><strong className="text-zinc-900 font-bold">Around Month 9:</strong> All setup costs and recurring expenses are fully recovered through egg/meat sales. Total revenue equals total expenses, known as the <strong className="text-amber-700 font-bold">Break-Even Point</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-600">•</span>
                <span><strong className="text-zinc-900 font-bold">Post-Month 9:</strong> With initial capital fully recovered, subsequent revenues transition into net business profits.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xs flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-emerald-950 block font-bold text-xs uppercase font-mono">Summary:</strong>
              <p className="text-xs md:text-sm text-emerald-900 font-medium">
                Hazaridevi Duck Farm aims to cover all foundational investments within 9 months, opening up sustainable profit margins moving forward.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-3 border-t border-zinc-200 text-xs font-mono text-zinc-500 flex items-center gap-2">
        <Calendar size={13} className="text-amber-600" />
        <span>Published by Hazaridevi Duck Farm & Hatchery Facility Management</span>
      </div>
    </div>
  );
};