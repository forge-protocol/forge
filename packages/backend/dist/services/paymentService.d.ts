import { PublicKey, Transaction } from '@solana/web3.js';
import { PaymentRequest, PaymentStatus, PaymentRecord } from '../types/payment';
export declare class PaymentService {
    private connection;
    private treasuryPubkey;
    constructor();
    /**
     * Create a new payment request
     */
    createPayment(request: PaymentRequest): Promise<PaymentRecord>;
    /**
     * Get payment by ID
     */
    getPayment(id: string): Promise<PaymentRecord | null>;
    /**
     * Update payment status
     */
    updatePaymentStatus(transactionId: string, status: PaymentStatus, amount?: number): Promise<PaymentRecord>;
    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(signature: string, payload: any): Promise<boolean>;
    /**
     * Get payments with filters
     */
    getPayments(filters: {
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<PaymentRecord[]>;
    /**
     * Process x402 payment
     */
    processX402Payment(paymentId: string, userWallet: PublicKey): Promise<{
        transaction: Transaction;
        expectedAmount: number;
    }>;
    /**
     * Confirm payment transaction
     */
    confirmPayment(signature: string): Promise<boolean>;
    private generatePaymentId;
}
//# sourceMappingURL=paymentService.d.ts.map