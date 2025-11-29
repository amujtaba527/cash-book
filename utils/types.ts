export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

export enum LiabilityStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum ReceivableStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // ISO string format
  category?: string;
}

export interface Liability {
  id: string;
  description: string;
  amount: number;
  date: string; // Transaction date
  dueDate?: string;
  status: LiabilityStatus;
  category?: string;
}

export interface Receivable {
  id: string;
  description: string;
  amount: number;
  date: string; // Transaction date
  dueDate?: string;
  status: ReceivableStatus;
  category?: string;
}

export type TabView = 'cashbook' | 'liabilities' | 'receivables';
