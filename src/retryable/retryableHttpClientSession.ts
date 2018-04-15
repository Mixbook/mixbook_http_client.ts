import {HttpClient, IHttpClientSession, IProgress, IRequest, IResponse} from "../httpClient";
import {Stream} from "../stream";
import {RetryCondition} from "./retryableHttpClient";

export class RetryableHttpClientSession implements IHttpClientSession {
  public readonly onUploadProgress: Stream<IProgress>;
  public readonly onDownloadProgress: Stream<IProgress>;

  private _promise?: Promise<IResponse>;
  private readonly _retryCondition: RetryCondition;
  private readonly _delaysInMilliseconds: number[];

  private readonly _request: IRequest;
  private readonly _client: HttpClient;
  private readonly _sessions: IHttpClientSession[] = [];
  private _timeoutId?: number | NodeJS.Timer;

  constructor(request: IRequest, client: HttpClient, retryCondition: RetryCondition, delaysInMilliseconds: number[]) {
    this.onUploadProgress = new Stream();
    this.onDownloadProgress = new Stream();
    this._request = request;
    this._client = client;
    this._retryCondition = retryCondition;
    this._delaysInMilliseconds = delaysInMilliseconds;
  }

  public start(): void {
    this._promise = new Promise(async (resolve, reject) => {
      this.attemptRequest(1)
        .then(resolve)
        .catch(reject);
    });
  }

  public get promise(): Promise<IResponse> {
    return this._promise!;
  }

  /* istanbul ignore next */
  public abort(): void {
    for (const session of this._sessions) {
      session.abort();
    }
    if (this._timeoutId != null) {
      clearTimeout(this._timeoutId as any);
    }
  }

  private addSession(session: IHttpClientSession): void {
    this._sessions.push(session);
    session.onDownloadProgress.listen(v => this.onDownloadProgress.push(v), true);
    session.onUploadProgress.listen(v => this.onUploadProgress.push(v), true);
  }

  private async attemptRequest(retryCount: number): Promise<IResponse> {
    const session = this._client.send({...this._request});
    this.addSession(session);
    try {
      const response = await session.promise;
      if (this._retryCondition(this._request, response, undefined, retryCount)) {
        return this.handleRetry(retryCount);
      } else {
        return response;
      }
    } catch (e) {
      /* istanbul ignore next */
      if (this._retryCondition(this._request, undefined, e, retryCount)) {
        return this.handleRetry(retryCount);
      } else {
        throw e;
      }
    }
  }

  private handleRetry(retryCount: number): Promise<IResponse> {
    return new Promise<IResponse>((resolve, reject) => {
      const delay =
        this._delaysInMilliseconds[retryCount - 1] || this._delaysInMilliseconds[this._delaysInMilliseconds.length - 1];
      this._timeoutId = setTimeout(() => {
        this._timeoutId = undefined;
        resolve(this.attemptRequest(retryCount + 1));
      }, delay);
    });
  }
}
