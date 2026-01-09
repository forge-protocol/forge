import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare function validatePaymentRequest<T>(schema: z.ZodSchema<T>): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare function validateQueryParams<T>(schema: z.ZodSchema<T>): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.d.ts.map