declare global {
  interface Window {
    Tiperite: {
      HTTP: {
        responses: Record<
          number,
          (payload: {
            response: {
              statusMessage: string;
              statusCode: number;
              headers: Record<string, string>;
              method: string;
              body: string;
              url: string;
            };
            error?: string;
          }) => void
        > = {};

        requestId: number;

        request(params: {
          headers: Record<string, string>;
          method: string;
          body: string | undefined;
          url: string;
          id: number;
        }): void;
      };
    };
  }
}

export * from './common';
export * from './config';
export * from './filesystem';
export * from './lightning-fs';
export * from './navigation';
export * from './state';
export * from './workspaces';
