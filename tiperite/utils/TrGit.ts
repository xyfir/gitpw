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
  fs: typeof FS.fs;
}

/**
 * A workspace-scoped wrapper around the isomorphic-git library
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

  public getRemoteInfo(): Promise<git.GetRemoteInfoResult> {
    return git.getRemoteInfo(this.commonOptions);
  }

  public clone(): Promise<void> {
    return git.clone(this.commonOptions);
  }
}
