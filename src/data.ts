import { Laporan, Peserta, Transaksi } from './types';

export const INITIAL_LAPORAN: Laporan[] = [
  {
    id: 'l-1',
    tanggal: '12 Oktober 2026',
    judul: 'Manajemen Kualitas Air Sungai',
    deskripsi: 'Praktek pengukuran pH, suhu, dan oksigen terlarut (DO) langsung di aliran sungai Lahat. Pembuatan laporan awal kesesuaian habitat.',
    tag: 'Modul 3',
    oleh: 'Kelompok Tani Harapan',
    status: 'Berjalan',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzqh8jISYnw8CovqkR3yjxb-qjvDEFcNd66bVMiMS2u7HPgY623-5gzdpF0jsYYMtQKlhEwqEO7twcFPgOyCc5J-OU1ag7XF8BquVt_bXbPC9dyRdLr4oKBwl-b4lwTPJWkCJsa1R36QEGELs_HGpKnM-pbwDDQ_2oH3urBjUSQIa8FJENcgbiAwhMHPGs_CtiGuZ3e8bBzZcnMJB7Fk5XmHgagpeXLJUmPCW1hsK4sSdiICPJYoIYx0Lh7XtcEeAzwkCfiHPzxsg'
  },
  {
    id: 'l-2',
    tanggal: '11 Oktober 2026',
    judul: 'Pemilihan Benih Ikan Patin Unggul',
    deskripsi: 'Teori dan identifikasi visual ciri-ciri benih ikan patin yang sehat. Simulasi proses aklimatisasi benih ke air kolam terpal.',
    tag: 'Modul 1',
    oleh: 'Bpk. Supriyadi',
    status: 'Selesai',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJViVKFKpPGSa13GjP2HVm30cjQB-iv_1gxSsxdWelfoIa0GUCCXhtv7BOWpqng_MyEdvmeBoRxVbVYi294C9M_PNf8P9Y0xhNSnzt8UiWBi1hLusP7kdW0OwvkKQyZjvqX4NIdTJ_riRc2kSr9Qv05GfT-kOF2LSc28sI8x0Mxjp9HTsEmZazuqYRR0Hx7J1qZt56y47lhvDBQfQBupW7Zg6sRu2JpvtkhxiPoNcVNvj3jtOLARRVPwlabH1GDlR4I3B0XEhIOqs'
  },
  {
    id: 'l-3',
    tanggal: '10 Oktober 2026',
    judul: 'Desain & Konstruksi Keramba Jaring Apung (KJA)',
    deskripsi: 'Sesi teori mengenai spesifikasi material jaring yang tahan arus sungai dan cara perakitan rangka KJA standar keamanan Lahat.',
    tag: 'Modul 3',
    oleh: 'Instruktur Pusat',
    status: 'Selesai',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnWma-wHc61wE3_lud6hn8kbB1B9kA0RH7fOkrbrkqxGtj2RdtY3n8suxEkZkU6x1dTZ-De82KEb8xWXMXnocwy9e7zKCoeJ5SVwC3_es8rip-CWcsZu1OSuoz2YGQD9sf5gYv5ysNG13q-g85z0X79hmvQBRP1bjlGH0W4KodQbDEPaRuJ96rOLgYtc9salwfpiYyR9eIGGfeYUl1LT-Tovi6_16cmcBqn_OZx1aG6iywPtw7HSzBOmJ_FXBqUHCaMFpgIdDdc2Y'
  },
  {
    id: 'l-4',
    tanggal: '09 Oktober 2026',
    judul: 'Praktek Pembuatan Pakan Alternatif',
    deskripsi: 'Sesi lapangan pembuatan pellet mandiri dari bahan baku lokal (bekatul, ikan rucah) untuk menekan biaya operasional budi daya.',
    tag: 'Jurnal',
    oleh: 'Kelompok Tani Tirta',
    status: 'Tertunda (Cuaca)',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOIQdq2PO34WcebfGt-NFYutJuVn1kVFekhvnu-e8IF-WXqcpVJUA6lUXnfgPkDDpPeLKrZeG8Z-9I97iGJE2UiRNwpwsRvaslEQ2PtRI04y_4D-kwf8II29hYVIvHbleyrxDeVvl0jJPAwV95Wev1rtKcoXLfQJg1vcTZCSRzjKOP5lV3HY56RTWTuTVlAVMr_GjOGW5y02A2GM_N3R8d3917X8nSzkkNltiILjj3GFKE77R0xiSxZEoLZsvZGmrM6c5qW06Yc_g'
  },
  {
    id: 'l-5',
    tanggal: '08 Oktober 2026',
    judul: 'Teknik Penebaran Benih',
    deskripsi: 'Simulasi penebaran benih ikan ke dalam keramba jaring apung dengan teknik yang meminimalisir tingkat stres ikan.',
    tag: 'Modul 2',
    oleh: 'Instruktur Pusat',
    status: 'Selesai',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-nqu9cV5ZZVsFl-nCvQ_a8EQwmQFXoAD0sipYRNwPSI43u8uyFhetA8dWwBmjR6bKYNuKfMwbWrjjvrXnpDxSQp5eqI_D1t-uXG60Puv18CIQaII1-3cnDV-NHO070eIRa8R-RwR3WcGUyGUeMQjerbjcSYk5AgA9z0ZPsoN2w8G-iKg6EWurU1CtrtBJCwvApM5e4hvxNwFQTYFr3r_TCzzSZGMRl7OtT3kcKEAy86J7U3dfNbubuf31NV0a3SzmpiAa9Ir6kUM'
  },
  {
    id: 'l-6',
    tanggal: '07 Oktober 2026',
    judul: 'Pengenalan Hama & Penyakit Ikan',
    deskripsi: 'Pemaparan jenis-jenis penyakit umum pada ikan sungai dan metode pencegahan serta pengobatan yang tepat sasaran.',
    tag: 'Modul 1',
    oleh: 'Dinas Perikanan',
    status: 'Selesai',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0wFcpoyVPQFM5jluactC3k22yPuJJsZ9Qe_mx267rkzpZL1lhWD69oAEGbJ7ZWMWUisvD8w6TuMz3yZR-BVwFhbE84sgGnLs9NpHMYPh0Ag8zeyhMOQahT19h0EkZEeX5Le1wKmym6dxftKT-RAMt-BugE4CQUoZgRswRrMmBBuTpr-IoudyD4aAtFv0sgDxVP6_WtYg3GkTg7H_elk3qI1oMfskO76uoq400K6RiYtfzxC4Ue4TFpu9gALR2_9ui5QCUP7x4HA0'
  },
  {
    id: 'l-7',
    tanggal: '05 Oktober 2026',
    judul: 'Konsolidasi dan Penggalangan Dana',
    deskripsi: 'Tim Konservasi melaksanakan audiensi ke BRIDA (Badan Riset dan Inovasi Daerah) Provinsi Sumatera Selatan guna persiapan fasilitas pendederan.',
    tag: 'Jurnal',
    oleh: 'Tim Pelaksana',
    status: 'Selesai',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzqh8jISYnw8CovqkR3yjxb-qjvDEFcNd66bVMiMS2u7HPgY623-5gzdpF0jsYYMtQKlhEwqEO7twcFPgOyCc5J-OU1ag7XF8BquVt_bXbPC9dyRdLr4oKBwl-b4lwTPJWkCJsa1R36QEGELs_HGpKnM-pbwDDQ_2oH3urBjUSQIa8FJENcgbiAwhMHPGs_CtiGuZ3e8bBzZcnMJB7Fk5XmHgagpeXLJUmPCW1hsK4sSdiICPJYoIYx0Lh7XtcEeAzwkCfiHPzxsg'
  },
  {
    id: 'l-8',
    tanggal: '03 Oktober 2026',
    judul: 'Sosialisasi Penyiapan Kolam Terpal',
    deskripsi: 'Praktek pemasangan kerangka besi kolam bundar berdiameter 3 meter. Pemasangan terpal dan penyiapan media filter air alami.',
    tag: 'Modul 2',
    oleh: 'Bpk. Supriyadi',
    status: 'Selesai',
    gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnWma-wHc61wE3_lud6hn8kbB1B9kA0RH7fOkrbrkqxGtj2RdtY3n8suxEkZkU6x1dTZ-De82KEb8xWXMXnocwy9e7zKCoeJ5SVwC3_es8rip-CWcsZu1OSuoz2YGQD9sf5gYv5ysNG13q-g85z0X79hmvQBRP1bjlGH0W4KodQbDEPaRuJ96rOLgYtc9salwfpiYyR9eIGGfeYUl1LT-Tovi6_16cmcBqn_OZx1aG6iywPtw7HSzBOmJ_FXBqUHCaMFpgIdDdc2Y'
  }
];

