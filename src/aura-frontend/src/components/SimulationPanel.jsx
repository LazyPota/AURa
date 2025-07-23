import React, { useState } from 'react';

export default function SimulationPanel({ onSimulate, result, loading }) {
  const [eth, setEth] = useState('');
  const [bnb, setBnb] = useState('');
  const [error, setError] = useState('');

  const handleSimulate = async (e) => {
    e.preventDefault();
    setError('');
    if (!eth || !bnb || isNaN(Number(eth)) || isNaN(Number(bnb))) {
      setError('Please enter valid numbers for both prices.');
      return;
    }
    await onSimulate(Number(eth), Number(bnb));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Simulation Panel</h2>
      <form onSubmit={handleSimulate} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="flex-1 px-2 py-1 rounded border border-slate-200 dark:bg-slate-700 dark:text-slate-100"
            placeholder="ETH Price"
            value={eth}
            onChange={e => setEth(e.target.value)}
            disabled={loading}
            type="number"
            step="0.01"
          />
          <input
            className="flex-1 px-2 py-1 rounded border border-slate-200 dark:bg-slate-700 dark:text-slate-100"
            placeholder="BNB Price"
            value={bnb}
            onChange={e => setBnb(e.target.value)}
            disabled={loading}
            type="number"
            step="0.01"
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading ? 'Simulating...' : 'Simulate AI Decision'}
        </button>
        {error && <div className="text-xs mt-1 text-red-500">{error}</div>}
      </form>
      {result && (
        <div className="mt-4 p-3 rounded bg-slate-100 dark:bg-slate-900">
          <div className="font-mono text-lg mb-1">Decision: <span className="font-bold">{result.decision}</span></div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Reason: {result.reason}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Score: {result.score}</div>
        </div>
      )}
    </div>
  );
}
