import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { logger } from '../utils/logger';
import { PaymentRequest, PaymentStatus, PaymentRecord } from '../types/payment';

export class PaymentService {
  private connection: Connection;
  private treasuryPubkey: PublicKey;

  constructor() {
    // Initialize Solana connection
    const rpcUrl = process.env.HELIUS_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');

    // Treasury public key from environment
    const treasuryKey = process.env.TREASURY_PUBKEY;
    if (!treasuryKey) {
      throw new Error('TREASURY_PUBKEY environment variable is required');
    }
    this.treasuryPubkey = new PublicKey(treasuryKey);

    logger.info('PaymentService initialized', {
      rpcUrl,
      treasuryPubkey: this.treasuryPubkey.toString()
    });
  }

  /**
   * Create a new payment request
   */
  async createPayment(request: PaymentRequest): Promise<PaymentRecord> {
    const paymentId = this.generatePaymentId();
    const amountInLamports = request.currency === 'SOL'
      ? request.amount * LAMPORTS_PER_SOL
      : request.amount; // Assume USDC is already in smallest unit

    const payment: PaymentRecord = {
      id: paymentId,
      amount: request.amount,
      amountInLamports,
      currency: request.currency,
      recipient: request.recipient,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      memo: request.memo,
      reference: request.reference
    };

    // In a real implementation, you'd save this to a database
    logger.info('Payment request created', payment);

    return payment;
  }

  /**
   * Get payment by ID
   */
  async getPayment(id: string): Promise<PaymentRecord | null> {
    // In a real implementation, you'd fetch from database
    // For now, return mock data
    return null;
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(transactionId: string, status: PaymentStatus, amount?: number): Promise<PaymentRecord> {
    // In a real implementation, you'd update the database
    const payment: PaymentRecord = {
      id: transactionId,
      amount: amount || 0,
      amountInLamports: 0,
      currency: 'SOL',
      recipient: '',
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    logger.info('Payment status updated', { transactionId, status });

    return payment;
  }

  /**
   * Verify webhook signature
   */
  async verifyWebhookSignature(signature: string, payload: any): Promise<boolean> {
    // In a real implementation, you'd verify the webhook signature
    // For now, accept all webhooks (not secure for production)
    logger.warn('Webhook signature verification not implemented');
    return true;
  }

  /**
   * Get payments with filters
   */
  async getPayments(filters: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaymentRecord[]> {
    // In a real implementation, you'd query the database
    // For now, return empty array
    return [];
  }

  /**
   * Process x402 payment
   */
  async processX402Payment(paymentId: string, userWallet: PublicKey): Promise<{
    transaction: Transaction;
    expectedAmount: number;
  }> {
    const payment = await this.getPayment(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'pending') {
      throw new Error('Payment is not in pending status');
    }

    // Create transfer instruction to treasury
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: userWallet,
        toPubkey: this.treasuryPubkey,
        lamports: payment.amountInLamports
      })
    );

    // Get recent blockhash
    const { blockhash } = await this.connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userWallet;

    return {
      transaction,
      expectedAmount: payment.amountInLamports
    };
  }

  /**
   * Confirm payment transaction
   */
  async confirmPayment(signature: string): Promise<boolean> {
    try {
      const confirmation = await this.connection.confirmTransaction(signature);
      return confirmation.value.err === null;
    } catch (error) {
      logger.error('Failed to confirm payment', { signature, error });
      return false;
    }
  }

  private generatePaymentId(): string {
    return `forge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}