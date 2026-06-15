import React, { useState, useEffect } from 'react';
import { 
  Settings, ArrowLeft, Plus, Trash2, Check, Upload, RotateCcw, Save, Image as ImageIcon 
} from 'lucide-react';

interface BrandViewProps {
  onGoBack: () => void;
}

interface HeaderLogo {
  id: string;
  url: string;
  name: string;
  isActive: boolean;
  width: number;
}

export default function BrandView({ onGoBack }: BrandViewProps) {
  // Brand title and subtitle states
  const [agencyTitle, setAgencyTitle] = useState<string>(() => {
    return localStorage.getItem('instansi_title_v2') || 'Dinas Perikanan';
  });

  const [agencySubtitle, setAgencySubtitle] = useState<string>(() => {
    return localStorage.getItem('instansi_subtitle_v2') || 'Kabupaten Lahat, Sumsel';
  });

  // Logo lists
  const [logos, setLogos] = useState<HeaderLogo[]>(() => {
    const stored = localStorage.getItem('instansi_logos_v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          let mapped = parsed.map(logo => {
            if (logo.id === 'default-lahat') {
              return {
                ...logo,
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Lambang_Kabupaten_Lahat.png/240px-Lambang_Kabupaten_Lahat.png'
              };
            }
            return logo;
          });

          // Enforce exactly one active logo
          const firstActiveIndex = mapped.findIndex(l => l.isActive);
          if (firstActiveIndex !== -1) {
            mapped = mapped.map((l, idx) => ({ ...l, isActive: idx === firstActiveIndex }));
          } else if (mapped.length > 0) {
            mapped[0].isActive = true;
          }
          return mapped;
        }
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'default-lahat',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Lambang_Kabupaten_Lahat.png/240px-Lambang_Kabupaten_Lahat.png',
        name: 'Lambang Kabupaten Lahat',
        isActive: true,
        width: 38
      }
    ];
  });

  // Track failed logo loads
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  // Local temp states for forms
  const [tempTitle, setTempTitle] = useState(agencyTitle);
  const [tempSubtitle, setTempSubtitle] = useState(agencySubtitle);
  const [tempLogos, setTempLogos] = useState<HeaderLogo[]>([]);

  // New logo creation states
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [useUploadMethod, setUseUploadMethod] = useState(true);

  // Applet feedback/errors and confirmation helper states
  const [brandError, setBrandError] = useState<string | null>(null);
  const [brandSuccess, setBrandSuccess] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Initialize tempLogos on load
  useEffect(() => {
    setTempLogos([...logos]);
  }, [logos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandError(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Logos are displayed small (38px-70px), so max-size of 400px is perfect
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress logo as lightweight PNG/JPEG (0.75 quality)
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.75);
            setNewLogoUrl(compressedUrl);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLogoLocal = () => {
    setBrandError(null);
    setBrandSuccess(null);
    if (!newLogoName.trim()) {
      setBrandError('Tulis nama/label bagi logo baru ini terlebih dahulu!');
      return;
    }
    if (!newLogoUrl.trim()) {
      setBrandError('Silakan pilih berkas gambar atau masukkan URL logo terlebih dahulu!');
      return;
    }

    // Set other logos as inactive since only one logo can be active at a time
    const updatedTemp = tempLogos.map(l => ({ ...l, isActive: false }));

    const item: HeaderLogo = {
      id: `logo-custom-${Date.now()}`,
      url: newLogoUrl,
      name: newLogoName.trim(),
      isActive: true,
      width: 38
    };

    setTempLogos([...updatedTemp, item]);
    setNewLogoName('');
    setNewLogoUrl('');
    setBrandError(null);
    setBrandSuccess('Logo berhasil ditambahkan ke daftar pratinjau. Klik "Simpan Perubahan" di bawah untuk memproses secara permanen.');
  };

  const handleToggleLogoActive = (id: string) => {
    setTempLogos(prev => prev.map(l => {
      return {
        ...l,
        isActive: l.id === id
      };
    }));
  };

  const handleWidthChange = (id: string, width: number) => {
    setTempLogos(prev => prev.map(l => l.id === id ? { ...l, width } : l));
  };

  const handleDeleteLogo = (id: string) => {
    setTempLogos(prev => {
      const filtered = prev.filter(l => l.id !== id);
      const deletedLogo = prev.find(l => l.id === id);
      if (deletedLogo?.isActive && filtered.length > 0) {
        const fallbackLogo = filtered.find(l => l.id === 'default-lahat') || filtered[0];
        if (fallbackLogo) {
          fallbackLogo.isActive = true;
        }
      }
      return filtered;
    });
  };

  const handleSaveChangesAll = () => {
    setBrandError(null);
    setBrandSuccess(null);
    if (!tempTitle.trim()) {
      setBrandError('Nama instansi tidak boleh dibiarkan kosong.');
      return;
    }

    // Save to states and localStorage
    setLogos(tempLogos);
    setAgencyTitle(tempTitle.trim());
    setAgencySubtitle(tempSubtitle.trim());
    setFailedLogos({});

    localStorage.setItem('instansi_logos_v2', JSON.stringify(tempLogos));
    localStorage.setItem('instansi_title_v2', tempTitle.trim());
    localStorage.setItem('instansi_subtitle_v2', tempSubtitle.trim());

    setBrandSuccess('Semua perubahan brand dan logo telah berhasil disimpan secara permanen!');
    
    // Auto navigation back after short delay for user friendly feedback
    setTimeout(() => {
      onGoBack();
    }, 1500);
  };

  const handleResetToDefaultAll = () => {
    const defaultLogos = [
      {
        id: 'default-lahat',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Lambang_Kabupaten_Lahat.png/240px-Lambang_Kabupaten_Lahat.png',
        name: 'Lambang Kabupaten Lahat',
        isActive: true,
        width: 38
      }
    ];

    setLogos(defaultLogos);
    setAgencyTitle('Dinas Perikanan');
    setAgencySubtitle('Kabupaten Lahat, Sumsel');
    setFailedLogos({});

    localStorage.setItem('instansi_logos_v2', JSON.stringify(defaultLogos));
    localStorage.setItem('instansi_title_v2', 'Dinas Perikanan');
    localStorage.setItem('instansi_subtitle_v2', 'Kabupaten Lahat, Sumsel');

    setTempLogos(defaultLogos);
    setTempTitle('Dinas Perikanan');
    setTempSubtitle('Kabupaten Lahat, Sumsel');
    setShowConfirmReset(false);
    setBrandSuccess('Layanan brand dan logo telah berhasil direset kembali ke setelan default asli!');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6 animate-fadeIn text-left">
      {/* Header Page Title */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-blue-50 text-blue-900 rounded-2xl shadow-sm">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-blue-900">Kelola Brand & Logo Instansi</h1>
            <p className="text-xs text-slate-500 font-medium">Ubah logo aktif, label nama instansi, dan kustomisasi lainnya secara dinamis</p>
          </div>
        </div>
        
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {brandError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 animate-fadeIn">
          <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="leading-tight">
            <p className="text-xs font-bold text-red-900">Validasi Gagal</p>
            <p className="text-[11px] text-red-700/90 font-medium">{brandError}</p>
          </div>
        </div>
      )}

      {brandSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 animate-fadeIn">
          <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div className="leading-tight">
            <p className="text-xs font-bold text-emerald-900">Tindakan Berhasil</p>
            <p className="text-[11px] text-emerald-700/90 font-medium">{brandSuccess}</p>
          </div>
        </div>
      )}

      {/* Section A: Text Instansi */}
      <section className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
          A. Ubah Teks Label Instansi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Instansi / Bidang</label>
            <input 
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              placeholder="Contoh: Dinas Perikanan"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Kabupaten / Provinsi / Subtitle</label>
            <input 
              type="text"
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
              placeholder="Contoh: Kabupaten Lahat, Sumsel"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 font-medium"
            />
          </div>
        </div>
      </section>

      {/* Section B: Daftar Logo */}
      <section className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            B. Daftar Logo Terpasang ({tempLogos.length})
          </h3>
          <span className="text-[10px] text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded-full shadow-sm border border-blue-100">
            Maksimal 1 logo aktif saja
          </span>
        </div>

        {tempLogos.length === 0 ? (
          <p className="text-xs italic text-slate-400 py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            Belum ada logo terpasang. Sila tambahkan logo di bawah ini.
          </p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {tempLogos.map((lg) => {
              const isDefault = lg.id === 'default-lahat';
              return (
                <div 
                  key={lg.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white border border-slate-250 hover:shadow-md transition-all gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-sm">
                      {failedLogos[lg.id] ? (
                        <div className="w-full h-full bg-slate-50 text-[10px] text-slate-400 font-bold flex items-center justify-center text-center leading-none p-0.5">
                          Gagal
                        </div>
                      ) : (
                        <img 
                          src={lg.url} 
                          alt={lg.name} 
                          className="max-h-full max-w-full object-contain" 
                          referrerPolicy="no-referrer" 
                          onError={() => setFailedLogos(prev => ({ ...prev, [lg.id]: true }))}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate max-w-[250px]">{lg.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono max-w-[250px] truncate">
                        {lg.url}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end flex-wrap">
                    {/* Width Slider */}
                    <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 shrink-0">
                      <span className="text-[10px] font-bold text-slate-500">Lebar:</span>
                      <input 
                        type="range" 
                        min="20" 
                        max="70" 
                        value={lg.width}
                        onChange={(e) => handleWidthChange(lg.id, parseInt(e.target.value))}
                        className="w-20 h-1 bg-slate-200 rounded-lg cursor-pointer accent-blue-950"
                      />
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 rounded-md">
                        {lg.width}px
                      </span>
                    </div>

                    {/* Active Logo Selector Radio Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLogoActive(lg.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        lg.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-sm' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                      title={lg.isActive ? "Logo Sedang Aktif" : "Aktifkan Logo Ini"}
                    >
                      {lg.isActive ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                          <span>Gunakan</span>
                        </>
                      )}
                    </button>

                    {/* Delete button option */}
                    <button
                      type="button"
                      onClick={() => handleDeleteLogo(lg.id)}
                      disabled={isDefault}
                      className={`p-2 rounded-xl border transition-all ${
                        isDefault 
                          ? 'text-slate-200 border-slate-100 cursor-not-allowed bg-slate-50' 
                          : 'text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200'
                      }`}
                      title={isDefault ? "Logo bawaan Lahat tidak dapat dihapus" : "Hapus Logo ini"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section C: Unggah / Tambah Logo Baru */}
      <section className="p-5 border border-slate-100 rounded-2xl bg-indigo-50/15 space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-700" /> C. Tambah & Pasang Logo Baru
        </h3>

        <div className="flex gap-4 border-b border-indigo-100/40 pb-2">
          <button 
            type="button"
            onClick={() => { setUseUploadMethod(true); setNewLogoUrl(''); }}
            className={`text-xs font-bold pb-1.5 border-b-2 transition-all ${useUploadMethod ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Unggah Berkas Gambar Anda
          </button>
          <button 
            type="button"
            onClick={() => { setUseUploadMethod(false); setNewLogoUrl(''); }}
            className={`text-xs font-bold pb-1.5 border-b-2 transition-all ${!useUploadMethod ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Tempel Link Gambar (URL)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama / Label Logo</label>
            <input 
              type="text"
              placeholder="Contoh: Logo Dinas Perikanan"
              value={newLogoName}
              onChange={(e) => setNewLogoName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 font-semibold"
            />
          </div>

          <div>
            {useUploadMethod ? (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Pilih Berkas Gambar (PNG/JPG)</label>
                <label className="flex items-center justify-center border border-dashed border-indigo-300 rounded-xl p-3 bg-white cursor-pointer hover:bg-slate-50 transition-all text-center">
                  <Upload className="w-4 h-4 mr-1.5 text-indigo-600 shrink-0" />
                  <span className="text-xs text-slate-500 truncate max-w-[180px] font-semibold">
                    {newLogoUrl ? 'Gambar Terpilih!' : 'Pilih Berkas Komputer...'}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Masukkan Link / URL Gambar</label>
                <input 
                  type="text"
                  placeholder="https://example.com/logo.png"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 font-mono font-medium"
                />
              </div>
            )}
          </div>
        </div>

        {/* Local Preview Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/30">
          <div className="flex items-center gap-2.5 min-h-[40px]">
            {newLogoUrl ? (
              <>
                <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-wider">Pratinjau Logo:</span>
                <div className="w-10 h-10 rounded-lg border border-indigo-100 p-1 overflow-hidden flex items-center justify-center bg-white shadow-sm shrink-0">
                  <img 
                    src={newLogoUrl} 
                    alt="Logo preview" 
                    className="max-h-full max-w-full object-containScale" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </>
            ) : (
              <span className="text-[10px] text-slate-400 italic font-semibold">Unggah berkas atau tempel URL untuk dapat mempratinjau logo Anda</span>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleAddLogoLocal}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambahkan ke Daftar
          </button>
        </div>
      </section>

      {/* Save / Reset Actions Row */}
      <footer className="pt-4 border-t border-slate-100">
        {showConfirmReset ? (
          <div className="p-4 bg-red-50 border border-red-150 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn">
            <div className="text-left space-y-0.5">
              <span className="text-xs font-bold text-red-900 block">Apakah Anda benar-benar yakin ingin mereset data?</span>
              <span className="text-[10px] text-red-600 font-semibold">Tindakan ini akan mengembalikan semua logo kustom dan nama label instansi ke bawaan asli Dinas Perikanan Kabupaten Lahat, Sumsel.</span>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-all active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetToDefaultAll}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 font-bold px-4 py-2.5 rounded-xl transition-all active:scale-[0.97]"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Setelan Default
            </button>

            <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onGoBack}
                className="w-1/2 sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all active:scale-[0.97]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveChangesAll}
                className="w-1/2 sm:w-auto bg-blue-900 hover:bg-blue-955 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-950/10 flex items-center justify-center gap-1.5 active:scale-[0.97]"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
