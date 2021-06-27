import { WebViewMessageEvent, WebView } from 'react-native-webview';

/** An event from code executed in the browser */
interface ExecutionEvent {
  payload: undefined | any;
  type: 'return' | string;
  id: number;
}

/** Listener waiting for event(s) from the code executed in the browser */
interface ExecutionListener {
  type: ExecutionEvent['type'];
  cb(payload: ExecutionEvent['payload']): void;
  id: ExecutionEvent['id'];
}

/**
 * This interfaces with `WebExecutorHost` to allow us to run code in a hidden
 *  embedded web browser from anywhere in the app. This is useful for things we
 *  can't easily do in React Native by itself.
 */
export class WebExecutor {
  /** Execution response listeners */
  private static listeners: ExecutionListener[] = [];
  /** Each execution gets its own unique ID for response tracking */
  private static execId: number = 0;

  /** Reference to the WebView component that we inject JavaScript into */
  public static webview: WebView;

  /** Initialize web environment */
  public static initialize(): void {
    this.webview.injectJavaScript(`
      const script = document.createElement('script');
      script.src = '';
      document.head.appendChild(script);
    `);
  }

  /** Handle HTTP request in React Native to bypass CORS */
  public static async onFetch(req: ExecutionEvent): Promise<void> {
    try {
      // Get basic request data
      const { headers = {}, method = 'GET', url } = req.payload;

      // Fetch response
      const response: any = await new Promise((resolve) => {
        // Convert body from base64 string to Buffer to ArrayBuffer
        let body = req.payload.body;
        if (body) {
          body = Buffer.from(req.payload.body, 'base64url');
          body = body.buffer.slice(
            body.byteOffset,
            body.byteOffset + body.byteLength,
          );
        }

        const xhr = new XMLHttpRequest();

        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value as string);
        }

        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
          const headers: any = {};
          xhr
            .getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/)
            .map((value) => value.split(/: /))
            .forEach((keyValue) => {
              headers[keyValue[0].trim()] = keyValue[1].trim();
            });

          resolve({
            statusText: xhr.statusText,
            statusCode: xhr.status,
            headers,
            body: xhr.response,
            url: xhr.responseURL,
          });
        };

        xhr.open(method, url, true);
        xhr.send(body);
      });

      const json = JSON.stringify({
        response: {
          statusMessage: response.statusText,
          statusCode: response.status,
          headers: response.headers,
          method,
          body:
            'data:*/*;base64,' + Buffer.from(response.body).toString('base64'),
          url: response.url,
        },
      });
      this.exec(`
        window.nativeProxy.responses[${req.id}](${json});
      `);
    } catch (err) {
      console.error('onFetch', err);

      const json = JSON.stringify({ error: err.toString() });
      this.exec(`
        window.nativeProxy.responses[${req.id}](${json});
      `);
    }
  }

  /** Execute JavaScript and return the response/error */
  public static exec<T = undefined>(
    js: string,
  ): {
    promise: Promise<T>;
    id: number;
  } {
    const id = this.execId++;

    // Inject the JavaScript and resolve/reject based on its response
    const promise = new Promise<T>((resolve, reject) => {
      this.listeners.push({
        type: 'return',
        cb: (payload) =>
          payload instanceof Error ? reject(payload) : resolve(payload),
        id,
      });

      this.webview.injectJavaScript(`(async () => {
        try {
          function emit(type, data) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ payload: data, type, id: ${id} })
            );
          }

          const payload = await (async () => { ${js} })();

          window.ReactNativeWebView.postMessage(
            JSON.stringify({ payload, type: 'resolve', id: ${id} })
          );
        } catch (err) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ payload: String(err), type: 'reject', id: ${id} })
          );
        }
      })();`);
    });

    return { promise, id };
  }

  /** Emit an execution response to listeners */
  public static emit(evt: WebViewMessageEvent): void {
    const res: ExecutionEvent = JSON.parse(evt.nativeEvent.data);

    switch (res.type) {
      // Trigger return listener and then remove it
      case 'resolve':
      case 'reject':
        this.listeners = this.listeners.filter((l) => {
          if (l.type != 'return' || res.id != l.id) return true;

          if (res.type == 'resolve') {
            l.cb(res.payload);
            return false;
          }
          if (res.type == 'reject') {
            l.cb(new Error(res.payload || 'error'));
            return false;
          }
          return true;
        });
        break;
      // Handle HTTP request
      case 'fetch':
        this.onFetch(res);
        break;
      // Trigger listener
      default:
        this.listeners.forEach((l) => {
          if (res.type == l.type && res.id == l.id) l.cb(res.payload);
        });
        break;
    }
  }

  /** Remove event listener */
  public static off(
    type: ExecutionEvent['type'],
    id: ExecutionEvent['id'],
    cb: (payload: ExecutionEvent['payload']) => void,
  ): void {
    this.listeners = this.listeners.filter(
      (l) => !(l.type == type && l.id == id && l.cb == cb),
    );
  }

  /** Add event listener */
  public static on<T = undefined>(
    type: ExecutionEvent['type'],
    id: ExecutionEvent['id'],
    cb: (payload: T) => void,
  ): void {
    this.listeners.push({ type, id, cb });
  }
}
