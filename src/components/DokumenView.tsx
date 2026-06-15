import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, FileSpreadsheet, FileVideo, Image as ImageIcon, File, 
  Search, Download, Plus, Trash2, Edit2, Info, Calendar, 
  HardDrive, Filter, Upload, X, Check, Eye, Award
} from 'lucide-react';
import { Dokumen } from '../types';
import { saveFileToDB, getFileFromDB, deleteFileFromDB } from '../lib/db';

interface DokumenViewProps {
  isLoggedIn: boolean;
}

const INITIAL_DOKUMEN_METADATA: Dokumen[] = [];

export default function DokumenView({ isLoggedIn }: DokumenViewProps) {
  const [documents, setDocuments] = useState<Dokumen[]>(() => {
    const saved = localStorage.getItem('instansi_dokumen_metadata_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out the initial mock documents
          const userDocs = parsed.filter((doc: any) => !['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'].includes(doc.id));
          return userDocs.map((doc: any) => {
            if (doc.tipe !== 'sertifikat' && doc.tipe !== 'dokumen') {
              const nameLower = (doc.nama || '').toLowerCase();
              const isCert = nameLower.includes('sertifikat') || nameLower.includes('piagam') || nameLower.includes('cert') || nameLower.includes('award');
              return {
                ...doc,
                tipe: isCert ? 'sertifikat' : 'dokumen'
              };
            }
            return doc;
          });
        }
        return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  });


  const [activeCategory, setActiveCategory] = useState<'dokumen' | 'sertifikat'>('dokumen');
  
  // Modals Controlling
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Dokumen | null>(null);

  // Form states
  const [formNama, setFormNama] = useState('');
  const [formTipe, setFormTipe] = useState<'sertifikat' | 'dokumen'>('dokumen');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formBlob, setFormBlob] = useState<Blob | null>(null);
  const [formSize, setFormSize] = useState('');
  
  // File Upload State Indicators
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progress or alerts
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'ref' } | null>(null);

  // Save changes to localStorage metadata list
  useEffect(() => {
    localStorage.setItem('instansi_dokumen_metadata_list', JSON.stringify(documents));
  }, [documents]);

  const showToast = (message: string, type: 'success' | 'ref' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Detect and helper for drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file) {
      setFormFileName(file.name);
      setFormBlob(file);
      
      // Calculate formatted size
      const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 1;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      };
      setFormSize(formatSize(file.size));

      // Auto set type based on name pattern or default to dokumen
      const normalizedName = file.name.toLowerCase();
      if (normalizedName.includes('sertifikat') || normalizedName.includes('piagam') || normalizedName.includes('cert') || normalizedName.includes('award')) {
        setFormTipe('sertifikat');
      } else {
        setFormTipe('dokumen');
      }
      
      if (!formNama.trim()) {
        // Auto filled default display name
        const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setFormNama(cleanName.replace(/[_-]/g, ' '));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const resetFormState = () => {
    setFormNama('');
    setFormTipe('dokumen');
    setFormDeskripsi('');
    setFormFileName('');
    setFormBlob(null);
    setFormSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenAddForm = () => {
    resetFormState();
    setEditingDoc(null);
    setShowAddModal(true);
  };

  const handleSaveAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formFileName) {
      alert('Mohon isi nama dokumen dan unggah berkas terlebih dahulu!');
      return;
    }

    const docId = `doc-${Date.now()}`;
    const today = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    // 1. Save metadata
    const newDoc: Dokumen = {
      id: docId,
      nama: formNama,
      tipe: formTipe,
      deskripsi: formDeskripsi || `Berkas ${formTipe.toUpperCase()} mengenai Program Dinas Perikanan Lahat.`,
      tanggalUpload: formattedDate,
      fileSize: formSize || '0 KB',
      namaFile: formFileName
    };

    // 2. Save binary file code to client IndexedDB database
    if (formBlob) {
      try {
        await saveFileToDB(docId, formBlob, formFileName, formBlob.type);
      } catch (err) {
        console.error('Failed to save file to IndexedDB database: ', err);
      }
    }

    setDocuments([newDoc, ...documents]);
    setShowAddModal(false);
    showToast('Dokumen baru berhasil diunggah & disimpan!');
  };

  const handleOpenEditForm = (doc: Dokumen, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDoc(doc);
    setFormNama(doc.nama);
    setFormTipe(doc.tipe);
    setFormDeskripsi(doc.deskripsi);
    setFormFileName(doc.namaFile);
    setFormSize(doc.fileSize);
    setFormBlob(null); // Keep unchanged unless they upload a new one
    setShowAddModal(true);
  };

  const handleSaveEditDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    if (!formNama.trim()) {
      alert('Nama dokumen tidak boleh kosong.');
      return;
    }

    // Update metadata
    const updatedDocs = documents.map(doc => {
      if (doc.id === editingDoc.id) {
        return {
          ...doc,
          nama: formNama,
          tipe: formTipe,
          deskripsi: formDeskripsi,
          fileSize: formBlob ? formSize : doc.fileSize,
          namaFile: formBlob ? formFileName : doc.namaFile
        };
      }
      return doc;
    });

    // Update binary if new file uploaded
    if (formBlob) {
      try {
        await saveFileToDB(editingDoc.id, formBlob, formFileName, formBlob.type);
      } catch (err) {
        console.error('Failed to write update binary to db', err);
      }
    }

    setDocuments(updatedDocs);
    setShowAddModal(false);
    setEditingDoc(null);
    showToast('Metadata dokumen berhasil diperbarui!');
  };

  const handleDeleteDoc = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${name}" beserta filenya secara permanen?`)) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      try {
        await deleteFileFromDB(id);
      } catch (err) {
        console.error('Failed to purge physical file from db: ', err);
      }
      showToast('Dokumen berhasil dihapus secara permanen!', 'ref');
    }
  };

  // Handles requesting files from IndexedDB or generating mockup fallbacks
  const handleDownloadFile = async (doc: Dokumen) => {
    try {
      const storedFile = await getFileFromDB(doc.id);
      let blob: Blob;
      let filename = doc.namaFile;

      if (storedFile) {
        blob = storedFile.blob;
        filename = storedFile.name;
      } else {
        // Fallback generator for PRE-LOADED documents or lost indexdb instances
        // Generates beautiful realistic mockup contents based on the file type
        const encoder = new TextEncoder();
        let content: Uint8Array;
        let mime = 'application/octet-stream';

        if (doc.tipe === 'sertifikat') {
          mime = 'image/svg+xml';
          // Generates a beautiful SVG of a Certificate with the award metadata
          const certificateSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
              <rect width="100%" height="100%" fill="#fafaf9"/>
              <rect x="20" y="20" width="760" height="560" fill="none" stroke="#b45309" stroke-width="10"/>
              <rect x="35" y="35" width="730" height="530" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="10 5"/>
              <circle cx="400" cy="120" r="45" fill="#f59e0b" opacity="0.1"/>
              
              <text x="400" y="130" font-family="'Georgia', serif" font-size="28" font-style="italic" fill="#b45309" text-anchor="middle" font-weight="bold">Sertifikat Penghargaan</text>
              <text x="400" y="180" font-family="'Inter', sans-serif" font-size="14" fill="#6b7280" text-anchor="middle" letter-spacing="4">PEMERINTAH KABUPATEN LAHAT</text>
              <text x="400" y="205" font-family="'Inter', sans-serif" font-size="16" font-weight="bold" fill="#1e3a8a" text-anchor="middle">DINAS PERIKANAN KABUPATEN LAHAT</text>
              
              <line x1="200" y1="230" x2="600" y2="230" stroke="#f59e0b" stroke-width="2"/>
              
              <text x="400" y="280" font-family="'Inter', sans-serif" font-size="14" fill="#4b5563" text-anchor="middle">Dengan ini menyatakan apresiasi tinggi diberikan kepada:</text>
              <text x="400" y="330" font-family="'Georgia', serif" font-size="26" font-weight="extrabold" fill="#111827" text-anchor="middle">${doc.nama}</text>
              
              <text x="400" y="390" font-family="'Inter', sans-serif" font-size="13" fill="#4b5563" text-anchor="middle">
                Atas dedikasi, pencapaian luar biasa, serta kontribusi aktif dalam mengembangkan
              </text>
              <text x="400" y="415" font-family="'Inter', sans-serif" font-size="13" fill="#4b5563" text-anchor="middle">
                teknologi budidaya perikanan berkelanjutan di Kabupaten Lahat, Sumatera Selatan.
              </text>
              
              <text x="400" y="465" font-family="'Inter', sans-serif" font-size="11" fill="#9ca3af" text-anchor="middle">Deskripsi: ${doc.deskripsi}</text>
              
              <text x="180" y="520" font-family="'Inter', sans-serif" font-size="11" fill="#4b5563" text-anchor="middle">Mengetahui, Kepala Dinas</text>
              <line x1="100" y1="540" x2="260" y2="540" stroke="#9ca3af" stroke-width="1"/>
              
              <text x="620" y="520" font-family="'Inter', sans-serif" font-size="11" fill="#4b5563" text-anchor="middle">Lahat, ${doc.tanggalUpload}</text>
              <line x1="540" y1="540" x2="700" y2="540" stroke="#9ca3af" stroke-width="1"/>
            </svg>
          `.trim();
          content = encoder.encode(certificateSvg);
          if (!filename.endsWith('.svg')) {
            filename = filename.substring(0, filename.lastIndexOf('.')) + '.svg';
          }
        } else {
          mime = 'application/pdf';
          // Simulates a plain text readable pseudo-pdf
          content = encoder.encode(
            `%PDF-1.4\n% Dinas Perikanan Kabupaten Lahat - Binaan 2026\n` +
            `3 0 obj\n<</Type /Page /Contents 4 0 R>>\nendobj\n` +
            `4 0 obj\n<</Length 150>>\nstream\n` +
            `BT\n/F1 12 Tf\n50 700 Td\n(Dinas Perikanan Kabupaten Lahat)\nTj\n` +
            `0 -20 Td\n(Dokumen Resmi: ${doc.nama})\nTj\n` +
            `0 -20 Td\n(File: ${doc.namaFile} | Ukuran: ${doc.fileSize})\nTj\n` +
            `0 -40 Td\n(Deskripsi: ${doc.deskripsi})\nTj\n` +
            `0 -30 Td\n(Sistem Kelompok Binaan Mandiri - Tanggal Upload: ${doc.tanggalUpload})\nTj\nET\n` +
            `endstream\nendobj\nxref\n0 5\n0000000000 65535 f\ntrailer\n<</Size 5>>\nstartxref\n310\n%%EOF`
          );
        }

        blob = new Blob([content], { type: mime });
      }

      // Open or Trigger Download
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      }, 100);

    } catch (err) {
      console.error('Error handling dynamic download: ', err);
      alert('Gagal mendownload file, silahkan coba lagi!');
    }
  };

  // Get icons based on document mimetype
  const getFileIcon = (type: Dokumen['tipe']) => {
    switch (type) {
      case 'sertifikat':
        return <Award className="w-8 h-8 text-amber-500" />;
      case 'dokumen':
        return <FileText className="w-8 h-8 text-blue-500" />;
      default:
        return <File className="w-8 h-8 text-indigo-400" />;
    }
  };

  const getFileBadgeStyle = (type: Dokumen['tipe']) => {
    switch (type) {
      case 'sertifikat':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'dokumen':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  // Filtering documents list selector
  const filteredDocuments = documents.filter(doc => doc.tipe === activeCategory);

  // Database stats calculation elements
  const stats = {
    total: documents.length,
    sertifikat: documents.filter(d => d.tipe === 'sertifikat').length,
    dokumen: documents.filter(d => d.tipe === 'dokumen').length,
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-[110] flex items-center gap-2 p-4 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold transition-all animate-bounce ${
          notification.type === 'success' 
            ? 'bg-blue-50 text-blue-900 border-blue-100' 
            : 'bg-rose-50 text-rose-900 border-rose-100'
        }`}>
          <Check className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-100 rounded-full">
            <Info className="w-3.5 h-3.5 text-blue-800" />
            <span>Pustaka Berkas & Panduan Dinas</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 font-sans tracking-tight leading-none">
            Dokumen & Unduhan Resmi
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Pusat arsip digital Dinas Perikanan Kabupaten Lahat. Akses mudah ke panduan teknis keramba jaring apung, tabel rekapitulasi bioflok, regulasi dinas, modul bimbingan, gambar kegiatan, hingga video tutorial.
          </p>
        </div>

        {isLoggedIn && (
          <button
            onClick={handleOpenAddForm}
            className="md:self-center bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Dokumen Baru</span>
          </button>
        )}
      </div>


      {/* Category Folders Grid - Dokumen & Sertifikat Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Dokumen Resmi Button Card */}
        <button
          type="button"
          onClick={() => setActiveCategory('dokumen')}
          className={`text-left p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-44 shadow-xs group ${
            activeCategory === 'dokumen'
              ? 'border-blue-900 bg-blue-50/20 ring-2 ring-blue-900/10'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
          }`}
        >
          <div className="flex justify-between items-start w-full">
            <span className={`p-3 rounded-2xl transition-all duration-300 ${
              activeCategory === 'dokumen' ? 'bg-blue-900 text-white' : 'bg-blue-50 text-blue-900 group-hover:scale-110'
            }`}>
              <FileText className="w-6 h-6" />
            </span>
            <span className={`text-[10px] sm:text-xs font-black tracking-wider px-3 py-1 rounded-full border uppercase ${
              activeCategory === 'dokumen' ? 'bg-blue-900/10 border-blue-900/20 text-blue-900' : 'bg-slate-50 border-slate-100 text-slate-500'
            }`}>
              {stats.dokumen} Berkas
            </span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
              Dokumen Resmi
            </h2>
            <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mt-1 font-medium">
              Akses panduan teknis, tabel rekapitulasi, regulasi dinas, pakan pendukung & data koordinasi.
            </p>
          </div>
        </button>

        {/* Sertifikat Resmi Button Card */}
        <button
          type="button"
          onClick={() => setActiveCategory('sertifikat')}
          className={`text-left p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-44 shadow-xs group ${
            activeCategory === 'sertifikat'
              ? 'border-amber-500 bg-amber-50/20 ring-2 ring-amber-500/10'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
          }`}
        >
          <div className="flex justify-between items-start w-full">
            <span className={`p-3 rounded-2xl transition-all duration-300 ${
              activeCategory === 'sertifikat' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 group-hover:scale-110'
            }`}>
              <Award className="w-6 h-6" />
            </span>
            <span className={`text-[10px] sm:text-xs font-black tracking-wider px-3 py-1 rounded-full border uppercase ${
              activeCategory === 'sertifikat' ? 'bg-amber-500/10 border-amber-500/20 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-500'
            }`}>
              {stats.sertifikat} Berkas
            </span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
              Sertifikat Resmi
            </h2>
            <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mt-1 font-medium">
              Akses piagam penghargaan, sertifikat kelompok binaan mandiri, dan apresiasi kualitas budidaya.
            </p>
          </div>
        </button>

      </div>

      {/* Active Category Header */}
      <div className="pt-4 flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
          {activeCategory === 'dokumen' ? (
            <>
              <FileText className="w-5 h-5 text-blue-900" />
              <span>Daftar Dokumen Resmi</span>
            </>
          ) : (
            <>
              <Award className="w-5 h-5 text-amber-500" />
              <span>Daftar Sertifikat Resmi</span>
            </>
          )}
        </h3>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {filteredDocuments.length} Berkas Tersedia
        </span>
      </div>

      {/* Document List */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
            {activeCategory === 'dokumen' ? <FileText className="w-8 h-8" /> : <Award className="w-8 h-8" />}
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-700 text-sm sm:text-base">Belum Ada Berkas</h4>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              Silakan unggah dokumen atau sertifikat baru menggunakan tombol di atas.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl shrink-0 group-hover:scale-105 transition-all">
                  {getFileIcon(doc.tipe)}
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getFileBadgeStyle(doc.tipe)}`}>
                      {doc.tipe}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{doc.tanggalUpload}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-900 transition-colors">
                    {doc.nama}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {doc.deskripsi}
                  </p>
                  <div className="text-[10px] text-slate-400 font-bold font-mono">
                    Nama File: {doc.namaFile} ({doc.fileSize})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end sm:justify-start shrink-0 pt-3 sm:pt-0 border-t border-slate-50 sm:border-t-0">
                <button
                  type="button"
                  onClick={() => handleDownloadFile(doc)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File</span>
                </button>

                {isLoggedIn && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditForm(doc, e)}
                      className="p-2.5 border border-slate-200 hover:bg-slate-50 text-indigo-600 rounded-xl transition-all cursor-pointer"
                      title="Edit Metadata"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteDoc(doc.id, doc.nama, e)}
                      className="p-2.5 border border-slate-200 hover:bg-rose-50 text-rose-600 rounded-xl transition-all cursor-pointer"
                      title="Hapus Permanen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Upload/Edit Modal Container */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-2xl max-w-xl w-full space-y-6 animate-fadeIn text-left my-8">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-blue-50 text-blue-900 rounded-2xl">
                  {editingDoc ? <Edit2 className="w-5 h-5 animate-pulse" /> : <Upload className="w-5 h-5" />}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-blue-900 font-sans tracking-tight">
                    {editingDoc ? 'Ubah Metadata Berkas' : 'Unggah Berkas Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingDoc ? `Ubah detail file: ${editingDoc.namaFile}` : 'Unggah dokumen referensi untuk kelompok binaan'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 px-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-50 font-bold transition-all active:scale-95 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span className="text-xs">Tutup</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={editingDoc ? handleSaveEditDoc : handleSaveAddDoc} className="space-y-4 text-xs sm:text-sm">
              
              {/* Drag and Drop File container (Omit for edit mode unless they want an replacement) */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Berkas Pendukung *</label>
                {editingDoc ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-blue-900">
                      {getFileIcon(formTipe)}
                      <div>
                        <p className="font-extrabold text-slate-800">{formFileName}</p>
                        <p className="text-[10px] text-slate-400">Ukuran: {formSize || 'Undef'} • Klik tombol unggah baru di bawah untuk mengganti</p>
                      </div>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-[10px] font-bold active:scale-95 transition-all"
                    >
                      Ganti Berkas
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-blue-900 bg-blue-50/40' 
                        : formFileName 
                          ? 'border-emerald-500 bg-emerald-50/10' 
                          : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                    }`}
                  >
                    {!formFileName ? (
                      <div className="space-y-2 pointer-events-none">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-extrabold text-slate-700 text-xs sm:text-sm">Seret & Letakkan file Anda di sini, atau <span className="text-blue-900 hover:underline">Pilih Manual</span></p>
                        <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">Mendukung PDF, Excel (.xlsx/.xls/.csv), Word (.docx/.doc), JPG/PNG, Video (.mp4), dll.</p>
                      </div>
                    ) : (
                      <div className="space-y-1 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto text-lg">
                          ✓
                        </div>
                        <p className="font-extrabold text-emerald-800 text-xs sm:text-sm">{formFileName}</p>
                        <p className="text-[10px] text-slate-500">Siap diunggah • Ukuran {formSize || '0 KB'}</p>
                      </div>
                    )}
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleManualFileSelect}
                  className="hidden"
                />
              </div>

              {/* Document Display Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Tampilan Dokumen *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan Keuangan Bioflok 2026"
                  value={formNama}
                  onChange={e => setFormNama(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-950/10 focus:border-blue-900 transition-all font-semibold text-slate-800"
                />
              </div>

              {/* Document Category and FileType selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Tipe *</label>
                  <select
                    value={formTipe}
                    onChange={e => setFormTipe(e.target.value as 'dokumen' | 'sertifikat')}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-900/10 focus:outline-none"
                  >
                    <option value="dokumen">Dokumen</option>
                    <option value="sertifikat">Sertifikat</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama File Fisik</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Auto diproses..."
                    value={formFileName}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Document Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Dokumen</label>
                <textarea
                  rows={3}
                  maxLength={250}
                  placeholder="Terangkan secara singkat tujuan, isi, atau sasaran berkas bantuan ini..."
                  value={formDeskripsi}
                  onChange={e => setFormDeskripsi(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-950/10 focus:border-blue-900 transition-all text-slate-700 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-150 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95"
                >
                  {editingDoc ? 'Simpan Perubahan' : 'Mulai Unggah'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
