import {
  StorageFileWorkspace,
  TiperiteVersion,
  TiperiteConfig,
  Credential,
  HexString,
  DocID,
} from '.';

/**
 * `/storage.json`: the main file that persists the app's state on the device.
 *  Loaded after `/boot.json`.
 */
export interface StorageFileData {
  credentials: Credential[];
  workspaces: StorageFileWorkspace[];
  /**
   * IDs of the 15 most recently updated docs in descending order of `updatedAt`
   */
  recentDocs: DocID[];
  /**
   * The version of Tiperite that last saved this file
   */
  version: TiperiteVersion;
  config: TiperiteConfig;
}

/**
 * `/boot.json`: the first file the app loads.
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
  salt: HexString;
}
