import { Router, Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { validatePaymentRequest } from '../middleware/validation';
import { logger } from '../utils/logger';
import { z } from 'zod';

const router = Router();
const paymentService = new PaymentService();

// Request validation schemas
const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['SOL', 'USDC']).default('SOL'),
  recipient: z.string().min(32, 'Invalid recipient address'),
  memo: z.string().optional(),
  reference: z.string().optional()
});

const paymentWebhookSchema = z.object({
  transactionId: z.string(),
  status: z.enum(['pending', 'confirmed', 'failed']),
  amount: z.number(),
  signature: z.string()
});

/**
 * POST /api/payments/create
 * Create a new payment request
 */
router.post('/create', validatePaymentRequest(createPaymentSchema), async (req: Request, res: Response) => {
  try {
    const { amount, currency, recipient, memo, reference } = req.body;

    const paymentRequest = await paymentService.createPayment({
      amount,
      currency,
      recipient,
      memo,
      reference
    });

    logger.info('Payment request created', { id: paymentRequest.id, amount, recipient });

    res.json({
      success: true,
      data: paymentRequest
    });
  } catch (error) {
    logger.error('Failed to create payment request', error);
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
router.get('/:id', async (req: Request, res: Response) => {
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
  } catch (error) {
    logger.error('Failed to get payment', { id: req.params.id, error });
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
router.post('/webhook', validatePaymentRequest(paymentWebhookSchema), async (req: Request, res: Response) => {
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

    logger.info('Payment webhook processed', { transactionId, status });

    res.json({
      success: true,
      data: updatedPayment
    });
  } catch (error) {
    logger.error('Failed to process webhook', error);
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
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    const payments = await paymentService.getPayments({
      status: status as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    logger.error('Failed to get payments', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payments'
    });
  }
});

export { router as paymentRoutes };