
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle, Search, User, Home, LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/auth');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/marketplace', label: 'Marketplace', icon: <Search size={18} /> },
    { path: '/add-item', label: 'Lend Item', icon: <PlusCircle size={18} /> },
    { path: '/profile', label: 'Dashboard', icon: <User size={18} /> },
  ];

  return (
    <nav className="bg-indigo-600 dark:bg-indigo-900 text-white sticky top-0 z-50 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 font-bold text-xl">
              <div className="bg-white text-indigo-600 p-1.5 rounded-lg dark:bg-indigo-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <span>Campus P2P Renting</span>
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-700 dark:bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-500 dark:hover:bg-indigo-700'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-indigo-100 hover:bg-indigo-500 dark:hover:bg-indigo-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-500 dark:hover:bg-indigo-700 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
          
          <div className="-mr-2 flex items-center md:hidden gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-indigo-100 hover:bg-indigo-500 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-indigo-600 dark:bg-indigo-800 inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-500 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700 dark:bg-indigo-950">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-indigo-800 dark:bg-indigo-900 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600 dark:hover:bg-indigo-800'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            {user && (
               <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600 dark:hover:bg-indigo-800 transition-colors text-left"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
