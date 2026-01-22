"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateCommand = migrateCommand;
const upgrade_js_1 = require("./upgrade.js");
async function migrateCommand(targetVersion) {
    console.log('🔄 FORGE Migration Assistant\n');
    console.log('This command helps migrate between Anchor versions.\n');
    await (0, upgrade_js_1.upgradeCommand)(targetVersion);
    console.log('\n📋 Additional Migration Steps:');
    console.log('   1. Review breaking changes in Anchor changelog');
    console.log('   2. Update any custom account serialization');
    console.log('   3. Test all instructions thoroughly');
    console.log('   4. Update client SDKs if needed');
}
//# sourceMappingURL=migrate.js.map