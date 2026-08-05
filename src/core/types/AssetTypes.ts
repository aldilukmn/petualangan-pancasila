export enum AssetType {
  IMAGE = 'image',
  AUDIO = 'audio',
  SPRITESHEET = 'spritesheet',
  JSON = 'json',
  VIDEO = 'video'
}

export interface AssetConfig {
  key: string;
  type: AssetType;
  path: string;
  options?: any; // Additional configuration, like frame sizes for spritesheets
  lazy?: boolean; // Whether to delay loading until specifically requested
}

export type AssetBundle = AssetConfig[];
