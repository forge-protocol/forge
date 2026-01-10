"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const CONFIG_FILE = (0, path_1.join)((0, os_1.homedir)(), '.forge', 'config.json');
function loadConfig() {
    try {
        if ((0, fs_1.existsSync)(CONFIG_FILE)) {
            const data = (0, fs_1.readFileSync)(CONFIG_FILE, 'utf8');
            return { ...getDefaultConfig(), ...JSON.parse(data) };
        }
    }
    catch (error) {
        // Ignore errors and use defaults
    }
    return getDefaultConfig();
}
function saveConfig(config) {
    const current = loadConfig();
    const updated = { ...current, ...config };
    // Ensure .forge directory exists
    const configDir = (0, path_1.join)((0, os_1.homedir)(), '.forge');
    if (!(0, fs_1.existsSync)(configDir)) {
        require('fs').mkdirSync(configDir, { recursive: true });
    }
    (0, fs_1.writeFileSync)(CONFIG_FILE, JSON.stringify(updated, null, 2));
}
function getDefaultConfig() {
    return {
        name: 'forge-project',
        version: '0.1.0',
        network: 'devnet'
    };
}
//# sourceMappingURL=config.js.map