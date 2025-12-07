/**
 * REFERENCE BACKEND IMPLEMENTATION
 * 
 * This file demonstrates how the backend would be implemented using Node.js + Express.
 * In the live browser demo, we are using 'services/queueService.ts' to simulate this behavior.
 */

/*
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database (Replace with SQLite or Firebase in production)
let state = {
  tokens: [],
  currentServingNumber: null,
  lastIssuedNumber: 0
};

// Endpoints

app.get('/api/status', (req, res) => {
  res.json({
    currentServing: state.currentServingNumber,
    lastIssued: state.lastIssuedNumber,
    waitingCount: state.tokens.filter(t => t.status === 'WAITING').length,
    tokens: state.tokens
  });
});

app.post('/api/register', (req, res) => {
  const newNumber = state.lastIssuedNumber + 1;
  const newToken = {
    id: uuidv4(),
    number: newNumber,
    status: 'WAITING',
    createdAt: Date.now()
  };
  
  state.tokens.push(newToken);
  state.lastIssuedNumber = newNumber;
  
  // Emit WebSocket update here
  
  res.json(newToken);
});

app.post('/api/next', (req, res) => {
  const nextToken = state.tokens.find(t => t.status === 'WAITING');
  if (!nextToken) return res.status(404).json({ message: 'No waiting tokens' });

  // Complete current
  if (state.currentServingNumber) {
    const current = state.tokens.find(t => t.number === state.currentServingNumber);
    if (current) current.status = 'COMPLETED';
  }

  // Set next
  nextToken.status = 'SERVING';
  state.currentServingNumber = nextToken.number;
  
  res.json(nextToken);
});

app.post('/api/reset', (req, res) => {
  state = { tokens: [], currentServingNumber: null, lastIssuedNumber: 0 };
  res.json({ message: 'Reset successful' });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/