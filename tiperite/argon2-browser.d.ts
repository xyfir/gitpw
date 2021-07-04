declare module 'argon2-browser' {
  export enum Argon2Type {
    Argon2id = 2,
    Argon2i = 1,
    Argon2d = 0,
  }

  export interface Argon2Error {
    message?: string;
    code: number;
  }

  export interface Argon2Response {
    hashHex: string;
    encoded: string;
    hash: Uint8Array;
  }

  export interface Argon2HashOptions {
    pass: string;
    salt: string;
    /** Desired parallelism (however it won't be computed in parallel) */
    parallelism?: number;
    /** Desired hash length */
    hashLen?: number;
    /** Optional secret data */
    secret?: Uint8Array;
    /** The number of iterations */
    time?: number;
    type?: Argon2Type;
    /** Used memory, in KiB */
    mem?: number;
    /** Optional associated data */
    ad?: Uint8Array;
  }

  export function hash(opt: Argon2HashOptions): Promise<Argon2Response>;

  export interface Argon2VerifyOptions {
    encoded: string;
    /** Optional secret data */
    secret?: Uint8Array;
    type?: Argon2Type;
    pass: string;
    /** Optional associated data */
    ad?: Uint8Array;
  }

  export function verify(opt: Argon2VerifyOptions): Promise<Argon2Response>;

  export default {
    verify,
    hash,
  };
}
