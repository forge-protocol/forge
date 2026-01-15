export interface SDKConfig {
    programName: string;
    programId: string;
    instructions: Instruction[];
    accounts: Account[];
    events?: Event[];
}
export interface Instruction {
    name: string;
    accounts: AccountField[];
    args: ArgField[];
    cpiType?: string;
}
export interface AccountField {
    name: string;
    type: string;
    isMut: boolean;
    isSigner: boolean;
}
export interface ArgField {
    name: string;
    type: string;
}
export interface Account {
    name: string;
    type: string;
}
export interface Event {
    name: string;
    fields: ArgField[];
}
export declare function generateClientSDK(config: SDKConfig): string;
export declare function saveSDK(config: SDKConfig, outputDir: string): void;
//# sourceMappingURL=sdk-generator.d.ts.map