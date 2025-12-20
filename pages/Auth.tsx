
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, GraduationCap } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Strict Nitrr.ac.in check as requested
    if (!email.toLowerCase().endsWith('@nitrr.ac.in')) {
      setError('Exclusive platform: Please use your official university email (@nitrr.ac.in).');
      return;
    }

    const mockUser = {
      id: `u${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isVerified: true,
      rating: 5.0
    };

    setUser(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="bg-indigo-600 dark:bg-indigo-800 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold">Campus P2P Renting</h1>
          <p className="text-indigo-100 mt-2 text-sm font-medium">Student Exclusive Marketplace</p>
        </div>

        <div className="p-8">
          <div className="flex border-b border-slate-100 dark:border-slate-800 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 transition-colors" 
                    placeholder="Your Name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">University Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 transition-colors" 
                  placeholder="rollno@nitrr.ac.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 transition-colors" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-medium border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 justify-center">
            Student Only Community
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
