import { getPath } from '../../utils/getPath';

test("getPath('')", () => {
  expect(getPath('')).toBe(process.cwd());
});

test("getPath('.gitpw')", () => {
  expect(getPath('.gitpw')).toBe(`${process.cwd()}/.gitpw`);
});
