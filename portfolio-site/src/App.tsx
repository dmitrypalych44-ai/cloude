import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { NovosyolyPage } from './pages/NovosyolyPage';
import { DemoTourDock } from './components/DemoTourDock';

const isStandaloneFile =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'file:' ||
    window.location.pathname.endsWith('.html') ||
    (window as unknown as { __STANDALONE_DEMO__?: boolean }).__STANDALONE_DEMO__ === true);

const ScrollManager: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const section = params.get('section');
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, search]);

  return null;
};

const AppShell: React.FC = () => (
  <>
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
  </>
);

export const App: React.FC = () => {
  if (isStandaloneFile) {
    return (
      <HashRouter>
        <AppShell />
      </HashRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
