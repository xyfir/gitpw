/**
 * Randomly generate iterations count for PBKDF2. 1,000,000 - 1,099,999.
 */
export function generateIterationsCount(): number {
  return 1000000 + +Math.random().toString().slice(-5);
}
