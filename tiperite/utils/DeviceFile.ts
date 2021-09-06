import { KeyDeriver } from './KeyDeriver';
import { BootFile } from './BootFile';
import Constants from 'expo-constants';
import { AES } from './AES';
import { FS } from './FS';
import {
  TiperiteVersion,
  EncryptedString,
  DeviceFileData,
  HexString,
} from '../types';

/**
 * Read and write to `/device.json`
 */
export class DeviceFile {
  /**
   * The passcode is appended to the passkey for `/boot.json` to form the
   *  password that generates the passkey for `/device.json`
   */
  private static passcode: string | null = null;
  /**
   * The passkey is used to encrypt `/device.json`
   */
  private static passkey: HexString | null = null;
  /**
   * The path on the filesystem
   */
  private static PATH: '/device.json' = '/device.json';
  /**
   * The decrypted in-memory object read from `/device.json`
   */
  private static data: DeviceFileData | null = null;

  /**
   * Returns the device passkey after generating it if needed
   */
  private static async getPasskey(passcode: string): Promise<HexString> {
    if (this.passkey !== null) return this.passkey;

    const bootPasskey = await BootFile.getPasskey();

    /** @todo */
    return await KeyDeriver.deriveKey(
      `${bootPasskey}-${passcode}`,
      '9T7Uh^B^ZmEJ',
      100000,
    );
  }

  /**
   * Returns a default `DeviceFileData` object
   */
  private static getDefaultData(): Readonly<DeviceFileData> {
    return Object.freeze({
      workspaces: [],
      version: Constants.nativeAppVersion as TiperiteVersion,
      config: {},
      memory: {
        activeWorkspaceId: null,
        githubToken: null,
        pinnedFiles: [],
        recentFiles: [],
      },
    });
  }

  /**
   * Returns the in-memory `DeviceFileData` if available
   */
  public static getData(): Readonly<DeviceFileData> {
    if (this.data === null) throw Error('Cannot get data before unlock');
    return this.data;
  }

  /**
   * Updates the data in the device file and in-memory cache
   */
  public static async setData(data: DeviceFileData): Promise<void> {
    if (this.data === null) throw Error('Cannot set data before unlock');

    this.data = Object.freeze({ ...data }) as DeviceFileData;
    const passkey = await this.getPasskey(this.passcode as string);
    const ciphertext = await AES.encrypt(JSON.stringify(this.data), passkey);
    await FS.writeFile(this.PATH, ciphertext);
  }

  /**
   * Read the device file to memory and decrypt using `passcode`
   *
   * @throws if `passcode` is incorrect
   */
  public static async unlock(passcode = ''): Promise<void> {
    // Read file and passkey
    const ciphertext = await FS.readFile<EncryptedString>(this.PATH);
    const passkey = await this.getPasskey(passcode);

    // Initialize file with default data
    if (ciphertext === null) {
      this.data = this.getDefaultData();
      this.passcode = passcode;
      const ciphertext_ = await AES.encrypt(JSON.stringify(this.data), passkey);
      await FS.writeFile(this.PATH, ciphertext_);
    }
    // Decrypt with passkey (if passcode is valid)
    else {
      const plaintext = await AES.decrypt(ciphertext, passkey);
      this.passcode = passcode;
      this.data = Object.freeze(JSON.parse(plaintext)) as DeviceFileData;
    }
  }
}
