use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo};
use mpl_token_metadata::instruction::create_metadata_accounts_v3;
use solana_program::instruction::Instruction;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod test_metadata {
    use super::*;

    pub fn process_intent(ctx: Context<ProcessIntent>) -> Result<()> {
        msg!("Processing intent...");

    // CPI: Mint tokens via SPL Token Program
    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        ),
        amount,
    )?;

    // CPI: Create Token Metadata
    let metadata_seeds = &[
        b"metadata",
        mpl_token_metadata::ID.as_ref(),
        ctx.accounts.mint.key().as_ref(),
    ];
    let (metadata_pda, _) = Pubkey::find_program_address(metadata_seeds, &mpl_token_metadata::ID);

    let ix = create_metadata_accounts_v3(
        mpl_token_metadata::ID,
        metadata_pda,
        *ctx.accounts.mint.key,
        *ctx.accounts.mint_authority.key,
        *ctx.accounts.payer.key,
        *ctx.accounts.update_authority.key,
        "my nft".to_string(),
        "mnft".to_string(),
        "https://example.com/nft.json".to_string(),
        None, // creators
        0,    // seller_fee_basis_points
        true, // update_authority_is_signer
        true, // is_mutable
        None, // collection
        None, // uses
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
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )?;

        msg!("Intent processed successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessIntent {
    token_program: TokenProgram,
    metadata: AccountInfo,
    system_program: SystemProgram,
    rent: SysvarRent,
}
