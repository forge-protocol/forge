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
export function detectCPI(intent: string): CPIDetection[] {
  const detections: CPIDetection[] = [];
  const lowerIntent = intent.toLowerCase();

  // System Program - SOL/lamports transfer
  if (/\b(transfer|send)\b.*\b(sol|lamports)\b/.test(lowerIntent)) {
    detections.push({
      type: 'system_transfer',
      confidence: 0.9,
      params: { amount: extractAmount(lowerIntent) }
    });
  }

  // SPL Token - Mint
  if (/\b(mint|create)\b.*\b(token|tokens)\b/.test(lowerIntent)) {
    detections.push({
      type: 'token_mint',
      confidence: 0.8,
      params: { amount: extractAmount(lowerIntent) }
    });
  }

  // SPL Token - Transfer
  if (/\b(transfer|send)\b.*\b(token|tokens)\b/.test(lowerIntent)) {
    detections.push({
      type: 'token_transfer',
      confidence: 0.8,
      params: { amount: extractAmount(lowerIntent) }
    });
  }

  // SPL Token - Burn
  if (/\b(burn|destroy)\b.*\b(token|tokens)\b/.test(lowerIntent)) {
    detections.push({
      type: 'token_burn',
      confidence: 0.7,
      params: { amount: extractAmount(lowerIntent) }
    });
  }

  // Associated Token Account - Create
  if (/\b(create|make)\b.*\b(ata|associated.*token)\b/.test(lowerIntent)) {
    detections.push({
      type: 'create_ata',
      confidence: 0.9
    });
  }

  // Token Metadata - Create
  if (/\b(metadata|nft|name|symbol|uri)\b/.test(lowerIntent) && /\b(create|set|attach)\b/.test(lowerIntent)) {
    detections.push({
      type: 'create_metadata',
      confidence: 0.7,
      params: {
        name: extractMetadataField(lowerIntent, 'name'),
        symbol: extractMetadataField(lowerIntent, 'symbol'),
        uri: extractMetadataField(lowerIntent, 'uri')
      }
    });
  }

  return detections.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate CPI code for detected patterns
 */
export function generateCPICode(detections: CPIDetection[]): CPICode {
  const imports = new Set<string>();
  const codeBlocks: string[] = [];
  const allAccounts: string[] = [];
  const allConstraints: string[] = [];

  for (const detection of detections) {
    const cpiCode = generateSingleCPI(detection);
    if (cpiCode) {
      cpiCode.imports.forEach(imp => imports.add(imp));
      codeBlocks.push(cpiCode.code);
      allAccounts.push(...cpiCode.accounts.accounts);
      allConstraints.push(...cpiCode.accounts.constraints);
    }
  }

  return {
    imports: Array.from(imports),
    code: codeBlocks.join('\n\n    '),
    accounts: {
      accounts: [...new Set(allAccounts)],
      constraints: [...new Set(allConstraints)]
    }
  };
}

/**
 * Generate code for a single CPI
 */
function generateSingleCPI(detection: CPIDetection): CPICode | null {
  switch (detection.type) {
    case 'system_transfer':
      return generateSystemTransferCPI(detection.params);
    case 'token_mint':
      return generateTokenMintCPI(detection.params);
    case 'token_transfer':
      return generateTokenTransferCPI(detection.params);
    case 'token_burn':
      return generateTokenBurnCPI(detection.params);
    case 'create_ata':
      return generateCreateATACPI();
    case 'create_metadata':
      return generateCreateMetadataCPI(detection.params);
    default:
      return null;
  }
}

/**
 * Generate System Program transfer CPI
 */
function generateSystemTransferCPI(params?: any): CPICode {
  const amount = params?.amount || 'amount';

  return {
    imports: ['use anchor_lang::system_program;'],
    code: `// CPI: Transfer SOL/lamports via System Program
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.from.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
            },
        ),
        ${amount},
    )?;`,
    accounts: {
      accounts: ['system_program: SystemProgram'],
      constraints: []
    }
  };
}

/**
 * Generate SPL Token mint CPI (Token-2022 compatible, modern)
 */
function generateTokenMintCPI(params?: any): CPICode {
  const amount = params?.amount || 'amount';

  return {
    imports: [
      'use anchor_spl::token_interface::{self, InterfaceAccount, Interface, Mint, TokenAccount, TokenInterface, MintTo};'
    ],
    code: `// CPI: Mint with PDA signer
    token_interface::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            &[&[b"mint_auth", &[ctx.bumps.mint_authority]]],
        ),
        ${amount},
    )?;`,
    accounts: {
      accounts: [
        '#[account(mut)] pub mint: InterfaceAccount<Mint>',
        '#[account(mut)] pub to: InterfaceAccount<TokenAccount>',
        'pub mint_authority: Signer',
        'pub token_program: Interface<TokenInterface>'
      ],
      constraints: []
    }
  };
}

/**
 * Generate SPL Token transfer CPI (Token-2022 compatible, modern)
 */
function generateTokenTransferCPI(params?: any): CPICode {
  const amount = params?.amount || 'amount';

  return {
    imports: [
      'use anchor_spl::token_interface::{self, InterfaceAccount, Interface, TokenAccount, Mint, TokenInterface, TransferChecked};'
    ],
    code: `// CPI: Safe transfer with decimals check (works Token + Token-2022)
    let decimals = ctx.accounts.mint.decimals;
    token_interface::transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.from.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        ${amount},
        decimals,
    )?;`,
    accounts: {
      accounts: [
        '#[account(mut)] pub from: InterfaceAccount<TokenAccount>',
        '#[account(mut)] pub to: InterfaceAccount<TokenAccount>',
        'pub mint: InterfaceAccount<Mint>',
        'pub authority: Signer',
        'pub token_program: Interface<TokenInterface>'
      ],
      constraints: []
    }
  };
}

/**
 * Generate SPL Token burn CPI
 */
function generateTokenBurnCPI(params?: any): CPICode {
  const amount = params?.amount || 'amount';

  return {
    imports: ['use anchor_spl::token::{self, Burn};'],
    code: `// CPI: Burn tokens via SPL Token Program
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        ${amount},
    )?;`,
    accounts: {
      accounts: ['token_program: TokenProgram'],
      constraints: []
    }
  };
}

/**
 * Generate Associated Token Account creation CPI
 */
function generateCreateATACPI(): CPICode {
  return {
    imports: ['use anchor_spl::associated_token::{self, Create};'],
    code: `// CPI: Create Associated Token Account
    associated_token::create(
        CpiContext::new(
            ctx.accounts.associated_token_program.to_account_info(),
            Create {
                payer: ctx.accounts.payer.to_account_info(),
                associated_token: ctx.accounts.ata.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
            },
        ),
    )?;`,
    accounts: {
      accounts: [
        'associated_token_program: AssociatedTokenProgram',
        'token_program: TokenProgram',
        'system_program: SystemProgram'
      ],
      constraints: [
        'associated_token::mint = mint',
        'associated_token::authority = authority'
      ]
    }
  };
}

/**
 * Generate Token Metadata creation CPI (modern DataV2 pattern)
 */
function generateCreateMetadataCPI(params?: any): CPICode {
  const name = params?.name ? `"${params.name}"` : '"Token Name"';
  const symbol = params?.symbol ? `"${params.symbol}"` : '"TKN"';
  const uri = params?.uri ? `"${params.uri}"` : '"https://example.com/metadata.json"';

  return {
    imports: [
      'use mpl_token_metadata::instruction::create_metadata_accounts_v3;',
      'use mpl_token_metadata::types::DataV2;'
    ],
    code: `// CPI: Create Token Metadata
    let data = DataV2 {
        name: ${name}.to_string(),
        symbol: ${symbol}.to_string(),
        uri: ${uri}.to_string(),
        seller_fee_basis_points: 500,
        creators: None,
        collection: None,
        uses: None,
    };

    let ix = create_metadata_accounts_v3(
        ctx.accounts.token_metadata_program.key(),
        ctx.accounts.metadata.key(),
        ctx.accounts.mint.key(),
        ctx.accounts.mint_authority.key(),
        ctx.accounts.payer.key(),
        ctx.accounts.update_authority.key(),
        data.name,
        data.symbol,
        data.uri,
        data.creators,
        data.seller_fee_basis_points,
        true, // update_authority_is_signer
        true, // is_mutable
        data.collection,
        data.uses,
        None, // collection_details
    );

    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.update_authority.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )?;`,
    accounts: {
      accounts: [
        'metadata: AccountInfo',
        'token_metadata_program: AccountInfo',
        'system_program: SystemProgram',
        'rent: SysvarRent'
      ],
      constraints: []
    }
  };
}

/**
 * Extract amount from intent string
 */
function extractAmount(intent: string): string {
  const amountMatch = intent.match(/(\d+)/);
  return amountMatch ? amountMatch[1] : 'amount';
}

/**
 * Extract metadata fields from intent string
 */
function extractMetadataField(intent: string, field: string): string {
  // Simple extraction - could be enhanced with better parsing
  const patterns: Record<string, RegExp> = {
    name: /(?:name|title)[:\s]+["']([^"']+)["']/i,
    symbol: /symbol[:\s]+["']([^"']+)["']/i,
    uri: /uri[:\s]+["']([^"'\s]+)["']/i
  };

  const match = intent.match(patterns[field]);
  return match ? match[1] : '';
}