
export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // ISO string format
  category?: string;
}