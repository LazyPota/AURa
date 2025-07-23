import React, { useRef, useEffect, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

const getLogColor = (log) => {
  if (log.includes('❌')) return 'text-red-500';
  if (log.includes('✅') || log.includes('🚀')) return 'text-green-600';
  if (log.includes('⚙️')) return 'text-blue-500';
  if (log.includes('⏸️')) return 'text-gray-500';
  if (log.includes('🤖')) return 'text-indigo-500';
  return 'text-slate-700';
};

export default function LogViewer({ logs, onClear, loading, onRefresh }) {
  const [filter, setFilter] = useState('');
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter((log) => log.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2">
        <h2 className="text-lg font-semibold">Activity Log</h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh logs"
            title="Refresh logs"
          >
            <FaSyncAlt className="inline mr-1" /> Refresh
          </button>
          <button
            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
            onClick={onClear}
            disabled={loading}
            aria-label="Clear logs"
            title="Clear logs"
          >
            Clear Logs
          </button>
        </div>
      </div>
      <input
        className="w-full mb-3 px-2 py-1 rounded border border-slate-200 dark:bg-slate-700 dark:text-slate-100"
        placeholder="Search logs..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        aria-label="Search logs"
      />
      <div className="h-64 overflow-y-auto border rounded bg-slate-50 dark:bg-slate-900 p-2">
        {loading ? (
          <div className="text-center text-slate-400">Loading logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-slate-400">No logs found.</div>
        ) : (
          filteredLogs.map((log, i) => (
            <div key={i} className={`text-sm font-mono mb-1 ${getLogColor(log)}`}>{log}</div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
