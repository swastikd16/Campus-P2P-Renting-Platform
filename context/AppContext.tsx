
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Item, User, Transaction, ChatMessage } from '../types';
import { MOCK_ITEMS } from '../constants';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  items: Item[];
  addItem: (item: Item) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  messages: ChatMessage[];
  sendMessage: (itemId: string, text: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('campus_p2p_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Default to light mode (false) unless explicitly saved as true
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('campus_p2p_dark_mode') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('campus_p2p_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campus_p2p_user');
    }
  }, [user]);

  // Sync dark mode class and storage
  useEffect(() => {
    localStorage.setItem('campus_p2p_dark_mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const addItem = (item: Item) => {
    setItems(prev => [item, ...prev]);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const sendMessage = (itemId: string, text: string) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      itemId,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, items, addItem, transactions, addTransaction, messages, sendMessage,
      isDarkMode, toggleDarkMode 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
