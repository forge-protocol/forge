"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePaymentRequest = validatePaymentRequest;
exports.validateQueryParams = validateQueryParams;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
function validatePaymentRequest(schema) {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                logger_1.logger.warn('Validation failed', {
                    errors: error.errors,
                    body: req.body
                });
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                        code: err.code
                    }))
                });
            }
            logger_1.logger.error('Unexpected validation error', error);
            return res.status(500).json({
                success: false,
                error: 'Internal validation error'
            });
        }
    };
}
function validateQueryParams(schema) {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.query);
            req.query = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                logger_1.logger.warn('Query validation failed', {
                    errors: error.errors,
                    query: req.query
                });
                return res.status(400).json({
                    success: false,
                    error: 'Invalid query parameters',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                        code: err.code
                    }))
                });
            }
            logger_1.logger.error('Unexpected query validation error', error);
            return res.status(500).json({
                success: false,
                error: 'Internal validation error'
            });
        }
    };
}
//# sourceMappingURL=validation.js.map