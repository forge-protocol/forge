export interface CPIDetection {
    type: 'system_transfer' | 'token_mint' | 'token_transfer' | 'token_burn' | 'create_ata' | 'create_metadata';
    confidence: number;
    params?: Record<string, any>;
}
export interface CPIAccounts {
    accounts: string[];
    constraints: string[];
}
export interface CPICode {
    imports: string[];
    code: string;
    accounts: CPIAccounts;
}
/**
 * Detect CPI patterns in intent strings
 */
export declare function detectCPI(intent: string): CPIDetection[];
/**
 * Generate CPI code for detected patterns
 */
export declare function generateCPICode(detections: CPIDetection[]): CPICode;
//# sourceMappingURL=cpi.d.ts.map