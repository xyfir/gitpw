import { TiperiteVersion, TiperiteConfig, HexString, UUID } from '.';

export type WorkspaceID = UUID;

/**
 * The workspace object as stored in `/storage.json`
 *
 * @see StorageFileData.workspaces
 */
export interface StorageFileWorkspace {
  lastViewedAt: number;
  config: TiperiteConfig;
  /**
   * @example "https://github.com/example/workspace.git"
   */
  repo: string;
  name: string;
  auth: {
    user: string;
    pass: string;
  };
  /**
   * The final plaintext passkey for the workspace. This is the output from
   *  `KeyDeriver.deriveKey()` using the user-supplied password and the
   *  requirements from the workspace's manifest.
   */
  key: HexString;
  id: WorkspaceID;
}

/**
 * The `workspaces` Redux state object
 *
 * @see RootState.workspaces
 */
export interface WorkspacesState {
  allIds: WorkspaceID[];
  byId: Record<WorkspaceID, StorageFileWorkspace>;
}

/**
 * The `manifest.json` file in a workspace's repo
 */
export interface WorkspaceManifestFileData {
  password: {
    iterations: number;
    hash: 'SHA-512';
    salt: string;
  };
  version: TiperiteVersion;
  id: WorkspaceID;
}
