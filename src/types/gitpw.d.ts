/**
 * An ISO date string
 *
 * @example "2021-11-27T23:55:30.126Z"
 */
export type GpwDateString = string;

/**
 * A base64-encoded string
 */
export type GpwBase64String = string;

/**
 * A unique identifier string
 */
export type GpwID = string;

/**
 * Unique identifier for a specific mode of encryption
 */
export type GpwKeyType = 'XChaCha20-Poly1305' | 'AES-256-GCM';

/**
 * A key within a keychain
 */
export type GpwKey = {
  type: GpwKeyType;
  /**
   * Data can be any type of string, but generally it is a base64 encoded string
   *  representing the `type` key's raw binary data. It may also be an encrypted
   *  version of the aforementioned.
   */
  data: string;
};

/**
 * A keychain specifies a set of `GpwKey`s to be used for encryption.
 */
export type GpwKeychain = {
  created_at: GpwDateString;
  /**
   * An array of keys to use for encryption/decryption.
   *
   * For encryption, use in order. For decryption, reverse order.
   */
  keys: GpwKey[];
};

/**
 * The final ciphertext of data encrypted with a `GpwKeychain`.
 */
export type GpwEncryptedString = string;

/**
 * A `GpwLockedKeychain` has the same structure as a `GpwUnlockedKeychain`, but
 *  the `data` fields of its `keys` are encrypted (`GpwEncryptedString`).
 *
 * @see GpwKeychain
 */
export type GpwLockedKeychain = GpwKeychain;

/**
 * A `GpwLockedKeychain` has the same structure as a `GpwLockedKeychain`, but
 *  the `data` fields of its `keys` have been decrypted.
 *
 * @see GpwKeychain
 */
export type GpwUnlockedKeychain = GpwKeychain;

/**
 * A GpwRepo's (`gitpw.json`) configuration file's version.
 */
export type GpwRepoVersion = 'com.xyfir.gitpw/0.0.0';

/**
 * A key stretching method.
 */
export type GpwKeyStretcherType = 'PBKDF2-SHA-512';

/**
 * A key stretcher (key derivation function) is used to generate a key from a
 *  user-supplied password.
 */
export type GpwKeyStretcher = {
  iterations: number;
  type: GpwKeyStretcherType;
  salt: GpwBase64String;
};

/**
 * The structure of the `manifest.json` file in a GpwRepo.
 */
export type GpwRepoManifest = {
  /**
   * Past and current keychains for the `GpwRepo`, ordered newest to oldest,
   *  with each key's `data` encrypted using the current keychain.
   *
   * This allows the decrypting of old commits made prior to key changes.
   *
   * It also allows the verifying of user-supplied passwords by attempting to
   *  decrypt any of the keys' `data`.
   */
  locked_keychains: GpwLockedKeychain[];
  /**
   * Configurations for key derivation functions. Each stretcher is used to
   *  generate the (decrypted) key `data` for the `GpwKey` of the same index in
   *  the first keychain in `locked_keychains`.
   */
  key_stretchers: GpwKeyStretcher[];
  version: GpwRepoVersion;
};

/**
 * A unique ID string for a `GpwFile`.
 */
export type GpwFileID = GpwID;

/**
 * The raw encrypted file within a `GpwRepo`.
 */
export type GpwFile = {
  created_at: GpwDateString;
  updated_at: GpwDateString;
  /**
   * The encrypted contents of the file, optionally broken up into "blocks".
   */
  content: GpwEncryptedString[];
  id: GpwFileID;
};

/**
 * Map a file ID to its plaintext file path relative to repo's root.
 */
export type GpwFileMap = Record<GpwFileID, string>;
