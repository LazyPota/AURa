import React, { useState, useEffect } from 'react';
import LogViewer from './components/LogViewer';
import GovernancePanel from './components/GovernancePanel';
import SimulationPanel from './components/SimulationPanel';
import WalletInfo from './components/WalletInfo';
import StatusBar from './components/StatusBar';
import { getLogs, checkMarkets, updateThreshold, clearLogs } from './api/backend';
import { theme } from './theme';
import { FaSyncAlt, FaMoon, FaSun, FaRobot, FaWallet, FaCogs, FaChartLine, FaListAlt } from 'react-icons/fa';

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('info');
  const [darkMode, setDarkMode] = useState(false);
  // Simulation state
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  // Wallet info (stub for now)
  const [wallet, setWallet] = useState({ address: '0xDEMO1234567890', balance: 'N/A' });

  // Fetch logs and threshold on mount
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const logData = await getLogs();
      setLogs(logData.slice().reverse());
      const thresholdLog = logData.find(l => l.includes('BUY_THRESHOLD updated to'));
      if (thresholdLog) {
        const match = thresholdLog.match(/updated to ([\d.]+)/);
        if (match) setThreshold(match[1]);
      }
    } catch (err) {
      setStatus('Failed to fetch logs.');
      setStatusType('error');
    }
    setLoading(false);
  };

  const handleCheckMarkets = async () => {
    setLoading(true);
    setStatus('Running AURA cycle...');
    setStatusType('info');
    try {
      await checkMarkets();
      await fetchAll();
      setStatus('AURA cycle complete!');
      setStatusType('success');
    } catch (err) {
      setStatus('Error running AURA cycle.');
      setStatusType('error');
    }
    setLoading(false);
  };

  const handleUpdateThreshold = async (value) => {
    setLoading(true);
    setStatus('Updating threshold...');
    setStatusType('info');
    try {
      await updateThreshold(value);
      setThreshold(value);
      await fetchAll();
      setStatus('Threshold updated!');
      setStatusType('success');
    } catch (err) {
      setStatus('Error updating threshold.');
      setStatusType('error');
    }
    setLoading(false);
  };

  const handleClearLogs = async () => {
    setLoading(true);
    setStatus('Clearing logs...');
    setStatusType('info');
    try {
      await clearLogs();
      await fetchAll();
      setStatus('Logs cleared.');
      setStatusType('success');
    } catch (err) {
      setStatus('Error clearing logs.');
      setStatusType('error');
    }
    setLoading(false);
  };

  // Simulation: for demo, just mock AI result
  const handleSimulate = async (eth, bnb) => {
    setSimLoading(true);
    const spread = (eth / bnb) - 1.0;
    const score = spread * 1.0 + 0.0;
    const t = parseFloat(threshold) || 1.01;
    const decision = score > t ? 'ARBITRAGE' : 'HOLD';
    const reason = `Spread: ${spread.toFixed(4)}, Threshold: ${t}`;
    setTimeout(() => {
      setSimResult({ decision, score: score.toFixed(4), reason });
      setSimLoading(false);
    }, 500);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300" style={{ fontFamily: theme.fontFamily }}>
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 shadow-md fixed top-0 left-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <FaRobot className="text-3xl text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-200 tracking-tight">AURA</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckMarkets}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold flex items-center gap-2"
            aria-label="Run AURA Cycle"
          >
            {loading ? <span className="loader mr-2 animate-spin border-2 border-white border-t-blue-400 rounded-full w-4 h-4" aria-label="Loading" /> : <FaSyncAlt />}
            {loading ? 'Loading...' : 'Run Cycle'}
          </button>
          <button
            onClick={() => setDarkMode(dm => !dm)}
            className="ml-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaMoon /> : <FaSun />}
            <span className="hidden sm:inline">{darkMode ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-24 pb-10 text-center bg-gradient-to-br from-blue-100 via-purple-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 flex items-center justify-center gap-2">
          <FaRobot className="inline text-5xl md:text-6xl text-purple-500 dark:text-purple-300 animate-bounce" />
          AURA Dashboard
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-4">Autonomous Unstoppable & Resilient Arbitrage<br />
          <span className="text-base text-purple-500 dark:text-purple-300">AI-powered, unstoppable, and beautiful.</span>
        </p>
      </section>
      <StatusBar status={status} type={statusType} onClose={() => setStatus('')} />
      {/* Main Content Grid */}
      <main className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaWallet className="text-xl text-blue-500 dark:text-blue-300" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">Wallet</span>
              </div>
              <WalletInfo address={wallet.address} balance={wallet.balance} loading={false} />
            </div>
            <div className="rounded-2xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaCogs className="text-xl text-purple-500 dark:text-purple-300" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">Governance</span>
              </div>
              <GovernancePanel threshold={threshold} onUpdate={handleUpdateThreshold} loading={loading} />
            </div>
            <div className="rounded-2xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaChartLine className="text-xl text-orange-500 dark:text-orange-300" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">Simulation</span>
              </div>
              <SimulationPanel onSimulate={handleSimulate} result={simResult} loading={simLoading} />
            </div>
          </div>
          <div>
            <div className="rounded-2xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaListAlt className="text-xl text-green-500 dark:text-green-300" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">Activity Log</span>
              </div>
              <LogViewer logs={logs} onClear={handleClearLogs} loading={loading} onRefresh={fetchAll} />
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-6 text-slate-400 dark:text-slate-600 text-sm mt-8">
        &copy; {new Date().getFullYear()} AURA Project &mdash; Autonomous Unstoppable & Resilient Arbitrage
      </footer>
    </div>
  );
}

export default App;