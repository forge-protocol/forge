import { z } from 'zod';
export declare const publicKeySchema: z.ZodEffects<z.ZodString, string, string>;
export declare const accountFieldSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
    description?: string | undefined;
}, {
    name: string;
    type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
    description?: string | undefined;
}>;
export declare const accountConfigSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["account", "program", "sysvar"]>;
    address: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    description: z.ZodOptional<z.ZodString>;
    fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }, {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "account" | "program" | "sysvar";
    description?: string | undefined;
    address?: string | undefined;
    fields?: {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }[] | undefined;
}, {
    name: string;
    type: "account" | "program" | "sysvar";
    description?: string | undefined;
    address?: string | undefined;
    fields?: {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }[] | undefined;
}>;
export declare const instructionAccountSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["signer", "writable", "readonly"]>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "signer" | "writable" | "readonly";
    description?: string | undefined;
}, {
    name: string;
    type: "signer" | "writable" | "readonly";
    description?: string | undefined;
}>;
export declare const instructionArgSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
    description?: string | undefined;
}, {
    name: string;
    type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
    description?: string | undefined;
}>;
export declare const instructionConfigSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    accounts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["signer", "writable", "readonly"]>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "signer" | "writable" | "readonly";
        description?: string | undefined;
    }, {
        name: string;
        type: "signer" | "writable" | "readonly";
        description?: string | undefined;
    }>, "many">;
    args: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }, {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    accounts: {
        name: string;
        type: "signer" | "writable" | "readonly";
        description?: string | undefined;
    }[];
    args: {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }[];
    description?: string | undefined;
}, {
    name: string;
    accounts: {
        name: string;
        type: "signer" | "writable" | "readonly";
        description?: string | undefined;
    }[];
    args: {
        name: string;
        type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
        description?: string | undefined;
    }[];
    description?: string | undefined;
}>;
export declare const programConfigSchema: z.ZodObject<{
    name: z.ZodString;
    id: z.ZodEffects<z.ZodString, string, string>;
    path: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    accounts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["account", "program", "sysvar"]>;
        address: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        description: z.ZodOptional<z.ZodString>;
        fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }, {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "account" | "program" | "sysvar";
        description?: string | undefined;
        address?: string | undefined;
        fields?: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[] | undefined;
    }, {
        name: string;
        type: "account" | "program" | "sysvar";
        description?: string | undefined;
        address?: string | undefined;
        fields?: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[] | undefined;
    }>, "many">;
    instructions: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        accounts: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["signer", "writable", "readonly"]>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: "signer" | "writable" | "readonly";
            description?: string | undefined;
        }, {
            name: string;
            type: "signer" | "writable" | "readonly";
            description?: string | undefined;
        }>, "many">;
        args: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }, {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        accounts: {
            name: string;
            type: "signer" | "writable" | "readonly";
            description?: string | undefined;
        }[];
        args: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }, {
        name: string;
        accounts: {
            name: string;
            type: "signer" | "writable" | "readonly";
            description?: string | undefined;
        }[];
        args: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    name: string;
    accounts: {
        name: string;
        type: "account" | "program" | "sysvar";
        description?: string | undefined;
        address?: string | undefined;
        fields?: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[] | undefined;
    }[];
    id: string;
    instructions: {
        name: string;
        accounts: {
            name: string;
            type: "signer" | "writable" | "readonly";
            description?: string | undefined;
        }[];
        args: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }[];
    description?: string | undefined;
}, {
    path: string;
    name: string;
    accounts: {
        name: string;
        type: "account" | "program" | "sysvar";
        description?: string | undefined;
        address?: string | undefined;
        fields?: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[] | undefined;
    }[];
    id: string;
    instructions: {
        name: string;
        accounts: {
            name: string;
            type: "signer" | "writable" | "readonly";
            description?: string | undefined;
        }[];
        args: {
            name: string;
            type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }[];
    description?: string | undefined;
}>;
export declare const forgeConfigSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    programs: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        id: z.ZodEffects<z.ZodString, string, string>;
        path: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        accounts: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["account", "program", "sysvar"]>;
            address: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            description: z.ZodOptional<z.ZodString>;
            fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }, {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: "account" | "program" | "sysvar";
            description?: string | undefined;
            address?: string | undefined;
            fields?: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[] | undefined;
        }, {
            name: string;
            type: "account" | "program" | "sysvar";
            description?: string | undefined;
            address?: string | undefined;
            fields?: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[] | undefined;
        }>, "many">;
        instructions: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            accounts: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<["signer", "writable", "readonly"]>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }, {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }>, "many">;
            args: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "bool", "string", "publicKey", "bytes"]>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }, {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            accounts: {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }[];
            args: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[];
            description?: string | undefined;
        }, {
            name: string;
            accounts: {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }[];
            args: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[];
            description?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string;
        name: string;
        accounts: {
            name: string;
            type: "account" | "program" | "sysvar";
            description?: string | undefined;
            address?: string | undefined;
            fields?: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[] | undefined;
        }[];
        id: string;
        instructions: {
            name: string;
            accounts: {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }[];
            args: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[];
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }, {
        path: string;
        name: string;
        accounts: {
            name: string;
            type: "account" | "program" | "sysvar";
            description?: string | undefined;
            address?: string | undefined;
            fields?: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[] | undefined;
        }[];
        id: string;
        instructions: {
            name: string;
            accounts: {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }[];
            args: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[];
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    programs: {
        path: string;
        name: string;
        accounts: {
            name: string;
            type: "account" | "program" | "sysvar";
            description?: string | undefined;
            address?: string | undefined;
            fields?: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[] | undefined;
        }[];
        id: string;
        instructions: {
            name: string;
            accounts: {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }[];
            args: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[];
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }[];
    description?: string | undefined;
    author?: string | undefined;
}, {
    name: string;
    version: string;
    programs: {
        path: string;
        name: string;
        accounts: {
            name: string;
            type: "account" | "program" | "sysvar";
            description?: string | undefined;
            address?: string | undefined;
            fields?: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[] | undefined;
        }[];
        id: string;
        instructions: {
            name: string;
            accounts: {
                name: string;
                type: "signer" | "writable" | "readonly";
                description?: string | undefined;
            }[];
            args: {
                name: string;
                type: "string" | "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "bool" | "publicKey" | "bytes";
                description?: string | undefined;
            }[];
            description?: string | undefined;
        }[];
        description?: string | undefined;
    }[];
    description?: string | undefined;
    author?: string | undefined;
}>;
export declare const forgeTransactionSchema: z.ZodObject<{
    programId: z.ZodEffects<z.ZodString, string, string>;
    instruction: z.ZodString;
    accounts: z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">;
    data: z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>;
    signers: z.ZodArray<z.ZodObject<{
        publicKey: z.ZodEffects<z.ZodString, string, string>;
        secretKey: z.ZodOptional<z.ZodType<Uint8Array<ArrayBuffer>, z.ZodTypeDef, Uint8Array<ArrayBuffer>>>;
    }, "strip", z.ZodTypeAny, {
        publicKey: string;
        secretKey?: Uint8Array<ArrayBuffer> | undefined;
    }, {
        publicKey: string;
        secretKey?: Uint8Array<ArrayBuffer> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    accounts: string[];
    programId: string;
    instruction: string;
    data: Buffer<ArrayBufferLike>;
    signers: {
        publicKey: string;
        secretKey?: Uint8Array<ArrayBuffer> | undefined;
    }[];
}, {
    accounts: string[];
    programId: string;
    instruction: string;
    data: Buffer<ArrayBufferLike>;
    signers: {
        publicKey: string;
        secretKey?: Uint8Array<ArrayBuffer> | undefined;
    }[];
}>;
export declare const deploymentConfigSchema: z.ZodObject<{
    cluster: z.ZodEnum<["devnet", "mainnet-beta", "localnet"]>;
    programId: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    wallet: z.ZodOptional<z.ZodString>;
    priorityFee: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cluster: "devnet" | "mainnet-beta" | "localnet";
    programId?: string | undefined;
    wallet?: string | undefined;
    priorityFee?: number | undefined;
}, {
    cluster: "devnet" | "mainnet-beta" | "localnet";
    programId?: string | undefined;
    wallet?: string | undefined;
    priorityFee?: number | undefined;
}>;
export declare const validationErrorSchema: z.ZodObject<{
    field: z.ZodString;
    message: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    field: string;
}, {
    code: string;
    message: string;
    field: string;
}>;
export declare const validationWarningSchema: z.ZodObject<{
    field: z.ZodString;
    message: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    field: string;
}, {
    code: string;
    message: string;
    field: string;
}>;
export declare const validationResultSchema: z.ZodObject<{
    isValid: z.ZodBoolean;
    errors: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        message: z.ZodString;
        code: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        field: string;
    }, {
        code: string;
        message: string;
        field: string;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        message: z.ZodString;
        code: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        field: string;
    }, {
        code: string;
        message: string;
        field: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    isValid: boolean;
    errors: {
        code: string;
        message: string;
        field: string;
    }[];
    warnings: {
        code: string;
        message: string;
        field: string;
    }[];
}, {
    isValid: boolean;
    errors: {
        code: string;
        message: string;
        field: string;
    }[];
    warnings: {
        code: string;
        message: string;
        field: string;
    }[];
}>;
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
//# sourceMappingURL=schemas.d.ts.map