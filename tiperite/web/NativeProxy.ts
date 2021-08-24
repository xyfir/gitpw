import { Buffer } from 'buffer';

export class NativeProxy {
  private static responses: Record<number, (payload: unknown) => void> = {};
  private static requestId = 0;

  private static mergeRequestBodyArrays(arrays: Uint8Array[]): Uint8Array {
    let size = 0;
    for (const value of arrays) {
      size += value.byteLength;
    }

    const merged = new Uint8Array(size);
    let nextIndex = 0;

    for (const arr of arrays) {
      merged.set(arr, nextIndex);
      nextIndex += arr.byteLength;
    }

    return merged;
  }

  /** Convert uint8array to base64url */
  private static convertRequestBody(body: Uint8Array[]): string {
    return `data:*/*;base64,${Buffer.from(
      NativeProxy.mergeRequestBodyArrays(body),
    ).toString('base64')}`;
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
    body?: Uint8Array[];
    url: string;
  }): Promise<any> {
    const base64body = body ? NativeProxy.convertRequestBody(body) : undefined;

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
      const payload = { headers, body: base64body, method, url };
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ payload, type: 'fetch', id }),
      );
    });
  }
}
