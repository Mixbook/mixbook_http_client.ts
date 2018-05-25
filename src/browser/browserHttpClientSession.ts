import {FunctionUtils} from "../functionUtils";
import {IHttpClientSession, IProgress, IRequest, IResponse} from "../httpClient";
import {Stream} from "../stream";
import {BrowserResponse} from "./browserResponse";

// TODO: Write specs
/* istanbul ignore next */
export class BrowserHttpClientSession implements IHttpClientSession {
  public readonly onUploadProgress = new Stream<IProgress>();
  public readonly onDownloadProgress = new Stream<IProgress>();

  private _promise?: Promise<IResponse>;
  private readonly _xhr: XMLHttpRequest;

  constructor() {
    this._xhr = new XMLHttpRequest();
    this.onUploadProgress = new Stream<IProgress>();
    this.onDownloadProgress = new Stream<IProgress>();
  }

  public get promise(): Promise<IResponse> {
    // TODO: Revise it, try avoid using !
    return this._promise!;
  }

  public async start(request: IRequest): Promise<void> {
    this._xhr.open(request.method, request.url.toString());

    if (request.timeout != null) {
      this._xhr.timeout = request.timeout;
    }

    const headers = request.headers || {};

    if (headers != null) {
      for (const headerName of Object.getOwnPropertyNames(headers)) {
        this._xhr.setRequestHeader(headerName, headers[headerName]);
      }
    }

    let body;
    if (request.body != null) {
      if (typeof request.body === "string") {
        body = request.body;
      } else {
        body = new FormData();

        for (const name of Object.getOwnPropertyNames(request.body)) {
          body.append(name, request.body[name]);
        }
      }
    }

    if (headers.accept === "application/msgpack") {
      this._xhr.responseType = "blob";
    }
    this._xhr.send(body);

    this._promise = new Promise<IResponse>((resolve, reject) => {
      this._xhr.upload.onprogress = FunctionUtils.throttle((e: ProgressEvent) => this.onUploadProgress.push(e), 1000);
      this._xhr.onprogress = FunctionUtils.throttle((e: ProgressEvent) => this.onDownloadProgress.push(e), 1000);
      this._xhr.onerror = e => reject(new Error(`Failed request to ${request.url.toString()}`));
      this._xhr.ontimeout = e => reject(new Error(`Request to ${request.url.toString()} timed out`));
      this._xhr.onload = e => {
        resolve(new BrowserResponse(this._xhr));
      };
    });
  }

  public abort(): void {
    return this._xhr.abort();
  }
}
