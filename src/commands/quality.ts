import { readFileSync, existsSync } from 'fs';

export async function qualityCommand(): Promise<void> {
  console.log('📊 FORGE Code Quality Metrics\n');

  try {
    if (!existsSync('Anchor.toml')) {
      console.error('❌ Not in an Anchor project directory');
      process.exit(1);
    }

    const { glob } = require('glob');
    const rustFiles = await glob('programs/**/*.rs');

    let totalLines = 0;
    let totalFunctions = 0;
    let totalStructs = 0;
    let complexity = 0;

    for (const file of rustFiles) {
      const content = readFileSync(file, 'utf8');
      totalLines += content.split('\n').length;
      totalFunctions += (content.match(/pub fn \w+/g) || []).length;
      totalStructs += (content.match(/pub struct \w+/g) || []).length;
      complexity += (content.match(/\{[^}]*\{/g) || []).length;
    }

    console.log('📈 Code Metrics:');
    console.log(`   Total lines: ${totalLines}`);
    console.log(`   Functions: ${totalFunctions}`);
    console.log(`   Structs: ${totalStructs}`);
    console.log(`   Complexity score: ${complexity}`);

    console.log('\n✅ Quality Assessment:');
    if (totalLines < 1000) {
      console.log('   ✅ Codebase size: Small (maintainable)');
    } else if (totalLines < 5000) {
      console.log('   ⚠️  Codebase size: Medium (consider modularization)');
    } else {
      console.log('   ⚠️  Codebase size: Large (consider splitting)');
    }

    if (totalFunctions > 0 && complexity / totalFunctions < 5) {
      console.log('   ✅ Complexity: Low (good maintainability)');
    } else {
      console.log('   ⚠️  Complexity: High (consider refactoring)');
    }

    console.log('\n💡 Recommendations:');
    console.log('   • Keep functions under 50 lines');
    console.log('   • Limit nesting depth to 3 levels');
    console.log('   • Extract complex logic into helper functions');
    console.log('   • Add comprehensive tests');

  } catch (error: any) {
    console.error('❌ Quality analysis failed');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
