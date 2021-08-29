/**
 * A version string corresponding to a Tiperite release
 *
 * @example "1.2.3"
 */
export type TiperiteVersion = string;

/**
 * An encrypted string output from `AES.encrypt()`
 *
 * `${iv_HexString}${ciphertext_Base64String}`
 */
export type EncryptedString = string;

/**
 * A base64 string
 *
 * @example "SGVsbG8gV29ybGQ="
 */
export type Base64String = string;

/**
 * A hexadecimal string
 *
 * @example "48656c6c6f20576f726c64203a29"
 */
export type HexString = string;

/**
 * A UUID v4 string used for indentifying objects
 *
 * @example "4ee12672-c5f7-4968-85c7-15c57bedbe85"
 */
export type UUID = string;
