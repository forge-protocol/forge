"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = require("express");
const web3_js_1 = require("@solana/web3.js");
const router = (0, express_1.Router)();
exports.healthRoutes = router;
/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', async (req, res) => {
    try {
        // Check Solana connection
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'));
        const slot = await connection.getSlot();
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                solana: {
                    status: 'connected',
                    slot: slot,
                    cluster: 'devnet'
                }
            }
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                solana: {
                    status: 'disconnected',
                    error: 'Failed to connect to Solana'
                }
            }
        });
    }
});
/**
 * GET /api/health/ready
 * Readiness check
 */
router.get('/ready', (req, res) => {
    res.json({
        status: 'ready',
        timestamp: new Date().toISOString()
    });
});
/**
 * GET /api/health/live
 * Liveness check
 */
router.get('/live', (req, res) => {
    res.json({
        status: 'alive',
        timestamp: new Date().toISOString()
    });
});
//# sourceMappingURL=health.js.map