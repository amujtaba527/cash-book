"use client"
import React from 'react';
import { Liability, Receivable, LiabilityStatus, ReceivableStatus } from '../utils/types';
import { TrashIcon, CheckIcon } from './icons';

interface DebtListProps {
    items: (Liability | Receivable)[];
    type: 'liability' | 'receivable';
    onDelete: (id: string) => void;
    onStatusChange: (id: string) => void;
}

const DebtList: React.FC<DebtListProps> = ({ items, type, onDelete, onStatusChange }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-500">No {type === 'liability' ? 'liabilities' : 'receivables'} found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <ul className="divide-y divide-slate-200">
                {items.map((item) => {
                    const isPaid = item.status === LiabilityStatus.PAID || item.status === ReceivableStatus.RECEIVED;
                    const statusColor = isPaid ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
                    const statusText = isPaid ? (type === 'liability' ? 'Paid' : 'Received') : 'Pending';

                    return (
                        <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-slate-800">{item.description}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor}`}>
                                        {statusText}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 space-x-4">
                                    <span>
                                        {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(item.amount)}
                                    </span>
                                    {item.dueDate && (
                                        <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                {!isPaid && (
                                    <button
                                        onClick={() => onStatusChange(item.id)}
                                        className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                        title={type === 'liability' ? "Mark as Paid" : "Mark as Received"}
                                    >
                                        <CheckIcon className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DebtList;
