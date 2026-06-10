import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';
import VoiceInput from './components/VoiceInput';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ScamFirewall from './pages/ScamFirewall';
import FinancialTwin from './pages/FinancialTwin';
import SchemeEligibility from './pages/SchemeEligibility';
import DocumentIntelligence from './pages/DocumentIntelligence';

function App() {
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-app-bg overflow-hidden">
      {showNav && <NavBar />}
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="max-w-content mx-auto px-4 md:px-8 py-5 md:py-7">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scam" element={<ScamFirewall />} />
              <Route path="/twin" element={<FinancialTwin />} />
              <Route path="/schemes" element={<SchemeEligibility />} />
              <Route path="/docs" element={<DocumentIntelligence />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
      
      {showNav && <VoiceInput />}
    </div>
  );
}

export default App;
