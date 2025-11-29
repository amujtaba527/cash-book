"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, TransactionType, Liability, Receivable, LiabilityStatus, ReceivableStatus, TabView } from '@/utils/types';
import SummaryCard from '@/components/SummaryCard';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddDebtModal from '@/components/AddDebtModal';
import DebtList from '@/components/DebtList';
import CategorySummary from '@/components/CategorySummary';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PlusIcon, FilterIcon, CloseIcon, DownloadIcon } from '@/components/icons';

const STORAGE_KEY = 'cashBookTransactions';
const LIABILITIES_KEY = 'cashBookLiabilities';
const RECEIVABLES_KEY = 'cashBookReceivables';

type FilterType = 'ALL' | TransactionType | LiabilityStatus | ReceivableStatus;

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);

  const [activeTab, setActiveTab] = useState<TabView>('cashbook');

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Confirmation State
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    type: 'DELETE_TRANSACTION' | 'DELETE_LIABILITY' | 'DELETE_RECEIVABLE' | 'SETTLE_LIABILITY' | 'SETTLE_RECEIVABLE' | null;
    itemId: string | null;
    itemData?: any;
  }>({ isOpen: false, type: null, itemId: null });

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem(STORAGE_KEY);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      const storedLiabilities = localStorage.getItem(LIABILITIES_KEY);
      if (storedLiabilities) {
        setLiabilities(JSON.parse(storedLiabilities));
      }
      const storedReceivables = localStorage.getItem(RECEIVABLES_KEY);
      if (storedReceivables) {
        setReceivables(JSON.parse(storedReceivables));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
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
    try {
      localStorage.setItem(LIABILITIES_KEY, JSON.stringify(liabilities));
    } catch (error) {
      console.error("Failed to save liabilities to localStorage", error);
    }
  }, [liabilities]);

  useEffect(() => {
    try {
      localStorage.setItem(RECEIVABLES_KEY, JSON.stringify(receivables));
    } catch (error) {
      console.error("Failed to save receivables to localStorage", error);
    }
  }, [receivables]);

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

  // Filter Logic
  const filteredData = useMemo(() => {
    const filterDate = (dateStr: string) => {
      if (!startDate && !endDate) return true;
      const itemDate = new Date(dateStr);
      const start = startDate ? new Date(startDate + 'T00:00:00') : null;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    };

    if (activeTab === 'cashbook') {
      return transactions.filter(tx => {
        if (filterType !== 'ALL' && tx.type !== filterType) return false;
        return filterDate(tx.date);
      });
    } else if (activeTab === 'liabilities') {
      return liabilities.filter(l => {
        if (filterType !== 'ALL' && l.status !== filterType) return false;
        // Use dueDate for filtering if available, otherwise ignore date filter or use creation date? 
        // Let's use creation date if we had it, but we don't store it explicitly other than in ID maybe. 
        // Wait, I added 'date' to AddDebtModal but didn't update the type yet? 
        // I should update the type or just use what I have. 
        // The AddDebtModal saves 'date' but Liability type doesn't have it. I need to update types.ts first!
        // For now, let's assume I'll update types.ts.
        return true; // Placeholder until types updated
      });
    } else {
      return receivables.filter(r => {
        if (filterType !== 'ALL' && r.status !== filterType) return false;
        return true; // Placeholder
      });
    }
  }, [transactions, liabilities, receivables, activeTab, startDate, endDate, filterType]);

  // I need to update types.ts to include 'date' in Liability and Receivable.
  // I will do that in a separate tool call. For now, I'll proceed with page.tsx assuming the property exists or I'll fix it shortly.
  // Actually, I should probably fix types.ts first to avoid errors.
  // But I'm already in write_to_file for page.tsx. I'll finish this and then fix types.ts.

  const { totalIn, totalOut, balance } = useMemo(() => {
    // Calculate from ALL transactions (which now include debt-related ones)
    const totalIn = transactions
      .filter(tx => tx.type === TransactionType.IN)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalOut = transactions
      .filter(tx => tx.type === TransactionType.OUT)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = totalIn - totalOut;

    return { totalIn, totalOut, balance };
  }, [transactions]);

  const totalLiabilities = useMemo(() => liabilities.filter(l => l.status === LiabilityStatus.PENDING).reduce((sum, l) => sum + l.amount, 0), [liabilities]);
  const totalReceivables = useMemo(() => receivables.filter(r => r.status === ReceivableStatus.PENDING).reduce((sum, r) => sum + r.amount, 0), [receivables]);

  const handleAddTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [
      ...prev,
      { ...newTransaction, id: new Date().getTime().toString() }
    ]);
  }, []);

  const handleAddDebt = (data: { description: string; amount: number; date: string; dueDate?: string; category?: string }) => {
    const id = new Date().getTime().toString();
    const newItem = {
      ...data,
      id,
      status: activeTab === 'liabilities' ? LiabilityStatus.PENDING : ReceivableStatus.PENDING
    };

    if (activeTab === 'liabilities') {
      setLiabilities(prev => [...prev, newItem as Liability]);
      // Create Cash In Transaction
      handleAddTransaction({
        type: TransactionType.IN,
        description: `Borrowed: ${data.description}`,
        amount: data.amount,
        date: data.date,
        category: data.category || 'Debt'
      });
    } else {
      setReceivables(prev => [...prev, newItem as Receivable]);
      // Create Cash Out Transaction
      handleAddTransaction({
        type: TransactionType.OUT,
        description: `Lent: ${data.description}`,
        amount: data.amount,
        date: data.date,
        category: data.category || 'Loan'
      });
    }
  };

  // Confirmation Handlers
  const initiateDeleteTransaction = (transaction: Transaction) => {
    setConfirmationState({
      isOpen: true,
      type: 'DELETE_TRANSACTION',
      itemId: transaction.id,
      itemData: transaction
    });
  };

  const initiateDeleteDebt = (id: string, item: any) => {
    setConfirmationState({
      isOpen: true,
      type: activeTab === 'liabilities' ? 'DELETE_LIABILITY' : 'DELETE_RECEIVABLE',
      itemId: id,
      itemData: item
    });
  };

  const initiateStatusChange = (id: string, item: any) => {
    setConfirmationState({
      isOpen: true,
      type: activeTab === 'liabilities' ? 'SETTLE_LIABILITY' : 'SETTLE_RECEIVABLE',
      itemId: id,
      itemData: item
    });
  };

  const handleConfirmAction = () => {
    const { type, itemId, itemData } = confirmationState;
    if (!type || !itemId) return;

    if (type === 'DELETE_TRANSACTION') {
      setTransactions(prev => prev.filter(tx => tx.id !== itemId));
    } else if (type === 'DELETE_LIABILITY') {
      setLiabilities(prev => prev.filter(l => l.id !== itemId));
      // Note: Deleting a debt does NOT automatically reverse the transaction. User might want to keep history.
      // Or should it? Usually "Delete" means "Oops, mistake". 
      // If it was a mistake, we should probably delete the transaction too, but linking them is hard without a reference ID.
      // For now, we just delete the debt record.
    } else if (type === 'DELETE_RECEIVABLE') {
      setReceivables(prev => prev.filter(r => r.id !== itemId));
    } else if (type === 'SETTLE_LIABILITY') {
      setLiabilities(prev => prev.map(item => {
        if (item.id === itemId) return { ...item, status: LiabilityStatus.PAID };
        return item;
      }));
      // Create Cash Out Transaction (Repayment)
      handleAddTransaction({
        type: TransactionType.OUT,
        description: `Repaid: ${itemData.description}`,
        amount: itemData.amount,
        date: new Date().toISOString(),
        category: 'Debt Repayment'
      });
    } else if (type === 'SETTLE_RECEIVABLE') {
      setReceivables(prev => prev.map(item => {
        if (item.id === itemId) return { ...item, status: ReceivableStatus.RECEIVED };
        return item;
      }));
      // Create Cash In Transaction (Received back)
      handleAddTransaction({
        type: TransactionType.IN,
        description: `Received: ${itemData.description}`,
        amount: itemData.amount,
        date: new Date().toISOString(),
        category: 'Loan Repayment'
      });
    }

    setConfirmationState({ isOpen: false, type: null, itemId: null });
  };

  const handleCancelAction = () => {
    setConfirmationState({ isOpen: false, type: null, itemId: null });
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

  // Helper to get confirmation modal props
  const getConfirmationProps = () => {
    const { type, itemData } = confirmationState;
    switch (type) {
      case 'DELETE_TRANSACTION':
        return {
          title: 'Delete Transaction',
          message: 'Are you sure you want to delete this transaction?',
          confirmLabel: 'Delete',
          confirmColorClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'DELETE_LIABILITY':
        return {
          title: 'Delete Liability',
          message: 'Are you sure you want to delete this liability record?',
          confirmLabel: 'Delete',
          confirmColorClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'DELETE_RECEIVABLE':
        return {
          title: 'Delete Receivable',
          message: 'Are you sure you want to delete this receivable record?',
          confirmLabel: 'Delete',
          confirmColorClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'SETTLE_LIABILITY':
        return {
          title: 'Mark as Paid',
          message: 'This will mark the liability as paid and create a "Cash Out" transaction. Continue?',
          confirmLabel: 'Confirm Payment',
          confirmColorClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      case 'SETTLE_RECEIVABLE':
        return {
          title: 'Mark as Received',
          message: 'This will mark the receivable as received and create a "Cash In" transaction. Continue?',
          confirmLabel: 'Confirm Receipt',
          confirmColorClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      default:
        return { title: '', message: '' };
    }
  };

  const confirmProps = getConfirmationProps();

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">Cash Book</h1>
              <div className="flex items-center space-x-2">
                {installPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                    aria-label="Install app"
                    title="Install App"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Install</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <FilterIcon className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
              <button
                onClick={() => { setActiveTab('cashbook'); setFilterType('ALL'); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'cashbook' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Cash Book
              </button>
              <button
                onClick={() => { setActiveTab('liabilities'); setFilterType('ALL'); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'liabilities' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Amount Owed
              </button>
              <button
                onClick={() => { setActiveTab('receivables'); setFilterType('ALL'); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'receivables' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Receivables
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
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type/Status</label>
                  <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                    <button type="button" onClick={() => setFilterType('ALL')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>All</button>
                    {activeTab === 'cashbook' ? (
                      <>
                        <button type="button" onClick={() => setFilterType(TransactionType.IN)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === TransactionType.IN ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Cash In</button>
                        <button type="button" onClick={() => setFilterType(TransactionType.OUT)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === TransactionType.OUT ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Cash Out</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => setFilterType(activeTab === 'liabilities' ? LiabilityStatus.PENDING : ReceivableStatus.PENDING)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === (activeTab === 'liabilities' ? LiabilityStatus.PENDING : ReceivableStatus.PENDING) ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Pending</button>
                        <button type="button" onClick={() => setFilterType(activeTab === 'liabilities' ? LiabilityStatus.PAID : ReceivableStatus.RECEIVED)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterType === (activeTab === 'liabilities' ? LiabilityStatus.PAID : ReceivableStatus.RECEIVED) ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>{activeTab === 'liabilities' ? 'Paid' : 'Received'}</button>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-slate-600">Start Date</label>
                  <input type="date" id="startDate" value={startDate || ''} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-slate-600">End Date</label>
                  <input type="date" id="endDate" value={endDate || ''} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <button onClick={handleResetFilters} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors h-10">
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cashbook' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Total Cash In" amount={totalIn} colorClass="text-green-600" />
                <SummaryCard title="Total Cash Out" amount={totalOut} colorClass="text-red-600" />
                <SummaryCard title="Balance" amount={balance} colorClass={balance >= 0 ? 'text-slate-800' : 'text-red-600'} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <TransactionList transactions={filteredData as Transaction[]} onInitiateDelete={initiateDeleteTransaction} totalTransactionCount={transactions.length} />
                </div>
                <div className="md:col-span-1">
                  <CategorySummary transactions={filteredData as Transaction[]} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'liabilities' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Total Amount Owed" amount={totalLiabilities} colorClass="text-red-600" />
              </div>
              <DebtList
                items={filteredData as Liability[]}
                type="liability"
                onDelete={(id) => initiateDeleteDebt(id, liabilities.find(l => l.id === id))}
                onStatusChange={(id) => initiateStatusChange(id, liabilities.find(l => l.id === id))}
              />
            </>
          )}

          {activeTab === 'receivables' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Total Receivable" amount={totalReceivables} colorClass="text-green-600" />
              </div>
              <DebtList
                items={filteredData as Receivable[]}
                type="receivable"
                onDelete={(id) => initiateDeleteDebt(id, receivables.find(r => r.id === id))}
                onStatusChange={(id) => initiateStatusChange(id, receivables.find(r => r.id === id))}
              />
            </>
          )}
        </main>
      </div>

      <button
        onClick={() => activeTab === 'cashbook' ? setIsModalOpen(true) : setIsDebtModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-40"
        aria-label="Add new item"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
      />

      <AddDebtModal
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        onSave={handleAddDebt}
        type={activeTab === 'liabilities' ? 'liability' : 'receivable'}
      />

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        title={confirmProps.title}
        message={confirmProps.message}
        itemDescription={confirmationState.itemData?.description}
        itemAmount={confirmationState.itemData?.amount}
        confirmLabel={confirmProps.confirmLabel}
        confirmColorClass={confirmProps.confirmColorClass}
      />
    </>
  );
};

export default App;