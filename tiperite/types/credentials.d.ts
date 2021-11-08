import { UUID } from '.';

export type CredentialID = UUID;

export interface Credential {
  username: string;
  password: string;
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
