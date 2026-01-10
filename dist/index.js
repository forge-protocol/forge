"use strict";
// FORGE SDK
// Main entry point for programmatic usage
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = exports.deployCommand = exports.initCommand = exports.saveConfig = exports.loadConfig = exports.logo = void 0;
var ascii_js_1 = require("./ascii.js");
Object.defineProperty(exports, "logo", { enumerable: true, get: function () { return ascii_js_1.logo; } });
var config_js_1 = require("./config.js");
Object.defineProperty(exports, "loadConfig", { enumerable: true, get: function () { return config_js_1.loadConfig; } });
Object.defineProperty(exports, "saveConfig", { enumerable: true, get: function () { return config_js_1.saveConfig; } });
// Re-export key utilities for SDK usage
var init_js_1 = require("./commands/init.js");
Object.defineProperty(exports, "initCommand", { enumerable: true, get: function () { return init_js_1.initCommand; } });
var deploy_js_1 = require("./commands/deploy.js");
Object.defineProperty(exports, "deployCommand", { enumerable: true, get: function () { return deploy_js_1.deployCommand; } });
var status_js_1 = require("./commands/status.js");
Object.defineProperty(exports, "statusCommand", { enumerable: true, get: function () { return status_js_1.statusCommand; } });
//# sourceMappingURL=index.js.map