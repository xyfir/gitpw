import { TrPBKDF2 } from './TrPBKDF2';
import { BootFile } from './BootFile';
import Constants from 'expo-constants';
import { TrAES } from './TrAES';
import { FS } from './FS';
import {
  TiperiteVersion,
  EncryptedString,
  StorageFileData,
  HexString,
} from '../types';

/**
 * Read and write to `/storage.json`
 */
export class StorageFile {
  /**
   * The passcode is appended to the passkey for `/boot.json` to form the
   *  password that generates the passkey for `/storage.json`
   */
  private static passcode: string | null = null;
  /**
   * The passkey is used to encrypt `/storage.json`
   */
  private static passkey: HexString | null = null;
  /**
   * The path on the filesystem
   */
  private static PATH: '/storage.json' = '/storage.json';
  /**
   * The decrypted in-memory object read from `/storage.json`
   */
  private static data: StorageFileData | null = null;

  /**
   * Returns the storage passkey after generating it if needed
   */
  private static async getPasskey(passcode: string): Promise<HexString> {
    if (this.passkey !== null) return this.passkey;

    const bootPasskey = await BootFile.getPasskey();
    const bootData = await BootFile.getData();

    return await TrPBKDF2.deriveKey(
      `${bootPasskey}-${passcode}`,
      bootData.salt,
      bootData.iterations,
    );
  }

  /**
   * Returns a default `StorageFileData` object
   */
  private static getDefaultData(): Readonly<StorageFileData> {
    const data: StorageFileData = {
      credentials: [],
      workspaces: [],
      recentDocs: [],
      version: Constants.nativeAppVersion as TiperiteVersion,
      config: {},
    };
    return Object.freeze(data);
  }

  /**
   * Returns the in-memory `StorageFileData` if available
   */
  public static getData(): Readonly<StorageFileData> {
    if (this.data === null) throw Error('Cannot get data before unlock');
    return this.data;
  }

  /**
   * Updates the data in the storage file and in-memory cache
   */
  public static async setData(data: StorageFileData): Promise<void> {
    if (this.data === null) throw Error('Cannot set data before unlock');

    this.data = Object.freeze({ ...data }) as StorageFileData;
    const passkey = await this.getPasskey(this.passcode as string);
    const ciphertext = await TrAES.encrypt(JSON.stringify(this.data), passkey);
    await FS.writeFile(this.PATH, ciphertext);
  }

  /**
   * Read the storage file to memory and decrypt using `passcode`
   *
   * @throws if `passcode` is incorrect
   */
  public static async unlock(passcode: string): Promise<void> {
    // Read file and passkey
    const ciphertext = await FS.readFile<EncryptedString>(this.PATH);
    const passkey = await this.getPasskey(passcode);

    // Initialize file with default data
    if (ciphertext === null) {
      this.data = this.getDefaultData();
      this.passcode = passcode;
      const ciphertext_ = await TrAES.encrypt(
        JSON.stringify(this.data),
        passkey,
      );
      await FS.writeFile(this.PATH, ciphertext_);
    }
    // Decrypt with passkey (if passcode is valid)
    else {
      const plaintext = await TrAES.decrypt(ciphertext, passkey);
      this.passcode = passcode;
      this.data = Object.freeze(JSON.parse(plaintext)) as StorageFileData;
    }
  }
}
