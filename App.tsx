import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/ItemDetails';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          
          <footer className="bg-slate-900 text-slate-400 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <span className="font-bold text-white text-lg">Campus P2P by CipherOps</span>
                    <p className="text-sm mt-1">Safe Peer-to-Peer Renting for Students</p>
                </div>
                <div className="flex space-x-6 text-sm">
                    <a href="#" className="hover:text-white">Refund Policy</a>
                    <a href="#" className="hover:text-white">Terms of Use</a>
                    <a href="#" className="hover:text-white">Safety Guidelines</a>
                </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;