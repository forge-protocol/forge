import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface SDKConfig {
  programName: string;
  programId: string;
  instructions: Instruction[];
  accounts: Account[];
  events?: Event[];
}

export interface Instruction {
  name: string;
  accounts: AccountField[];
  args: ArgField[];
  cpiType?: string; // 'transfer', 'mint', 'create_ata', 'metadata'
}

export interface AccountField {
  name: string;
  type: string;
  isMut: boolean;
  isSigner: boolean;
}

export interface ArgField {
  name: string;
  type: string;
}

export interface Account {
  name: string;
  type: string;
}

export interface Event {
  name: string;
  fields: ArgField[];
}

export function generateClientSDK(config: SDKConfig): string {
  const { programName, programId, instructions, accounts, events = [] } = config;

  return `import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { IDL } from './idl';

export class ${programName}Client {
  private program: anchor.Program;
  private provider: anchor.AnchorProvider;

  constructor(
    connection: anchor.web3.Connection,
    wallet: anchor.Wallet,
    programId: PublicKey = new PublicKey("${programId}")
  ) {
    this.provider = new anchor.AnchorProvider(connection, wallet, {});
    anchor.setProvider(this.provider);
    this.program = new anchor.Program(IDL as any, programId, this.provider);
  }

  // Program instructions
  ${instructions.map(instr => generateInstructionMethod(instr)).join('\n\n  ')}

  // Account helpers
  ${accounts.map(acc => generateAccountHelper(acc)).join('\n\n  ')}

  // Utility methods
  ${generateUtilityMethods(programName)}

  // Event parsers
  ${events.map(event => generateEventParser(event)).join('\n\n  ')}
}

// Generated instruction methods
${instructions.map(instr => generateInstructionMethodImpl(instr, programName)).join('\n\n')}

// Account type definitions
${accounts.map(acc => generateAccountType(acc)).join('\n\n')}

// Event type definitions
${events.map(event => generateEventType(event)).join('\n\n')}

// Export types
export type { ${accounts.map(acc => acc.name).join(', ')} };
export type { ${events.map(event => event.name).join(', ')} };
`;
}

function generateInstructionMethod(instr: Instruction): string {
  const accountParams = instr.accounts.map(acc => `${acc.name}: PublicKey`).join(', ');
  const allParams = [
    ...instr.args.map(arg => `${arg.name}: ${mapTypeScriptType(arg.type)}`),
    accountParams ? `accounts: { ${accountParams} }` : '',
    'options?: anchor.web3.ConfirmOptions'
  ].filter(p => p).join(', ');

  return `async ${instr.name}(${allParams}): Promise<string> {
    const tx = await this.program.methods.${instr.name}(${instr.args.map(arg => arg.name).join(', ')})
      .accounts(accounts)
      .rpc(options);

    return tx;
  }`;
}

function generateInstructionMethodImpl(instr: Instruction, programName: string): string {
  if (instr.cpiType) {
    return generateCPIMethod(instr, programName);
  }

  const params = [
    ...instr.args.map(arg => `${arg.name}: ${mapTypeScriptType(arg.type)}`),
    'accounts: {',
    ...instr.accounts.map(acc => `  ${acc.name}: PublicKey;`),
    '}',
    'options?: anchor.web3.ConfirmOptions'
  ];

  return `export async function ${instr.name}(
  program: anchor.Program<${programName}>,
  ${params.join('\n  ')}
): Promise<string> {
  const tx = await program.methods.${instr.name}(${instr.args.map(arg => arg.name).join(', ')})
    .accounts(accounts)
    .rpc(options);

  return tx;
}`;
}

function generateCPIMethod(instr: Instruction, programName: string): string {
  const cpiMethodMap: Record<string, (instr: Instruction, programName: string) => string> = {
    'token_transfer': generateTransferMethod,
    'token_mint': generateMintMethod,
    'create_ata': generateCreateATAMethod,
    'create_metadata': generateMetadataMethod,
  };

  const methodGenerator = cpiMethodMap[instr.cpiType!];
  if (methodGenerator) {
    return methodGenerator(instr, programName);
  }

  return '';
}

function generateTransferMethod(instr: Instruction, programName: string): string {
  return `export async function ${instr.name}(
  program: anchor.Program<${programName}>,
  amount: number,
  from: PublicKey,
  to: PublicKey,
  mint: PublicKey,
  authority: PublicKey,
  options?: anchor.web3.ConfirmOptions
): Promise<string> {
  const tx = await program.methods.${instr.name}(new anchor.BN(amount))
    .accounts({
      from: from,
      to: to,
      mint: mint,
      authority: authority,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc(options);

  return tx;
}`;
}

function generateMintMethod(instr: Instruction, programName: string): string {
  return `export async function ${instr.name}(
  program: anchor.Program<${programName}>,
  amount: number,
  mint: PublicKey,
  to: PublicKey,
  mintAuthority: PublicKey,
  options?: anchor.web3.ConfirmOptions
): Promise<string> {
  const tx = await program.methods.${instr.name}(new anchor.BN(amount))
    .accounts({
      mint: mint,
      to: to,
      mintAuthority: mintAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc(options);

  return tx;
}`;
}

