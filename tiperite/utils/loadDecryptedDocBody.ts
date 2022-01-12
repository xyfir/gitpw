import { TrCrypto } from './TrCrypto';
import { FS } from './FS';
import {
  StorageFileWorkspace,
  DecryptedDocMeta,
  EncryptedDocBody,
} from '../types';

/**
 * Loads a doc's body from the filesystem and returns both the encrypted and
 *  decrypted blocks.
 */
export async function loadDecryptedDocBody(
  doc: DecryptedDocMeta,
  workspace: StorageFileWorkspace,
): Promise<{
  encryptedBlocks: string[];
  decryptedBlocks: string[];
}> {
  const body = await FS.readJSON<EncryptedDocBody>(doc.bodyPath);
  if (!body) throw Error(`Missing file ${doc.bodyPath}`);

  const decryptedBlocks = await Promise.all(
    body.blocks.map((block) => {
      return TrCrypto.decrypt(block, workspace.keys);
    }),
  );

  return {
    encryptedBlocks: body.blocks,
    decryptedBlocks,
  };
}
