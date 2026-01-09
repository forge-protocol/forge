use anchor_lang::prelude::*;

declare_id!("YourProgramIDHere");

#[program]
pub mod test2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Program initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}