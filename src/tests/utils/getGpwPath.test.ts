import { getGpwPath } from '../../utils/getGpwPath.js';

test("getGpwPath('')", () => {
  expect(getGpwPath('')).toBe(`${process.cwd()}/.gitpw`);
});

test("getGpwPath('files/id.json')", () => {
  expect(getGpwPath('files/id.json')).toBe(
    `${process.cwd()}/.gitpw/files/id.json`,
  );
});
