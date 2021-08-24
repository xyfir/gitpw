import { Buffer } from 'buffer';

export class NativeProxy {
  private static responses: Record<number, (payload: unknown) => void> = {};
  private static requestId = 0;

  private static async collect(iterable: any) {
    let size = 0;
    const buffers: any[] = [];
    // This will be easier once `for await ... of` loops are available.
    for await (const value of iterable) {
      buffers.push(value);
      size += value.byteLength;
    }
    const result = new Uint8Array(size);
    let nextIndex = 0;
    for (const buffer of buffers) {
      result.set(buffer, nextIndex);
      nextIndex += buffer.byteLength;
    }
    return result;
  }

  /** Convert uint8array to base64url */
  private static convertRequestBody(body: any) {
    return NativeProxy.collect(body).then(
      (body) => `data:*/*;base64,${Buffer.from(body).toString('base64')}`,
    );
  }

  /** Convert base64url to uint8array */
  private static convertResponseBody(base64url: string): Promise<Uint8Array[]> {
    return fetch(base64url)
      .then((res) => res.arrayBuffer())
      .then((buffer) => [new Uint8Array(buffer)]);
  }

  /**
   * Send request up to React Native to bypass CORS
   *
   * @see https://github.com/isomorphic-git/isomorphic-git/blob/main/src/http/web/index.js
   */
  public static request({
    headers = {},
    method = 'GET',
    body,
    url,
  }: {
    headers: Record<string, string>;
    method: string;
    body: any;
    url: string;
  }): Promise<any> {
    return (
      body ? NativeProxy.convertRequestBody(body) : Promise.resolve()
    ).then((body) => {
      return new Promise((resolve, reject) => {
        // Listen for RN's response
        const id = NativeProxy.requestId++;
        NativeProxy.responses[id] = (payload: any) => {
          delete NativeProxy.responses[id];

          if (payload.error) return reject(payload.error);

          (payload.response.body
            ? NativeProxy.convertResponseBody(payload.response.body)
            : Promise.resolve()
          ).then((responseBody) => {
            resolve({
              statusMessage: payload.response.statusMessage,
              statusCode: payload.response.statusCode,
              headers: payload.response.headers,
              method: payload.response.method,
              body: responseBody,
              url: payload.response.url,
            });
          });
        };

        // Send to RN
        const payload = { headers, body, method, url };
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ payload, type: 'fetch', id }),
        );
      });
    });
  }
}
