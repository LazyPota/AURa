import React, { useState } from 'react';

export default function GovernancePanel({ threshold, onUpdate, loading }) {
  const [value, setValue] = useState(threshold || '');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setFeedback('Please enter a valid positive number.');
      return;
    }
    try {
      await onUpdate(Number(value));
      setFeedback('Threshold updated!');
    } catch (err) {
      setFeedback('Error updating threshold.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Governance Panel</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="text-sm text-slate-600 dark:text-slate-300">
          Current Threshold:
          <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">{threshold}</span>
        </label>
        <input
          className="px-2 py-1 rounded border border-slate-200 dark:bg-slate-700 dark:text-slate-100"
          type="number"
          step="0.0001"
          min="0.001"
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Threshold'}
        </button>
        {feedback && <div className="text-xs mt-1 text-green-600 dark:text-green-400">{feedback}</div>}
      </form>
    </div>
  );
}
