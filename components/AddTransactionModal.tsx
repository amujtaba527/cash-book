"use client"
import React, { useState, FormEvent, useEffect } from 'react';
import { Transaction, TransactionType } from '../utils/types';
import { CloseIcon } from './icons';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.IN);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
        // Reset form on close
        setType(TransactionType.IN);
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('');
        setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      setError('Description and amount are required.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    onSave({
      type,
      description,
      amount: numericAmount,
      date: new Date(date).toISOString(),
      category: category.trim() || undefined,
    });
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-slate-800">New Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-2">Type</span>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              <button type="button" onClick={() => setType(TransactionType.IN)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${type === TransactionType.IN ? 'bg-green-500 text-white shadow' : 'text-slate-600'}`}>Cash In</button>
              <button type="button" onClick={() => setType(TransactionType.OUT)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${type === TransactionType.OUT ? 'bg-red-500 text-white shadow' : 'text-slate-600'}`}>Cash Out</button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" placeholder="e.g. Client Payment" required/>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category (Optional)</label>
            <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" placeholder="e.g. Salary, Groceries"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount (PKR)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} min="1" step="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" placeholder="5000" required/>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" required/>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg">
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;