import { WebViewMessageEvent, WebView } from 'react-native-webview';

/** An event from code executed in the browser */
interface ExecutionEvent {
  payload: undefined | unknown;
  type: string;
  id: number;
}

/** An event to proxy a fetch request via RN for the webview */
interface FetchEvent extends ExecutionEvent {
  payload: {
    headers: Record<string, string>;
    method: string;
    /** base64 url */
    body?: string;
    url: string;
  };
  type: 'fetch';
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
  private static execId = 0;

  /** Reference to the WebView component that we inject JavaScript into */
  public static webview: WebView;

  /** Handle HTTP request in React Native to bypass CORS */
  public static async onFetch(req: FetchEvent): Promise<void> {
    try {
      // Get basic request data
      const { headers, method, url } = req.payload;

      // Fetch response
      const response = await new Promise<{
        statusMessage?: string;
        statusCode: number;
        headers: Record<string, string>;
        body: string;
        url: string;
      }>((resolve, reject) => {
        // Convert body from base64url string to Buffer to ArrayBuffer
        // Why base64? Because we're sending binary data from/to webview via JSON
        let body: ArrayBuffer | Buffer | string | undefined = req.payload.body;
        if (typeof body == 'string') {
          // The buffer polyfill doesn't support base64url
          body = Buffer.from(body.split(';base64,')[1], 'base64');
          body = (body as Buffer).buffer.slice(
            (body as Buffer).byteOffset,
            (body as Buffer).byteOffset + body.byteLength,
          );
        }

        // Unfortunately React Native's fetch() implementation doesn't support
        // arraybuffers so we need to use XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        // Set request headers
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value as string);
        }

        // Handle arraybuffer response
        xhr.responseType = 'arraybuffer';
        xhr.onerror = reject;
        xhr.onload = () => {
          // Set response headers
          const headers: Record<string, string> = {};
          xhr
            .getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/)
            .map((value) => value.split(/: /))
            .forEach((keyValue) => {
              headers[keyValue[0].trim()] = keyValue[1].trim();
            });

          // Send response object nativeProxy expects
          resolve({
            statusMessage: xhr.statusText,
            statusCode: xhr.status,
            headers,
            body: xhr.response,
            url: xhr.responseURL,
          });
        };

        xhr.send(body);
      });

      // Convert the response back into base64 and JSON and trigger the correct
      // NativeProxy response callback
      const json = JSON.stringify({
        response: {
          statusMessage: response.statusMessage,
          statusCode: response.statusCode,
          headers: response.headers,
          method,
          // The buffer polyfill doesn't support base64url
          body:
            'data:*/*;base64,' + Buffer.from(response.body).toString('base64'),
          url: response.url,
        },
      });
      this.exec(`
        window.NativeProxy.responses[${req.id}](${json});
      `);
    } catch (err) {
      console.error('onFetch', err);

      const json = JSON.stringify({ error: err.toString() });
      this.exec(`
        window.NativeProxy.responses[${req.id}](${json});
      `);
    }
  }

  /** Execute JavaScript and return the response/error */
  public static exec<T = undefined>(
    js: string,
    params: Record<string, unknown> = {},
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
          payload instanceof Error ? reject(payload) : resolve(payload as T),
        id,
      });

      const stringifiedParams = Buffer.from(
        JSON.stringify(params),
        'utf8',
      ).toString('base64');

      this.webview.injectJavaScript(`(async () => {
        try {
          function emit(type, data) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ payload: data, type, id: ${id} })
            );
          }

          const payload = await (async () => {
            const params = JSON.parse(atob('${stringifiedParams}'));

            ${js}
          })();

          window.ReactNativeWebView.postMessage(
            JSON.stringify({ payload, type: 'resolve', id: ${id} })
          );
        } catch (err) {
          console.error(err);
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
            l.cb(new Error((res.payload as string) || 'error'));
            return false;
          }
          return true;
        });
        break;
      // Handle HTTP request
      case 'fetch':
        this.onFetch(res as FetchEvent);
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
