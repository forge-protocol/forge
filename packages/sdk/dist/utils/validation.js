import { forgeConfigSchema, programConfigSchema, deploymentConfigSchema } from '../schemas';
/**
 * Validates a FORGE configuration object
 */
export function validateForgeConfig(config) {
    const result = forgeConfigSchema.safeParse(config);
    if (result.success) {
        return {
            isValid: true,
            errors: [],
            warnings: []
        };
    }
    const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
    }));
    return {
        isValid: false,
        errors,
        warnings: []
    };
}
/**
 * Validates a program configuration
 */
export function validateProgramConfig(config) {
    const result = programConfigSchema.safeParse(config);
    if (result.success) {
        return {
            isValid: true,
            errors: [],
            warnings: []
        };
    }
    const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
    }));
    return {
        isValid: false,
        errors,
        warnings: []
    };
}
/**
 * Validates deployment configuration
 */
export function validateDeploymentConfig(config) {
    const result = deploymentConfigSchema.safeParse(config);
    if (result.success) {
        return {
            isValid: true,
            errors: [],
            warnings: []
        };
    }
    const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
    }));
    return {
        isValid: false,
        errors,
        warnings: []
    };
}
/**
 * Validates a public key string
 */
export function validatePublicKey(key) {
    const errors = [];
    const warnings = [];
    // Check basic format
    if (!key || typeof key !== 'string') {
        errors.push({
            field: 'publicKey',
            message: 'Public key must be a non-empty string',
            code: 'INVALID_TYPE'
        });
    }
    else if (key.length !== 32 && key.length !== 44) {
        errors.push({
            field: 'publicKey',
            message: 'Public key must be 32 bytes or 44 characters (base58)',
            code: 'INVALID_LENGTH'
        });
    }
    // Check for placeholder values
    if (key.includes('YourProgramIDHere') || key.includes('11111111')) {
        warnings.push({
            field: 'publicKey',
            message: 'Public key appears to be a placeholder - please update with actual program ID',
            code: 'PLACEHOLDER_VALUE'
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
/**
 * Comprehensive validation for a complete FORGE project
 */
export function validateForgeProject(config) {
    const errors = [];
    const warnings = [];
    // Validate main config
    const configValidation = validateForgeConfig(config);
    errors.push(...configValidation.errors);
    warnings.push(...configValidation.warnings);
    // Validate each program
    config.programs.forEach((program, index) => {
        const programValidation = validateProgramConfig(program);
        programValidation.errors.forEach((error) => {
            errors.push({
                ...error,
                field: `programs[${index}].${error.field}`
            });
        });
        programValidation.warnings.forEach((warning) => {
            warnings.push({
                ...warning,
                field: `programs[${index}].${warning.field}`
            });
        });
        // Additional program-specific validations
        const programIdValidation = validatePublicKey(program.id.toString());
        if (!programIdValidation.isValid) {
            programIdValidation.errors.forEach((error) => {
                errors.push({
                    ...error,
                    field: `programs[${index}].id`
                });
            });
        }
        programIdValidation.warnings.forEach((warning) => {
            warnings.push({
                ...warning,
                field: `programs[${index}].id`
            });
        });
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
//# sourceMappingURL=validation.js.map