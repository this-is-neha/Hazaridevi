import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { Lock, User, AlertCircle, Loader2, X, ShieldCheck } from 'lucide-react';

interface Props {
  onSuccess: (token: string) => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({ onSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    window.location.hash = '';
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username: cleanUsername,
        password: cleanPassword
      });

      if (res.data?.success && res.data?.token) {
        localStorage.setItem('hz_admin_token', res.data.token);
        window.location.hash = '#admin';
        onSuccess(res.data.token);
      } else {
        setError(res.data?.message || 'Login failed! Invalid credentials.');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed! Please check your username and password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans"
      onClick={handleClose}
    >
      <div 
        className="bg-white max-w-sm w-full rounded-md border border-emerald-900/40 shadow-2xl overflow-hidden relative text-left transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Deep Forest Green */}
        <div className="bg-[#1a3a2a] p-5 text-white border-b-2 border-amber-500 relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-[#12271c] border border-emerald-800 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 mb-2 rounded-xs">
            <ShieldCheck size={12} className="text-amber-400" />
            <span>SECURE GATEWAY</span>
          </div>
          <h3 className="font-serif font-black text-white text-lg tracking-tight">Admin Portal Access</h3>
          <p className="text-xs text-zinc-100 mt-0.5 font-normal leading-relaxed">
            Authenticate to manage orders, products & bus dispatches.
          </p>
        </div>

        {/* Body Form */}
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-mono font-bold flex items-center gap-2 rounded-xs">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 rounded-xs text-xs sm:text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none font-mono transition"
                />
                <User size={14} className="absolute left-3 top-3.5 text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 rounded-xs text-xs sm:text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none font-mono transition"
                />
                <Lock size={14} className="absolute left-3 top-3.5 text-zinc-400" />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/2 py-2.5 border border-zinc-300 text-zinc-700 font-bold uppercase tracking-wider text-xs rounded-xs hover:bg-zinc-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-zinc-950 font-black uppercase tracking-wider text-xs rounded-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-60"
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                <span>Authorize</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};