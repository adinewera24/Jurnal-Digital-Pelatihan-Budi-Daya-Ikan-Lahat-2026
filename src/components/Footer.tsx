import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-10 bg-slate-100 border-t border-slate-200 mt-auto z-10 relative">
      <div className="max-w-[1280px] mx-auto px-[10px] flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand / Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <span className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span className="text-xl">🌊</span>
            Jurnal Digital Lahat
          </span>
          <span className="text-xs text-slate-500 font-medium">
            © 2026 Jurnal Digital Pelatihan Budi Daya Ikan Lahat. Seluruh Hak Cipta Dilindungi.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors"
          >
            Kontak Kami
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors"
          >
            Kebijakan Privasi
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors"
          >
            Mitra Strategis
          </a>
        </div>
      </div>
    </footer>
  );
}
