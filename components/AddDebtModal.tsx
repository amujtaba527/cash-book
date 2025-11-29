"use client"
import React, { useState, FormEvent, useEffect } from 'react';
import { CloseIcon } from './icons';

interface AddDebtModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { description: string; amount: number; date: string; dueDate?: string; category?: string }) => void;
    type: 'liability' | 'receivable';
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({ isOpen, onClose, onSave, type }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setDescription('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setDueDate('');
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
            description,
            amount: numericAmount,
            date: new Date(date).toISOString(),
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            category: category.trim() || undefined,
        });
        onClose();
    };

    if (!isOpen) return null;

    const title = type === 'liability' ? 'Add Amount Owed' : 'Add Amount Receivable';
    const amountLabel = type === 'liability' ? 'Amount Owed (PKR)' : 'Amount Receivable (PKR)';

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

                <h2 className="text-2xl font-bold mb-6 text-slate-800">{title}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                        <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" placeholder="e.g. Loan from Friend" required />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category (Optional)</label>
                        <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" placeholder="e.g. Loan, Salary" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">{amountLabel}</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} min="1" step="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" placeholder="5000" required />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date (Optional)</label>
                        <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800" />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDebtModal;
