import React, { useState } from 'react';
import { FileText, ShieldCheck, ExternalLink, ArrowLeft, Eye, X } from 'lucide-react';
import { useLang } from './LanguageContext';

interface LegalDocumentsProps {
  onBack?: () => void;
}

interface DocItem {
  id: string;
  title: string;
  authority: string;
  verified: boolean;
  fileUrl: string;
}

export const LegalDocuments: React.FC<LegalDocumentsProps> = ({ onBack }) => {
  const { lang } = useLang();
  const [activeDoc, setActiveDoc] = useState<DocItem | null>(null);

  const documents: DocItem[] = [
    {
      id: 'pan-cert',
      title: lang === 'ne' ? 'स्थायी लेखा नम्बर (PAN दर्ता प्रमाणपत्र)' : 'Tax Registration (PAN Certificate)',
      authority: lang === 'ne' ? 'आन्तरिक राजस्व कार्यालय लहान (PAN: ६१४०९००००)' : 'Inland Revenue Dept Lahan (PAN: 614090000)',
      verified: true,
      fileUrl: '/574f9949-2af4-4cd8-a80a-461ef21c8013.jpeg'
    },
    {
      id: 'reg-cert',
      title: lang === 'ne' ? 'फार्म व्यवसाय दर्ता प्रमाणपत्र' : 'Farm Business Registration Certificate',
      authority: lang === 'ne' ? 'नेपाल सरकार / स्थानीय सरकार (उद्योग कार्यालय)' : 'Government of Nepal / Local Government',
      verified: true,
      fileUrl: '/fd632b40-adc1-4341-ab75-342d1a23a06e.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 font-sans text-zinc-900 border-b border-zinc-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider bg-white border border-zinc-300 px-4 py-2 hover:bg-zinc-100 hover:border-zinc-900 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ne' ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'}</span>
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-zinc-800 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <ShieldCheck size={13} className="text-amber-500" />
            <span>OFFICIAL COMPLIANCE & LEGAL RECORDS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight">
            {lang === 'ne' ? 'फार्मका कानुनी कागजात तथा प्रमाणपत्रहरू' : 'Farm Legal Documents & Certifications'}
          </h1>

          <p className="text-xs sm:text-sm font-serif text-zinc-600 font-light leading-relaxed">
            {lang === 'ne' 
              ? 'हाम्रो फार्म नेपाल सरकारका सम्पूर्ण पशुपन्छी मापदण्ड र कर कानुन अनुसार पूर्ण रूपमा दर्ता र प्रमाणित छ।'
              : 'Our farm is fully registered and complies with all local livestock and tax regulations.'}
          </p>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-2"></div>
        </div>

        {/* 2 Verified Document Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border-2 border-zinc-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="w-11 h-11 bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900">
                  <FileText size={22} className="text-amber-600" />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-zinc-900 text-base leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs font-serif text-zinc-500 mt-1 font-light leading-relaxed">
                    {doc.authority}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-900">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>{lang === 'ne' ? 'प्रमाणित (Verified)' : 'Verified & Active'}</span>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveDoc(doc)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 hover:text-amber-800 cursor-pointer uppercase tracking-wider"
                  >
                    <Eye size={13} />
                    <span>{lang === 'ne' ? 'हेर्नुहोस्' : 'View'}</span>
                  </button>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-zinc-600 hover:text-zinc-900 uppercase tracking-wider"
                  >
                    <span>Tab</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full Document Image Modal */}
      {activeDoc && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveDoc(null)}
        >
          <div 
            className="bg-white border-2 border-[#18181b] max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 text-left">
              <div>
                <h3 className="font-serif font-bold text-zinc-900 text-sm md:text-base">
                  {activeDoc.title}
                </h3>
                <p className="text-xs font-serif text-zinc-500 font-light">{activeDoc.authority}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="p-1.5 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1 flex justify-center bg-zinc-100">
              <img
                src={activeDoc.fileUrl}
                alt={activeDoc.title}
                className="max-w-full h-auto max-h-[70vh] object-contain shadow-md border border-zinc-300"
              />
            </div>

            <div className="p-3 bg-[#18181b] border-t border-zinc-800 text-center text-xs font-mono text-zinc-300">
              <span><strong className="text-amber-400">प्रमाणित:</strong> {activeDoc.authority}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};