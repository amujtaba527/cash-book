"use client"
import React from 'react';
import { Transaction } from '../utils/types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  transaction: Transaction | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, transaction }) => {
  if (!isOpen || !transaction) return null;

  const formattedAmount = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(transaction.amount);

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
        onClick={onCancel}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2 text-slate-800">Confirm Deletion</h2>
        <p className="text-slate-600 mb-4">
          Are you sure you want to delete this transaction?
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 text-left">
            <p className="font-semibold text-slate-800">{transaction.description}</p>
            <p className="text-sm text-slate-500">{formattedAmount}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-full bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;