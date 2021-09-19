import * as SecureStore from 'expo-secure-store';
import { KeyDeriver } from '../utils/KeyDeriver';
import { Random } from '../utils/Random';
import Constants from 'expo-constants';
import { AES } from './AES';
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
   *  encryption key (or part of it) for `/device.json`
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
    this.passkey = await SecureStore.getItemAsync(this.SECURESTORE_KEY);
    if (this.passkey) return this.passkey;

    // Generate a passkey
    const salt = await KeyDeriver.generateSalt();
    const itr = await Random.integer(50000, 100000);
    this.passkey = await KeyDeriver.deriveKey(Random.uuid(), salt, itr);

    // Save and return passkey
    await SecureStore.setItemAsync(this.SECURESTORE_KEY, this.passkey);
    return this.passkey;
  }

  /**
   * Generates a default `BootFileData` object
   */
  public static generateDefaultData(
    iterations: number,
    salt: string,
  ): BootFileData {
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
   * Returns a default `BootFileData` object
   */
  private static async getDefaultData(): Promise<BootFileData> {
    const iterations = await Random.integer(50000, 100000);
    const salt = await KeyDeriver.generateSalt();
    return this.generateDefaultData(iterations, salt);
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
      const ciphertext_ = await AES.encrypt(JSON.stringify(data), passkey);
      await FS.writeFile(this.PATH, ciphertext_);
      return data;
    }
    // Decrypt and return existing data
    else {
      const plaintext = await AES.decrypt(ciphertext, passkey);
      return JSON.parse(plaintext) as BootFileData;
    }
  }

  /**
   * Updates the data in the boot file
   */
  public static async setData(data: BootFileData): Promise<void> {
    const passkey = await this.getPasskey();
    const ciphertext = await AES.encrypt(JSON.stringify(data), passkey);
    await FS.writeFile(this.PATH, ciphertext);
  }
}
