import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from 'declarations/aura-backend/aura-backend.did.js';

// Configuration
const canisterId = process.env.CANISTER_ID_AURA_BACKEND || 'rdmx6-jaaaa-aaaah-qdrva-cai';
const host = process.env.DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app';

// Create agent
const agent = new HttpAgent({ host });

// Fetch root key for local development
if (process.env.DFX_NETWORK === 'local') {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
    console.error(err);
  });
}

// Create actor
const backend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

// API wrapper functions with error handling
export const getDashboardData = async () => {
  try {
    const result = await backend.getDashboardData();
    return result[0] || null; // Handle optional return
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
};

export const getLogs = async () => {
  try {
    return await backend.getLogs();
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error('Failed to fetch logs');
  }
};

export const getSystemStatus = async () => {
  try {
    return await backend.getSystemStatus();
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw new Error('Failed to fetch system status');
  }
};

export const manualUpdate = async () => {
  try {
    return await backend.manualUpdate();
  } catch (error) {
    console.error('Error triggering manual update:', error);
    throw new Error('Failed to trigger manual update');
  }
};

export const clearLogs = async () => {
  try {
    return await backend.clearLogs();
  } catch (error) {
    console.error('Error clearing logs:', error);
    throw new Error('Failed to clear logs');
  }
};

export const setApiKey = async (key) => {
  try {
    const result = await backend.setApiKey(key);
    if ('err' in result) {
      throw new Error(result.err);
    }
    return result.ok;
  } catch (error) {
    console.error('Error setting API key:', error);
    throw new Error('Failed to set API key');
  }
};

export const healthCheck = async () => {
  try {
    return await backend.healthCheck();
  } catch (error) {
    console.error('Error checking health:', error);
    throw new Error('Failed to check system health');
  }
};

export const stopAutomatedCycle = async () => {
  try {
    return await backend.stopAutomatedCycle();
  } catch (error) {
    console.error('Error stopping automated cycle:', error);
    throw new Error('Failed to stop automated cycle');
  }
};

export const startCycle = async () => {
  try {
    return await backend.startCycle();
  } catch (error) {
    console.error('Error starting cycle:', error);
    throw new Error('Failed to start cycle');
  }
};

// Connection status checker
export const checkConnection = async () => {
  try {
    await healthCheck();
    return true;
  } catch (error) {
    return false;
  }
};