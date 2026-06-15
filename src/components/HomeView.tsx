import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, Info, Users, Waves, BarChart3, Award, MapPin, 
  GraduationCap, ShieldAlert, Calendar, User, Eye, Sparkles 
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToTab: (tab: string) => void;
  isLoggedIn?: boolean;
}

const DEFAULT_HERO_SLIDES = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDB2r-N4lrrMaKe7E71bFi3ElohCAliwqo1bDRIal2wuGpXRN8wWyjCAo8elOaanPxFo5TKLU1o_Yvi3Ndi3-TTbCbwG5I-0fvofRChWhM_M6uRjqkK7bG1fJIxI1QWzFl6qj27JhoKsOgYOmme6enZ4h92hg6VPf87PaHHIG6DMMEgXwGd1NaErSU6uCZxtdAp-Etha_-4GWlvJ6GJTmaggx_M9F_LiSQcb_3QfG9Ea1iMOsrbwcai_IWHBnSDBMQG1LeLT0sEcI'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzqh8jISYnw8CovqkR3yjxb-qjvDEFcNd66bVMiMS2u7HPgY623-5gzdpF0jsYYMtQKlhEwqEO7twcFPgOyCc5J-OU1ag7XF8BquVt_bXbPC9dyRdLr4oKBwl-b4lwTPJWkCJsa1R36QEGELs_HGpKnM-pbwDDQ_2oH3urBjUSQIa8FJENcgbiAwhMHPGs_CtiGuZ3e8bBzZcnMJB7Fk5XmHgagpeXLJUmPCW1hsK4sSdiICPJYoIYx0Lh7XtcEeAzwkCfiHPzxsg'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJViVKFKpPGSa13GjP2HVm30cjQB-iv_1gxSsxdWelfoIa0GUCCXhtv7BOWpqng_MyEdvmeBoRxVbVYi294C9M_PNf8P9Y0xhNSnzt8UiWBi1hLusP7kdW0OwvkKQyZjvqX4NIdTJ_riRc2kSr9Qv05GfT-kOF2LSc28sI8x0Mxjp9HTsEmZazuqYRR0Hx7J1qZt56y47lhvDBQfQBupW7Zg6sRu2JpvtkhxiPoNcVNvj3jtOLARRVPwlabH1GDlR4I3B0XEhIOqs'
  }
];

