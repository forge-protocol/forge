"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const paymentService_1 = require("../services/paymentService");
const validation_1 = require("../middleware/validation");
const logger_1 = require("../utils/logger");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.paymentRoutes = router;
const paymentService = new paymentService_1.PaymentService();
// Request validation schemas
const createPaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be positive'),
    currency: zod_1.z.enum(['SOL', 'USDC']).default('SOL'),
    recipient: zod_1.z.string().min(32, 'Invalid recipient address'),
    memo: zod_1.z.string().optional(),
    reference: zod_1.z.string().optional()
});
const paymentWebhookSchema = zod_1.z.object({
    transactionId: zod_1.z.string(),
    status: zod_1.z.enum(['pending', 'confirmed', 'failed']),
    amount: zod_1.z.number(),
    signature: zod_1.z.string()
});
/**
 * POST /api/payments/create
 * Create a new payment request
 */
router.post('/create', (0, validation_1.validatePaymentRequest)(createPaymentSchema), async (req, res) => {
    try {
        const { amount, currency, recipient, memo, reference } = req.body;
        const paymentRequest = await paymentService.createPayment({
            amount,
            currency,
            recipient,
            memo,
            reference
        });
        logger_1.logger.info('Payment request created', { id: paymentRequest.id, amount, recipient });
        res.json({
            success: true,
            data: paymentRequest
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to create payment request', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment request'
        });
    }
});
/**
 * GET /api/payments/:id
 * Get payment status by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await paymentService.getPayment(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
        res.json({
            success: true,
            data: payment
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get payment', { id: req.params.id, error });
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve payment'
        });
    }
});
/**
 * POST /api/payments/webhook
 * Handle payment webhook notifications
 */
router.post('/webhook', (0, validation_1.validatePaymentRequest)(paymentWebhookSchema), async (req, res) => {
    try {
        const { transactionId, status, amount, signature } = req.body;
        // Verify webhook signature (implement signature verification)
        const isValidSignature = await paymentService.verifyWebhookSignature(signature, req.body);
        if (!isValidSignature) {
            return res.status(401).json({
                success: false,
                error: 'Invalid webhook signature'
            });
        }
        const updatedPayment = await paymentService.updatePaymentStatus(transactionId, status, amount);
        logger_1.logger.info('Payment webhook processed', { transactionId, status });
        res.json({
            success: true,
            data: updatedPayment
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to process webhook', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process webhook'
        });
    }
});
/**
 * GET /api/payments
 * Get payment history with optional filters
 */
router.get('/', async (req, res) => {
    try {
        const { status, limit = 10, offset = 0 } = req.query;
        const payments = await paymentService.getPayments({
            status: status,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.json({
            success: true,
            data: payments
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get payments', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve payments'
        });
    }
});
//# sourceMappingURL=payments.js.map