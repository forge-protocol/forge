export interface ForgeConfig {
    name: string;
    version: string;
    programs: {
        [key: string]: {
            id: string;
            path: string;
        };
    };
}
export declare function loadConfig(): Promise<ForgeConfig | null>;
export declare function saveConfig(config: ForgeConfig): Promise<void>;
export declare function isForgeProject(): Promise<boolean>;
//# sourceMappingURL=config.d.ts.map