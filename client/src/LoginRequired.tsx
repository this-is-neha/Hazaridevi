import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Lock } from 'lucide-react';
import { useLang } from './LanguageContext';

interface LoginRequiredProps {
  /** What the visitor is trying to do, e.g. "place an order" */
  actionEn: string;
  actionNe: string;
  /** Called before navigating (used by modals to close themselves) */
  onNavigate?: () => void;
}

/** Shown in place of a form when the visitor is not logged in. Browsing and the cart stay open to everyone. */
export const LoginRequired: React.FC<LoginRequiredProps> = ({ actionEn, actionNe, onNavigate }) => {
  const { lang } = useLang();
  const location = useLocation();
  const from = location.pathname + location.search;

  return (
    <div className="p-8 sm:p-10 text-center space-y-5 font-sans">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
        <Lock size={30} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-serif font-black text-zinc-950">
          {lang === 'ne' ? 'कृपया पहिला लगइन गर्नुहोस्' : 'Please log in first'}
        </h3>
        <p className="text-sm text-zinc-700 max-w-md mx-auto leading-relaxed">
          {lang === 'ne'
            ? `${actionNe} का लागि लगइन आवश्यक छ। उत्पादन हेर्न र कार्टमा थप्न लगइन चाहिँदैन।`
            : `You need an account to ${actionEn}. Browsing products and filling your cart never needs a login, and your cart is kept safe.`}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/login"
          state={{ from }}
          onClick={onNavigate}
          className="inline-flex items-center justify-center gap-2 min-w-[180px] px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xs transition"
        >
          <LogIn size={16} />
          {lang === 'ne' ? 'लगइन' : 'Log in'}
        </Link>
        <Link
          to="/register"
          state={{ from }}
          onClick={onNavigate}
          className="inline-flex items-center justify-center gap-2 min-w-[180px] px-6 py-3.5 border-2 border-[#1a3a2a] text-[#1a3a2a] hover:bg-[#1a3a2a] hover:text-white font-black text-sm uppercase tracking-wider rounded-xs transition"
        >
          <UserPlus size={16} />
          {lang === 'ne' ? 'खाता खोल्नुहोस्' : 'Create account'}
        </Link>
      </div>
    </div>
  );
};
