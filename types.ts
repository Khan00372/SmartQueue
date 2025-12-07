export enum TokenStatus {
  WAITING = 'WAITING',
  SERVING = 'SERVING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export interface Token {
  id: string;
  number: number;
  status: TokenStatus;
  createdAt: number; // timestamp
  completedAt?: number;
}

export interface QueueState {
  tokens: Token[];
  currentServingNumber: number | null;
  lastIssuedNumber: number;
  shopId: string;
  shopName: string;
}

export interface QueueStats {
  totalIssued: number;
  totalWaiting: number;
  totalCompleted: number;
  avgWaitTimeMinutes: number;
}