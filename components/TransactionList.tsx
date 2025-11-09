"use client"
import React from 'react';
import { Transaction } from '../utils/types';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onInitiateDelete: (transaction: Transaction) => void;
  totalTransactionCount: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onInitiateDelete, totalTransactionCount }) => {
  if (totalTransactionCount === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">No Transactions Yet</h3>
        <p className="text-slate-500 mt-2">Click the '+' button to add your first transaction.</p>
      </div>
    );
  }

  if (transactions.length === 0 && totalTransactionCount > 0) {
    return (
        <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">No Transactions Found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your filters to see more results.</p>
        </div>
      );
  }

  // Sort transactions by date, newest first
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">History</h2>
      <ul className="space-y-3">
        {sortedTransactions.map(tx => (
          <TransactionItem key={tx.id} transaction={tx} onInitiateDelete={onInitiateDelete} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;