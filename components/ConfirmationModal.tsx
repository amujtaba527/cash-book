"use client"
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  itemDescription?: string;
  itemAmount?: number;
  confirmLabel?: string;
  confirmColorClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  itemDescription,
  itemAmount,
  confirmLabel = "Confirm",
  confirmColorClass = "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
}) => {
  if (!isOpen) return null;

  const formattedAmount = itemAmount !== undefined ? new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(itemAmount) : null;

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
        <h2 className="text-xl font-bold mb-2 text-slate-800">{title}</h2>
        <p className="text-slate-600 mb-4">
          {message}
        </p>

        {(itemDescription || formattedAmount) && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 text-left">
            {itemDescription && <p className="font-semibold text-slate-800">{itemDescription}</p>}
            {formattedAmount && <p className="text-sm text-slate-500">{formattedAmount}</p>}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-full bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`w-full text-white font-bold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmColorClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;