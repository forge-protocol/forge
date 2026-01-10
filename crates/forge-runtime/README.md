# forge-runtime

Minimal Solana runtime for FORGE operations.

## Usage

```rust
use forge_runtime::{init_project, build_program, deploy_program, program_status};
use std::path::Path;

// Initialize project
init_project(Path::new("./my-project"))?;

// Build program
let artifact = build_program(Path::new("./my-project"))?;

// Deploy to devnet
let program_id = deploy_program(artifact, "https://api.devnet.solana.com")?;

// Check status
let status = program_status(program_id, "https://api.devnet.solana.com")?;
```

## API

- `init_project(path: &Path) -> Result<()>`
- `build_program(path: &Path) -> Result<BuildArtifact>`
- `deploy_program(artifact: BuildArtifact, rpc: &str) -> Result<Pubkey>`
- `program_status(pubkey: Pubkey, rpc: &str) -> Result<ProgramStatus>`

## License

MIT