"use client"
import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, colorClass }) => {
  const formattedAmount = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{formattedAmount}</p>
    </div>
  );
};

export default SummaryCard;