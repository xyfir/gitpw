import { TrPBKDF2 } from './TrPBKDF2';
import { Random } from '../utils/Random';
import Constants from 'expo-constants';
import { TrAES } from './TrAES';
import { FS } from './FS';
import {
  TiperiteVersion,
  EncryptedString,
  BootFileData,
  HexString,
} from '../types';

/**
 * Read and write to `/boot.json`
 */
export class BootFile {
  /**
   * Key name in `SecureStore` for saving passkey
   */
  private static SECURESTORE_KEY: 'boot-passkey' = 'boot-passkey';
  /**
   * The boot passkey is used to encrypt `/boot.json` and is also used as the
   *  encryption key (or part of it) for `/storage.json`
   */
  private static passkey: HexString | null = null;
  /**
   * The path on the filesystem
   */
  private static PATH: '/boot.json' = '/boot.json';

  /**
   * Returns the boot passkey after generating the key if needed
   */
  public static async getPasskey(): Promise<HexString> {
    if (this.passkey !== null) return this.passkey;

    // Get previously generated passkey and return if available
    this.passkey = localStorage.getItem(this.SECURESTORE_KEY);
    if (this.passkey) return this.passkey;

    // Generate a passkey
    const salt = TrPBKDF2.generateSalt();
    const itr = await Random.integer(50000, 100000);
    this.passkey = await TrPBKDF2.deriveKey(Random.uuid(), salt, itr);

    // Save and return passkey
    localStorage.setItem(this.SECURESTORE_KEY, this.passkey);
    return this.passkey;
  }

  /**
   * Returns a default `BootFileData` object
   */
  private static async getDefaultData(): Promise<BootFileData> {
    const iterations = await Random.integer(50000, 100000);
    const salt = await TrPBKDF2.generateSalt();

    return {
      hasDevicePassword: false,
      passwordLength: null,
      passwordType: null,
      firstLaunch: true,
      iterations,
      version: Constants.nativeAppVersion as TiperiteVersion,
      salt,
    };
  }

  /**
   * Returns the `BootFileData` object after initializing the file if needed
   */
  public static async getData(): Promise<BootFileData> {
    // Read file and passkey
    const ciphertext = await FS.readFile<EncryptedString>(this.PATH);
    const passkey = await this.getPasskey();

    // Initialize file with default data
    if (ciphertext === null) {
      const data = this.getDefaultData();
      const ciphertext_ = await TrAES.encrypt(JSON.stringify(data), passkey);
      await FS.writeFile(this.PATH, ciphertext_);
      return data;
    }
    // Decrypt and return existing data
    else {
      const plaintext = await TrAES.decrypt(ciphertext, passkey);
      return JSON.parse(plaintext) as BootFileData;
    }
  }

  /**
   * Updates the data in the boot file
   */
  public static async setData(data: BootFileData): Promise<void> {
    const passkey = await this.getPasskey();
    const ciphertext = await TrAES.encrypt(JSON.stringify(data), passkey);
    await FS.writeFile(this.PATH, ciphertext);
  }
}
