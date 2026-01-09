"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const web3_js_1 = require("@solana/web3.js");
const logger_1 = require("../utils/logger");
class PaymentService {
    constructor() {
        // Initialize Solana connection
        const rpcUrl = process.env.HELIUS_RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new web3_js_1.Connection(rpcUrl, 'confirmed');
        // Treasury public key from environment
        const treasuryKey = process.env.TREASURY_PUBKEY;
        if (!treasuryKey) {
            throw new Error('TREASURY_PUBKEY environment variable is required');
        }
        this.treasuryPubkey = new web3_js_1.PublicKey(treasuryKey);
        logger_1.logger.info('PaymentService initialized', {
            rpcUrl,
            treasuryPubkey: this.treasuryPubkey.toString()
        });
    }
    /**
     * Create a new payment request
     */
    async createPayment(request) {
        const paymentId = this.generatePaymentId();
        const amountInLamports = request.currency === 'SOL'
            ? request.amount * web3_js_1.LAMPORTS_PER_SOL
            : request.amount; // Assume USDC is already in smallest unit
        const payment = {
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
        logger_1.logger.info('Payment request created', payment);
        return payment;
    }
    /**
     * Get payment by ID
     */
    async getPayment(id) {
        // In a real implementation, you'd fetch from database
        // For now, return mock data
        return null;
    }
    /**
     * Update payment status
     */
    async updatePaymentStatus(transactionId, status, amount) {
        // In a real implementation, you'd update the database
        const payment = {
            id: transactionId,
            amount: amount || 0,
            amountInLamports: 0,
            currency: 'SOL',
            recipient: '',
            status,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        logger_1.logger.info('Payment status updated', { transactionId, status });
        return payment;
    }
    /**
     * Verify webhook signature
     */
    async verifyWebhookSignature(signature, payload) {
        // In a real implementation, you'd verify the webhook signature
        // For now, accept all webhooks (not secure for production)
        logger_1.logger.warn('Webhook signature verification not implemented');
        return true;
    }
    /**
     * Get payments with filters
     */
    async getPayments(filters) {
        // In a real implementation, you'd query the database
        // For now, return empty array
        return [];
    }
    /**
     * Process x402 payment
     */
    async processX402Payment(paymentId, userWallet) {
        const payment = await this.getPayment(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.status !== 'pending') {
            throw new Error('Payment is not in pending status');
        }
        // Create transfer instruction to treasury
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: userWallet,
            toPubkey: this.treasuryPubkey,
            lamports: payment.amountInLamports
        }));
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
    async confirmPayment(signature) {
        try {
            const confirmation = await this.connection.confirmTransaction(signature);
            return confirmation.value.err === null;
        }
        catch (error) {
            logger_1.logger.error('Failed to confirm payment', { signature, error });
            return false;
        }
    }
    generatePaymentId() {
        return `forge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=paymentService.js.map