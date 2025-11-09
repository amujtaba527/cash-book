"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, TransactionType } from '@/utils/types';
import SummaryCard from '@/components/SummaryCard';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import CategorySummary from '@/components/CategorySummary';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PlusIcon, FilterIcon, CloseIcon, DownloadIcon } from '@/components/icons';

const STORAGE_KEY = 'cashBookTransactions';

type FilterType = 'ALL' | TransactionType;

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem(STORAGE_KEY);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Failed to load transactions from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions to localStorage", error);
    }
  }, [transactions]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    const handleAppInstalled = () => {
        setInstallPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
    } else {
        console.log('User dismissed the install prompt');
    }
    setInstallPrompt(null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (filterType !== 'ALL' && tx.type !== filterType) {
        return false;
      }
      if (!startDate && !endDate) return true;
      const txDate = new Date(tx.date);
      const start = startDate ? new Date(startDate + 'T00:00:00') : null;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;
      
      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      return true;
    });
  }, [transactions, startDate, endDate, filterType]);

  const { totalIn, totalOut, balance } = useMemo(() => {
    const totalIn = filteredTransactions
      .filter(tx => tx.type === TransactionType.IN)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalOut = filteredTransactions
      .filter(tx => tx.type === TransactionType.OUT)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = totalIn - totalOut;

    return { totalIn, totalOut, balance };
  }, [filteredTransactions]);

  const handleAddTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [
      ...prev,
      { ...newTransaction, id: new Date().getTime().toString() }
    ]);
  }, []);

  const handleInitiateDelete = useCallback((transaction: Transaction) => {
    setTransactionToDelete(transaction);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!transactionToDelete) return;
    setTransactions(prev => prev.filter(tx => tx.id !== transactionToDelete.id));
    setTransactionToDelete(null);
  }, [transactionToDelete]);

  const handleCancelDelete = () => {
    setTransactionToDelete(null);
  };

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilterType('ALL');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Cash Book</h1>
            <div className="flex items-center space-x-2">
                {installPrompt && (
                    <button 
                        onClick={handleInstallClick}
                        className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                        aria-label="Install app"
                        title="Install App"
                    >
                        <DownloadIcon className="w-5 h-5"/>
                        <span>Install</span>
                    </button>
                )}
                <button 
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                >
                    <FilterIcon className="w-5 h-5"/>
                    <span>Filter</span>
                </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
          
          {isFilterVisible && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-700">Filters</h3>
                    <button onClick={() => setIsFilterVisible(false)} className="text-slate-400 hover:text-slate-600">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                            <button type="button" onClick={() => setFilterType('ALL')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>All</button>
                            <button type="button" onClick={() => setFilterType(TransactionType.IN)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === TransactionType.IN ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Cash In</button>
                            <button type="button" onClick={() => setFilterType(TransactionType.OUT)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === TransactionType.OUT ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Cash Out</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-600">Start Date</label>
                        <input type="date" id="startDate" value={startDate || ''} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-slate-600">End Date</label>
                        <input type="date" id="endDate" value={endDate || ''} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    </div>
                    <button onClick={handleResetFilters} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors h-10">
                        Reset Filters
                    </button>
                </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <SummaryCard title="Total Cash In" amount={totalIn} colorClass="text-green-600" />
            <SummaryCard title="Total Cash Out" amount={totalOut} colorClass="text-red-600" />
            <SummaryCard title="Balance" amount={balance} colorClass={balance >= 0 ? 'text-slate-800' : 'text-red-600'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <TransactionList transactions={filteredTransactions} onInitiateDelete={handleInitiateDelete} totalTransactionCount={transactions.length} />
            </div>
            <div className="md:col-span-1">
                <CategorySummary transactions={filteredTransactions} />
            </div>
          </div>
        </main>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-40"
        aria-label="Add new transaction"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
      />

      <ConfirmationModal
        isOpen={!!transactionToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        transaction={transactionToDelete}
      />
    </>
  );
};

export default App;