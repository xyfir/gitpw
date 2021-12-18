import { WorkspaceID } from '../types';
import { store } from '../state/store';
import * as git from 'isomorphic-git';
import { FS } from '../utils/FS';
import http from 'isomorphic-git/http/web';

interface CommonOptions {
  corsProxy: string;
  onAuth: git.AuthCallback;
  http: git.HttpClient;
  url: string;
  dir: string;
  fs: git.PromiseFsClient;
}

/**
 * A workspace-scoped wrapper around the `isomorphic-git` library
 *
 * @see https://isomorphic-git.org/docs/en/alphabetic
 */
export class TrGit {
  private commonOptions: CommonOptions;

  constructor(workspaceId: WorkspaceID) {
    const { credentials, workspaces } = store.getState();
    if (!credentials || !workspaces) throw Error('Null credentials/workspaces');

    const workspace = workspaces.byId[workspaceId];
    const credential = credentials.byId[workspace.credentialId];
    this.commonOptions = {
      corsProxy: 'https://cors.isomorphic-git.org',
      onAuth: () => ({
        username: credential.username,
        password: credential.password,
      }),
      http,
      dir: `/workspaces/${workspace.id}`,
      url: workspace.repoUrl,
      fs: FS.fs,
    };
  }

  /**
   * Return all files with unstaged changes
   *
   * @see https://isomorphic-git.org/docs/en/statusMatrix#q-what-files-have-unstaged-changes
   */
  public getUnstagedChanges(): Promise<string[]> {
    return this.statusMatrix().then((rows) => {
      return rows.filter((row) => row[2] != row[3]).map((row) => row[0]);
    });
  }

  /**
   * @see https://isomorphic-git.org/docs/en/getRemoteInfo
   */
  public getRemoteInfo(): Promise<git.GetRemoteInfoResult> {
    return git.getRemoteInfo(this.commonOptions);
  }

  /**
   * @see https://isomorphic-git.org/docs/en/statusMatrix
   */
  public statusMatrix(): Promise<git.StatusRow[]> {
    return git.statusMatrix(this.commonOptions);
  }

  /**
   * @see https://isomorphic-git.org/docs/en/fastForward
   */
  public fastForward(): Promise<void> {
    return git.fastForward(this.commonOptions);
  }

  /**
   * Add multiple files
   */
  public addAll(filepaths: string[]): Promise<void[]> {
    return Promise.all(filepaths.map(this.add));
  }

  /**
   * @see https://isomorphic-git.org/docs/en/commit
   */
  public commit(message: string): ReturnType<typeof git.commit> {
    return git.commit({ ...this.commonOptions, message });
  }

  /**
   * @see https://isomorphic-git.org/docs/en/clone
   */
  public clone(): Promise<void> {
    return git.clone(this.commonOptions);
  }

  /**
   * Pushes `main` branch to `origin`
   *
   * @see https://isomorphic-git.org/docs/en/push
   */
  public push(): Promise<git.PushResult> {
    return git.push({ ...this.commonOptions, remote: 'origin', ref: 'main' });
  }

  /**
   * @see https://isomorphic-git.org/docs/en/add
   */
  public add(filepath: string): Promise<void> {
    return git.add({ ...this.commonOptions, filepath });
  }
}
