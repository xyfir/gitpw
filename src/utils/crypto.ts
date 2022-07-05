import { webcrypto } from 'crypto';

/**
 * Re-export web crypto since the types are a little wonky as of writing this.
 */
export const crypto = webcrypto as unknown as Crypto;
