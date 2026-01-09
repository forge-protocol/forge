// Main SDK exports
export * from './types';
export * from './schemas';
export * from './utils/validation';

// Re-export commonly used Solana types
export type {
  PublicKey,
  Keypair,
  Transaction,
  Connection,
  Signer
} from '@solana/web3.js';

export { SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';