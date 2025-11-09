"use client"
import React from 'react';
import { Transaction, TransactionType } from '../utils/types';
import { TrashIcon } from './icons';

interface TransactionItemProps {
  transaction: Transaction;
  onInitiateDelete: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onInitiateDelete }) => {
  const isCashIn = transaction.type === TransactionType.IN;
  
  const amountColor = isCashIn ? 'text-green-600' : 'text-red-600';
  const amountSign = isCashIn ? '+' : '-';

  const formattedAmount = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <li className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className={`w-2 h-12 rounded-full ${isCashIn ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <div className="flex flex-col items-start space-y-1">
          <p className="font-semibold text-slate-800">{transaction.description}</p>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
             <span>{formattedDate}</span>
             {transaction.category && (
                <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                        {transaction.category}
                    </span>
                </>
             )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`font-bold text-lg ${amountColor}`}>{amountSign} {formattedAmount}</span>
        <button 
          onClick={() => onInitiateDelete(transaction)} 
          className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
          aria-label="Delete transaction"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export default TransactionItem;