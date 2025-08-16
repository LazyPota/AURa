import React, { useState, useEffect, useCallback } from 'react';
import SentimentGauge from './components/SentimentGauge';
import PriceCard from './components/PriceCard';
import LogFeed from './components/LogFeed';
import Architecture from './components/Architecture';
import { 
  getDashboardData, 
  getLogs, 
  getSystemStatus, 
  manualUpdate, 
  clearLogs,
  setApiKey,
  checkConnection,
  healthCheck
} from './api/backend';
import { 
  FaRobot, 
  FaPlay, 
  FaPause, 
  FaSync, 
  FaMoon, 
  FaSun, 
  FaCog,
  FaWifi,
  FaWifiSlash,
  FaKey,
  FaChartBar,
  FaNewspaper,
  FaServer
} from 'react-icons/fa';

function App() {
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKeyInput] = useState('');
  const [status, setStatus] = useState({ message: '', type: 'info' });

  // Polling interval (15 seconds)
  const POLL_INTERVAL = 15000;

  // Initialize app
  useEffect(() => {
    initializeApp();
    const interval = setInterval(fetchAllData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Initialize application
  const initializeApp = async () => {
    setLoading(true);
    try {
      await fetchAllData();
      setStatus({ message: 'AURA system connected successfully', type: 'success' });
    } catch (error) {
      console.error('Initialization error:', error);
      setStatus({ message: 'Failed to connect to AURA system', type: 'error' });
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      // Check connection first
      const isConnected = await checkConnection();
      setConnected(isConnected);
      
      if (!isConnected) {
        setStatus({ message: 'Connection lost - retrying...', type: 'warning' });
        return;
      }

      // Fetch data in parallel
      const [dashboardResult, logsResult, statusResult] = await Promise.allSettled([
        getDashboardData(),
        getLogs(),
        getSystemStatus()
      ]);

      // Handle dashboard data
      if (dashboardResult.status === 'fulfilled') {
        setDashboardData(dashboardResult.value);
      }

      // Handle logs
      if (logsResult.status === 'fulfilled') {
        setLogs(logsResult.value.slice().reverse()); // Most recent first
      }

      // Handle system status
      if (statusResult.status === 'fulfilled') {
        setSystemStatus(statusResult.value);
      }

      // Clear any previous error status
      if (status.type === 'error' || status.type === 'warning') {
        setStatus({ message: '', type: 'info' });
      }

    } catch (error) {
      console.error('Data fetch error:', error);
      setConnected(false);
      setStatus({ message: 'Failed to fetch data', type: 'error' });
    }
  }, [status.type]);

  // Manual update
  const handleManualUpdate = async () => {
    setLoading(true);
    setStatus({ message: 'Triggering manual update...', type: 'info' });
    
    try {
      await manualUpdate();
      setStatus({ message: 'Manual update triggered successfully', type: 'success' });
      
      // Fetch updated data after a short delay
      setTimeout(() => {
        fetchAllData();
      }, 2000);
      
    } catch (error) {
      console.error('Manual update error:', error);
      setStatus({ message: 'Failed to trigger manual update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Clear logs
  const handleClearLogs = async () => {
    try {
      await clearLogs();
      setLogs([]);
      setStatus({ message: 'Logs cleared successfully', type: 'success' });
    } catch (error) {
      console.error('Clear logs error:', error);
      setStatus({ message: 'Failed to clear logs', type: 'error' });
    }
  };

  // Set API key
  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setStatus({ message: 'Please enter a valid API key', type: 'error' });
      return;
    }

    try {
      await setApiKey(apiKey);
      setStatus({ message: 'API key updated successfully', type: 'success' });
      setShowApiKeyModal(false);
      setApiKeyInput('');
    } catch (error) {
      console.error('Set API key error:', error);
      setStatus({ message: 'Failed to set API key', type: 'error' });
    }
  };

  // Status message component
  const StatusMessage = () => {
    if (!status.message) return null;

    const bgColor = {
      success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300',
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300'
    }[status.type];

    return (
      <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg border shadow-lg ${bgColor} transition-all duration-300`}>
        <div className="flex items-center gap-2">
          <span>{status.message}</span>
          <button
            onClick={() => setStatus({ message: '', type: 'info' })}
            className="ml-2 text-lg font-bold opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaRobot className="text-3xl text-blue-600 dark:text-blue-400" />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  AURA
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Autonomous Unbiased Reasoning Agent
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
                { id: 'logs', label: 'Logs', icon: <FaNewspaper /> },
                { id: 'architecture', label: 'Architecture', icon: <FaServer /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                connected 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {connected ? <FaWifi /> : <FaWifiSlash />}
                {connected ? 'Connected' : 'Disconnected'}
              </div>

              {/* Manual Update */}
              <button
                onClick={handleManualUpdate}
                disabled={loading || !connected}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trigger manual update"
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Update</span>
              </button>

              {/* API Key */}
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Set NewsAPI Key"
              >
                <FaKey />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Message */}
      <StatusMessage />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
          <div className="flex gap-1 p-1 bg-white dark:bg-slate-800 rounded-lg shadow">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
              { id: 'logs', label: 'Logs', icon: <FaNewspaper /> },
              { id: 'architecture', label: 'Architecture', icon: <FaServer /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Status Bar */}
        {systemStatus && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {systemStatus.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Status</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {systemStatus.cycleCount}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Cycles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {systemStatus.logsCount}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Logs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {systemStatus.lastUpdate ? 
                    new Date(Number(systemStatus.lastUpdate) / 1000000).toLocaleTimeString() : 
                    'Never'
                  }
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Last Update</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SentimentGauge 
                sentiment={dashboardData?.sentiment} 
                loading={loading && !dashboardData} 
              />
              <PriceCard 
                price={dashboardData?.price} 
                loading={loading && !dashboardData} 
              />
            </div>
            <div>
              <LogFeed
                logs={logs}
                onClear={handleClearLogs}
                onRefresh={fetchAllData}
                loading={loading}
              />
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="max-w-4xl mx-auto">
            <LogFeed
              logs={logs}
              onClear={handleClearLogs}
              onRefresh={fetchAllData}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="max-w-4xl mx-auto">
            <Architecture />
          </div>
        )}
      </main>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
              Set NewsAPI Key
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Enter your NewsAPI key to enable news sentiment analysis. Get your free key at{' '}
              <a 
                href="https://newsapi.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                newsapi.org
              </a>
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your NewsAPI key"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSetApiKey}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set Key
              </button>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setApiKeyInput('');
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              © 2024 AURA - Autonomous Unbiased Reasoning Agent
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              Running 100% on Internet Computer Protocol
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;