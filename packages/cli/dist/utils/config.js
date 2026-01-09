"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.isForgeProject = isForgeProject;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function loadConfig() {
    const configPath = path_1.default.join(process.cwd(), 'forge.json');
    try {
        const config = await fs_extra_1.default.readJson(configPath);
        return config;
    }
    catch {
        return null;
    }
}
async function saveConfig(config) {
    const configPath = path_1.default.join(process.cwd(), 'forge.json');
    await fs_extra_1.default.writeJson(configPath, config, { spaces: 2 });
}
async function isForgeProject() {
    const configPath = path_1.default.join(process.cwd(), 'forge.json');
    const anchorConfig = path_1.default.join(process.cwd(), 'Anchor.toml');
    return (await fs_extra_1.default.pathExists(configPath)) || (await fs_extra_1.default.pathExists(anchorConfig));
}
//# sourceMappingURL=config.js.map