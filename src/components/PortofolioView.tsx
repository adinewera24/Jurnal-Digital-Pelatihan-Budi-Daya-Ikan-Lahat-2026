import React, { useState } from 'react';
import { Peserta } from '../types';
import { 
  MapPin, CheckCircle2, 
  MessageSquare, Eye, Compass, Info,
  Edit2, Trash2, Plus, Sparkles, ArrowLeft,
  Award, ShieldCheck, Mail, Phone, Users
} from 'lucide-react';

interface PortofolioViewProps {
  pesertaList: Peserta[];
  setPesertaList: React.Dispatch<React.SetStateAction<Peserta[]>>;
  isLoggedIn: boolean;
}

const DINAS_LIST = [
  {
    id: 'd-1',
    nama: 'Ir. Augustine, M.T.',
    instansi: 'Dinas Perikanan Kabupaten Lahat',
    jabatan: 'Kepala Dinas Perikanan',
    nip: 'NIP. 19740825 200112 2 001',
    peran: 'Pembina utama, pengarah kebijakan akselerasi teknologi bioflok & sirkulasi RAS daerah.',
    lokasi: 'Kecamatan Lahat, Kabupaten Lahat, Sumsel',
    email: 'dinasperikanan@lahatkab.go.id',
    telepon: '+62 811-2055-6677',
    gambar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    tipe: 'Pemerintah',
    status: 'Pembina Utama'
  },
  {
    id: 'd-2',
    nama: 'Drs. H. M. Yusuf, M.M.',
    instansi: 'Dinas Perikanan & BRIDA Sumsel',
    jabatan: 'Kabid Pemberdayaan & Budidaya',
    nip: 'NIP. 19710314 199803 1 004',
    peran: 'Fasilitator penyaluran sarana prasarana, logistik bantuan benih & pakan mandiri.',
    lokasi: 'Palembang, Sumatera Selatan',
    email: 'yusuf.diskan@sumselprov.go.id',
    telepon: '+62 812-7044-8833',
    gambar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    tipe: 'Pemerintah',
    status: 'Koordinator Kebijakan'
  }
];

const INSTRUKTUR_LIST = [
  {
    id: 'i-1',
    nama: 'Bpk. Ahmad Fauzi',
    bidang: 'Nutrisi Pakan & Bioflok',
    jabatan: 'Koordinator Lapangan & Instruktur Teknis',
    peran: 'Mengawal formula pakan alternatif fermentasi ragi dan kontrol kualitas air.',
    lokasi: 'Sungkai, Lahat, Sumsel',
    email: 'ahmad.fauzi@aquatech.org',
    telepon: '+62 821-8854-9911',
    gambar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    tipe: 'Ahli Praktisi',
    status: 'Instruktur Utama'
  },
  {
    id: 'i-2',
    nama: 'Ir. Hermawan Saputra, M.Si',
    bidang: 'Manajemen Sistem RAS',
    jabatan: 'Project Director & Konsultan Konstruksi',
    peran: 'Ahli penanganan sirkulasi RAS tertutup dan manajemen padat tebar.',
    lokasi: 'Lahat, Sumsel',
    email: 'hermawan.aquatech@gmail.com',
    telepon: '+62 813-6622-4455',
    gambar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tipe: 'Sertifikasi KKP',
    status: 'Instruktur Ahli'
  }
];

