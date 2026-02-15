"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSdkV2 = generateSdkV2;
const fs_1 = require("fs");
const path_1 = require("path");
async function generateSdkV2(config, idl) {
    const { programName, programId, outputDir } = config;
    // Create output directory
    (0, fs_1.mkdirSync)(outputDir, { recursive: true });
    // Generate package.json for v2
    const packageJson = {
        name: `${programName.toLowerCase()}-sdk-v2`,
        version: "1.0.0",
        description: `Web3.js v2 SDK for ${programName} Solana program`,
        main: "dist/index.js",
        types: "dist/index.d.ts",
        scripts: {
            build: "tsc",
        },
        dependencies: {
            "@solana/web3.js": "2.0.0",
            "@solana/functional": "experimental",
            "bn.js": "^5.2.1"
        },
        devDependencies: {
            "typescript": "^5.0.0",
            "@types/node": "^20.0.0",
            "@types/bn.js": "^5.1.5"
        }
    };
    (0, fs_1.writeFileSync)((0, path_1.join)(outputDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    // Generate tsconfig.json
    const tsconfig = {
        compilerOptions: {
            target: "ES2022",
            module: "ESNext",
            moduleResolution: "node",
            lib: ["ES2022", "DOM"],
            outDir: "./dist",
            rootDir: "./src",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            declaration: true,
        },
        include: ["src/**/*.ts"],
    };
    (0, fs_1.mkdirSync)((0, path_1.join)(outputDir, 'src'), { recursive: true });
    (0, fs_1.writeFileSync)((0, path_1.join)(outputDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
    // Generate index.ts
    const indexContent = `// Auto-generated Web3.js v2 SDK for ${programName}
export * from './instructions';
export * from './accounts';
export * from './pdas';
export * from './rpc';
`;
    (0, fs_1.writeFileSync)((0, path_1.join)(outputDir, 'src', 'index.ts'), indexContent);
    // Generate RPC helpers
    const rpcContent = `import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/web3.js';

export function create${programName}Rpc(url: string) {
  return createSolanaRpc(url);
}

export function create${programName}RpcSubscriptions(url: string) {
  return createSolanaRpcSubscriptions(url);
}
`;
    (0, fs_1.writeFileSync)((0, path_1.join)(outputDir, 'src', 'rpc.ts'), rpcContent);
    // Generate instructions.ts
    const instructionsContent = generateInstructionsV2(programName, programId, idl);
    (0, fs_1.writeFileSync)((0, path_1.join)(outputDir, 'src', 'instructions.ts'), instructionsContent);
    // Generate accounts.ts
    const accountsContent = generateAccountsV2(programName, idl);
    (0, fs_1.writeFileSync)((0, path_1.join)(outputDir, 'src', 'accounts.ts'), accountsContent);
    // Generate pdas.ts
    const pdasContent = generatePdasV2(programName, programId, idl);
    (0, fs_1.writeFileSync)((0, path_1.join)(outputDir, 'src', 'pdas.ts'), pdasContent);
}
function generateInstructionsV2(programName, programId, idl) {
    let content = `import { 
  address, 
  appendTransactionInstruction, 
  getInstructionDataEncoder, 
  IAccountMeta, 
  IInstruction, 
  IInstructionWithAccounts, 
  IInstructionWithData 
} from '@solana/web3.js';
import { getStructEncoder, getU64Encoder, getU32Encoder, getU8Encoder, getStringEncoder } from '@solana/codecs-data-structures';

export const PROGRAM_ID = address('${programId}');

`;
    if (idl.instructions) {
        for (const ix of idl.instructions) {
            const ixName = ix.name.charAt(0).toUpperCase() + ix.name.slice(1);
            // Instruction Data Struct
            content += `// ${ixName} Instruction\n`;
            content += `export type ${ixName}InstructionData = {\n`;
            if (ix.args) {
                for (const arg of ix.args) {
                    content += `  ${arg.name}: ${mapIdlTypeToTsV2(arg.type)};\n`;
                }
            }
            content += `};\n\n`;
            // Encoder
            content += `export const get${ixName}InstructionDataEncoder = () => 
  getStructEncoder([\n`;
            if (ix.args) {
                for (const arg of ix.args) {
                    content += `    ['${arg.name}', ${getEncoderForTypeV2(arg.type)}],\n`;
                }
            }
            content += `  ]);\n\n`;
            // Instruction Factory
            content += `export function get${ixName}Instruction(\n`;
            content += `  accounts: {\n`;
            if (ix.accounts) {
                for (const acc of ix.accounts) {
                    content += `    ${acc.name}: string | IAccountMeta;\n`;
                }
            }
            content += `  },\n`;
            if (ix.args && ix.args.length > 0) {
                content += `  args: ${ixName}InstructionData\n`;
            }
            content += `): IInstruction {\n`;
            content += `  const data = get${ixName}InstructionDataEncoder().encode(${ix.args && ix.args.length > 0 ? 'args' : '{}'});\n`;
            content += `  return {\n`;
            content += `    programAddress: PROGRAM_ID,\n`;
            content += `    accounts: [\n`;
            if (ix.accounts) {
                for (const acc of ix.accounts) {
                    const isSigner = acc.isSigner ? 'true' : 'false';
                    const isWritable = acc.isMut ? 'true' : 'false';
                    content += `      typeof accounts.${acc.name} === 'string' \n`;
                    content += `        ? { address: address(accounts.${acc.name}), role: ${isSigner === 'true' ? (isWritable === 'true' ? '2' : '1') : (isWritable === 'true' ? '3' : '0')} } \n`;
                    content += `        : accounts.${acc.name},\n`;
                }
            }
            content += `    ],\n`;
            content += `    data,\n`;
            content += `  };\n`;
            content += `}\n\n`;
        }
    }
    return content;
}
function generateAccountsV2(programName, idl) {
    let content = `import { address } from '@solana/web3.js';
import { getStructDecoder, getU64Decoder, getU32Decoder, getU8Decoder, getStringDecoder } from '@solana/codecs-data-structures';

`;
    if (idl.accounts) {
        for (const acc of idl.accounts) {
            const accName = acc.name.charAt(0).toUpperCase() + acc.name.slice(1);
            content += `// ${accName} Account\n`;
            content += `export type ${accName} = {\n`;
            // We'd need the field definitions from the IDL for full account decoding
            content += `  // Add fields from IDL\n`;
            content += `};\n\n`;
            content += `export const get${accName}Decoder = () => \n`;
            content += `  getStructDecoder([\n`;
            content += `    // Add field decoders\n`;
            content += `  ]);\n\n`;
        }
    }
    return content;
}
function generatePdasV2(programName, programId, idl) {
    let content = `import { address, getProgramDerivedAddress } from '@solana/web3.js';

export const PROGRAM_ID = address('${programId}');

`;
    if (idl.accounts) {
        for (const acc of idl.accounts) {
            if (acc.seeds) {
                const methodName = `find${acc.name}Pda`;
                content += `export async function ${methodName}(`;
                const params = [];
                for (const seed of acc.seeds) {
                    if (seed.kind === 'account') {
                        params.push(`${seed.path}: string`);
                    }
                }
                content += params.join(', ');
                content += `) {\n`;
                content += `  return await getProgramDerivedAddress({\n`;
                content += `    programAddress: PROGRAM_ID,\n`;
                content += `    seeds: [\n`;
                for (const seed of acc.seeds) {
                    if (seed.kind === 'const') {
                        content += `      Buffer.from('${seed.value}'),\n`;
                    }
                    else if (seed.kind === 'account') {
                        content += `      address(${seed.path}),\n`;
                    }
                }
                content += `    ],\n`;
                content += `  });\n`;
                content += `}\n\n`;
            }
        }
    }
    return content;
}
function mapIdlTypeToTsV2(type) {
    if (typeof type === 'string') {
        switch (type) {
            case 'publicKey': return 'string';
            case 'string': return 'string';
            case 'u8': return 'number';
            case 'u16': return 'number';
            case 'u32': return 'number';
            case 'u64': return 'bigint';
            case 'bool': return 'boolean';
            default: return 'any';
        }
    }
    return 'any';
}
function getEncoderForTypeV2(type) {
    if (typeof type === 'string') {
        switch (type) {
            case 'u64': return 'getU64Encoder()';
            case 'u32': return 'getU32Encoder()';
            case 'u8': return 'getU8Encoder()';
            case 'string': return 'getStringEncoder()';
            default: return 'getU8Encoder()'; // Fallback
        }
    }
    return 'getU8Encoder()';
}
//# sourceMappingURL=sdk-generator-v2.js.map