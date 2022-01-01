import { StorageFileWorkspace, WorkspaceID } from '../types';
import { store } from '../state/store';
import * as git from 'isomorphic-git';
import { FS } from '../utils/FS';
import http from 'isomorphic-git/http/web';

type UnstagedChange = {
  filepath: string;
  remove: boolean;
};

interface CommonOptions {
  corsProxy: string;
  onAuth: git.AuthCallback;
  author: {
    email: string;
    name: string;
  };
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

  constructor(
    ws:
      | WorkspaceID
      | Pick<StorageFileWorkspace, 'credentialId' | 'repoUrl' | 'id'>,
  ) {
    const { credentials, workspaces } = store.getState();
    if (!credentials || !workspaces) throw Error('Null credentials/workspaces');

    const workspace = typeof ws == 'object' ? ws : workspaces.byId[ws];
    const credential = credentials.byId[workspace.credentialId];
    this.commonOptions = {
      corsProxy: 'https://cors.isomorphic-git.org',
      onAuth: () => ({
        username: credential.username,
        password: credential.password,
      }),
      author: {
        email: credential.authorEmail,
        name: credential.authorName,
      },
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
  public getUnstagedChanges(): Promise<UnstagedChange[]> {
    return this.statusMatrix().then((rows) => {
      return rows
        .filter((row) => row[2] != row[3])
        .map((row) => ({ filepath: row[0], remove: row[2] == 0 }));
    });
  }

  /**
   * Check if the remote branch has changes that the local does not
   */
  public hasRemoteChanges(): Promise<boolean> {
    return Promise.all([this.log({ depth: 1 }), this.fetch()]).then(
      ([log, fetch]) => {
        return log[0].oid != fetch.fetchHead;
      },
    );
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
   * Remove multiple files
   */
  public removeAll(filepaths: string[]): Promise<void[]> {
    return Promise.all(filepaths.map((file) => this.remove(file)));
  }

  /**
   * Add multiple files
   */
  public addAll(filepaths: string[]): Promise<void[]> {
    return Promise.all(filepaths.map((file) => this.add(file)));
  }

  /**
   * @see https://isomorphic-git.org/docs/en/commit
   */
  public commit(message: string): ReturnType<typeof git.commit> {
    return git.commit({ ...this.commonOptions, message });
  }

  /**
   * @see https://isomorphic-git.org/docs/en/remove
   */
  public remove(filepath: string): Promise<void> {
    return git.remove({ ...this.commonOptions, filepath });
  }

  /**
   * @see https://isomorphic-git.org/docs/en/clone
   */
  public clone(): Promise<void> {
    return git.clone(this.commonOptions);
  }

  /**
   * @see https://isomorphic-git.org/docs/en/fetch
   */
  public fetch(): Promise<git.FetchResult> {
    return git.fetch(this.commonOptions);
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

  /**
   * @see https://isomorphic-git.org/docs/en/log
   */
  public log({ depth }: { depth?: number }): Promise<git.ReadCommitResult[]> {
    return git.log({ ...this.commonOptions, depth });
  }
}
