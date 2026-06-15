import React, { useState, useEffect } from 'react';
import { 
  Menu, X, LogIn, LogOut, Wallet, Settings, 
  Plus, Trash2, Eye, EyeOff, Upload, RotateCcw, 
  Image as ImageIcon, Check, Save 
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
}

interface HeaderLogo {
  id: string;
  url: string;
  name: string;
  isActive: boolean;
  width: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onLogout,
  onOpenLogin,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Logo management states
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

          // Enforce exactly one active logo on load
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

  // Track logos that failed to load to prevent infinite retry loop
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const [agencyTitle, setAgencyTitle] = useState<string>(() => {
    return localStorage.getItem('instansi_title_v2') || 'Dinas Perikanan';
  });

  const [agencySubtitle, setAgencySubtitle] = useState<string>(() => {
    return localStorage.getItem('instansi_subtitle_v2') || 'Kabupaten Lahat, Sumsel';
  });

  // Modal control states
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [tempLogos, setTempLogos] = useState<HeaderLogo[]>([]);
  const [tempTitle, setTempTitle] = useState('');
  const [tempSubtitle, setTempSubtitle] = useState('');

  // New logo creation states
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [useUploadMethod, setUseUploadMethod] = useState(true);

  // Sandbox-friendly error/alert and confirm helper states
  const [brandError, setBrandError] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const saveLogos = (updated: HeaderLogo[]) => {
    setLogos(updated);
    // Crucial: Clear any previous failed logo flags so updated logos get a fresh attempt to render
    setFailedLogos({});
    localStorage.setItem('instansi_logos_v2', JSON.stringify(updated));
  };

  const saveAgencyInfo = (title: string, subtitle: string) => {
    setAgencyTitle(title);
    setAgencySubtitle(subtitle);
    localStorage.setItem('instansi_title_v2', title);
    localStorage.setItem('instansi_subtitle_v2', subtitle);
  };

  useEffect(() => {
    const storedLogos = localStorage.getItem('instansi_logos_v2');
    if (storedLogos) {
      try {
        const parsed = JSON.parse(storedLogos);
        if (Array.isArray(parsed)) {
          setLogos(parsed);
        }
      } catch (e) {}
    }
    setAgencyTitle(localStorage.getItem('instansi_title_v2') || 'Dinas Perikanan');
    setAgencySubtitle(localStorage.getItem('instansi_subtitle_v2') || 'Kabupaten Lahat, Sumsel');
  }, [activeTab]);

