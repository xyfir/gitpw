import { getPath } from '../../utils/getPath.js';

test("getPath('')", () => {
  expect(getPath('')).toBe(process.cwd());
});

test("getPath('.gitpw')", () => {
  expect(getPath('.gitpw')).toBe(`${process.cwd()}/.gitpw`);
});
