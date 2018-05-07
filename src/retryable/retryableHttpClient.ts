import {HttpClient, IHttpClientArgs, IHttpClientSession, IRequest, IResponse} from "../httpClient";
import {Maybe} from "../types";
import {RetryableHttpClientSession} from "./retryableHttpClientSession";

export type RetryCondition = (
  request: IRequest,
  response: Maybe<IResponse>,
  error: Maybe<any>,
  retryCount: number
) => boolean;

export class RetryableHttpClient extends HttpClient {
  public static defaultRetryCondition(
    request: IRequest,
    response: Maybe<IResponse>,
    error: Maybe<any>,
    retryCount: number
  ): boolean {
    return retryCount < 4 && request.method === "GET" && (response == null || response.status >= 500);
  }

  private readonly _client: HttpClient;
  private readonly _retryCondition: RetryCondition;
  private readonly _delaysInMilliseconds: number[];

  constructor(
    client: HttpClient,
    opts: {
      retryCondition?: RetryCondition;
      delaysInMilliseconds?: number[];
    } = {}
  ) {
    super();
    this._client = client;
    this._retryCondition = opts.retryCondition || RetryableHttpClient.defaultRetryCondition;
    this._delaysInMilliseconds = opts.delaysInMilliseconds || [100, 500, 1000];
  }

  public send(request: IRequest): IHttpClientSession {
    const session = new RetryableHttpClientSession(
      request,
      this._client,
      this._retryCondition,
      this._delaysInMilliseconds
    );
    session.start();

    return session;
  }

  public copy(args: IHttpClientArgs = {}): RetryableHttpClient {
    return new RetryableHttpClient(this._client.copy(args), {
      retryCondition: this._retryCondition,
      delaysInMilliseconds: this._delaysInMilliseconds,
    });
  }
}
