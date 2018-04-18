import { HttpClient, IHttpClientSession, IProgress, IRequest, IResponse } from "../httpClient";
import { Stream } from "../stream";
import { RetryCondition } from "./retryableHttpClient";
export declare class RetryableHttpClientSession implements IHttpClientSession {
    readonly onUploadProgress: Stream<IProgress>;
    readonly onDownloadProgress: Stream<IProgress>;
    private _promise?;
    private readonly _retryCondition;
    private readonly _delaysInMilliseconds;
    private readonly _request;
    private readonly _client;
    private readonly _sessions;
    private _timeoutId?;
    constructor(request: IRequest, client: HttpClient, retryCondition: RetryCondition, delaysInMilliseconds: number[]);
    start(): void;
    readonly promise: Promise<IResponse>;
    abort(): void;
    private addSession(session);
    private attemptRequest(retryCount);
    private handleRetry(retryCount);
}
