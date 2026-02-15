"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSdkCommand = generateSdkCommand;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const sdk_generator_v2_js_1 = require("../sdk-generator-v2.js");
const mkdir = (0, util_1.promisify)(fs_1.default.mkdir);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
async function generateSdkCommand(outputDir, v2 = false) {
    console.log(`🔧 Generating TypeScript SDK${v2 ? ' (Web3.js v2)' : ''}...\n`);
    try {
        // Check if we're in an Anchor project
        if (!fs_1.default.existsSync('Anchor.toml')) {
            console.error('❌ Not in an Anchor project directory');
            console.error('Run "forge init" first or cd into your project');
            process.exit(1);
        }
        // Check if IDL exists, build only if needed
        const programName = getProgramName();
        const idlFilePath = path_1.default.join('target', 'idl', `${programName}.json`);
        if (!fs_1.default.existsSync(idlFilePath)) {
            console.log('Building project to generate IDL...');
            try {
                (0, child_process_1.execSync)('anchor build', { stdio: 'inherit' });
            }
            catch (error) {
                console.warn('⚠️  Build failed, but continuing with manual IDL generation...');
                // Create a basic IDL if build fails
                await createBasicIDL(programName);
            }
        }
        // Find IDL file
        const targetDir = outputDir || './sdk';
        const idlPath = path_1.default.join('target', 'idl', `${getProgramName()}.json`);
        if (!fs_1.default.existsSync(idlPath)) {
            console.error('❌ IDL file not found. Make sure your program builds successfully.');
            process.exit(1);
        }
        // Parse IDL and generate SDK
        const idlContent = fs_1.default.readFileSync(idlFilePath, 'utf8');
        const idl = JSON.parse(idlContent);
        const config = {
            programName: getProgramName(),
            programId: getProgramId(),
            idlPath: idlFilePath,
            outputDir: targetDir,
        };
        if (v2) {
            await (0, sdk_generator_v2_js_1.generateSdkV2)(config, idl);
        }
        else {
            await generateSdk(config, idl);
        }
        console.log(`\n✅ SDK generated successfully in ${targetDir}/`);
        if (v2) {
            console.log('📦 Install dependencies: npm install @solana/web3.js@2.0.0');
        }
        else {
            console.log('📦 Install dependencies: npm install @solana/web3.js @coral-xyz/anchor');
        }
        console.log('🚀 Ready to use!');
    }
    catch (error) {
        console.error('❌ SDK generation failed');
        console.error('Error:', error.message);
        process.exit(1);
    }
}
function getProgramName() {
    // Read Anchor.toml to get program name
    const anchorToml = fs_1.default.readFileSync('Anchor.toml', 'utf8');
    const match = anchorToml.match(/\[programs\.localnet\]\s*\n([^\s]+)\s*=/);
    if (!match) {
        throw new Error('Could not find program name in Anchor.toml');
    }
    return match[1];
}
function getProgramId() {
    // Read lib.rs to get program ID
    const libPath = path_1.default.join('programs', getProgramName(), 'src', 'lib.rs');
    const libContent = fs_1.default.readFileSync(libPath, 'utf8');
    const match = libContent.match(/declare_id!\("([^"]+)"/);
    if (!match) {
        throw new Error('Could not find program ID in lib.rs');
    }
    return match[1];
}
async function generateSdk(config, idl) {
    // Create output directory
    try {
        await mkdir(config.outputDir, { recursive: true });
    }
    catch (error) {
        // Directory might already exist, continue
    }
    // Generate package.json
    await generatePackageJson(config);
    // Generate TypeScript types
    await generateTypes(config, idl);
    // Generate client methods
    await generateClient(config, idl);
    // Generate PDA helpers
    await generatePdaHelpers(config, idl);
    // Generate index.ts
    await generateIndex(config);
}
async function generatePackageJson(config) {
    const packageJson = {
        name: `${config.programName}-sdk`,
        version: '1.0.0',
        description: `TypeScript SDK for ${config.programName} Solana program`,
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        scripts: {
            build: 'tsc',
            prepublishOnly: 'npm run build',
        },
        dependencies: {
            '@solana/web3.js': '^1.87.6',
            '@coral-xyz/anchor': '^0.32.1',
        },
        devDependencies: {
            typescript: '^5.0.0',
            '@types/node': '^20.0.0',
        },
    };
    await writeFile(path_1.default.join(config.outputDir, 'package.json'), JSON.stringify(packageJson, null, 2));
}
async function generateTypes(config, idl) {
    let typesContent = `// Auto-generated types for ${config.programName}
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { IdlAccounts, IdlTypes } from '@coral-xyz/anchor';

export type ${config.programName}Program = IdlAccounts<typeof IDL>;
export const IDL = ${JSON.stringify(idl, null, 2)};

// Account types
`;
    // Generate account types
    if (idl.accounts) {
        for (const account of idl.accounts) {
            typesContent += `export type ${account.name} = IdlAccounts<typeof IDL>['${account.name}'];\n`;
        }
    }
    // Generate instruction types
    if (idl.instructions) {
        typesContent += '\n// Instruction types\n';
        for (const instruction of idl.instructions) {
            typesContent += `export interface ${instruction.name}Args {\n`;
            if (instruction.args) {
                for (const arg of instruction.args) {
                    const tsType = mapIdlTypeToTs(arg.type);
                    typesContent += `  ${arg.name}: ${tsType};\n`;
                }
            }
            typesContent += '}\n\n';
        }
    }
    // Generate event types
    if (idl.events) {
        typesContent += '\n// Event types\n';
        for (const event of idl.events) {
            typesContent += `export interface ${event.name}Event {\n`;
            if (event.fields) {
                for (const field of event.fields) {
                    const tsType = mapIdlTypeToTs(field.type);
                    typesContent += `  ${field.name}: ${tsType};\n`;
                }
            }
            typesContent += '}\n\n';
        }
    }
    await writeFile(path_1.default.join(config.outputDir, 'types.ts'), typesContent);
}
async function generateClient(config, idl) {
    let clientContent = `// Auto-generated client for ${config.programName}
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, Signer } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { IDL, ${config.programName}Program } from './types';

export class ${config.programName}Client {
  private program: Program<${config.programName}Program>;

  constructor(
    connection: Connection,
    programId: PublicKey = new PublicKey('${config.programId}'),
    wallet?: any
  ) {
    const provider = new AnchorProvider(connection, wallet, {});
    this.program = new Program(IDL, programId, provider);
  }

  // Program methods
`;
    if (idl.instructions) {
        for (const instruction of idl.instructions) {
            clientContent += `  async ${instruction.name}(\n`;
            clientContent += `    accounts: {\n`;
            if (instruction.accounts) {
                for (const account of instruction.accounts) {
                    const isOptional = account.isOptional || account.optional;
                    const optionalMark = isOptional ? '?' : '';
                    clientContent += `      ${account.name}${optionalMark}: PublicKey;\n`;
                }
            }
            clientContent += '    },\n';
            if (instruction.args && instruction.args.length > 0) {
                clientContent += '    args: {\n';
                for (const arg of instruction.args) {
                    clientContent += `      ${arg.name}: ${mapIdlTypeToTs(arg.type)};\n`;
                }
                clientContent += '    },\n';
            }
            clientContent += '    signers?: Signer[]\n';
            clientContent += '  ): Promise<string> {\n';
            // Generate method body
            clientContent += '    const tx = await this.program.methods\n';
            clientContent += `      .${instruction.name}(\n`;
            if (instruction.args && instruction.args.length > 0) {
                clientContent += '        ';
                for (let i = 0; i < instruction.args.length; i++) {
                    clientContent += `args.${instruction.args[i].name}`;
                    if (i < instruction.args.length - 1)
                        clientContent += ', ';
                }
                clientContent += '\n';
            }
            clientContent += '      )\n';
            clientContent += '      .accounts(accounts)\n';
            clientContent += '      .signers(signers || [])\n';
            clientContent += '      .rpc();\n\n';
            clientContent += '    return tx;\n';
            clientContent += '  }\n\n';
        }
    }
    clientContent += '}\n';
    await writeFile(path_1.default.join(config.outputDir, 'client.ts'), clientContent);
}
async function generatePdaHelpers(config, idl) {
    let pdaContent = `// Auto-generated PDA helpers for ${config.programName}
import { PublicKey } from '@solana/web3.js';

export class ${config.programName}Pdas {
  private programId: PublicKey;

  constructor(programId: PublicKey = new PublicKey('${config.programId}')) {
    this.programId = programId;
  }

  // PDA finder methods
`;
    // Look for PDA seeds in the IDL or generate common patterns
    if (idl.accounts) {
        for (const account of idl.accounts) {
            if (account.seeds) {
                const methodName = `find${account.name}`;
                pdaContent += `  ${methodName}(`;
                // Generate method parameters based on seeds
                const params = [];
                for (const seed of account.seeds) {
                    if (seed.kind === 'const')
                        continue;
                    if (seed.kind === 'account') {
                        params.push(`${seed.path}: PublicKey`);
                    }
                }
                pdaContent += params.join(', ');
                pdaContent += '): [PublicKey, number] {\n';
                pdaContent += '    return PublicKey.findProgramAddress(\n';
                pdaContent += '      [\n';
                for (const seed of account.seeds) {
                    if (seed.kind === 'const') {
                        pdaContent += `        Buffer.from('${seed.value}'),\n`;
                    }
                    else if (seed.kind === 'account') {
                        pdaContent += `        ${seed.path}.toBuffer(),\n`;
                    }
                }
                pdaContent += '      ],\n';
                pdaContent += '      this.programId\n';
                pdaContent += '    );\n';
                pdaContent += '  }\n\n';
            }
        }
    }
    pdaContent += '}\n';
    await writeFile(path_1.default.join(config.outputDir, 'pdas.ts'), pdaContent);
}
async function generateIndex(config) {
    const indexContent = `// ${config.programName} SDK
export { ${config.programName}Client } from './client';
export { ${config.programName}Pdas } from './pdas';
export * from './types';

// Re-export commonly used types
export { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
export { Program, AnchorProvider } from '@coral-xyz/anchor';
`;
    await writeFile(path_1.default.join(config.outputDir, 'index.ts'), indexContent);
}
async function createBasicIDL(programName) {
    const idlDir = path_1.default.join('target', 'idl');
    try {
        await mkdir(idlDir, { recursive: true });
    }
    catch (error) {
        // Directory might already exist
    }
    const basicIDL = {
        version: "0.1.0",
        name: programName.replace(/-/g, '_'),
        instructions: [
            {
                name: "processIntent",
                accounts: [],
                args: []
            }
        ],
        accounts: [],
        events: [],
        errors: []
    };
    await writeFile(path_1.default.join(idlDir, `${programName}.json`), JSON.stringify(basicIDL, null, 2));
}
function mapIdlTypeToTs(type) {
    if (typeof type === 'string') {
        switch (type) {
            case 'publicKey': return 'PublicKey';
            case 'string': return 'string';
            case 'u8': return 'number';
            case 'u16': return 'number';
            case 'u32': return 'number';
            case 'u64': return 'BN';
            case 'i8': return 'number';
            case 'i16': return 'number';
            case 'i32': return 'number';
            case 'i64': return 'BN';
            case 'f32': return 'number';
            case 'f64': return 'number';
            case 'bool': return 'boolean';
            default: return 'any';
        }
    }
    if (type.array) {
        return `${mapIdlTypeToTs(type.array[0])}[]`;
    }
    if (type.defined) {
        return type.defined;
    }
    if (type.option) {
        return `${mapIdlTypeToTs(type.option)} | null`;
    }
    return 'any';
}
//# sourceMappingURL=generate-sdk.js.map