export class HTTP {
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

  /**
   * Convert uint8array to base64url
   */
  private static convertRequestBody(body: Uint8Array[]): string {
    return `data:*/*;base64,${Buffer.from(
      HTTP.mergeRequestBodyArrays(body),
    ).toString('base64')}`;
  }

  /**
   * Convert base64url to uint8array
   */
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
  }): Promise<{
    statusMessage: string;
    statusCode: number;
    headers: Record<string, string>;
    method: string;
    body: Uint8Array[] | undefined;
    url: string;
  }> {
    const base64body = body ? HTTP.convertRequestBody(body) : undefined;

    return new Promise((resolve, reject) => {
      // Listen for RN's response
      const id = window.Tiperite.HTTP.requestId++;
      window.Tiperite.HTTP.responses[id] = (payload) => {
        delete window.Tiperite.HTTP.responses[id];

        if (payload.error) return reject(payload.error);

        (payload.response.body
          ? HTTP.convertResponseBody(payload.response.body)
          : Promise.resolve(undefined)
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

      window.Tiperite.HTTP.request({
        headers,
        method,
        body: base64body,
        url,
        id,
      });
    });
  }
}
