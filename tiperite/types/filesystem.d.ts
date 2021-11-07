import { StorageFileWorkspace, TiperiteVersion, TiperiteConfig } from '.';

/**
 * `/storage.json`
 *
 * The main file that persists the app's state on the device. Loaded after
 *  `/boot.json`.
 *
 * @todo update `UUID` with actual type references
 */
export interface StorageFileData {
  // /** Track any extensions installed on the local device */
  // extensions: {
  //   manifest: unknown;
  //   /** @example "https://github.com/example/extension.git" */
  //   repo: string;
  //   id: UUID;
  // }[];
  /**
   * Track any workspaces saved on the local device
   */
  workspaces: StorageFileWorkspace[];
  /**
   * The version of Tiperite that last saved this file
   */
  version: TiperiteVersion;
  config: TiperiteConfig;
}

/**
 * `/boot.json`
 *
 * The first file the app loads.
 */
export interface BootFileData {
  hasDevicePassword: boolean;
  passwordLength: number | null;
  passwordType: 'number' | 'text' | null;
  firstLaunch: boolean;
  /**
   * The iterations to use to generate the passkey for `/storage.json`
   */
  iterations: number;
  /**
   * The version of Tiperite that last saved this file
   */
  version: TiperiteVersion;
  /**
   * The salt to use to generate the passkey for `/storage.json`
   */
  salt: string;
}
