import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from 'declarations/aura-backend/aura-backend.did.js';

const canisterId = 'uxrrr-q7777-77774-qaaaq-cai'; // Ganti dengan hasil dfx canister id aura-backend
const host = window.location.hostname === 'localhost' ? 'http://127.0.0.1:4943' : undefined;
const agent = new HttpAgent({ host });
if (host) agent.fetchRootKey();

const backend = Actor.createActor(idlFactory, { agent, canisterId });

export const getLogs = async () => backend.getLogs();
export const checkMarkets = async () => backend.checkMarkets();
export const updateThreshold = async (value) => backend.updateThreshold(value);
export const clearLogs = async () => backend.clearLogs();