export default function PortofolioView({ 
  pesertaList, 
  setPesertaList, 
  isLoggedIn 
}: PortofolioViewProps) {
  // Sub-tab selection state
  const [activeSubTab, setActiveSubTab] = useState<'dinas' | 'instruktur' | 'peserta'>('peserta');

  // Active detail modal
  const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
  const [consultationText, setConsultationText] = useState('');
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  // Dynamic list for Dinas
  const [dinasList, setDinasList] = useState<any[]>(() => {
    const local = localStorage.getItem('eo_dinas_list_2026');
    if (local) {
      try { return JSON.parse(local); } catch (e) { return DINAS_LIST; }
    }
    return DINAS_LIST;
  });

  // Dynamic list for Instruktur
  const [instrukturList, setInstrukturList] = useState<any[]>(() => {
    const local = localStorage.getItem('eo_instruktur_list_2026');
    if (local) {
      try { return JSON.parse(local); } catch (e) { return INSTRUKTUR_LIST; }
    }
    return INSTRUKTUR_LIST;
  });

  // Save changes
  React.useEffect(() => {
    try {
      localStorage.setItem('eo_dinas_list_2026', JSON.stringify(dinasList));
    } catch (e) {
      console.error(e);
    }
  }, [dinasList]);

  React.useEffect(() => {
    try {
      localStorage.setItem('eo_instruktur_list_2026', JSON.stringify(instrukturList));
    } catch (e) {
      console.error(e);
    }
  }, [instrukturList]);

  // Dinas Form States
  const [showAddDinasModal, setShowAddDinasModal] = useState(false);
  const [editingDinas, setEditingDinas] = useState<any | null>(null);
  const [formDinasNama, setFormDinasNama] = useState('');
  const [formDinasInstansi, setFormDinasInstansi] = useState('');
  const [formDinasJabatan, setFormDinasJabatan] = useState('');
  const [formDinasNip, setFormDinasNip] = useState('');
  const [formDinasPeran, setFormDinasPeran] = useState('');
  const [formDinasLokasi, setFormDinasLokasi] = useState('');
  const [formDinasEmail, setFormDinasEmail] = useState('');
  const [formDinasTelepon, setFormDinasTelepon] = useState('');
  const [formDinasGambar, setFormDinasGambar] = useState('');
  const [formDinasStatus, setFormDinasStatus] = useState('Pembina Utama');

  // Instruktur Form States
  const [showAddInstrukturModal, setShowAddInstrukturModal] = useState(false);
  const [editingInstruktur, setEditingInstruktur] = useState<any | null>(null);
  const [formInstrukturNama, setFormInstrukturNama] = useState('');
  const [formInstrukturBidang, setFormInstrukturBidang] = useState('');
  const [formInstrukturJabatan, setFormInstrukturJabatan] = useState('');
  const [formInstrukturPeran, setFormInstrukturPeran] = useState('');
  const [formInstrukturLokasi, setFormInstrukturLokasi] = useState('');
  const [formInstrukturEmail, setFormInstrukturEmail] = useState('');
  const [formInstrukturTelepon, setFormInstrukturTelepon] = useState('');
  const [formInstrukturGambar, setFormInstrukturGambar] = useState('');
  const [formInstrukturStatus, setFormInstrukturStatus] = useState('Instruktur Utama');

  // Modals for Admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPeserta, setEditingPeserta] = useState<Peserta | null>(null);

  // Form states (Add/Edit)
  const [formNama, setFormNama] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formKelompok, setFormKelompok] = useState('');
  const [formStatus, setFormStatus] = useState<Peserta['status']>('Aktif');
  const [formTerverifikasi, setFormTerverifikasi] = useState(true);
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formGambar, setFormGambar] = useState('');
  
  // detail data
  const [formKondisiAir, setFormKondisiAir] = useState('pH 7.2 | DO > 5.0 mg/L');
  const [formFcr, setFormFcr] = useState(1.2);
  const [formSr, setFormSr] = useState('85%');
  const [formLuasKolam, setFormLuasKolam] = useState('Kolam Terpal Bulat D3');
  const [formLokasiKolam, setFormLokasiKolam] = useState('');
  const [formKontribusi, setFormKontribusi] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormGambar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInstrukturFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormInstrukturGambar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDinasFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormDinasGambar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };


  const handleOpenAdd = () => {
    setFormNama('');
    setFormAlamat('');
    setFormKelompok('');
    setFormStatus('Aktif');
    setFormTerverifikasi(true);
    setFormDeskripsi('');
    setFormGambar('');
    setFormKondisiAir('pH 7.2 | DO > 5.0 mg/L');
    setFormFcr(1.2);
    setFormSr('85%');
    setFormLuasKolam('Kolam Terpal Bulat D3');
    setFormLokasiKolam('');
    setFormKontribusi('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (peserta: Peserta, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPeserta(peserta);
    setFormNama(peserta.nama);
    setFormAlamat(peserta.alamat);
    setFormKelompok(peserta.kelompok || '');
    setFormStatus(peserta.status || 'Aktif');
    setFormTerverifikasi(peserta.terverifikasi);
    setFormDeskripsi(peserta.deskripsi || '');
    setFormGambar(peserta.gambar);
    setFormKondisiAir(peserta.detailData?.kondisiAir || 'pH 7.2 | DO > 5.0 mg/L');
    setFormFcr(peserta.detailData?.fcr || 1.2);
    setFormSr(peserta.detailData?.survivalRate || '85%');
    setFormLuasKolam(peserta.detailData?.luasKolam || 'Kolam Terpal Bulat D3');
    setFormLokasiKolam(peserta.detailData?.lokasiKolam || '');
    setFormKontribusi(peserta.detailData?.kontribusi || '');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formAlamat.trim()) {
      alert('Mohon lengkapi field wajib!');
      return;
    }

    const defaultPic = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    const newPeserta: Peserta = {
      id: `p-${Date.now()}`,
      nama: formNama,
      alamat: formAlamat,
      terverifikasi: formTerverifikasi,
      gambar: formGambar || defaultPic,
      detailData: {
        kontribusi: formKontribusi
      }
    };

    setPesertaList([newPeserta, ...pesertaList]);
    setShowAddModal(false);
    alert('Mitra binaan baru berhasil didaftarkan!');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeserta) return;

    const defaultPic = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    const updated: Peserta = {
      ...editingPeserta,
      nama: formNama,
      alamat: formAlamat,
      terverifikasi: formTerverifikasi,
      gambar: formGambar || defaultPic,
      detailData: {
        ...editingPeserta.detailData,
        kontribusi: formKontribusi
      }
    };

    setPesertaList(prev => prev.map(p => p.id === editingPeserta.id ? updated : p));
    setEditingPeserta(null);
    alert('Profil peserta binaan sukses diperbarui!');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus profil peserta ini secara permanen?')) {
      setPesertaList(prev => prev.filter(p => p.id !== id));
      alert('Profil peserta berhasil dihapus!');
    }
  };

  // Dinas handlers
  const handleOpenAddDinas = () => {
    setFormDinasNama('');
    setFormDinasInstansi('Dinas Perikanan Kabupaten Lahat');
    setFormDinasJabatan('Kepala Seksi/Bidang');
    setFormDinasNip('NIP. ');
    setFormDinasPeran('');
    setFormDinasLokasi('Kabupaten Lahat, Sumsel');
    setFormDinasEmail('dinasperikanan@lahatkab.go.id');
    setFormDinasTelepon('+62 ');
    setFormDinasGambar('');
    setFormDinasStatus('Pembina Utama');
    setShowAddDinasModal(true);
  };

  const handleOpenEditDinas = (dinas: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDinas(dinas);
    setFormDinasNama(dinas.nama);
    setFormDinasInstansi(dinas.instansi);
    setFormDinasJabatan(dinas.jabatan);
    setFormDinasNip(dinas.nip);
    setFormDinasPeran(dinas.peran);
    setFormDinasLokasi(dinas.lokasi);
    setFormDinasEmail(dinas.email);
    setFormDinasTelepon(dinas.telepon);
    setFormDinasGambar(dinas.gambar);
    setFormDinasStatus(dinas.status);
  };

  const handleSaveAddDinas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDinasNama.trim() || !formDinasPeran.trim()) {
      alert('Mohon lengkapi field wajib!');
      return;
    }
    const defaultPic = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
    const newDinas = {
      id: `d-${Date.now()}`,
      nama: formDinasNama,
      instansi: formDinasInstansi,
      jabatan: formDinasJabatan,
      nip: formDinasNip,
      peran: formDinasPeran,
      lokasi: formDinasLokasi,
      email: formDinasEmail,
      telepon: formDinasTelepon,
      gambar: formDinasGambar || defaultPic,
      tipe: 'Pemerintah',
      status: formDinasStatus
    };
    setDinasList([newDinas, ...dinasList]);
    setShowAddDinasModal(false);
    alert('Profil dinas berhasil didaftarkan!');
  };

  const handleSaveEditDinas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDinas) return;
    const defaultPic = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
    const updated = {
      ...editingDinas,
      nama: formDinasNama,
      instansi: formDinasInstansi,
      jabatan: formDinasJabatan,
      nip: formDinasNip,
      peran: formDinasPeran,
      lokasi: formDinasLokasi,
      email: formDinasEmail,
      telepon: formDinasTelepon,
      gambar: formDinasGambar || defaultPic,
      status: formDinasStatus
    };
    setDinasList(prev => prev.map(d => d.id === editingDinas.id ? updated : d));
    setEditingDinas(null);
    alert('Profil dinas sukses diperbarui!');
  };

  const handleDeleteDinas = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus profil dinas ini secara permanen?')) {
      setDinasList(prev => prev.filter(d => d.id !== id));
      alert('Profil dinas berhasil dihapus!');
    }
  };

  // Instruktur handlers
  const handleOpenAddInstruktur = () => {
    setFormInstrukturNama('');
    setFormInstrukturBidang('Sistem RAS / Bioflok');
    setFormInstrukturJabatan('Instruktur Teknis');
    setFormInstrukturPeran('');
    setFormInstrukturLokasi('Lahat, Sumsel');
    setFormInstrukturEmail('instruktur@aquatech.org');
    setFormInstrukturTelepon('+62 ');
    setFormInstrukturGambar('');
    setFormInstrukturStatus('Instruktur Ahli');
    setShowAddInstrukturModal(true);
  };

  const handleOpenEditInstruktur = (instruktur: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingInstruktur(instruktur);
    setFormInstrukturNama(instruktur.nama);
    setFormInstrukturBidang(instruktur.bidang);
    setFormInstrukturJabatan(instruktur.jabatan);
    setFormInstrukturPeran(instruktur.peran);
    setFormInstrukturLokasi(instruktur.lokasi);
    setFormInstrukturEmail(instruktur.email);
    setFormInstrukturTelepon(instruktur.telepon);
    setFormInstrukturGambar(instruktur.gambar);
    setFormInstrukturStatus(instruktur.status);
  };

  const handleSaveAddInstruktur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInstrukturNama.trim() || !formInstrukturPeran.trim()) {
      alert('Mohon lengkapi field wajib!');
      return;
    }
    const defaultPic = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80';
    const newInstruktur = {
      id: `i-${Date.now()}`,
      nama: formInstrukturNama,
      bidang: formInstrukturBidang,
      jabatan: formInstrukturJabatan,
      peran: formInstrukturPeran,
      lokasi: formInstrukturLokasi,
      email: formInstrukturEmail,
      telepon: formInstrukturTelepon,
      gambar: formInstrukturGambar || defaultPic,
      tipe: 'Ahli Praktisi',
      status: formInstrukturStatus
    };
    setInstrukturList([newInstruktur, ...instrukturList]);
    setShowAddInstrukturModal(false);
    alert('Profil instruktur berhasil didaftarkan!');
  };

  const handleSaveEditInstruktur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstruktur) return;
    const defaultPic = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80';
    const updated = {
      ...editingInstruktur,
      nama: formInstrukturNama,
      bidang: formInstrukturBidang,
      jabatan: formInstrukturJabatan,
      peran: formInstrukturPeran,
      lokasi: formInstrukturLokasi,
      email: formInstrukturEmail,
      telepon: formInstrukturTelepon,
      gambar: formInstrukturGambar || defaultPic,
      status: formInstrukturStatus
    };
    setInstrukturList(prev => prev.map(i => i.id === editingInstruktur.id ? updated : i));
    setEditingInstruktur(null);
    alert('Profil instruktur sukses diperbarui!');
  };

  const handleDeleteInstruktur = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus profil instruktur ini secara permanen?')) {
      setInstrukturList(prev => prev.filter(i => i.id !== id));
      alert('Profil instruktur berhasil dihapus!');
    }
  };

  const getStatusBadgeStyle = (status: Peserta['status']) => {
    switch (status) {
      case 'Lulus Unggulan':
        return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white';
      case 'Lulus':
        return 'bg-emerald-600 text-white';
      case 'Aktif':
      default:
        return 'bg-blue-900 text-white';
    }
  };

  const handleSendConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationText.trim()) return;

    // Simulate sending
    setConsultationSuccess(true);
    setTimeout(() => {
      setConsultationText('');
      setConsultationSuccess(false);
      alert(`Pesan konsultasi sukses terkirim ke WhatsApp/Portal ${selectedPeserta?.nama}!`);
    }, 1200);
  };

  if (selectedPeserta) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6 animate-fadeIn text-left relative">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img src={selectedPeserta.gambar} alt={selectedPeserta.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-blue-900 font-sans tracking-tight flex items-center gap-1.5 flex-wrap">
                {selectedPeserta.nama}
                {selectedPeserta.terverifikasi && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{selectedPeserta.alamat || (selectedPeserta as any).kecamatan || ''}</p>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedPeserta(null)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>



        {/* Achievement Paragraph */}
        {selectedPeserta.detailData?.kontribusi && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Kontribusi Sosial</h4>
            <p className="text-xs sm:text-sm text-slate-600 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 italic font-medium">
              "{selectedPeserta.detailData.kontribusi}"
            </p>
          </div>
        )}

        {/* Action Consultation Form */}
        <div className="border-t border-slate-150 pt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-sans">
            <MessageSquare className="w-4.5 h-4.5 text-blue-900" />
            Kirim Pesan Konsultasi / Pendampingan
          </h4>
          <form onSubmit={handleSendConsultation} className="space-y-2">
            <textarea
              placeholder="Tuliskan pesan pembinaan, jadwal tim lapangan, atau pertanyaan teknis..."
              rows={3}
              value={consultationText}
              onChange={(e) => setConsultationText(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
            <div className="flex justify-between items-center flex-wrap gap-2 pt-1">
              <span className="text-[10px] text-slate-400">Pesan akan dikirim langsung via WhatsApp Mitra Binaan.</span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedPeserta(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!consultationText.trim()}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 active:scale-95"
                >
                  {consultationSuccess ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showAddDinasModal) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-blue-50 text-blue-900 rounded-2xl shadow-sm">
              <Plus className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-blue-900 font-sans tracking-tight">Tambah Profil Dinas</h1>
              <p className="text-xs text-slate-500 font-medium">Tambah profil aparatur pembina dinas Kabupaten Lahat</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddDinasModal(false)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <form onSubmit={handleSaveAddDinas} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input type="text" required value={formDinasNama} onChange={e => setFormDinasNama(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instansi *</label>
              <input type="text" required value={formDinasInstansi} onChange={e => setFormDinasInstansi(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1">Jabatan *</label>
              <input type="text" required value={formDinasJabatan} onChange={e => setFormDinasJabatan(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-705 mb-1">NIP / Identitas</label>
              <input type="text" value={formDinasNip} onChange={e => setFormDinasNip(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1">Status Peran / Tag Pembinaan *</label>
              <input type="text" required placeholder="Contoh: Pembina Utama" value={formDinasStatus} onChange={e => setFormDinasStatus(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-707 mb-1 font-semibold">Lokasi Wilayah Kerja *</label>
              <input type="text" required value={formDinasLokasi} onChange={e => setFormDinasLokasi(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Uraian Tugas / Kebijakan Peran *</label>
            <textarea required rows={3} placeholder="Menjelaskan peran pembinaan dalam perikanan lokal..." value={formDinasPeran} onChange={e => setFormDinasPeran(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-710 mb-1 font-semibold">Alamat Email *</label>
              <input type="email" required value={formDinasEmail} onChange={e => setFormDinasEmail(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-710 mb-1 font-semibold">Nomor Telepon Kontak *</label>
              <input type="text" required value={formDinasTelepon} onChange={e => setFormDinasTelepon(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700 mb-1">Foto Profil Aparatur Dinas *</label>
            <div className="flex items-center gap-4">
              {formDinasGambar && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img src={formDinasGambar} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleDinasFileChange} 
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau WEBP. Maksimal 2MB.</p>
              </div>
            </div>
          </div>


          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs">
            <button type="button" onClick={() => setShowAddDinasModal(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-colors">Batal</button>
            <button type="submit" className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95">Simpan Profil Dinas</button>
          </div>
        </form>
      </div>
    );
  }

  if (editingDinas) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl shadow-sm">
              <Edit2 className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-indigo-900 font-sans tracking-tight">Edit Profil Dinas</h1>
              <p className="text-xs text-slate-500 font-medium">Perbarui profil dan tanggung jawab aparatur dinas {formDinasNama}</p>
            </div>
          </div>
          
          <button
            onClick={() => setEditingDinas(null)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <form onSubmit={handleSaveEditDinas} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input type="text" required value={formDinasNama} onChange={e => setFormDinasNama(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instansi *</label>
              <input type="text" required value={formDinasInstansi} onChange={e => setFormDinasInstansi(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1">Jabatan *</label>
              <input type="text" required value={formDinasJabatan} onChange={e => setFormDinasJabatan(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-705 mb-1 font-semibold">NIP / Identitas</label>
              <input type="text" value={formDinasNip} onChange={e => setFormDinasNip(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1">Status Peran / Tag Pembinaan *</label>
              <input type="text" required value={formDinasStatus} onChange={e => setFormDinasStatus(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-707 mb-1 font-semibold">Lokasi Wilayah Kerja *</label>
              <input type="text" required value={formDinasLokasi} onChange={e => setFormDinasLokasi(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 font-semibold">Uraian Tugas / Kebijakan Peran *</label>
            <textarea required rows={3} value={formDinasPeran} onChange={e => setFormDinasPeran(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-710 mb-1">Alamat Email *</label>
              <input type="email" required value={formDinasEmail} onChange={e => setFormDinasEmail(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-710 mb-1">Nomor Telepon Kontak *</label>
              <input type="text" required value={formDinasTelepon} onChange={e => setFormDinasTelepon(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700 mb-1">Foto Profil *</label>
            <div className="flex items-center gap-4">
              {formDinasGambar && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img src={formDinasGambar} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleDinasFileChange} 
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-indigo-50 file:text-indigo-900 hover:file:bg-indigo-100 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau WEBP. Maksimal 2MB.</p>
              </div>
            </div>
          </div>


          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs">
            <button type="button" onClick={() => setEditingDinas(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-colors">Batal</button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    );
  }

  if (showAddInstrukturModal) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-blue-50 text-blue-900 rounded-2xl shadow-sm">
              <Plus className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-blue-900 font-sans tracking-tight">Tambah Instruktur Baru</h1>
              <p className="text-xs text-slate-500 font-medium font-semibold">Daftarkan instruktur teknis dan tenaga ahli pembimbing lapangan</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddInstrukturModal(false)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <form onSubmit={handleSaveAddInstruktur} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input type="text" required value={formInstrukturNama} onChange={e => setFormInstrukturNama(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bidang Spesialisasi / Keahlian *</label>
              <input type="text" required placeholder="Contoh: Manajemen RAS / Bioflok" value={formInstrukturBidang} onChange={e => setFormInstrukturBidang(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1 font-bold">Jabatan Peran *</label>
              <input type="text" required value={formInstrukturJabatan} onChange={e => setFormInstrukturJabatan(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-705 mb-1">Tempat/Wilayah Pendampingan *</label>
              <input type="text" required value={formInstrukturLokasi} onChange={e => setFormInstrukturLokasi(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1">Status Sertifikasi / Level *</label>
              <input type="text" required placeholder="Contoh: Instruktur Ahli" value={formInstrukturStatus} onChange={e => setFormInstrukturStatus(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Fokus Tugas & Peran Bimbingan *</label>
            <textarea required rows={3} placeholder="Menjelaskan bimbingan teknis yang diberikan ke kelompok..." value={formInstrukturPeran} onChange={e => setFormInstrukturPeran(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-710 mb-1">Alamat Email *</label>
              <input type="email" required value={formInstrukturEmail} onChange={e => setFormInstrukturEmail(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-710 mb-1">Nomor Telepon Kontak *</label>
              <input type="text" required value={formInstrukturTelepon} onChange={e => setFormInstrukturTelepon(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700 mb-1">Foto Profil *</label>
            <div className="flex items-center gap-4">
              {formInstrukturGambar && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img src={formInstrukturGambar} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleInstrukturFileChange} 
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau WEBP. Maksimal 2MB.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs">
            <button type="button" onClick={() => setShowAddInstrukturModal(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-colors">Batal</button>
            <button type="submit" className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95">Simpan Instruktur</button>
          </div>
        </form>
      </div>
    );
  }

  if (editingInstruktur) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl shadow-sm">
              <Edit2 className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-indigo-900 font-sans tracking-tight">Edit Profil Instruktur</h1>
              <p className="text-xs text-slate-500 font-semibold font-medium">Perbarui kualifikasi & penugasan instruktur {formInstrukturNama}</p>
            </div>
          </div>
          
          <button
            onClick={() => setEditingInstruktur(null)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <form onSubmit={handleSaveEditInstruktur} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input type="text" required value={formInstrukturNama} onChange={e => setFormInstrukturNama(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bidang Spesialisasi / Keahlian *</label>
              <input type="text" required value={formInstrukturBidang} onChange={e => setFormInstrukturBidang(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1">Jabatan Peran *</label>
              <input type="text" required value={formInstrukturJabatan} onChange={e => setFormInstrukturJabatan(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-705 mb-1">Tempat/Wilayah Pendampingan *</label>
              <input type="text" required value={formInstrukturLokasi} onChange={e => setFormInstrukturLokasi(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-705 mb-1">Status Sertifikasi / Level *</label>
              <input type="text" required value={formInstrukturStatus} onChange={e => setFormInstrukturStatus(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Fokus Tugas & Peran Bimbingan *</label>
            <textarea required rows={3} value={formInstrukturPeran} onChange={e => setFormInstrukturPeran(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-710 mb-1">Alamat Email *</label>
              <input type="email" required value={formInstrukturEmail} onChange={e => setFormInstrukturEmail(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-710 mb-1">Nomor Telepon Kontak *</label>
              <input type="text" required value={formInstrukturTelepon} onChange={e => setFormInstrukturTelepon(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700 mb-1">Foto Profil *</label>
            <div className="flex items-center gap-4">
              {formInstrukturGambar && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img src={formInstrukturGambar} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleInstrukturFileChange} 
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau WEBP. Maksimal 2MB.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs">
            <button type="button" onClick={() => setEditingInstruktur(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-colors">Batal</button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95">Simpan Perubahan</button>
          </div>
        </form>
      </div>
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
              <h1 className="text-xl font-extrabold text-blue-900 font-sans tracking-tight">Daftarkan Mitra Binaan Baru</h1>
              <p className="text-xs text-slate-500 font-medium">Tambah profil pendampingan mitra tani perikanan Lahat 2026</p>
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

        <form onSubmit={handleSaveAdd} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input type="text" required value={formNama} onChange={e => setFormNama(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat *</label>
              <input type="text" required placeholder="Contoh: Desa Merapi, Merapi Barat" value={formAlamat} onChange={e => setFormAlamat(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700 mb-1">Foto Profil *</label>
            <div className="flex items-center gap-4">
              {formGambar && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img src={formGambar} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau WEBP. Maksimal 2MB.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs">
            <button type="button" onClick={() => setShowAddModal(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-colors">Batal</button>
            <button type="submit" className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95">Simpan Mitra Binaan</button>
          </div>
        </form>
      </div>
    );
  }

  if (editingPeserta) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl shadow-sm">
              <Edit2 className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-indigo-900 font-sans tracking-tight">Edit Profil Mitra Binaan</h1>
              <p className="text-xs text-slate-500 font-medium">Perbarui profil dan parameter audit periodik {formNama}</p>
            </div>
          </div>
          
          <button
            onClick={() => setEditingPeserta(null)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input type="text" required value={formNama} onChange={e => setFormNama(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat *</label>
              <input type="text" required placeholder="Contoh: Desa Merapi, Merapi Barat" value={formAlamat} onChange={e => setFormAlamat(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700 mb-1">Foto Profil *</label>
            <div className="flex items-center gap-4">
              {formGambar && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img src={formGambar} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau WEBP. Maksimal 2MB.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 text-xs">
            <button type="button" onClick={() => setEditingPeserta(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-colors">Batal</button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    );
  }  return (
    <div className="space-y-[10px] animate-fadeIn">
      {/* View Header with Dinas, Instruktur, Peserta Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-auto max-w-md">
          <button
            type="button"
            onClick={() => setActiveSubTab('dinas')}
            className={`flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'dinas' 
                ? 'bg-blue-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dinas
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('instruktur')}
            className={`flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'instruktur' 
                ? 'bg-blue-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Instruktur
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('peserta')}
            className={`flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'peserta' 
                ? 'bg-blue-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Peserta
          </button>
        </div>

        {activeSubTab === 'peserta' && isLoggedIn && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="shrink-0 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-4 py-2.5 text-center rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Pendaftaran Mitra Baru</span>
          </button>
        )}

        {activeSubTab === 'dinas' && isLoggedIn && (
          <button
            type="button"
            onClick={handleOpenAddDinas}
            className="shrink-0 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-4 py-2.5 text-center rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Staff Dinas</span>
          </button>
        )}

        {activeSubTab === 'instruktur' && isLoggedIn && (
          <button
            type="button"
            onClick={handleOpenAddInstruktur}
            className="shrink-0 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-4 py-2.5 text-center rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Instruktur Baru</span>
          </button>
        )}
      </div>

      {/* DINAS SUB-TAB */}
      {activeSubTab === 'dinas' && (
        <>
          {dinasList.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <p className="text-slate-700 font-bold text-base">Tidak ada profil dinas ditemukan</p>
            </div>
          )}

          {dinasList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] text-left">
              {dinasList.map((dinas) => (
                <div key={dinas.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div className="w-full aspect-[4/5] bg-slate-100 relative overflow-hidden group/img">
                    <img src={dinas.gambar} alt={dinas.nama} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
                    }} referrerPolicy="no-referrer" />
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                      <span className="py-1 px-2.5 rounded-lg text-[10px] font-extrabold shadow-sm bg-blue-900 text-white">
                        {dinas.status}
                      </span>
                      <span className="bg-emerald-500 text-white py-1 px-2.5 rounded-lg text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-white" />
                        Resmi
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 z-10 bg-slate-900/75 backdrop-blur-sm text-white py-1 px-2.5 rounded-lg text-[10px] font-extrabold tracking-wide flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{dinas.lokasi}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight group-hover:text-blue-900 transition-colors">
                        {dinas.nama}
                      </h3>
                      <p className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">{dinas.jabatan}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-semibold">{dinas.nip} • {dinas.instansi}</p>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-4 font-normal mt-1 pt-1 border-t border-slate-100/50">
                        {dinas.peran}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dinas.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dinas.telepon}</span>
                        </div>
                      </div>
                      {isLoggedIn && (
                        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                          <button
                            onClick={(e) => handleOpenEditDinas(dinas, e)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit Profil Dinas"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteDinas(dinas.id, e)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Hapus Profil Dinas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* INSTRUKTUR SUB-TAB */}
      {activeSubTab === 'instruktur' && (
        <>
          {instrukturList.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <p className="text-slate-700 font-bold text-base">Tidak ada profil instruktur ditemukan</p>
            </div>
          )}

          {instrukturList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] text-left">
              {instrukturList.map((instruktur) => (
                <div key={instruktur.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div className="w-full aspect-[4/5] bg-slate-100 relative overflow-hidden group/img">
                    <img src={instruktur.gambar} alt={instruktur.nama} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80';
                    }} referrerPolicy="no-referrer" />
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                      <span className="py-1 px-2.5 rounded-lg text-[10px] font-extrabold shadow-sm bg-indigo-900 text-white">
                        {instruktur.status}
                      </span>
                      <span className="bg-amber-500 text-white py-1 px-2.5 rounded-lg text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                        <Award className="w-3 h-3 text-white" />
                        Sertifikasi Ahli
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 z-10 bg-slate-900/75 backdrop-blur-sm text-white py-1 px-2.5 rounded-lg text-[10px] font-extrabold tracking-wide flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{instruktur.lokasi}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight group-hover:text-indigo-900 transition-colors">
                        {instruktur.nama}
                      </h3>
                      <p className="text-xs font-bold text-indigo-700">{instruktur.jabatan}</p>
                      <div className="mt-1">
                        <span className="text-[9px] font-extrabold text-indigo-800 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                          Spesialis: {instruktur.bidang}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-4 font-normal mt-2 pt-1 border-t border-slate-100/50">
                        {instruktur.peran}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{instruktur.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{instruktur.telepon}</span>
                        </div>
                      </div>
                      {isLoggedIn && (
                        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                          <button
                            onClick={(e) => handleOpenEditInstruktur(instruktur, e)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit Profil Instruktur"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteInstruktur(instruktur.id, e)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Hapus Profil Instruktur"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* PESERTA SUB-TAB */}
      {activeSubTab === 'peserta' && (
        <>
          {/* No outcomes notice */}
          {pesertaList.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <p className="text-slate-700 font-bold text-base">Tidak ada profil peserta ditemukan</p>
            </div>
          )}

          {/* Card Showcase Grid */}
          {pesertaList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] text-left">
              {pesertaList.map((peserta) => (
                <div 
                  key={peserta.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Photo section in 4:5 Ratio */}
                  <div className="w-full aspect-[4/5] bg-slate-100 relative overflow-hidden group/img">
                    <img
                      src={peserta.gambar}
                      alt={peserta.nama}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.dataset.failed) {
                          img.dataset.failed = "true";
                          img.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                        } else {
                          // Inline SVG fallback on double-failure to prevent freeze loops
                          img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
                        }
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Status Badge overlay */}
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                      {peserta.terverifikasi && (
                        <span className="bg-emerald-500 text-white py-1 px-2.5 rounded-lg text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          Terverifikasi
                        </span>
                      )}
                    </div>

                    {/* Alamat Location tag overlay */}
                    <div className="absolute bottom-3 left-3 z-10 bg-slate-900/75 backdrop-blur-sm text-white py-1 px-2.5 rounded-lg text-[10px] font-extrabold tracking-wide flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{peserta.alamat || (peserta as any).kecamatan || ''}</span>
                    </div>
                  </div>

                  {/* Description & details section */}
                  <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight group-hover:text-blue-900 transition-colors">
                          {peserta.nama}
                        </h3>
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/20">
                      <div className="flex items-center gap-1">
                        <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-blue-900" />
                          <span className="hidden sm:inline">Lahat, Sumsel</span>
                        </div>

                        {isLoggedIn && (
                          <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-2">
                            <button
                              onClick={(e) => handleOpenEdit(peserta, e)}
                              className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Edit Peserta"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(peserta.id, e)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Hapus Peserta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPeserta(peserta);
                          setConsultationSuccess(false);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-900 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 active:scale-95 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail Peserta
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
