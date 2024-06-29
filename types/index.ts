declare interface Transaction {
  id: string;
  text: string;
  amount: number;
  userId: string;
  createdAt: Date;
}

declare interface TransactionData {
  text: string;
  amount: number;
}

declare interface TransactionResult {
  data?: TransactionData;
  error?: string;
}
