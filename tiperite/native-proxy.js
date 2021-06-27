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

  convertRequestBody(body) {
    return nativeProxy.collect(body).then((body) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(body);
      });
    });
  },

  convertResponseBody(base64) {
    return fetch(base64)
      .then((res) => res.arrayBuffer())
      .then((buffer) => [new Uint8Array(buffer)]);
  },

  request({ headers = {}, method = 'GET', body, url }) {
    return (body ? convertRequestBody(body) : Promise.resolve()).then(
      (body) => {
        return new Promise((resolve, reject) => {
          // Initialize listener for response
          const id = nativeProxy.requestId++;
          nativeProxy.responses[id] = (payload) => {
            delete nativeProxy.responses[id];

            if (payload.error) return reject(payload.error);

            (payload.response.body
              ? nativeProxy.convertResponseBody(payload.response.body)
              : undefined
            ).then((responseBody) => {
              resolve({
                statusMessage: payload.response.statusText,
                statusCode: payload.response.status,
                headers: payload.response.headers,
                method: payload.response.method,
                body: responseBody,
                url: payload.response.url,
              });
            });
          };

          // Send request up to React Native to bypass CORS
          const payload = { headers, body, method, url };
          ReactNativeWebView.postMessage(
            JSON.stringify({ payload, type: 'fetch', id }),
          );
        });
      },
    );
  },
};
