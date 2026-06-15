import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import LaporanView from './components/LaporanView';
import PortofolioView from './components/PortofolioView';
import LoginView from './components/LoginView';
import BrandView from './components/BrandView';
import DokumenView from './components/DokumenView';

import { INITIAL_LAPORAN, INITIAL_PESERTA, INITIAL_TRANSAKSI } from './data';
import { Laporan, Peserta, Transaksi } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['laporan', 'portofolio', 'dokumen', 'keuangan', 'beranda'].includes(tabParam)) {
      return tabParam;
    }
    return 'beranda';
  });


  // Authenticated state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('eo_logged') === 'true';
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('eo_user') || '';
  });

  // Dynamic journals state
  const [laporanList, setLaporanList] = useState<Laporan[]>(() => {
    const localData = localStorage.getItem('eo_laporan_list_2026');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        return INITIAL_LAPORAN;
      }
    }
    return INITIAL_LAPORAN;
  });

  // Dynamic transactions ledger state
  const [transactions, setTransactions] = useState<Transaksi[]>(() => {
    const localData = localStorage.getItem('eo_transactions_list_2026');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        return INITIAL_TRANSAKSI;
      }
    }
    return INITIAL_TRANSAKSI;
  });

  // Keep Unsplash profile participants constant
  const [pesertaList, setPesertaList] = useState<Peserta[]>(() => {
    const localData = localStorage.getItem('eo_peserta_list_2026');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        return INITIAL_PESERTA;
      }
    }
    return INITIAL_PESERTA;
  });

  // Sync state modifications with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('eo_laporan_list_2026', JSON.stringify(laporanList));
    } catch (e) {
      console.error('Error saving laporan list to localStorage:', e);
      alert('Penyimpanan lokal penuh! Mohon kurangi jumlah berkas yang Anda unggah.');
    }
  }, [laporanList]);

  useEffect(() => {
    try {
      localStorage.setItem('eo_transactions_list_2026', JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage:', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('eo_peserta_list_2026', JSON.stringify(pesertaList));
    } catch (e) {
      console.error('Error saving peserta list to localStorage:', e);
    }
  }, [pesertaList]);

  // Sync activeTab with URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get('tab');
    if (currentTab !== activeTab) {
      params.set('tab', activeTab);
      // Keep ID if we are on laporan tab and it was there
      if (activeTab !== 'laporan') {
        params.delete('id');
      }
      const newRelativePathQuery = window.location.pathname + '?' + params.toString();
      window.history.pushState(null, '', newRelativePathQuery);
    }
  }, [activeTab]);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') || 'beranda';
      if (['laporan', 'portofolio', 'dokumen', 'keuangan', 'beranda'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  // Auth synchronization handlers
  const handleLoginSuccess = (user: string) => {
    setIsLoggedIn(true);
    setUserName(user);
    localStorage.setItem('eo_logged', 'true');
    localStorage.setItem('eo_user', user);
    // Switch tab to home/beranda or keuangan
    setActiveTab('beranda');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('eo_logged');
    localStorage.removeItem('eo_user');
    setActiveTab('beranda');
  };

  // State addition handlers
  const handleAddLaporan = (newLaporan: Omit<Laporan, 'id'>) => {
    const item: Laporan = {
      ...newLaporan,
      id: `l-${Date.now()}`
    };
    setLaporanList([item, ...laporanList]);
  };

  const handleEditLaporan = (updatedLaporan: Laporan) => {
    setLaporanList(prev => prev.map(l => l.id === updatedLaporan.id ? updatedLaporan : l));
  };

  const handleDeleteLaporan = (id: string) => {
    setLaporanList(prev => prev.filter(l => l.id !== id));
  };

  const handleAddTransaction = (newTrans: Omit<Transaksi, 'id'>) => {
    const trans: Transaksi = {
      ...newTrans,
      id: `t-${Date.now()}`
    };
    setTransactions([trans, ...transactions]);
  };

  const handleEditTransaction = (updatedTrans: Transaksi) => {
    setTransactions(prev => prev.map(t => t.id === updatedTrans.id ? updatedTrans : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleResetTransactions = () => {
    setTransactions([]);
  };

  const handleOpenLogin = () => {
    setActiveTab('login');
  };

  const handleCloseLogin = () => {
    setActiveTab('beranda');
  };

  // Tab dynamic view selector helper
  const renderActiveView = () => {
    switch (activeTab) {
      case 'beranda':
        return <HomeView onNavigateToTab={setActiveTab} isLoggedIn={isLoggedIn} />;
      case 'laporan':
        return (
          <LaporanView 
            laporanList={laporanList} 
            onAddLaporan={handleAddLaporan} 
            onEditLaporan={handleEditLaporan}
            onDeleteLaporan={handleDeleteLaporan}
            isLoggedIn={isLoggedIn} 
          />
        );
      case 'portofolio':
        return (
          <PortofolioView 
            pesertaList={pesertaList} 
            setPesertaList={setPesertaList}
            isLoggedIn={isLoggedIn} 
          />
        );
      case 'dokumen':
        return <DokumenView isLoggedIn={isLoggedIn} />;

      case 'login':
        return <LoginView onLoginSuccess={handleLoginSuccess} onClose={handleCloseLogin} />;
      case 'brand':
        return <BrandView onGoBack={() => setActiveTab('beranda')} />;
      default:
        return <HomeView onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-[#f9f9ff]">
      {/* Universal header top bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
        onOpenLogin={handleOpenLogin} 
      />

      {/* Main Container Wrapper with appropriate 4rem top bar padding */}
      <main className="flex-grow pt-20 md:pt-24 w-full max-w-[1280px] mx-auto px-[10px] relative z-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Unified footer bar */}
      <Footer />
    </div>
  );
}
