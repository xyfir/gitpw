import { GpwPBKDF2 } from '../../utils/GpwPBKDF2';

test('GpwPBKDF2.generateIterations()', () => {
  expect(GpwPBKDF2.generateIterations()).toBeGreaterThanOrEqual(1000000);
});

test('GpwPBKDF2.generateSalt()', () => {
  expect(GpwPBKDF2.generateSalt()).toHaveLength(24);
});

test('GpwPBKDF2.deriveKey(pass, salt, itr)', async () => {
  const pass = 'password';
  const salt = GpwPBKDF2.generateSalt();
  const itr = GpwPBKDF2.generateIterations();
  const key = await GpwPBKDF2.deriveKey(pass, salt, itr);

  expect(/^[-A-Za-z0-9+/=]{44}$/.test(key)).toBe(true);

  const sameKey = await GpwPBKDF2.deriveKey(pass, salt, itr);
  expect(key).toBe(sameKey);
});
