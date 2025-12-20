
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/ItemDetails';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? <>{children}</> : null;
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-8 mb-8">
                <div className="mb-6 md:mb-0">
                    <span className="font-bold text-white text-xl">Campus P2P Renting</span>
                    <p className="text-sm mt-1 max-w-xs">Verified student marketplace for sharing resources safely within the university ecosystem.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                    <div>
                        <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs">
                <p>&copy; {new Date().getFullYear()} Campus P2P Renting. Student verified.</p>
                <div className="flex gap-4 mt-4 sm:mt-0">
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Status: Online</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
