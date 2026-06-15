import React, { useState } from 'react';
import { Shield, ArrowRight, Home, Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (username: string) => void;
  onClose: () => void;
}

export default function LoginView({ onLoginSuccess, onClose }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username dan kata sandi wajib diisi!');
      return;
    }

    setIsLoading(true);

    // Simulate validation
    setTimeout(() => {
      setIsLoading(false);
      const isCorrectUser = username.toLowerCase() === 'admin' || username.toLowerCase() === 'eo@lahat.go.id';
      const isCorrectPass = password === 'admin123';

      if (isCorrectUser && isCorrectPass) {
        onLoginSuccess('EO Lahat Admin');
      } else {
        setErrorMsg('Kredensial salah! Harap periksa kembali pengisian Anda.');
      }
    }, 1000);
  };

  return (
    <div className="min-y-[80vh] flex items-center justify-center py-12 px-4 relative z-10 animate-fadeIn">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 fish-scale-pattern z-0 opacity-15 pointer-events-none"></div>

      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-900 via-indigo-700 to-teal-500"></div>

        {/* Head Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto shadow-sm border border-blue-100">
            <Shield className="w-6 h-6 text-blue-900" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight leading-none">Login EO</h1>
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Jurnal Digital Pelatihan Lahat 2026
            </p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            Halaman ini khusus untuk pengurus/EO mengakses Laporan Keuangan terproteksi.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm text-left">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Username atau Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Contoh: admin atau eo@lahat.go.id"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Tips Testing box */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/50 space-y-1 text-left">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Kredensial Akses Pengujian:</span>
            <div className="text-[11px] text-slate-600 font-medium">
              Username: <code className="bg-emerald-100 px-1 py-0.5 rounded font-bold">admin</code><br />
              Kata Sandi: <code className="bg-emerald-100 px-1 py-0.5 rounded font-bold">admin123</code>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-950 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/10 disabled:opacity-50"
          >
            <span>{isLoading ? 'Memvalidasi Sesi...' : 'Masuk ke Laporan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Back Link */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors flex items-center gap-1.5 mx-auto"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Kembali ke Beranda Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
}
