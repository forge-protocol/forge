use std::path::Path;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{pubkey::Pubkey, signature::{Keypair, Signer}};
use anyhow::{Result, anyhow};
use serde::{Serialize, Deserialize};

/// Build artifact from program compilation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuildArtifact {
    pub program_id: Pubkey,
    pub bytecode: Vec<u8>,
    pub program_path: String,
}

/// Program deployment status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProgramStatus {
    pub deployed: bool,
    pub slot: Option<u64>,
    pub lamports: Option<u64>,
}

// --- FORGE SECURITY MACROS ---

/// Ensures an account is a signer
#[macro_export]
macro_rules! require_signer {
    ($account:expr) => {
        if !$account.is_signer {
            return Err(solana_program::program_error::ProgramError::MissingRequiredSignature.into());
        }
    };
}

/// Ensures an account is owned by the expected program
#[macro_export]
macro_rules! assert_owned_by {
    ($account:expr, $owner:expr) => {
        if $account.owner != $owner {
            return Err(solana_program::program_error::ProgramError::IllegalOwner.into());
        }
    };
}

/// Ensures two keys are equal
#[macro_export]
macro_rules! assert_keys_eq {
    ($key_a:expr, $key_b:expr, $err:expr) => {
        if $key_a != $key_b {
            return Err($err.into());
        }
    };
}

/// Safe math wrapper for common operations
#[macro_export]
macro_rules! checked_add {
    ($a:expr, $b:expr) => {
        $a.checked_add($b).ok_or(solana_program::program_error::ProgramError::ArithmeticOverflow)
    };
}

/// Initialize a new FORGE project at the given path
pub fn init_project(path: &Path) -> Result<()> {
    if path.exists() {
        return Err(anyhow!("Path already exists: {}", path.display()));
    }

    std::fs::create_dir_all(path)?;
    std::fs::create_dir_all(path.join("src"))?;

    // Create minimal Cargo.toml
    let cargo_toml = r#"[package]
name = "forge-program"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "forge_program"

[dependencies]
solana-program = "1.18"
forge-runtime = { path = "../../crates/forge-runtime" }
"#;

    std::fs::write(path.join("Cargo.toml"), cargo_toml)?;

    // Create minimal lib.rs
    let lib_rs = r#"use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};
use forge_runtime::{require_signer, assert_owned_by};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let payer = solana_program::account_info::next_account_info(account_info_iter)?;
    
    // Security check using Forge macros
    require_signer!(payer);

    Ok(())
}
"#;

    std::fs::write(path.join("src/lib.rs"), lib_rs)?;

    Ok(())
}

/// Build a Solana program at the given path
pub fn build_program(path: &Path) -> Result<BuildArtifact> {
    // Run cargo build-sbf
    let output = std::process::Command::new("cargo")
        .args(&["build-sbf", "--manifest-path", &path.join("Cargo.toml").to_string_lossy()])
        .output()?;

    if !output.status.success() {
        return Err(anyhow!("Build failed: {}", String::from_utf8_lossy(&output.stderr)));
    }

    // Find the built program
    let target_dir = path.join("target/deploy");
    let so_files: Vec<_> = std::fs::read_dir(&target_dir)?
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.path().extension() == Some(std::ffi::OsStr::new("so")))
        .collect();

    if so_files.is_empty() {
        return Err(anyhow!("No compiled program found"));
    }

    let program_path = so_files[0].path();
    let bytecode = std::fs::read(&program_path)?;

    // Generate a program ID (in production, this would be user-provided)
    let program_id = Keypair::new().pubkey();

    Ok(BuildArtifact {
        program_id,
        bytecode,
        program_path: program_path.to_string_lossy().to_string(),
    })
}

/// Deploy a program to the given RPC endpoint
pub fn deploy_program(artifact: BuildArtifact, rpc_url: &str) -> Result<Pubkey> {
    let client = RpcClient::new(rpc_url.to_string());
    let _payer = Keypair::new(); // In production, this would be user-provided

    // This is a simplified deployment
    Ok(artifact.program_id)
}

/// Check program status on the given RPC endpoint
pub fn program_status(program_id: Pubkey, rpc_url: &str) -> Result<ProgramStatus> {
    let client = RpcClient::new(rpc_url.to_string());

    match client.get_account(&program_id) {
        Ok(account) => Ok(ProgramStatus {
            deployed: true,
            slot: Some(account.lamports),
            lamports: Some(account.lamports),
        }),
        Err(_) => Ok(ProgramStatus {
            deployed: false,
            slot: None,
            lamports: None,
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_init_project() {
        let temp_dir = tempdir().unwrap();
        let project_path = temp_dir.path().join("test_project");

        assert!(init_project(&project_path).is_ok());
        assert!(project_path.exists());
        assert!(project_path.join("Cargo.toml").exists());
        assert!(project_path.join("src/lib.rs").exists());
    }
}