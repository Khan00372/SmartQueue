import { Token, TokenStatus, QueueState } from '../types';

/**
 * MOCK BACKEND SERVICE
 * 
 * In a real deployment, this would be replaced by API calls to the Node.js/Python backend.
 * For this demo, we use LocalStorage to simulate a database and 'storage' events for real-time updates across tabs.
 */

const STORAGE_KEY = 'smart_queue_db';
const EVENT_KEY = 'smart_queue_update';

const INITIAL_STATE: QueueState = {
  tokens: [],
  currentServingNumber: null,
  lastIssuedNumber: 0,
  shopId: 'clinic-1234',
  shopName: 'City Health Clinic'
};

// Helper to get state
const getState = (): QueueState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : INITIAL_STATE;
};

// Helper to save state and trigger update
const saveState = (state: QueueState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Dispatch event for same-tab updates
  window.dispatchEvent(new CustomEvent(EVENT_KEY));
  // LocalStorage automatically fires 'storage' events for other tabs
};

export const queueService = {
  // --- READS ---
  
  getQueueStatus: (): QueueState => {
    return getState();
  },

  // --- WRITES (Actions) ---

  registerToken: (): Token => {
    const state = getState();
    const newNumber = state.lastIssuedNumber + 1;
    
    const newToken: Token = {
      id: crypto.randomUUID(),
      number: newNumber,
      status: TokenStatus.WAITING,
      createdAt: Date.now()
    };

    const newState = {
      ...state,
      tokens: [...state.tokens, newToken],
      lastIssuedNumber: newNumber
    };

    saveState(newState);
    return newToken;
  },

  callNext: (): Token | null => {
    const state = getState();
    
    // Find next waiting token
    const nextToken = state.tokens.find(t => t.status === TokenStatus.WAITING);
    
    if (!nextToken) return null;

    // If there was someone currently serving, mark them completed (or we could force explicit complete)
    const updatedTokens = state.tokens.map(t => {
      // Mark currently serving as completed if admin forgot
      if (t.number === state.currentServingNumber && t.status === TokenStatus.SERVING) {
        return { ...t, status: TokenStatus.COMPLETED, completedAt: Date.now() };
      }
      // Set next token to serving
      if (t.id === nextToken.id) {
        return { ...t, status: TokenStatus.SERVING };
      }
      return t;
    });

    const newState = {
      ...state,
      tokens: updatedTokens,
      currentServingNumber: nextToken.number
    };

    saveState(newState);
    return nextToken;
  },

  skipCurrent: () => {
    const state = getState();
    if (!state.currentServingNumber) return;

    const updatedTokens = state.tokens.map(t => {
      if (t.number === state.currentServingNumber && t.status === TokenStatus.SERVING) {
        return { ...t, status: TokenStatus.SKIPPED };
      }
      return t;
    });

    // Automatically call next after skip? Or let admin do it? Let's just clear current.
    const newState = {
      ...state,
      tokens: updatedTokens,
      currentServingNumber: null
    };

    saveState(newState);
  },

  completeCurrent: () => {
    const state = getState();
    if (!state.currentServingNumber) return;

    const updatedTokens = state.tokens.map(t => {
      if (t.number === state.currentServingNumber && t.status === TokenStatus.SERVING) {
        return { ...t, status: TokenStatus.COMPLETED, completedAt: Date.now() };
      }
      return t;
    });

    const newState = {
      ...state,
      tokens: updatedTokens,
      currentServingNumber: null
    };

    saveState(newState);
  },

  resetQueue: () => {
    saveState(INITIAL_STATE);
  },

  // --- Helpers ---
  
  subscribe: (callback: () => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) callback();
    };
    const handleCustom = () => callback();

    window.addEventListener('storage', handleStorage);
    window.addEventListener(EVENT_KEY, handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(EVENT_KEY, handleCustom);
    };
  }
};