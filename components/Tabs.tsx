import React from 'react';

// Simple placeholder for consistency if imported
export const Tabs = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const TabsList = ({ children }: { children: React.ReactNode }) => <div className="flex space-x-2 border-b">{children}</div>;
export const TabsTrigger = ({ children }: { children: React.ReactNode }) => <button className="px-4 py-2 hover:bg-slate-100">{children}</button>;
export const TabsContent = ({ children }: { children: React.ReactNode }) => <div className="p-4">{children}</div>;