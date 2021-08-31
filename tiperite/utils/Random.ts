import { v4 as uuidv4 } from 'uuid';
import { UUID } from '../types';

export class Random {
  public static uuid(): UUID {
    return uuidv4();
  }
}
