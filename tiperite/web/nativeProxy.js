window.nativeProxy = {
  responses: {},
  requestId: 0,

  fromValue(value) {
    let queue = [value];
    return {
      next() {
        return Promise.resolve({
          done: queue.length === 0,
          value: queue.pop(),
        });
      },
      return() {
        queue = [];
        return {};
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  },

  getIterator(iterable) {
    if (iterable[Symbol.asyncIterator]) {
      return iterable[Symbol.asyncIterator]();
    }
    if (iterable[Symbol.iterator]) {
      return iterable[Symbol.iterator]();
    }
    if (iterable.next) {
      return iterable;
    }
    return nativeProxy.fromValue(iterable);
  },

  async forAwait(iterable, cb) {
    const iter = nativeProxy.getIterator(iterable);
    while (true) {
      const { value, done } = await iter.next();
      if (value) await cb(value);
      if (done) break;
    }
    if (iter.return) iter.return();
  },

  async collect(iterable) {
    let size = 0;
    const buffers = [];
    // This will be easier once `for await ... of` loops are available.
    await nativeProxy.forAwait(iterable, (value) => {
      buffers.push(value);
      size += value.byteLength;
    });
    const result = new Uint8Array(size);
    let nextIndex = 0;
    for (const buffer of buffers) {
      result.set(buffer, nextIndex);
      nextIndex += buffer.byteLength;
    }
    return result;
  },

  /** Convert uint8array to base64url */
  convertRequestBody(body) {
    return nativeProxy.collect(body).then((body) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(body);
      });
    });
  },

  /** Convert base64url to uint8array */
  convertResponseBody(base64) {
    return fetch(base64)
      .then((res) => res.arrayBuffer())
      .then((buffer) => [new Uint8Array(buffer)]);
  },

  /**
   * Send request up to React Native to bypass CORS
   * @see https://github.com/isomorphic-git/isomorphic-git/blob/main/src/http/web/index.js
   */
  request({ headers = {}, method = 'GET', body, url }) {
    return (
      body ? nativeProxy.convertRequestBody(body) : Promise.resolve()
    ).then((body) => {
      return new Promise((resolve, reject) => {
        // Listen for RN's response
        const id = nativeProxy.requestId++;
        nativeProxy.responses[id] = (payload) => {
          delete nativeProxy.responses[id];

          if (payload.error) return reject(payload.error);

          (payload.response.body
            ? nativeProxy.convertResponseBody(payload.response.body)
            : undefined
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
        ReactNativeWebView.postMessage(
          JSON.stringify({ payload, type: 'fetch', id }),
        );
      });
    });
  },
};
