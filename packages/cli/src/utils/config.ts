import fs from 'fs-extra';
import path from 'path';

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

export async function loadConfig(): Promise<ForgeConfig | null> {
  const configPath = path.join(process.cwd(), 'forge.json');

  try {
    const config = await fs.readJson(configPath);
    return config;
  } catch {
    return null;
  }
}

export async function saveConfig(config: ForgeConfig): Promise<void> {
  const configPath = path.join(process.cwd(), 'forge.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export async function isForgeProject(): Promise<boolean> {
  const configPath = path.join(process.cwd(), 'forge.json');
  const anchorConfig = path.join(process.cwd(), 'Anchor.toml');

  return (await fs.pathExists(configPath)) || (await fs.pathExists(anchorConfig));
}