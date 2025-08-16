import React, { useRef, useEffect, useState } from 'react';
import { FaSearch, FaTrash, FaSync, FaFilter, FaDownload } from 'react-icons/fa';

const LogFeed = ({ logs = [], onClear, onRefresh, loading = false }) => {
  const [filter, setFilter] = useState('');
  const [logLevel, setLogLevel] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Handle manual scroll to detect if user scrolled up
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom);
    }
  };

  // Parse log entry to extract timestamp and message
  const parseLogEntry = (log) => {
    const parts = log.split(' | ');
    if (parts.length >= 2) {
      const timestamp = parts[0];
      const message = parts.slice(1).join(' | ');
      return { timestamp, message, raw: log };
    }
    return { timestamp: '', message: log, raw: log };
  };

  // Determine log level and styling
  const getLogStyle = (message) => {
    if (message.includes('❌') || message.includes('error') || message.includes('failed')) {
      return {
        level: 'error',
        className: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500',
        icon: '❌'
      };
    } else if (message.includes('⚠️') || message.includes('warning') || message.includes('partial')) {
      return {
        level: 'warning',
        className: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500',
        icon: '⚠️'
      };
    } else if (message.includes('✅') || message.includes('success') || message.includes('completed')) {
      return {
        level: 'success',
        className: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500',
        icon: '✅'
      };
    } else if (message.includes('🔄') || message.includes('starting') || message.includes('processing')) {
      return {
        level: 'info',
        className: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
        icon: '🔄'
      };
    } else {
      return {
        level: 'debug',
        className: 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-l-4 border-slate-300',
        icon: '📝'
      };
    }
  };

  // Filter logs based on search term and log level
  const filteredLogs = logs.filter(log => {
    const { message } = parseLogEntry(log);
    const { level } = getLogStyle(message);
    
    const matchesFilter = filter === '' || 
      message.toLowerCase().includes(filter.toLowerCase());
    
    const matchesLevel = logLevel === 'all' || level === logLevel;
    
    return matchesFilter && matchesLevel;
  });

  // Export logs function
  const exportLogs = () => {
    const logData = filteredLogs.join('\n');
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Activity Log
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
            title="Refresh logs"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          
          <button
            onClick={exportLogs}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            title="Export logs"
          >
            <FaDownload />
            Export
          </button>
          
          <button
            onClick={onClear}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
            title="Clear logs"
          >
            <FaTrash />
            Clear
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
          <select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            className="pl-10 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
      </div>

      {/* Auto-scroll toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {filteredLogs.length} of {logs.length} logs
        </div>
        
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Auto-scroll
        </label>
      </div>

      {/* Log Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-80 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3 space-y-2"
      >
        {loading && filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Loading logs...
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            {filter || logLevel !== 'all' ? 'No logs match your filters' : 'No logs available'}
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const { timestamp, message } = parseLogEntry(log);
            const { className, icon } = getLogStyle(message);
            
            return (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm font-mono transition-all duration-200 hover:shadow-sm ${className}`}
              >
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 text-base">{icon}</span>
                  <div className="flex-1 min-w-0">
                    {timestamp && (
                      <div className="text-xs opacity-75 mb-1">
                        {new Date(parseInt(timestamp) / 1000000).toLocaleTimeString()}
                      </div>
                    )}
                    <div className="break-words">{message}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {autoScroll ? '🔄 Auto-scrolling' : '⏸️ Manual scroll'}
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Last update: {logs.length > 0 ? 'Just now' : 'Never'}
        </div>
      </div>
    </div>
  );
};

export default LogFeed;