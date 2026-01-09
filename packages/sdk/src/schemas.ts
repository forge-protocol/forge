import { z } from 'zod';

// Zod schemas for validation

// Public Key validation
export const publicKeySchema = z.string().refine(
  (val) => {
    try {
      return val.length === 32 || val.length === 44; // bytes or base58
    } catch {
      return false;
    }
  },
  { message: "Invalid public key format" }
);

// Account field schema
export const accountFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['u8', 'u16', 'u32', 'u64', 'i8', 'i16', 'i32', 'i64', 'bool', 'string', 'publicKey', 'bytes']),
  description: z.string().optional()
});

// Account configuration schema
export const accountConfigSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['account', 'program', 'sysvar']),
  address: publicKeySchema.optional(),
  description: z.string().optional(),
  fields: z.array(accountFieldSchema).optional()
});

// Instruction account schema
export const instructionAccountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['signer', 'writable', 'readonly']),
  description: z.string().optional()
});

// Instruction argument schema
export const instructionArgSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['u8', 'u16', 'u32', 'u64', 'i8', 'i16', 'i32', 'i64', 'bool', 'string', 'publicKey', 'bytes']),
  description: z.string().optional()
});

// Instruction configuration schema
export const instructionConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  accounts: z.array(instructionAccountSchema),
  args: z.array(instructionArgSchema)
});

// Program configuration schema
export const programConfigSchema = z.object({
  name: z.string().min(1),
  id: publicKeySchema,
  path: z.string().min(1),
  description: z.string().optional(),
  accounts: z.array(accountConfigSchema),
  instructions: z.array(instructionConfigSchema)
});

// FORGE configuration schema
export const forgeConfigSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be in format x.y.z"),
  description: z.string().optional(),
  author: z.string().optional(),
  programs: z.array(programConfigSchema)
});

// Transaction schema
export const forgeTransactionSchema = z.object({
  programId: publicKeySchema,
  instruction: z.string().min(1),
  accounts: z.array(publicKeySchema),
  data: z.instanceof(Buffer),
  signers: z.array(z.object({
    publicKey: publicKeySchema,
    secretKey: z.instanceof(Uint8Array).optional()
  }))
});

// Deployment configuration schema
export const deploymentConfigSchema = z.object({
  cluster: z.enum(['devnet', 'mainnet-beta', 'localnet']),
  programId: publicKeySchema.optional(),
  wallet: z.string().optional(),
  priorityFee: z.number().min(0).optional()
});

// Validation result schemas
export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string()
});

export const validationWarningSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string()
});

export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(validationErrorSchema),
  warnings: z.array(validationWarningSchema)
});

// Type exports
export type PublicKeySchema = z.infer<typeof publicKeySchema>;
export type AccountFieldSchema = z.infer<typeof accountFieldSchema>;
export type AccountConfigSchema = z.infer<typeof accountConfigSchema>;
export type InstructionAccountSchema = z.infer<typeof instructionAccountSchema>;
export type InstructionArgSchema = z.infer<typeof instructionArgSchema>;
export type InstructionConfigSchema = z.infer<typeof instructionConfigSchema>;
export type ProgramConfigSchema = z.infer<typeof programConfigSchema>;
export type ForgeConfigSchema = z.infer<typeof forgeConfigSchema>;
export type ForgeTransactionSchema = z.infer<typeof forgeTransactionSchema>;
export type DeploymentConfigSchema = z.infer<typeof deploymentConfigSchema>;
export type ValidationErrorSchema = z.infer<typeof validationErrorSchema>;
export type ValidationWarningSchema = z.infer<typeof validationWarningSchema>;
export type ValidationResultSchema = z.infer<typeof validationResultSchema>;