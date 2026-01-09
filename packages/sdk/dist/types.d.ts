import { PublicKey } from '@solana/web3.js';
export interface ForgeConfig {
    name: string;
    version: string;
    description?: string;
    author?: string;
    programs: ProgramConfig[];
}
export interface ProgramConfig {
    name: string;
    id: PublicKey;
    path: string;
    description?: string;
    accounts: AccountConfig[];
    instructions: InstructionConfig[];
}
export interface AccountConfig {
    name: string;
    type: 'account' | 'program' | 'sysvar';
    address?: PublicKey;
    description?: string;
    fields?: AccountField[];
}
export interface AccountField {
    name: string;
    type: 'u8' | 'u16' | 'u32' | 'u64' | 'i8' | 'i16' | 'i32' | 'i64' | 'bool' | 'string' | 'publicKey' | 'bytes';
    description?: string;
}
export interface InstructionConfig {
    name: string;
    description?: string;
    accounts: InstructionAccount[];
    args: InstructionArg[];
}
export interface InstructionAccount {
    name: string;
    type: 'signer' | 'writable' | 'readonly';
    description?: string;
}
export interface InstructionArg {
    name: string;
    type: 'u8' | 'u16' | 'u32' | 'u64' | 'i8' | 'i16' | 'i32' | 'i64' | 'bool' | 'string' | 'publicKey' | 'bytes';
    description?: string;
}
export interface ForgeTransaction {
    programId: PublicKey;
    instruction: string;
    accounts: PublicKey[];
    data: Buffer;
    signers: SignerInfo[];
}
export interface SignerInfo {
    publicKey: PublicKey;
    secretKey?: Uint8Array;
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
export interface ValidationWarning {
    field: string;
    message: string;
    code: string;
}
export interface DeploymentConfig {
    cluster: 'devnet' | 'mainnet-beta' | 'localnet';
    programId?: PublicKey;
    wallet?: string;
    priorityFee?: number;
}
export interface DeploymentResult {
    success: boolean;
    programId?: PublicKey;
    signature?: string;
    logs?: string[];
    error?: string;
}
//# sourceMappingURL=types.d.ts.map