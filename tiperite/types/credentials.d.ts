import { UUID } from '.';

export type CredentialID = UUID;

export type CredentialType = 'Bitbucket' | 'GitHub' | 'GitLab' | 'Custom';

export interface Credential {
  authorEmail: string;
  authorName: string;
  username: string;
  password: string;
  type: CredentialType;
  id: CredentialID;
}

/**
 * The `credentials` Redux state object
 *
 * @see RootState.credentials
 */
export interface CredentialsState {
  allIds: CredentialID[];
  byId: Record<CredentialID, Credential>;
}
