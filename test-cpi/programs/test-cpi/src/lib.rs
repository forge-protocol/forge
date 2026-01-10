use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod test_cpi {
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
        1000,
    )?;

        msg!("Intent processed successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessIntent {
    token_program: TokenProgram,
}
