export interface Laporan {
  id: string;
  tanggal: string;
  judul: string;
  deskripsi: string;
  tag: string; // e.g. 'Modul 1', 'Modul 2', 'Modul 3', 'Jurnal'
  oleh: string;
  status: 'Berjalan' | 'Selesai' | 'Tertunda (Cuaca)';
  gambar: string;
  mediaList?: { type: 'image' | 'video'; url: string }[];
  googlePhotosUrl?: string;
}

export interface Peserta {
  id: string;
  nama: string;
  alamat: string;
  kelompok?: string;
  status?: 'Aktif' | 'Lulus Unggulan' | 'Lulus';
  terverifikasi: boolean;
  deskripsi?: string;
  gambar: string;
  detailData?: {
    kondisiAir?: string;
    fcr?: number; // Food Conversion Ratio
    survivalRate?: string;
    lokasiKolam?: string;
    luasKolam?: string;
    kontribusi?: string;
  };
}

export interface Transaksi {
  id: string;
  tanggal: string;
  jenis: 'Masuk' | 'Keluar'; // "Masuk" for income, "Keluar" for expense
  deskripsi: string;
  nominal: number;
}

export interface Dokumen {
  id: string;
  nama: string;
  tipe: 'sertifikat' | 'dokumen';
  deskripsi: string;
  tanggalUpload: string;
  fileSize: string;
  url?: string;
  namaFile: string;
}

