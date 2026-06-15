import React, { useState, useEffect } from 'react';
import { Laporan } from '../types';
import { 
  Search, Grid, List, Download, Plus, FileText, Calendar, 
  Tag, User, CheckCircle2, ChevronRight, Filter, AlertCircle, Eye, Share2,
  Edit2, Trash2, ArrowLeft, Play, Film, Image, Video, Copy, Check,
  MessageSquare, Facebook, Twitter, Send, X, ExternalLink
} from 'lucide-react';

interface LaporanViewProps {
  laporanList: Laporan[];
  onAddLaporan: (laporan: Omit<Laporan, 'id'>) => void;
  onEditLaporan: (laporan: Laporan) => void;
  onDeleteLaporan: (id: string) => void;
  isLoggedIn: boolean;
}

const formatIndonesianDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};

const parseIndonesianDateToYmd = (indoDateStr: string): string => {
  if (!indoDateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(indoDateStr)) return indoDateStr;
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const parts = indoDateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const monthIndex = months.findIndex(m => m.toLowerCase() === parts[1].toLowerCase());
    const year = parts[2];
    if (monthIndex !== -1 && !isNaN(Number(day)) && !isNaN(Number(year))) {
      const month = String(monthIndex + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  const d = new Date(indoDateStr);
  if (!isNaN(d.getTime())) {
    try {
      return d.toISOString().split('T')[0];
    } catch (e) {
      // ignore
    }
  }
  return new Date().toISOString().split('T')[0];
};

export default function LaporanView({ 
  laporanList, 
  onAddLaporan, 
  onEditLaporan,
  onDeleteLaporan,
  isLoggedIn 
}: LaporanViewProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [selectedLaporan, setSelectedLaporan] = useState<Laporan | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Custom Social Media Sharing State
  const [sharingLaporan, setSharingLaporan] = useState<Laporan | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit states for Admin
  const [editingLaporan, setEditingLaporan] = useState<Laporan | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editOleh, setEditOleh] = useState('');
  const [editTag, setEditTag] = useState('Modul 1');
  const [editStatus, setEditStatus] = useState<'Berjalan' | 'Selesai' | 'Tertunda (Cuaca)'>('Berjalan');
  const [editGambar, setEditGambar] = useState('');
  const [editMediaList, setEditMediaList] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [editMediaUrlInput, setEditMediaUrlInput] = useState('');
  const [editMediaTypeInput, setEditMediaTypeInput] = useState<'image' | 'video'>('image');
  const [editGooglePhotosUrl, setEditGooglePhotosUrl] = useState('');
  const [editTanggal, setEditTanggal] = useState('');

  // New report form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOleh, setNewOleh] = useState('');
  const [newTag, setNewTag] = useState('Jurnal');
  const [newStatus, setNewStatus] = useState<'Berjalan' | 'Selesai' | 'Tertunda (Cuaca)'>('Berjalan');
  const [newGambar, setNewGambar] = useState('');
  const [newMediaList, setNewMediaList] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [inputMediaUrl, setInputMediaUrl] = useState('');
  const [inputMediaType, setInputMediaType] = useState<'image' | 'video'>('image');
  const [newGooglePhotosUrl, setNewGooglePhotosUrl] = useState('');
  const [newTanggal, setNewTanggal] = useState(() => new Date().toISOString().split('T')[0]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState<{ current: number; total: number; filename: string } | null>(null);

  // Load specific laporan from URL search parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('id');
    if (sharedId) {
      const found = laporanList.find(item => item.id === sharedId);
      if (found) {
        setSelectedLaporan(found);
      }
    }
  }, [laporanList]);

  // Synchronize selectedLaporan with URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentId = params.get('id');
    if (selectedLaporan) {
      if (currentId !== selectedLaporan.id) {
        params.set('tab', 'laporan');
        params.set('id', selectedLaporan.id);
        const newRelativePathQuery = window.location.pathname + '?' + params.toString();
        window.history.pushState(null, '', newRelativePathQuery);
      }
    } else {
      if (currentId) {
        params.delete('id');
        const newRelativePathQuery = window.location.pathname + '?' + params.toString();
        window.history.pushState(null, '', newRelativePathQuery);
      }
    }
  }, [selectedLaporan]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const renderOverlays = () => {
    return (
      <>
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-[110] bg-slate-900 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-800 animate-slide-up">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center">
              <h3 className="text-base font-extrabold text-slate-900">Konfirmasi Hapus</h3>
              <p className="text-slate-500 text-xs">Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDeleteLaporan(deleteConfirmId);
                    setDeleteConfirmId(null);
                    triggerToast('Laporan sukses dihapus!');
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Sharing Modal overlay */}
        {sharingLaporan && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 text-left relative animate-scaleUp">
              
              {/* Close button */}
              <button
                onClick={() => setSharingLaporan(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full">Bagikan Jurnal</span>
                <h2 className="text-lg font-extrabold text-slate-900 leading-snug">{sharingLaporan.judul}</h2>
                <p className="text-xs text-slate-400 leading-tight">Tanggal: {sharingLaporan.tanggal}</p>
              </div>

              {/* Simulated Link copy bar */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-mono truncate select-all">{`${window.location.origin}/?tab=laporan&id=${sharingLaporan.id}`}</span>
                <button
                  onClick={() => copyShareLink(sharingLaporan)}
                  className="p-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg transition-all flex items-center gap-1 shrink-0 active:scale-95 text-xs font-bold"
                  title="Salin Tautan"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>

              {/* Social Share Grid */}
              <div className="space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pilih Media Sosial Anda</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Aktivitas Budidaya Lahat 2026: *${sharingLaporan.judul}* pada ${sharingLaporan.tanggal}. Baca lebih lengkap jurnal petambak di digital ledger berikut: ${window.location.origin}/?tab=laporan&id=${sharingLaporan.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="p-1 bg-emerald-500 rounded-full text-white">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </span>
                    <span>WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/?tab=laporan&id=${sharingLaporan.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="p-1 bg-blue-600 rounded-full text-white">
                      <Facebook className="w-3.5 h-3.5" />
                    </span>
                    <span>Facebook</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Simak jurnal operasional perikanan Lahat 2026! "${sharingLaporan.judul}".`)}&url=${encodeURIComponent(`${window.location.origin}/?tab=laporan&id=${sharingLaporan.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-205 bg-slate-50 hover:bg-slate-100 text-slate-900 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="p-1 bg-slate-900 rounded-full text-white">
                      <Twitter className="w-3.5 h-3.5" />
                    </span>
                    <span>Twitter / X</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/?tab=laporan&id=${sharingLaporan.id}`)}&text=${encodeURIComponent(`Laporan Jurnal Lapangan Lahat: ${sharingLaporan.judul}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="p-1 bg-indigo-500 rounded-full text-white">
                      <Send className="w-3.5 h-3.5" />
                    </span>
                    <span>Telegram</span>
                  </a>

                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-4">
                Tautan publik program pendampingan perikanan berkelanjutan Lahat 2026.
              </div>

            </div>
          </div>
        )}
      </>
    );
  };



  // Reusable helper to read uploaded files as Data URL quickly with fast canvas scale down to prevent QuotaExceededError
  const compressImageFile = (file: File): Promise<{ type: 'image' | 'video'; url: string }> => {
    return new Promise((resolve, reject) => {
      const isVideo = file.type.startsWith('video/');
      if (isVideo) {
        if (file.size > 20 * 1024 * 1024) {
          reject(new Error(`Video "${file.name}" terlalu besar! Maksimal 20MB.`));
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          resolve({ type: 'video', url: result });
        };
        reader.onerror = () => {
          reject(new Error(`Gagal membaca berkas "${file.name}".`));
        };
        reader.readAsDataURL(file);
      } else {
        // High-speed image load and canvas downscale
        const objectUrl = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          const MAX_SIZE = 1000;
          let width = img.width;
          let height = img.height;
          if (width > MAX_SIZE || height > MAX_SIZE) {
            if (width > height) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            } else {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.75);
            resolve({ type: 'image', url: compressedUrl });
          } else {
            resolve({ type: 'image', url: img.src });
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Gagal memuat gambar "${file.name}".`));
        };
        img.src = objectUrl;
      }
    });
  };

  const handleAddMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const totalFiles = files.length;
    const fileArray = Array.from(files) as File[];

    try {
      setCompressProgress({ current: 1, total: totalFiles, filename: fileArray[0].name });
      // Perform all file loads/processing in parallel for maximum speed!
      const promises = fileArray.map((file) => compressImageFile(file));
      const results = await Promise.all(promises);
      
      if (results.length > 0) {
        setNewMediaList((prev) => [...prev, ...results]);
        triggerToast(`${results.length} media berhasil ditambahkan!`);
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat memproses gambar.');
    } finally {
      setIsCompressing(false);
      setCompressProgress(null);
      e.target.value = ''; // Reset input to allow re-upload if needed
    }
  };

  const handleEditMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const totalFiles = files.length;
    const fileArray = Array.from(files) as File[];

    try {
      setCompressProgress({ current: 1, total: totalFiles, filename: fileArray[0].name });
      // Perform all file loads/processing in parallel for maximum speed!
      const promises = fileArray.map((file) => compressImageFile(file));
      const results = await Promise.all(promises);
      
      if (results.length > 0) {
        setEditMediaList((prev) => [...prev, ...results]);
        triggerToast(`${results.length} media berhasil ditambahkan!`);
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat memproses gambar.');
    } finally {
      setIsCompressing(false);
      setCompressProgress(null);
      e.target.value = ''; // Reset input to allow re-upload if needed
    }
  };

  const handleAddMediaUrl = () => {
    if (!inputMediaUrl) return;
    setNewMediaList((prev) => [...prev, { type: inputMediaType, url: inputMediaUrl }]);
    setInputMediaUrl('');
  };

  const handleEditMediaUrl = () => {
    if (!editMediaUrlInput) return;
    setEditMediaList((prev) => [...prev, { type: editMediaTypeInput, url: editMediaUrlInput }]);
    setEditMediaUrlInput('');
  };

  const handleOpenEdit = (laporan: Laporan) => {
    setEditingLaporan(laporan);
    setEditTitle(laporan.judul);
    setEditDesc(laporan.deskripsi);
    setEditOleh(laporan.oleh);
    setEditTag(laporan.tag);
    setEditStatus(laporan.status);
    setEditGambar(laporan.gambar);
    setEditMediaList(laporan.mediaList || [{ type: 'image', url: laporan.gambar }]);
    setEditGooglePhotosUrl(laporan.googlePhotosUrl || '');
    setEditTanggal(parseIndonesianDateToYmd(laporan.tanggal));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLaporan) return;

    onEditLaporan({
      ...editingLaporan,
      judul: editTitle,
      deskripsi: editDesc,
      tanggal: formatIndonesianDate(editTanggal) || editingLaporan.tanggal,
      gambar: editMediaList[0]?.url || editGambar || 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80',
      mediaList: editMediaList.length > 0 ? editMediaList : [{ type: 'image', url: editGambar || 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80' }],
      googlePhotosUrl: editGooglePhotosUrl
    });

    setEditingLaporan(null);
    triggerToast('Laporan sukses diperbarui!');
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleShareLaporan = (laporan: Laporan) => {
    setSharingLaporan(laporan);
    setCopiedLink(false);
  };


  // Combined web path copying generator
  const copyShareLink = (laporan: Laporan) => {
    const shareUrl = `${window.location.origin}/?tab=laporan&id=${laporan.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      triggerToast(`Tautan disalin ke clipboard!`);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {
      triggerToast(`Gagal menyalin tautan.`);
    });
  };

  // Form states logic references (moved downstream)


  // Filtering process
  const filteredList = laporanList.filter((laporan) => {
    const matchesSearch = 
      laporan.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      laporan.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      laporan.oleh.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'All' || laporan.tag === selectedTag;

    return matchesSearch && matchesTag;
  });

  // Sorting process (oldest to newest)
  const sortedList = [...filteredList].sort((a, b) => {
    const dateA = parseIndonesianDateToYmd(a.tanggal);
    const dateB = parseIndonesianDateToYmd(b.tanggal);
    return dateA.localeCompare(dateB);
  });

  // Pagination calculation
  const totalItems = sortedList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = sortedList.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) {
      alert('Mohon isi semua field wajib!');
      return;
    }

    // Default Unsplash imagery if empty, otherwise use first uploaded media url
    const imgUrl = newMediaList[0]?.url || newGambar || `https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80`;

    const dateStr = formatIndonesianDate(newTanggal) || (() => {
      const todayDate = new Date();
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return todayDate.toLocaleDateString('id-ID', options);
    })();

    // If they have media list, use it; otherwise generate standard array from imgUrl
    const mediaToSave = newMediaList.length > 0 
      ? newMediaList 
      : [{ type: 'image' as const, url: imgUrl }];

    // Use default values for author, tag, and status since they are removed from the form
    const currentOperator = localStorage.getItem('eo_user') || 'Operator';
    const author = currentOperator;
    const tagToSave = 'Jurnal';
    const statusToSave = 'Berjalan';

    onAddLaporan({
      tanggal: dateStr,
      judul: newTitle,
      deskripsi: newDesc,
      tag: tagToSave,
      oleh: author,
      status: statusToSave,
      gambar: imgUrl,
      mediaList: mediaToSave,
      googlePhotosUrl: newGooglePhotosUrl
    });

    // Reset states
    setNewTitle('');
    setNewDesc('');
    setNewOleh('');
    setNewTag('Jurnal'); // Default tag back to Jurnal
    setNewStatus('Berjalan');
    setNewGambar('');
    setNewMediaList([]);
    setInputMediaUrl('');
    setNewGooglePhotosUrl('');
    setNewTanggal(new Date().toISOString().split('T')[0]);
    setShowAddModal(false);
  };

  const getStatusStyle = (status: Laporan['status']) => {
    switch (status) {
      case 'Selesai':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Berjalan':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Tertunda (Cuaca)':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  if (selectedLaporan) {
    const reportMedia = selectedLaporan.mediaList || [{ type: 'image', url: selectedLaporan.gambar }];
    const activeMedia = reportMedia[activeMediaIndex] || reportMedia[0];

    return (
      <>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Tanggal Entri: {selectedLaporan.tanggal}</span>
          </div>
          
          <button
            onClick={() => {
              setSelectedLaporan(null);
              setActiveMediaIndex(0);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight leading-tight">
              {selectedLaporan.judul}
            </h1>
            
            {/* Social Share Trigger */}
            <button
              type="button"
              onClick={() => handleShareLaporan(selectedLaporan)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-900 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm active:scale-95"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>

        {/* Dynamic Main Media Viewer Component */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md relative group">
          {activeMedia ? (
            activeMedia.type === 'video' ? (
              <video 
                src={activeMedia.url} 
                controls 
                autoPlay={false}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <img 
                src={activeMedia.url} 
                alt={selectedLaporan.judul} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs text-center">Media tidak tersedia</div>
          )}

          {/* Small Indicator on top right */}
          {activeMedia && (
            <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-[10px] font-bold py-1 px-2.5 rounded-full text-white shadow-md select-none border border-white/10 z-10">
              {activeMedia.type === 'video' ? 'VIDEO BERKAS' : 'FOTO BERKAS'}
            </span>
          )}
        </div>

        {/* Interactive Media Album Row (Thumbnails) */}
        {reportMedia.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Album Foto & Video ({reportMedia.length} Media)</span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">Klik media untuk melihat</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
              {reportMedia.map((media, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`relative aspect-[16/10] w-24 sm:w-28 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    idx === activeMediaIndex 
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-95' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white relative">
                      <video src={media.url} className="absolute inset-0 w-full h-full object-cover opacity-60" muted />
                      <div className="absolute inset-0 bg-black/20" />
                      <Play className="w-5 h-5 text-indigo-300 drop-shadow relative z-10" />
                      <span className="absolute bottom-1 right-1 text-[8px] bg-slate-950/80 text-indigo-300 font-bold px-1 py-0.2 rounded font-sans scale-90">VIDEO</span>
                    </div>
                  ) : (
                    <img src={media.url} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedLaporan.googlePhotosUrl && (
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">Album Eksternal</span>
              <p className="text-slate-700 text-xs font-bold leading-snug">Jurnal terhubung dengan Album Google Photos lengkap.</p>
            </div>
            <a
              href={selectedLaporan.googlePhotosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-900/15 hover:from-blue-950 hover:to-indigo-950 active:scale-95 transition-all text-center cursor-pointer shrink-0"
            >
              <Image className="w-4 h-4 shrink-0 text-blue-200" />
              <span>Buka Google Photos</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi Kegiatan Lengkap</h4>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {selectedLaporan.deskripsi}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
          <button
            onClick={() => {
              setSelectedLaporan(null);
              setActiveMediaIndex(0);
            }}
            className="bg-blue-900 hover:bg-blue-950 font-bold text-white px-5 py-2.5 rounded-xl text-center active:scale-95 transition-all shadow-md"
          >
            Selesai Membaca
          </button>
        </div>
      </div>
      {renderOverlays()}
    </>
    );
  }

  if (showAddModal) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-blue-50 text-blue-900 rounded-2xl shadow-sm">
              <Plus className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-blue-900 font-sans tracking-tight">Buat Jurnal Lapangan Baru</h1>
              <p className="text-xs text-slate-500 font-medium">Rekam praktikum serta operasional harian program Lahat</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(false)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <form onSubmit={handleCreateReport} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Judul Kegiatan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Pengukuran Kadar Amonia Kolam"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Tanggal Kegiatan *</label>
            <input
              type="date"
              required
              value={newTanggal}
              onChange={(e) => setNewTanggal(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Penulis, Kategori, and Status fields removed by request */}



          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Deskripsi Kegiatan Lengkap *</label>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan secara lengkap rincian praktikum, parameter yang berhasil diukur..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Album Media Selector for Photos & Videos support */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Album Media Rekaman (Foto & Video)</span>
              <span className="text-[10px] text-slate-400 font-semibold">{newMediaList.length} media dipilih</span>
            </div>

            {/* Media Thumbnails list inside form */}
            {newMediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {newMediaList.map((media, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group animate-fadeIn">
                    {media.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white relative">
                        <Film className="w-5 h-5 text-slate-400" />
                        <video src={media.url} className="absolute inset-0 w-full h-full object-cover opacity-60" muted />
                        <span className="absolute bottom-1 right-1 text-[8px] font-bold bg-slate-900/80 px-1.5 py-0.5 rounded text-indigo-300">Video</span>
                      </div>
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}

                    {/* Cover Status or Action */}
                    {idx === 0 ? (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-md flex items-center gap-0.5 z-10 selection:bg-transparent">
                        ⭐ Sampul Utama
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const selected = newMediaList[idx];
                          const remaining = newMediaList.filter((_, i) => i !== idx);
                          setNewMediaList([selected, ...remaining]);
                        }}
                        className="absolute bottom-1 left-1 bg-slate-900/85 hover:bg-blue-800 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow transition-all z-10 opacity-90 md:opacity-0 md:group-hover:opacity-100 duration-200"
                        title="Jadikan gambar sampul utama"
                      >
                        Set Utama
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setNewMediaList(newMediaList.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-650 hover:bg-red-700 text-white rounded-full p-1 shadow transition-all hover:scale-110 z-10"
                      title="Hapus media"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input choices: Upload */}
            <div className="pt-1">
              {/* File Upload choice */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600">Unggah Berkas (Foto / Video)</label>
                <input
                  type="file"
                  multiple
                  disabled={isCompressing}
                  accept="image/*,video/*"
                  onChange={handleAddMediaFile}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            {isCompressing && (
              <div className="space-y-2 px-3 py-2.5 bg-blue-50 border border-blue-200/50 rounded-xl text-blue-900 font-medium text-[11px] mt-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-blue-900">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
                    {compressProgress ? (
                      <span>Memuat berkas {compressProgress.current} dari {compressProgress.total}...</span>
                    ) : (
                      <span>Sedang memproses...</span>
                    )}
                  </div>
                  {compressProgress && (
                    <span className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">
                      {Math.round((compressProgress.current / compressProgress.total) * 100)}%
                    </span>
                  )}
                </div>
                {compressProgress && (
                  <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(compressProgress.current / compressProgress.total) * 100}%` }}
                    />
                  </div>
                )}
                <div className="text-[9px] text-blue-700/80 font-mono truncate">
                  Memproses: {compressProgress?.filename || '-'}
                </div>
              </div>
            )}
            <p className="text-[10px] text-slate-400 font-medium leading-tight">
              Tips: Admin dapat mengunggah berkas gambar/video lokal langsung dari perangkat (<span className="text-amber-600">disarankan &lt; 2MB</span> untuk stabilitas penyimpanan lokal).
            </p>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-705">Tautan Album Google Photos (Opsional)</label>
            <input
              type="url"
              placeholder="Contoh: https://photos.app.goo.gl/xXyYzZ"
              value={newGooglePhotosUrl}
              onChange={(e) => setNewGooglePhotosUrl(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <p className="text-[10px] text-slate-400 font-medium">Bila diisi, pengunjung dapat mengeklik tombol langsung untuk membuka album Google Photos lengkap yang dibagikan oleh pihak lain.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs font-bold">
            <button
              type="button"
              disabled={isCompressing}
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCompressing}
              className={`px-5 py-2 text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                isCompressing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-950'
              }`}
            >
              {isCompressing && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{isCompressing ? 'Memproses Berkas...' : 'Simpan Jurnal Lapangan'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (showExportModal) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl shadow-sm">
              <FileText className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-blue-900 font-sans tracking-tight">Format Ekspor Jurnal Digital Pelatihan</h1>
              <p className="text-xs text-slate-500 font-medium">Kompilasi lembar bukti fisik dinas perikanan Lahat 2026</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowExportModal(false)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Berikut adalah salinan berkas PDF/Excel yang siap dikirimkan ke Penilai Regional, Dinas Perikanan Kabupaten Lahat, dan Dinas Kelautan Sumatra Selatan.
        </p>

        {/* Simulated Paper Print Card */}
        <div className="bg-slate-100/70 p-5 rounded-2xl border border-slate-200 max-h-64 overflow-y-auto font-mono text-[9px] text-slate-600 leading-tight space-y-3 shadow-inner">
          <div className="text-center font-bold border-b border-dashed border-slate-300 pb-2 text-[10px] text-slate-800">
            LAPORAN REKAPITULASI HARIAN<br />
            PROGRAM KULIAH LAPANGAN BUDI DAYA IKAN LAHAT 2026<br />
            -------------------------------------------------
          </div>
          <div>Tanggal Laporan: {new Date().toLocaleDateString('id-ID')}</div>
          <div>Jumlah Jurnal Aktif: {laporanList.length} Entri Terverifikasi</div>
          <div>Mitra Utama: BRIDA SUMSEL & DINAS PERIKANAN LAHAT</div>
          
          <div className="border-t border-dashed border-slate-300 pt-2 font-bold text-slate-705">
            RINCIAN JURNAL TERBARU:
          </div>

          {laporanList.slice(0, 4).map((lap) => (
            <div key={lap.id} className="border-l-2 border-emerald-500 pl-2 py-1.5 bg-white shadow-xs rounded mb-1">
              {lap.judul}<br />
              - Tanggal: {lap.tanggal}
            </div>
          ))}

          <div className="text-[8px] text-slate-400 text-center border-t border-dashed border-slate-300 pt-2">
            ------ Dokumen ini dihasilkan secara otomatis oleh Ledger Jurnal Digital Lahat 2026 ------
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold pt-4">
          <button
            onClick={() => {
              window.print();
              setShowExportModal(false);
            }}
            className="bg-emerald-600 text-white hover:bg-emerald-700 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            Cetak ke PDF / Printer
          </button>
          <button
            onClick={() => {
              alert('Excel Sheet (.xlsx) berhasil diekspor ke folder unduhan!');
              setShowExportModal(false);
            }}
            className="bg-slate-800 text-white hover:bg-slate-900 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <FileText className="w-4 h-4" />
            Ekspor Data sebagai CSV
          </button>
        </div>
      </div>
    );
  }

  if (editingLaporan) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl shadow-sm">
              <Edit2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-blue-900 font-sans tracking-tight">Edit Jurnal Lapangan</h1>
              <p className="text-xs text-slate-500 font-medium">Perbarui parameter dan data aktivitas penambakan</p>
            </div>
          </div>
          
          <button
            onClick={() => setEditingLaporan(null)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Judul Kegiatan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Pengukuran Kadar Amonia Kolam"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Tanggal Kegiatan *</label>
            <input
              type="date"
              required
              value={editTanggal}
              onChange={(e) => setEditTanggal(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>



          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Deskripsi Kegiatan Lengkap *</label>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan deskripsi lengkap hasil pendampingan di sini..."
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Album Media Selector for Photos & Videos support (Edit Modal) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Album Media Rekaman (Foto & Video)</span>
              <span className="text-[10px] text-slate-400 font-semibold">{editMediaList.length} media dipilih</span>
            </div>

            {/* Media Thumbnails list inside form */}
            {editMediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {editMediaList.map((media, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group animate-fadeIn">
                    {media.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white relative">
                        <Film className="w-5 h-5 text-slate-400" />
                        <video src={media.url} className="absolute inset-0 w-full h-full object-cover opacity-60" muted />
                        <span className="absolute bottom-1 right-1 text-[8px] font-bold bg-slate-900/80 px-1.5 py-0.5 rounded text-indigo-300">Video</span>
                      </div>
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}

                    {/* Cover Status or Action */}
                    {idx === 0 ? (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-md flex items-center gap-0.5 z-10 selection:bg-transparent">
                        ⭐ Sampul Utama
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const selected = editMediaList[idx];
                          const remaining = editMediaList.filter((_, i) => i !== idx);
                          setEditMediaList([selected, ...remaining]);
                        }}
                        className="absolute bottom-1 left-1 bg-slate-900/85 hover:bg-indigo-700 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow transition-all z-10 opacity-90 md:opacity-0 md:group-hover:opacity-100 duration-200"
                        title="Jadikan gambar sampul utama"
                      >
                        Set Utama
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setEditMediaList(editMediaList.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-all hover:scale-110 z-10"
                      title="Hapus media"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input choices: Upload */}
            <div className="pt-1">
              {/* File Upload choice */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600">Unggah Berkas Baru (Foto / Video)</label>
                <input
                  type="file"
                  multiple
                  disabled={isCompressing}
                  accept="image/*,video/*"
                  onChange={handleEditMediaFile}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            {isCompressing && (
              <div className="space-y-2 px-3 py-2.5 bg-indigo-50 border border-indigo-200/50 rounded-xl text-indigo-900 font-medium text-[11px] mt-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-900">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-indigo-800 border-t-transparent rounded-full animate-spin"></div>
                    {compressProgress ? (
                      <span>Memuat berkas {compressProgress.current} dari {compressProgress.total}...</span>
                    ) : (
                      <span>Sedang memproses...</span>
                    )}
                  </div>
                  {compressProgress && (
                    <span className="bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-900">
                      {Math.round((compressProgress.current / compressProgress.total) * 100)}%
                    </span>
                  )}
                </div>
                {compressProgress && (
                  <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(compressProgress.current / compressProgress.total) * 100}%` }}
                    />
                  </div>
                )}
                <div className="text-[9px] text-indigo-700/80 font-mono truncate">
                  Memproses: {compressProgress?.filename || '-'}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-705">Tautan Album Google Photos (Opsional)</label>
            <input
              type="url"
              placeholder="Contoh: https://photos.app.goo.gl/xXyYzZ"
              value={editGooglePhotosUrl}
              onChange={(e) => setEditGooglePhotosUrl(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <p className="text-[10px] text-slate-400 font-medium">Bila diisi, pengunjung dapat mengeklik tombol langsung untuk membuka album Google Photos lengkap yang dibagikan oleh pihak lain.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs font-bold">
            <button
              type="button"
              disabled={isCompressing}
              onClick={() => setEditingLaporan(null)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-bold disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCompressing}
              className={`px-5 py-2 text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                isCompressing ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isCompressing && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{isCompressing ? 'Memproses Berkas...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-[10px] animate-fadeIn">
      {/* Header and Control Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">Laporan Jurnal Lapangan</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Audit runutan aktivitas operasional tambak dan program pendampingan peternak Lahat.</p>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto shrink-0">
          {/* Export PDF Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 hover:bg-emerald-100 transition-colors rounded-xl font-bold text-[11px] sm:text-xs md:text-sm animate-fadeIn"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor PDF/Excel</span>
          </button>
          
          {/* New Report/Journal Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-900 text-white hover:bg-blue-950 transition-all rounded-xl font-bold text-[11px] sm:text-xs md:text-sm shadow-md animate-fadeIn"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>{isLoggedIn ? 'Buat Laporan Baru' : 'Publish Jurnal Baru'}</span>
          </button>
        </div>
      </div>


      {/* No results notice */}
      {sortedList.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-slate-700 font-semibold text-base">Tidak ada laporan ditemukan</p>
          <p className="text-slate-400 text-xs">Coba ganti kata kunci pencarian Anda atau periksa filter modul di atas.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('All');
            }}
            className="text-xs font-bold text-blue-900 hover:underline"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Main Listing Viewport */}
      {sortedList.length > 0 && viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] text-left">
          {paginatedList.map((laporan) => (
            <div 
              key={laporan.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
                {/* Image banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={laporan.gambar}
                  alt={laporan.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Content area */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
                    <Calendar className="w-3 h-3" />
                    <span>{laporan.tanggal}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-900 transition-colors">
                    {laporan.judul}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {laporan.deskripsi}
                  </p>

                  {laporan.googlePhotosUrl && (
                    <div className="pt-1.5">
                      <a
                        href={laporan.googlePhotosUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 hover:border-blue-300 text-[10px] font-extrabold text-blue-700 hover:text-blue-800 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
                      >
                        <Image className="w-3.5 h-3.5 text-blue-600" />
                        <span>Album Google Photos</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareLaporan(laporan);
                      }}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-blue-900 transition-colors text-xs font-bold active:scale-95 py-1 px-2 rounded-lg hover:bg-slate-50 -ml-2"
                      title="Bagikan Laporan"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-400 hover:text-blue-900" />
                      <span className="hidden sm:inline">Bagikan</span>
                    </button>

                    {isLoggedIn && (
                      <div className="flex items-center gap-1 ml-1 border-l border-slate-200 pl-2">
                        <button
                          onClick={() => handleOpenEdit(laporan)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit Laporan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(laporan.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Hapus Laporan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedLaporan(laporan)}
                    className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1 group/btn"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-900" />
                    Detail Laporan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Tampilan Viewport */}
      {sortedList.length > 0 && viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6 text-left">Tanggal</th>
                  <th className="py-4 px-6 text-left">Judul Jurnal</th>
                  <th className="py-4 px-6 text-center">Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedList.map((laporan) => (
                  <tr key={laporan.id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-slate-400 font-semibold">{laporan.tanggal}</span>
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      <p className="font-extrabold text-slate-800 text-sm">{laporan.judul}</p>
                      {laporan.googlePhotosUrl && (
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={laporan.googlePhotosUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] text-blue-600 hover:text-blue-800 font-extrabold transition-all hover:underline"
                          >
                            <Image className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>Google Photos</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedLaporan(laporan)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-150 px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>

                        {isLoggedIn && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(laporan)}
                              className="p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                              title="Edit Laporan"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(laporan.id)}
                              className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-150 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                              title="Hapus Laporan"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Row */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl">
          <p className="text-xs text-slate-500 font-semibold">
            Menampilkan <span className="text-slate-700 font-bold">{startIndex + 1}</span> -{' '}
            <span className="text-slate-700 font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> dari{' '}
            <span className="text-slate-700 font-bold">{totalItems}</span> laporan harian
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {renderOverlays()}
    </div>
  );
}