  const handleOpenLogoModal = () => {
    setActiveTab('brand');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setBrandError('Ukuran berkas terlalu besar! Maksimal adalah 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLogoLocal = () => {
    setBrandError(null);
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
  };

  const handleToggleLogoActive = (id: string) => {
    setTempLogos(prev => prev.map(l => {
      // Radio box style selection: activate the selected logo and deactivate all other logos
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
      // If the deleted logo was the active one, transfer active status to another remaining logo (e.g., default-lahat)
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
    if (!tempTitle.trim()) {
      setBrandError('Nama instansi tidak boleh dibiarkan kosong.');
      return;
    }
    saveLogos(tempLogos);
    saveAgencyInfo(tempTitle.trim(), tempSubtitle.trim());
    setIsLogoModalOpen(false);
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
    saveLogos(defaultLogos);
    saveAgencyInfo('Dinas Perikanan', 'Kabupaten Lahat, Sumsel');
    setTempLogos(defaultLogos);
    setShowConfirmReset(false);
    setIsLogoModalOpen(false);
  };

  const navigationLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'laporan', label: 'Laporan Harian' },
    { id: 'portofolio', label: 'Peserta' },
    { id: 'dokumen', label: 'Dokumen' },
    ...(!isLoggedIn ? [{ id: 'login', label: 'Login Admin' }] : []),
    ...(isLoggedIn ? [
      { id: 'logout', label: 'Keluar (Admin)' }
    ] : []),
  ];

  const logoList = Array.isArray(logos) ? logos : [];
  const activeLogos = logoList.filter(l => l.isActive);
  const activeLogosCount = activeLogos.length;

  return (
    <>
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/90 border-b border-slate-200/60 shadow-sm z-50 transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-[10px] h-16 flex justify-between items-center">
        
        {/* Brand Group */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('beranda')} 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            {activeLogosCount > 0 ? (
              <div className="flex items-center gap-1.5 shrink-0">
                {activeLogos.map((logo) => {
                  const hasFailed = failedLogos[logo.id];
                  
                  if (hasFailed) {
                    // Render beautiful fallback icon instead of broken img
                    return (
                      <div 
                        key={logo.id}
                        className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg flex items-center justify-center font-bold px-2 py-1 gap-1 text-[11px]"
                        style={{ height: `${logo.width || 38}px` }}
                        title={`${logo.name} (Gagal memuat)`}
                      >
                        <svg className="w-4 h-4 text-blue-800 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12c0-3.3-2-6-4.5-6s-4.5 2.7-4.5 6 2 6 4.5 6 4.5-2.7 4.5-6Z" />
                          <path d="M13 12c0-3.3-2-6-4.5-6S4 8.7 4 12s2 6 4.5 6 4.5-2.7 4.5-6Z" />
                          <path d="M4 12c0-3.3-1-6-2.5-6" />
                        </svg>
                        <span className="text-[10px] hidden sm:inline text-blue-900 font-extrabold font-sans">Lahat</span>
                      </div>
                    );
                  }

                  return (
                    <img 
                      key={logo.id}
                      src={logo.url} 
                      alt={logo.name} 
                      style={{ height: `${logo.width || 38}px` }}
                      className="w-auto object-contain shrink-0 transition-all duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        // Double protection against infinite error trigger
                        setFailedLogos(prev => ({ ...prev, [logo.id]: true }));
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                <ImageIcon className="w-4 h-4" />
              </div>
            )}
            
            <div className="leading-tight">
              <span className="font-bold text-blue-900 text-[13px] sm:text-base tracking-tight block max-w-[135px] sm:max-w-none hover:text-blue-800 transition-colors">
                {agencyTitle}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 block">
                {agencySubtitle}
              </span>
            </div>
          </div>

          {/* Settings Trigger Badge (Only visible when logged in) */}
          {isLoggedIn && (
            <button
              onClick={handleOpenLogoModal}
              className="px-2 py-1 flex items-center gap-1.5 text-[10px] font-bold text-blue-900 hover:text-indigo-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-lg transition-all active:scale-95 shadow-sm group"
              title="Manajemen Logo & Identitas Brand"
            >
              <Settings className="w-3.5 h-3.5 text-blue-800 group-hover:rotate-45 transition-transform duration-300" />
              <span className="hidden md:inline">Ubah Brand</span>
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-6 items-center h-full">
          {navigationLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => {
                  if (link.id === 'logout') {
                    onLogout();
                  } else {
                    setActiveTab(link.id);
                  }
                }}
                className={`h-full flex items-center px-1 font-semibold transition-colors border-b-2 relative text-sm sm:text-base ${
                  link.id === 'logout'
                    ? 'text-red-600 border-transparent hover:text-red-700 hover:border-red-300'
                    : isActive
                      ? 'text-blue-900 border-blue-900 font-bold'
                      : 'text-slate-600 border-transparent hover:text-blue-900 hover:border-slate-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.id === 'logout' && <LogOut className="w-3.5 h-3.5" />}
                  {link.label}
                </span>
                {link.id === 'keuangan' && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.5 bg-emerald-500 text-white text-[8px] rounded-full uppercase animate-pulse">
                    Admin
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Trailing Action */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-blue-950 hover:bg-slate-100 p-2 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer/Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg px-[10px] py-4 space-y-3 animate-fadeIn">
          {navigationLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'logout') {
                    onLogout();
                  } else {
                    setActiveTab(link.id);
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                  link.id === 'logout'
                    ? 'bg-red-55/70 text-red-650 hover:bg-red-100 hover:text-red-700'
                    : isActive
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900'
                }`}
              >
                {link.id === 'logout' && <LogOut className="w-4 h-4 text-red-500 shrink-0" />}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
    </>
  );
}
