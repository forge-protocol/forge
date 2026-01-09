use anchor_lang::prelude::*;

declare_id!("YourProgramIDHere");

#[program]
pub mod claude_aaas_factory {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let factory = &mut ctx.accounts.factory;
        factory.authority = ctx.accounts.authority.key();
        factory.program_count = 0;
        factory.bump = ctx.bumps.factory;

        msg!("FORGE Factory initialized by: {}", factory.authority);
        Ok(())
    }

    pub fn create_program(ctx: Context<CreateProgram>, name: String, description: String) -> Result<()> {
        let factory = &mut ctx.accounts.factory;
        let program = &mut ctx.accounts.program;

        // Validate inputs
        require!(name.len() <= 50, ErrorCode::NameTooLong);
        require!(description.len() <= 200, ErrorCode::DescriptionTooLong);

        // Initialize program account
        program.name = name.clone();
        program.description = description;
        program.authority = ctx.accounts.authority.key();
        program.created_at = Clock::get()?.unix_timestamp;
        program.bump = ctx.bumps.program;

        // Update factory
        factory.program_count = factory.program_count.checked_add(1).unwrap();

        msg!("Program '{}' created by: {}", name, program.authority);
        Ok(())
    }

    pub fn update_program(ctx: Context<UpdateProgram>, description: String) -> Result<()> {
        let program = &mut ctx.accounts.program;

        // Only authority can update
        require!(program.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);

        require!(description.len() <= 200, ErrorCode::DescriptionTooLong);
        program.description = description;

        msg!("Program updated by: {}", program.authority);
        Ok(())
    }

    pub fn deploy_program(ctx: Context<DeployProgram>, bytecode: Vec<u8>) -> Result<()> {
        let program = &mut ctx.accounts.program;

        // Only authority can deploy
        require!(program.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);

        // Validate bytecode size (max 10KB for demo)
        require!(bytecode.len() <= 10240, ErrorCode::BytecodeTooLarge);

        program.bytecode = bytecode;
        program.deployed = true;

        msg!("Program deployed: {}", program.name);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Factory::LEN,
        seeds = [b"factory"],
        bump
    )]
    pub factory: Account<'info, Factory>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateProgram<'info> {
    #[account(
        mut,
        seeds = [b"factory"],
        bump = factory.bump
    )]
    pub factory: Account<'info, Factory>,

    #[account(
        init,
        payer = authority,
        space = 8 + Program::LEN,
        seeds = [b"program", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub program: Account<'info, Program>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProgram<'info> {
    #[account(mut)]
    pub program: Account<'info, Program>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeployProgram<'info> {
    #[account(mut)]
    pub program: Account<'info, Program>,

    pub authority: Signer<'info>,
}

#[account]
pub struct Factory {
    pub authority: Pubkey,
    pub program_count: u64,
    pub bump: u8,
}

impl Factory {
    pub const LEN: usize = 32 + 8 + 1; // authority + program_count + bump
}

#[account]
pub struct Program {
    pub name: String,
    pub description: String,
    pub authority: Pubkey,
    pub bytecode: Vec<u8>,
    pub deployed: bool,
    pub created_at: i64,
    pub bump: u8,
}

impl Program {
    pub const LEN: usize = 4 + 50 + 4 + 200 + 32 + 4 + 10240 + 1 + 8 + 1; // Dynamic sizing
}

#[error_code]
pub enum ErrorCode {
    #[msg("Program name is too long")]
    NameTooLong,
    #[msg("Program description is too long")]
    DescriptionTooLong,
    #[msg("Bytecode is too large")]
    BytecodeTooLarge,
    #[msg("Unauthorized operation")]
    Unauthorized,
}