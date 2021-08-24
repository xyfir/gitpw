import { WebExecutor } from './WebExecutor';

/**
 * Derive key from a user-supplied password
 */
export class KeyDeriver {
  /**
   * Randomly generate iterations count for PBKDF2
   *
   * **Min:** 1,000,000\
   * **Max:** 1,099,999
   */
  public static generateIterations(): number {
    return 1000000 + +Math.random().toString().slice(-5);
  }

  /**
   * Generate a random 16-byte salt and convert to string
   */
  public static generateSalt(): Promise<string> {
    return WebExecutor.exec<string>(/* js */ `
      return KeyDeriverWeb.generateSalt();
    `).promise;
  }

  /**
   * Uses web's `SubtleCrypto` PBKDF2 interface to convert a password to a key
   *
   * @return derived key as a hex string
   */
  public static deriveKey(
    pass: string,
    salt: string,
    itr: number,
  ): Promise<string> {
    return WebExecutor.exec<string>(
      /* js */ `
        return KeyDeriverWeb.deriveKey(params);
      `,
      {
        pass,
        salt,
        itr,
      },
    ).promise;
  }
}
