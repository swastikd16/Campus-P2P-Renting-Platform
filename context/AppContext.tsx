import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Item, User, Transaction } from '../types';
import { MOCK_ITEMS, CURRENT_USER } from '../constants';

interface AppContextType {
  user: User;
  items: Item[];
  addItem: (item: Item) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User>(CURRENT_USER);
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addItem = (item: Item) => {
    setItems(prev => [item, ...prev]);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  return (
    <AppContext.Provider value={{ user, items, addItem, transactions, addTransaction }}>
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
