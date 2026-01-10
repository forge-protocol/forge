use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, InterfaceAccount, Interface, Mint, TokenAccount, TokenInterface, MintTo};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod test_final_mint {
    use super::*;

    pub fn process_intent(ctx: Context<ProcessIntent>) -> Result<()> {
        msg!("Processing intent...");

    // CPI: Mint with PDA signer
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
        500,
    )?;

        msg!("Intent processed successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessIntent {
    #[account(mut)] pub mint: InterfaceAccount<Mint>,
    #[account(mut)] pub to: InterfaceAccount<TokenAccount>,
    pub mint_authority: Signer,
    pub token_program: Interface<TokenInterface>,
}
