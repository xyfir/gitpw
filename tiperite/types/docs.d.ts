import { EncryptedString, DateString, UUID } from '.';

export type DocID = UUID;

export interface Doc {
  createdAt: DateString;
  updatedAt: DateString;
  /**
   * The header hash map JSON-stringified and encrypted
   */
  header: EncryptedString;
  /**
   * The body of the document broken up into encrypted 'blocks'
   */
  body: EncryptedString[];
  id: DocID;
}
