import React from 'react';

const typeStyles = {
  success: 'bg-green-100 text-green-700 border-green-300',
  error: 'bg-red-100 text-red-700 border-red-300',
  info: 'bg-blue-100 text-blue-700 border-blue-300',
};

export default function StatusBar({ status, type = 'info', onClose }) {
  if (!status) return null;
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded border shadow-lg flex items-center gap-3 ${typeStyles[type] || typeStyles.info}`}
      role="alert"
      aria-live="polite"
    >
      <span>{status}</span>
      {onClose && (
        <button
          className="ml-2 text-lg font-bold text-slate-500 hover:text-slate-800"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
}
