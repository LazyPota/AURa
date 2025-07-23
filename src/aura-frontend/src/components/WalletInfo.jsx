import React from 'react';

export default function WalletInfo({ address, balance, loading }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mt-4 flex flex-col gap-2 border-2 border-blue-200 dark:border-blue-800">
      <h2 className="text-lg font-semibold mb-2">Wallet Info</h2>
      <div className="flex items-center gap-2">
        <span className="font-mono text-blue-600 dark:text-blue-400 truncate">{address || 'N/A'}</span>
        <button
          className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
          onClick={handleCopy}
          disabled={!address}
          aria-label="Copy wallet address"
          title="Copy wallet address"
        >
          Copy
        </button>
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Balance: <span className="font-mono text-green-600 dark:text-green-400">{loading ? 'Loading...' : balance ?? 'N/A'}</span>
      </div>
    </div>
  );
}
