import { ForgeConfig, ValidationResult } from '../types';
/**
 * Validates a FORGE configuration object
 */
export declare function validateForgeConfig(config: unknown): ValidationResult;
/**
 * Validates a program configuration
 */
export declare function validateProgramConfig(config: unknown): ValidationResult;
/**
 * Validates deployment configuration
 */
export declare function validateDeploymentConfig(config: unknown): ValidationResult;
/**
 * Validates a public key string
 */
export declare function validatePublicKey(key: string): ValidationResult;
/**
 * Comprehensive validation for a complete FORGE project
 */
export declare function validateForgeProject(config: ForgeConfig): ValidationResult;
//# sourceMappingURL=validation.d.ts.map