export const INITIAL_PESERTA: Peserta[] = [
  {
    id: 'p-1',
    nama: 'Ahmad Riyadi',
    alamat: 'Kecamatan Merapi Barat',
    kelompok: 'Kelompok Tani Tirta Makmur',
    status: 'Aktif',
    terverifikasi: true,
    deskripsi: 'Berhasil mengimplementasikan sistem bioflok untuk pembesaran ikan nila. Mencatat tingkat survival rate (SR) hingga 88% dengan pemberian probiotik berkala dan kontrol oksigen terlarut.',
    gambar: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80',
    detailData: {
      kondisiAir: 'pH 7.2 - 7.5 | Oksigen Terlarut > 5.5 mg/L',
      fcr: 1.25,
      survivalRate: '88%',
      lokasiKolam: 'Desa Merapi, Merapi Barat',
      luasKolam: 'Kolam Bioflok Bulat D3 (5 Unit)',
      kontribusi: 'Ketua Kelompok, aktif melatih 12 pemuda setempat dalam manajemen pakan.'
    }
  },
  {
    id: 'p-2',
    nama: 'Siti Aminah',
    alamat: 'Kecamatan Kikim Timur',
    kelompok: 'Koperasi Mina Mandiri',
    status: 'Lulus Unggulan',
    terverifikasi: true,
    deskripsi: 'Fokus pada pembenihan ikan lele strain unggul. Menjadi mentor bagi 3 kelompok tani baru di wilayahnya setelah berhasil meningkatkan hatch rate hingga 92% menggunakan rekayasa temperatur air.',
    gambar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    detailData: {
      kondisiAir: 'Suhu Terjaga 28°C - 30°C',
      fcr: 1.12,
      survivalRate: '92%',
      lokasiKolam: 'Desa Kikim, Kikim Timur',
      luasKolam: 'Kolam Beton Pembenihan 4x6 Meter (4 Unit)',
      kontribusi: 'Penerima penghargaan inovator budi daya daerah, rutin membagikan bibit gratis ke dhuafa.'
    }
  },
  {
    id: 'p-3',
    nama: 'Budi Santoso',
    alamat: 'Kecamatan Lahat Selatan',
    kelompok: 'Kelompok Jaya Air',
    status: 'Aktif',
    terverifikasi: false,
    deskripsi: 'Sedang dalam tahap transisi dari metode konvensional ke sistem sirkulasi air tertutup (RAS). Mencatat data pertumbuhan harian secara detail untuk optimalisasi nutrisi pakan mandiri.',
    gambar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    detailData: {
      kondisiAir: 'Sistem RAS terfilter biologi',
      fcr: 1.35,
      survivalRate: '82%',
      lokasiKolam: 'Tanjung Tebat, Lahat Selatan',
      luasKolam: 'Pondasi Beratap Galvalum, 8 Kolam Bioflok',
      kontribusi: 'Sekretaris kelompok, aktif memperbaharui buku kas dan transparansi keuangan.'
    }
  },
  {
    id: 'p-4',
    nama: 'Dian Safitri',
    alamat: 'Kecamatan Merapi Timur',
    kelompok: 'Kelompok Mina Lestari',
    status: 'Lulus',
    terverifikasi: true,
    deskripsi: 'Sukses membesarkan Ikan Patin dengan padat tebar tinggi di kolam terpal. Menggunakan pakan alternatif berbahan bekatul fermentasi ragi.',
    gambar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    detailData: {
      kondisiAir: 'pH 6.8 - 7.2 | Air Hijau Chlorella',
      fcr: 1.40,
      survivalRate: '85%',
      lokasiKolam: 'Desa Prabu Menang, Merapi Timur',
      luasKolam: 'Kolam Terpal Persegi 3x5 Meter (6 Unit)',
      kontribusi: 'Inisiator dapur pakan mandiri, mengurangi kebergantungan kelompok pada pabrikan.'
    }
  },
  {
    id: 'p-5',
    nama: 'Hendra Wijaya',
    alamat: 'Kecamatan Lahat Kota',
    kelompok: 'Kelompok Maju Bersama',
    status: 'Aktif',
    terverifikasi: false,
    deskripsi: 'Mengembangkan pendederan nila merah di aliran irigasi persawahan. Sistem filter memanfaatkan eceng gondok sebagai peredam polutan sisa pupuk padi.',
    gambar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    detailData: {
      kondisiAir: 'Irigasi mengalir perlahan, DO tinggi',
      fcr: 1.30,
      survivalRate: '84%',
      lokasiKolam: 'Sukarame, Lahat Kota',
      luasKolam: 'Keramba Jaring Arus Lambat 2x4m (6 Petak)',
      kontribusi: 'Sosialisator sistem agroforestry integrasi padi-ikan (mina padi).'
    }
  },
  {
    id: 'p-6',
    nama: 'Sri Wahyuni',
    alamat: 'Kecamatan Mulak Ulu',
    kelompok: 'Kelompok Mandiri Sejahtera',
    status: 'Lulus Unggulan',
    terverifikasi: true,
    deskripsi: 'Pelopor budi daya ikan Gurami di dataran tinggi Lahat. Berhasil menjaga anakan Gurami dari serangan hawar dingin dengan penutup terpal malam hari.',
    gambar: 'https://images.unsplash.com/photo-1534751516642-a131ffd10b7c?auto=format&fit=crop&w=400&q=80',
    detailData: {
      kondisiAir: 'Suhu dingin 18°C - 22°C (dengan heater alami surya)',
      fcr: 1.18,
      survivalRate: '90%',
      lokasiKolam: 'Desa Mulak, Mulak Ulu',
      luasKolam: 'Tanah Galian Berpematang Semen 5x10 Meter',
      kontribusi: 'Menyediakan kelas malam gratis untuk anak-anak peternak ikan tentang ekosistem air.'
    }
  }
];

