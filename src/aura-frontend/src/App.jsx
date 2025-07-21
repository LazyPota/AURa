import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/aura-backend/aura-backend.did.js';

const canisterId = "vg3po-ix777-77774-qaafa-cai";

const host = "http://127.0.0.1:4943";

const agent = new HttpAgent({ host });
agent.fetchRootKey();

const aura_backend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});


function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    const logMessages = await aura_backend.get_logs();
    setLogs(logMessages.slice().reverse());
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCheckMarkets = async () => {
    setLoading(true);
    await aura_backend.check_and_decide();
    await fetchLogs();
  };
  
  const styles = {
    container: { fontFamily: 'Arial, sans-serif', margin: 'auto', padding: '20px', maxWidth: '800px' },
    header: { textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' },
    button: { display: 'block', width: '200px', margin: '20px auto', padding: '10px 15px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' },
    logContainer: { marginTop: '20px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '5px', padding: '10px 20px', minHeight: '300px' },
    logEntry: { margin: '8px 0', paddingBottom: '8px', borderBottom: '1px solid #eee', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🤖 AURA Dashboard</h1>
        <p>Autonomous Unstoppable & Resilient Arbitrage</p>
      </header>
      <button onClick={handleCheckMarkets} disabled={loading} style={styles.button}>
        {loading ? 'Loading...' : 'Run AURA Cycle'}
      </button>
      <div style={styles.logContainer}>
        <h2>Activity Log</h2>
        {loading ? <p>Loading logs...</p> :
          logs.map((log, index) => (
            <p key={index} style={styles.logEntry}>{log}</p>
          ))
        }
      </div>
    </div>
  );
}

export default App;