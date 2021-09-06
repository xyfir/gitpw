import { TiperiteVersion, TiperiteConfig, HexString, UUID } from '.';

/**
 * `/device.json`
 *
 * The main file that persists the app's state on the device. Sometimes
 *  encrypted. Loaded after `/boot.json`.
 *
 * @todo update `UUID` with actual type references
 */
export interface DeviceFileData {
  // /** Track any extensions installed on the local device */
  // extensions: {
  //   manifest: unknown;
  //   /** @example "https://github.com/example/extension.git" */
  //   repo: string;
  //   id: UUID;
  // }[];
  /** Track any workspaces saved on the local device */
  workspaces: {
    config: TiperiteConfig;
    /** @example "https://github.com/example/workspace.git" */
    repo: string;
    name: string;
    /**
     * The final plaintext passkey for the workspace. This is the output from
     *  `KeyDeriver.deriveKey()` using the user-supplied password and the
     *  requirements from the workspace's manifest.
     */
    key: HexString;
    id: UUID;
  }[];
  /** The version of Tiperite that last saved this file */
  version: TiperiteVersion;
  memory: {
    activeWorkspaceId: UUID | null;
    githubToken: string | null;
    pinnedFiles: UUID[];
    recentFiles: UUID[];
  };
  config: TiperiteConfig;
}

/**
 * `/boot.json`
 *
 * The first file the app loads. Always unencrypted.
 */
export interface BootFileData {
  hasDevicePassword: boolean;
  passwordLength: number | null;
  passwordType: 'number' | 'text' | null;
  firstLaunch: boolean;
  /** The version of Tiperite that last saved this file */
  version: TiperiteVersion;
}
