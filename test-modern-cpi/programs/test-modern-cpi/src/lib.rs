use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, TokenAccount, TokenInterface, TransferChecked, Mint};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod test_modern_cpi {
    use super::*;

    pub fn process_intent(ctx: Context<ProcessIntent>) -> Result<()> {
        msg!("Processing intent...");

    // CPI: Transfer tokens via Token Interface (Token + Token-2022 compatible)
    let decimals = ctx.accounts.mint.decimals;

    token_interface::transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.from.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        500,
        decimals,
    )?;

        msg!("Intent processed successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessIntent {
    #[account(mut)] pub from: InterfaceAccount<TokenAccount>,
    #[account(mut)] pub to: InterfaceAccount<TokenAccount>,
    pub mint: InterfaceAccount<Mint>,
    pub authority: Signer,
    pub token_program: Interface<TokenInterface>,
}
