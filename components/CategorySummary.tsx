"use client"
import React from 'react';
import { Transaction, TransactionType } from '../utils/types';

interface CategorySummaryProps {
  transactions: Transaction[];
}

interface CategoryTotals {
  [key: string]: {
    in: number;
    out: number;
    total: number;
  };
}

const CategorySummary: React.FC<CategorySummaryProps> = ({ transactions }) => {
  const categoryTotals = transactions.reduce((acc, tx) => {
    const category = tx.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { in: 0, out: 0, total: 0 };
    }
    if (tx.type === TransactionType.IN) {
      acc[category].in += tx.amount;
      acc[category].total += tx.amount;
    } else {
      acc[category].out += tx.amount;
      acc[category].total -= tx.amount;
    }
    return acc;
  }, {} as CategoryTotals);

  const sortedCategories = Object.entries(categoryTotals)
    .filter(([_, data]) => data.in > 0 || data.out > 0)
    .sort(([, a], [, b]) => (b.in + b.out) - (a.in + a.out));

  if (sortedCategories.length === 0) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
             <h2 className="text-xl font-bold text-slate-800 mb-4">Category Breakdown</h2>
             <p className="text-sm text-slate-500">No categorized transactions in the selected period.</p>
        </div>
    );
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Category Breakdown</h2>
      <ul className="space-y-3">
        {sortedCategories.map(([category, data]) => (
          <li key={category} className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-700">{category}</span>
            <div className="flex items-center space-x-4">
                {data.in > 0 && <span className="text-green-600 font-semibold">{formatCurrency(data.in)}</span>}
                {data.out > 0 && <span className="text-red-600 font-semibold">- {formatCurrency(data.out)}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySummary;
