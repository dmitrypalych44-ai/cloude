import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { NovosyolyPage } from './pages/NovosyolyPage';
import { DemoTourDock } from './components/DemoTourDock';

const ScrollManager: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#141414]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/anketa" element={<QuestionnairePage />} />
            <Route path="/novosyoly" element={<NovosyolyPage />} />
          </Routes>
        </main>
        <Footer />
        <DemoTourDock />
      </div>
    </BrowserRouter>
  );
};

export default App;