export default function HomeView({ onNavigateToTab, isLoggedIn }: HomeViewProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Dynamic States for Editable Content
  const [slides, setSlides] = useState(() => {
    const saved = localStorage.getItem('eo_home_slides_custom');
    return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('eo_home_cards_custom');
    if (saved) return JSON.parse(saved);
    return [
      {
        title: 'Lokasi Pelatihan',
        desc: 'Lahat Selatan',
        sub: '15 Desa Binaan Air Tawar',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-900'
      },
      {
        title: 'Jumlah Peserta',
        desc: '124 Orang',
        sub: 'Terdaftar Aktif & Berkompeten',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-800'
      },
      {
        title: 'Instruktur',
        desc: '12 Ahli Senior',
        sub: 'Sertifikasi Akuakultur Nasional',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700'
      },
      {
        title: 'Panitia Pelaksana',
        desc: 'Dinas Perikanan',
        sub: 'Kabupaten Lahat, Sumsel',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700'
      }
    ];
  });

  const [aboutProgram, setAboutProgram] = useState(() => {
    const saved = localStorage.getItem('eo_home_about_custom');
    return saved ? JSON.parse(saved) : {
      title: 'Tentang Program Akselerasi',
      text1: 'Program Akselerasi Akuakultur Sumatra Selatan 2026 adalah program strategis yang diinisiasi oleh Dinas Perikanan Kabupaten Lahat berkolaborasi dengan instansi nasional.',
      text2: 'Program ini menyasar pendampingan intensif bagi peternak ikan tawar tradisional di aliran sungai Lematang untuk beralih ke praktik modern ramah lingkungan, meliputi:',
      bullets: [
        'Penerapan kolam beratap berbasis material bioflok hemat air.',
        'Sistem sirkulasi RAS (Recirculating Aquaculture System) hemat pakan.',
        'Penyaluran induk & bibit unggulan bersertifikat KKP.',
        'Pengawasan komprehensif kualitas air dengan telemetry digital portable.'
      ]
    };
  });

  // Admin edit form variables
  const [editSlides, setEditSlides] = useState(slides);
  const [editCards, setEditCards] = useState(cards);
  const [editAboutTitle, setEditAboutTitle] = useState(aboutProgram.title);
  const [editAboutText1, setEditAboutText1] = useState(aboutProgram.text1);
  const [editAboutText2, setEditAboutText2] = useState(aboutProgram.text2);
  const [editAboutBullets, setEditAboutBullets] = useState(aboutProgram.bullets.join('\n'));

  // Sync edits to localStorage
  const handleSaveHomeEdits = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if each slide has an image
    for (let i = 0; i < editSlides.length; i++) {
      if (!editSlides[i].image) {
        alert(`Gambar untuk Slide #${i + 1} tidak boleh kosong! Silakan pilih untuk mengunggah gambar atau masukkan URL gambar.`);
        return;
      }
    }
    
    // Save slides
    localStorage.setItem('eo_home_slides_custom', JSON.stringify(editSlides));
    setSlides(editSlides);

    // Save cards
    localStorage.setItem('eo_home_cards_custom', JSON.stringify(editCards));
    setCards(editCards);

    // Save about
    const parsedAbout = {
      title: editAboutTitle,
      text1: editAboutText1,
      text2: editAboutText2,
      bullets: editAboutBullets.split('\n').filter((b: string) => b.trim() !== '')
    };
    localStorage.setItem('eo_home_about_custom', JSON.stringify(parsedAbout));
    setAboutProgram(parsedAbout);

    setShowAdminModal(false);
    alert('Perubahan beranda berhasil disimpan!');
  };

  // Add a new slide helper
  const handleAddSlide = () => {
    setEditSlides([...editSlides, { image: '' }]);
  };

  // Remove slide helper
  const handleRemoveSlide = (idx: number) => {
    if (editSlides.length <= 1) {
      alert('Minimal harus ada 1 slide!');
      return;
    }
    setEditSlides(editSlides.filter((_: any, i: number) => i !== idx));
  };

  // Auto slide effect
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  // Sync edit states when admin opens the pane
  useEffect(() => {
    if (showAdminModal) {
      setEditSlides(slides);
      setEditCards(cards);
      setEditAboutTitle(aboutProgram.title);
      setEditAboutText1(aboutProgram.text1);
      setEditAboutText2(aboutProgram.text2);
      setEditAboutBullets(aboutProgram.bullets.join('\n'));
    }
  }, [showAdminModal, slides, cards, aboutProgram]);

  if (showInfoModal) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6 animate-fadeIn text-left">
        {/* Head header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-blue-50 text-blue-900 rounded-2xl shadow-sm">
              <Info className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-blue-900">{aboutProgram.title}</h1>
              <p className="text-xs text-slate-500 font-medium">Informasi resmi program strategis pemberdayaan nelayan dan budi daya ikan</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowInfoModal(false)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p className="font-semibold text-slate-800 text-base">{aboutProgram.text1}</p>
          <p>{aboutProgram.text2}</p>
          
          <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50 mt-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900">Pilar Fokus Kegiatan & Pembinaan:</h4>
            <ul className="text-xs text-slate-705 space-y-2.5 pl-4 list-disc font-semibold">
              {aboutProgram.bullets.map((bullet: string, i: number) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setShowInfoModal(false)}
            className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-blue-950/10"
          >
            Tutup Informasi & Kembali
          </button>
        </div>
      </div>
    );
  }

  if (showAdminModal) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6 animate-fadeIn text-left">
        {/* Head Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl shadow-sm animate-pulse">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-indigo-900">Edit Konten Halaman Beranda</h1>
              <p className="text-xs text-slate-500 font-medium font-semibold">Ubah berkas slide utama, 4 kartu info cepat, dan informasi program tentang</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAdminModal(false)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        <form onSubmit={handleSaveHomeEdits} className="space-y-6 text-xs sm:text-sm">
          {/* SLIDES EDITOR */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-indigo-900 uppercase tracking-wider text-xs">Gambar Slider Hero (16:9)</h3>
              <button
                type="button"
                onClick={handleAddSlide}
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-750 font-bold px-3 py-1.5 rounded-xl transition-colors border border-indigo-100"
              >
                + Tambah Slide Baru
              </button>
            </div>
            
            <div className="space-y-4 max-h-72 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
              {editSlides.map((slide: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 relative shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(idx)}
                    className="absolute top-3 right-3 text-rose-600 hover:text-rose-700 font-extrabold bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded text-[10px] transition-all"
                  >
                    Hapus Slide
                  </button>
                  <div className="font-extrabold text-slate-400 text-[10px] uppercase">Slide #{idx + 1}</div>
                  
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="block text-slate-600 text-[10px] font-bold mb-1">Unggah Gambar Slide</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                // Target standard landscape size (max width 1200px)
                                const MAX_WIDTH = 1200;
                                let width = img.width;
                                let height = img.height;

                                if (width > MAX_WIDTH) {
                                  height = Math.round((height * MAX_WIDTH) / width);
                                  width = MAX_WIDTH;
                                }

                                const canvas = document.createElement('canvas');
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                  ctx.drawImage(img, 0, 0, width, height);
                                  // Compress as high-quality JPEG (0.65 quality)
                                  const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
                                  const updated = [...editSlides];
                                  updated[idx].image = compressedDataUrl;
                                  setEditSlides(updated);
                                }
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[10px] font-bold mb-1">Atau Gunakan URL Gambar Slide</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={slide.image}
                        onChange={(e) => {
                          const updated = [...editSlides];
                          updated[idx].image = e.target.value;
                          setEditSlides(updated);
                        }}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    {slide.image && (
                      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mt-1">
                        <img 
                          src={slide.image} 
                          alt="Preview Slide" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 CARDS EDITOR */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="font-extrabold text-indigo-900 uppercase tracking-wider text-xs">4 Kartu Informasi Cepat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editCards.map((card: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 text-left shadow-sm">
                  <div className="font-extrabold text-slate-400 text-[10px] uppercase">Kartu #{idx + 1}</div>
                  <div>
                    <label className="block text-slate-600 text-[10px] font-bold mb-1">Judul Label</label>
                    <input
                      type="text"
                      required
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...editCards];
                        updated[idx].title = e.target.value;
                        setEditCards(updated);
                      }}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-[10px] font-bold mb-1">Nilai Utama</label>
                      <input
                        type="text"
                        required
                        value={card.desc}
                        onChange={(e) => {
                          const updated = [...editCards];
                          updated[idx].desc = e.target.value;
                          setEditCards(updated);
                        }}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-extrabold text-indigo-950"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px] font-bold mb-1">Subtitle Keterangan</label>
                      <input
                        type="text"
                        required
                        value={card.sub}
                        onChange={(e) => {
                          const updated = [...editCards];
                          updated[idx].sub = e.target.value;
                          setEditCards(updated);
                        }}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-semibold text-slate-605"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ABOUT PROGRAM EDITOR */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="font-extrabold text-indigo-900 uppercase tracking-wider text-xs">Tentang Program Binaan (Detail Page)</h3>
            
            <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
              <div>
                <label className="block text-slate-600 text-[10px] font-bold mb-1">Judul Tentang</label>
                <input
                  type="text"
                  required
                  value={editAboutTitle}
                  onChange={(e) => setEditAboutTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-extrabold text-blue-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[10px] font-bold mb-1">Paragraf Pertama</label>
                <textarea
                  required
                  rows={2}
                  value={editAboutText1}
                  onChange={(e) => setEditAboutText1(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[10px] font-bold mb-1">Paragraf Deskripsi Modul</label>
                <textarea
                  required
                  rows={2}
                  value={editAboutText2}
                  onChange={(e) => setEditAboutText2(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[10px] font-bold mb-1">Pilar Bullet Points (Pisahkan per Baris)</label>
                <textarea
                  required
                  rows={4}
                  value={editAboutBullets}
                  onChange={(e) => setEditAboutBullets(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON ACTIONS */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3.5">
            <button
              type="button"
              onClick={() => setShowAdminModal(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-[10px] py-[10px]">
      {/* Decorative background container */}
      <div className="absolute inset-0 fish-scale-pattern z-0 pointer-events-none"></div>

      {/* Admin quick entry bar */}
      {isLoggedIn && (
        <div className="relative z-20 flex justify-between items-center bg-indigo-50 border border-indigo-200 p-4 rounded-2xl shadow-sm text-left gap-4">
          <div>
            <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Mode Editor Aktif
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Sebagai administrator, Anda dapat mengedit seluruh teks, gambar, dan elemen-elemen di halaman Beranda ini secara instan.</p>
          </div>
          <button
            onClick={() => setShowAdminModal(true)}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
          >
            Edit Konten Beranda
          </button>
        </div>
      )}

      {/* Hero Section with 16:9 Slideshow */}
      <section className="relative z-10 max-w-4xl mx-auto flex flex-col gap-[10px]">
        {/* Slideshow Frame with precise 16:9 ratio */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group">
          {slides.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={slideIndex}
                src={slides[slideIndex]?.image || 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80'}
                alt={`Slide ${slideIndex + 1}`}
                className="w-full h-full object-cover select-none"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">Belum ada slide</div>
          )}

          {/* Subtle gradient shadow for better photo depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Navigation indicators overlay on top right */}
          {slides.length > 1 && (
            <div className="absolute top-4 right-4 flex gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    slideIndex === i ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Pilih slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Interactive touch controls on image wrapper hover */}
          {slides.length > 1 && (
            <div className="absolute inset-y-0 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button
                onClick={() => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 hover:bg-white active:scale-95 text-blue-900 hover:text-blue-950 flex items-center justify-center shadow-lg transition-all font-black text-lg cursor-pointer"
              >
                ‹
              </button>
              <button
                onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 hover:bg-white active:scale-95 text-blue-900 hover:text-blue-950 flex items-center justify-center shadow-lg transition-all font-black text-lg cursor-pointer"
              >
                ›
              </button>
            </div>
          )}
        </div>


      </section>

      {/* Informational Cards Row */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {cards.map((item: any, idx: number) => {
          let iconElement = <MapPin className="w-6 h-6 text-blue-900" />;
          if (idx === 1) iconElement = <Users className="w-6 h-6 text-emerald-800" />;
          if (idx === 2) iconElement = <GraduationCap className="w-6 h-6 text-indigo-700" />;
          if (idx === 3) iconElement = <Award className="w-6 h-6 text-amber-700" />;

          return (
            <div 
              key={idx}
              className="bg-white px-8 py-5 rounded-2xl border border-slate-200/80 flex gap-4 items-start shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
              onClick={() => {
                if (idx === 3) {
                  setShowInfoModal(true);
                }
              }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bgColor} shrink-0`}>
                {iconElement}
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-400 block tracking-wider uppercase">{item.title}</span>
                <p className="text-lg font-extrabold text-slate-800 mt-1 leading-tight">{item.desc}</p>
                <span className="text-[11px] text-slate-500 font-medium block mt-1.5">{item.sub}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Featured Document Pustaka Quick Access CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-blue-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-sans text-white">
            Pusat Dokumen & Regulasi Resmi
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Dapatkan panduan bimbingan teknik, tabel rekap produktivitas harian, hingga formulir persetujuan bantuan sarana prasarana kelompok tani secara gratis.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('dokumen')}
          className="shrink-0 bg-white hover:bg-slate-100 text-blue-900 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold active:scale-95 transition-all shadow-md self-start md:self-center flex items-center gap-2 cursor-pointer"
        >
          <span>Buka Pustaka Dokumen</span>
          <ArrowRight className="w-4 h-4 text-blue-900" />
        </button>
      </section>
    </div>
  );
}
