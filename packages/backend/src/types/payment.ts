export interface PaymentRequest {
  amount: number;
  currency: 'SOL' | 'USDC';
  recipient: string;
  memo?: string;
  reference?: string;
}

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'expired';

export interface PaymentRecord {
  id: string;
  amount: number;
  amountInLamports: number;
  currency: 'SOL' | 'USDC';
  recipient: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  memo?: string;
  reference?: string;
  transactionId?: string;
  confirmedAt?: Date;
}

export interface PaymentWebhookPayload {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  signature: string;
  timestamp: Date;
}

export interface X402PaymentRequest {
  paymentId: string;
  userWallet: string;
  amount: number;
  currency: 'SOL' | 'USDC';
}

export interface X402PaymentResponse {
  transaction: string; // Serialized transaction
  expectedAmount: number;
  paymentId: string;
}