function generateCreateATAMethod(instr: Instruction, programName: string): string {
  return `export async function ${instr.name}(
  program: anchor.Program<${programName}>,
  mint: PublicKey,
  owner: PublicKey,
  payer: PublicKey,
  options?: anchor.web3.ConfirmOptions
): Promise<string> {
  const [ata] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const tx = await program.methods.${instr.name}()
    .accounts({
      ata: ata,
      mint: mint,
      owner: owner,
      payer: payer,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc(options);

  return tx;
}`;
}

function generateMetadataMethod(instr: Instruction, programName: string): string {
  return `export async function ${instr.name}(
  program: anchor.Program<${programName}>,
  name: string,
  symbol: string,
  uri: string,
  mint: PublicKey,
  mintAuthority: PublicKey,
  updateAuthority: PublicKey,
  payer: PublicKey,
  options?: anchor.web3.ConfirmOptions
): Promise<string> {
  const [metadata] = PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(), mint.toBuffer()],
    new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
  );

  const tx = await program.methods.${instr.name}(name, symbol, uri)
    .accounts({
      metadata: metadata,
      mint: mint,
      mintAuthority: mintAuthority,
      updateAuthority: updateAuthority,
      payer: payer,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      tokenMetadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
    })
    .rpc(options);

  return tx;
}`;
}

function generateAccountParam(acc: AccountField): string {
  if (acc.name.includes('ata') || acc.name.includes('tokenAccount')) {
    return `this.findAssociatedTokenAccount(mint, owner)`;
  }
  if (acc.name.includes('metadata')) {
    return `this.findMetadataAccount(mint)`;
  }
  return acc.name;
}

function generateAccountHelper(acc: Account): string {
  if (acc.name.toLowerCase().includes('token') && acc.name.toLowerCase().includes('account')) {
    return `findAssociatedTokenAccount(mint: PublicKey, owner: PublicKey): PublicKey {
    const [ata] = PublicKey.findProgramAddressSync(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return ata;
  }`;
  }

  if (acc.name.toLowerCase().includes('metadata')) {
    return `findMetadataAccount(mint: PublicKey): PublicKey {
    const [metadata] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(), mint.toBuffer()],
      new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    );
    return metadata;
  }`;
  }

  return `// ${acc.name} helper - implement as needed`;
}

function generateUtilityMethods(programName: string): string {
  return `getProgramId(): PublicKey {
    return this.program.programId;
  }

  async getAccountInfo(account: PublicKey): Promise<any> {
    return await this.program.account.${programName.toLowerCase()}Account.fetch(account);
  }

  async getAllAccounts(): Promise<any[]> {
    return await this.program.account.${programName.toLowerCase()}Account.all();
  }`;
}

function generateEventParser(event: Event): string {
  return `parse${event.name}Event(log: any): ${event.name}Event | null {
    // Event parsing logic - implement based on your event structure
    return null;
  }`;
}

function generateAccountType(acc: Account): string {
  return `export interface ${acc.name} {
  // Define account fields based on your program's account structure
}`;
}

function generateEventType(event: Event): string {
  const fields = event.fields.map(field => `  ${field.name}: ${mapTypeScriptType(field.type)};`).join('\n');

  return `export interface ${event.name}Event {
${fields}
}`;
}

function mapTypeScriptType(rustType: string): string {
  const typeMap: Record<string, string> = {
    'u64': 'anchor.BN',
    'u32': 'number',
    'u16': 'number',
    'u8': 'number',
    'i64': 'anchor.BN',
    'i32': 'number',
    'i16': 'number',
    'i8': 'number',
    'bool': 'boolean',
    'String': 'string',
    'Pubkey': 'PublicKey',
    'Vec<u8>': 'Buffer',
  };

  return typeMap[rustType] || 'any';
}

export function saveSDK(config: SDKConfig, outputDir: string): void {
  const sdkCode = generateClientSDK(config);

  // Create client directory
  mkdirSync(join(outputDir, 'client'), { recursive: true });

  // Write main client file
  writeFileSync(join(outputDir, 'client', 'index.ts'), sdkCode);

  // Write IDL placeholder
  const idlPlaceholder = `export const IDL = {
  version: "0.1.0",
  name: "${config.programName.toLowerCase()}",
  instructions: [],
  accounts: [],
  events: [],
  errors: []
};`;

  writeFileSync(join(outputDir, 'client', 'idl.ts'), idlPlaceholder);

  // Write package.json for client
  const packageJson = {
    name: `${config.programName.toLowerCase()}-client`,
    version: "0.1.0",
    description: `Client SDK for ${config.programName} Solana program`,
    main: "dist/index.js",
    types: "dist/index.d.ts",
    scripts: {
      build: "tsc",
      test: "jest"
    },
    dependencies: {
      "@coral-xyz/anchor": "^0.32.1",
      "@solana/web3.js": "^1.87.6",
      "@solana/spl-token": "^0.3.8"
    },
    devDependencies: {
      typescript: "^5.0.0",
      "@types/jest": "^29.0.0"
    }
  };

  writeFileSync(join(outputDir, 'client', 'package.json'), JSON.stringify(packageJson, null, 2));

  // Write tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: "ES2020",
      module: "commonjs",
      lib: ["ES2020"],
      outDir: "./dist",
      rootDir: "./",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true
    },
    include: ["**/*.ts"],
    exclude: ["node_modules", "dist"]
  };

  writeFileSync(join(outputDir, 'client', 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
}