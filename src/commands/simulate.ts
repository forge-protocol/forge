import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

export async function simulateCommand(instructionName?: string): Promise<void> {
    console.log('🔮 FORGE Instruction Simulator\n');

    try {
        if (!existsSync('Anchor.toml')) {
            console.error('❌ Not in an Anchor project directory');
            process.exit(1);
        }

        // 1. Load IDL to find instructions
        const programName = getProgramName();
        const idlPath = join('target', 'idl', `${programName}.json`);

        if (!existsSync(idlPath)) {
            console.error('❌ IDL not found. Run "anchor build" first.');
            process.exit(1);
        }

        const idl = JSON.parse(readFileSync(idlPath, 'utf8'));
        const instructions = idl.instructions || [];

        if (instructions.length === 0) {
            console.error('❌ No instructions found in IDL');
            process.exit(1);
        }

        // 2. Select instruction to simulate
        let targetIx = null;
        if (instructionName) {
            targetIx = instructions.find((ix: any) => ix.name === instructionName);
            if (!targetIx) {
                console.error(`❌ Instruction "${instructionName}" not found in IDL`);
                process.exit(1);
            }
        } else {
            // Use the first one for now (or could be interactive)
            targetIx = instructions[0];
            console.log(`💡 No instruction specified, simulating first instruction: "${targetIx.name}"`);
        }

        console.log(`🛠️  Simulating instruction: ${targetIx.name}`);
        console.log(`📋 Accounts required: ${targetIx.accounts.length}`);
        console.log(`📦 Arguments: ${targetIx.args.length}\n`);

        // 3. Setup Connection
        const rpcUrl = getRpcUrl();
        const connection = new Connection(rpcUrl);

        console.log(`🌐 Connected to: ${rpcUrl}`);
        console.log('🚀 Running simulation...\n');

        // 4. Create a dummy transaction for simulation
        // Note: This is an approximation. Real simulation requires valid accounts and signatures.
        const programId = new PublicKey(getProgramId());

        // Create zeroed accounts for simulation
        const keys = targetIx.accounts.map((acc: any) => ({
            pubkey: PublicKey.default, // Dummy address
            isSigner: acc.isSigner,
            isWritable: acc.isMut,
        }));

        const ix = new TransactionInstruction({
            keys,
            programId,
            data: Buffer.alloc(0), // Dummy data
        });

        const tx = new Transaction().add(ix);
        tx.feePayer = PublicKey.default;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const simulation = await connection.simulateTransaction(tx);

        // 5. Display Results
        if (simulation.value.err) {
            console.log('❌ Simulation FAILED');
            console.log(`   Error: ${JSON.stringify(simulation.value.err)}`);
        } else {
            console.log('✅ Simulation SUCCESSFUL');
        }

        console.log(`\n📊 Performance Metrics:`);
        console.log(`   • Compute Units Consumed: ${simulation.value.unitsConsumed || 'Unknown'}`);

        if (simulation.value.logs && simulation.value.logs.length > 0) {
            console.log(`\n📜 Program Logs:`);
            simulation.value.logs.forEach(log => {
                if (log.includes('Program log:')) {
                    console.log(`   • ${log.replace('Program log: ', '')}`);
                } else if (log.includes('Program return:')) {
                    console.log(`   💎 ${log}`);
                } else {
                    console.log(`     ${log}`);
                }
            });
        }

        console.log('\n💡 Note: Simulation used default/dummy accounts. Real execution may vary.');

    } catch (error: any) {
        console.error('❌ Simulation failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

function getProgramName(): string {
    const anchorToml = readFileSync('Anchor.toml', 'utf8');
    const match = anchorToml.match(/\[programs\.localnet\]\s*\n([^\s]+)\s*=/);
    return match ? match[1] : '';
}

function getProgramId(): string {
    const anchorToml = readFileSync('Anchor.toml', 'utf8');
    const match = anchorToml.match(/\[programs\.localnet\]\s*([^=]+)\s*=\s*"([^"]+)"/);
    return match ? match[2] : '';
}

function getRpcUrl(): string {
    const anchorToml = readFileSync('Anchor.toml', 'utf8');
    const match = anchorToml.match(/cluster\s*=\s*"([^"]+)"/);
    const cluster = match ? match[1] : 'localnet';

    const urls: Record<string, string> = {
        localnet: 'http://127.0.0.1:8899',
        devnet: 'https://api.devnet.solana.com',
        'mainnet-beta': 'https://api.mainnet-beta.solana.com'
    };

    return urls[cluster] || urls.localnet;
}
