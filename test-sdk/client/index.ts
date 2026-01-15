import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { IDL } from './idl';

export class test_sdkClient {
  private program: anchor.Program;
  private provider: anchor.AnchorProvider;

  constructor(
    connection: anchor.web3.Connection,
    wallet: anchor.Wallet,
    programId: PublicKey = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")
  ) {
    this.provider = new anchor.AnchorProvider(connection, wallet, {});
    anchor.setProvider(this.provider);
    this.program = new anchor.Program(IDL as any, programId, this.provider);
  }

  // Program instructions
  async processIntent(amount: anchor.BN, accounts: { from: PublicKey, to: PublicKey, mint: PublicKey, authority: PublicKey }, options?: anchor.web3.ConfirmOptions): Promise<string> {
    const tx = await this.program.methods.processIntent(amount)
      .accounts(accounts)
      .rpc(options);

    return tx;
  }

  // Account helpers
  

  // Utility methods
  getProgramId(): PublicKey {
    return this.program.programId;
  }

  async getAccountInfo(account: PublicKey): Promise<any> {
    return await this.program.account.test_sdkAccount.fetch(account);
  }

  async getAllAccounts(): Promise<any[]> {
    return await this.program.account.test_sdkAccount.all();
  }

  // Event parsers
  
}

// Generated instruction methods
export async function processIntent(
  program: anchor.Program<test_sdk>,
  amount: number,
  from: PublicKey,
  to: PublicKey,
  mint: PublicKey,
  authority: PublicKey,
  options?: anchor.web3.ConfirmOptions
): Promise<string> {
  const tx = await program.methods.processIntent(new anchor.BN(amount))
    .accounts({
      from: from,
      to: to,
      mint: mint,
      authority: authority,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc(options);

  return tx;
}

// Account type definitions


// Event type definitions


// Export types
export type {  };
export type {  };
