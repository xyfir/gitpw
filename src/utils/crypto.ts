import { webcrypto } from 'crypto';

export const crypto = webcrypto as unknown as Crypto;
