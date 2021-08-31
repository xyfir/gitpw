import { v4 as uuidv4 } from 'uuid';
import { WebExecutor } from './WebExecutor';
import { UUID } from '../types';

/**
 * A utility class for generating cryptographically secure data
 */
export class Random {
  /**
   * Returns an integer between `min` (inclusive) and `max` (exclusive)
   */
  public static async integer(min: number, max: number): Promise<number> {
    const float = await this.float();
    return Math.floor(float * (max - min) + min);
  }

  /**
   * A cryptographically secure replacement for `Math.random()`. Returns a
   *  number between `0` (inclusive) and `1` (exclusive).
   */
  public static float(): Promise<number> {
    return WebExecutor.exec<number>(/* js */ `
      return crypto.getRandomValues(new Uint32Array(1))[0] / Math.pow(2, 32);
    `).promise;
  }

  /**
   * Returns a UUID4 string
   */
  public static uuid(): UUID {
    return uuidv4();
  }
}