export const INITIAL_TRANSAKSI: Transaksi[] = [
  {
    id: 't-1',
    tanggal: '05 Okt 2026',
    jenis: 'Masuk',
    deskripsi: 'Dana Alokasi Kegiatan APBD Perikanan',
    nominal: 150000000
  },
  {
    id: 't-2',
    tanggal: '12 Okt 2026',
    jenis: 'Keluar',
    deskripsi: 'Sewa Tenda, Panggung & Kursi Pembukaan',
    nominal: 15000000
  },
  {
    id: 't-3',
    tanggal: '14 Okt 2026',
    jenis: 'Keluar',
    deskripsi: 'Catering Makan Siang Peserta (Hari 1-3)',
    nominal: 22500000
  },
  {
    id: 't-4',
    tanggal: '15 Okt 2026',
    jenis: 'Keluar',
    deskripsi: 'Honorarium Pembicara Ahli (Dr. Ikan Lahat)',
    nominal: 5000000
  },
  {
    id: 't-5',
    tanggal: '16 Okt 2026',
    jenis: 'Keluar',
    deskripsi: 'Pembelian Bibit Ikan Patin & Lele Unggul (Demo Kerja)',
    nominal: 27500000
  },
  {
    id: 't-6',
    tanggal: '17 Okt 2026',
    jenis: 'Masuk',
    deskripsi: 'Kontribusi CSR Tambahan Mitra Perikanan',
    nominal: 15000000
  },
  {
    id: 't-7',
    tanggal: '18 Okt 2026',
    jenis: 'Keluar',
    deskripsi: 'Pengadaan Alat Ukur Kualitas Air (pH & DO Meter)',
    nominal: 4500000
  }
];
