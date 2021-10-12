declare module '@isomorphic-git/lightning-fs' {
  class LightningFS {
    constructor(name: string) {} // eslint-disable-line

    promises: {
      writeFile(path: string, data: string): Promise<void>;

      readFile<T extends string>(
        path: string,
        encoding: 'utf8',
      ): Promise<T | null>;

      unlink(path: string): Promise<void>;
    };
  }
  export default LightningFS;
}
