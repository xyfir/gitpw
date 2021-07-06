import { WebExecutor } from './WebExecutor';

/** Generate a random 16-byte salt */
export function generateSalt(): Promise<string> {
  return WebExecutor.exec<string>(/* js */ `
    return String.fromCharCode.apply(
      null,
      crypto.getRandomValues(new Uint8Array(16)),
    );
  `).promise;
}
