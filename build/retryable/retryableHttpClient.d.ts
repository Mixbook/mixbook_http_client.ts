import { HttpClient, IHttpClientSession, IRequest, IResponse } from "../httpClient";
import { Maybe } from "../types";
export declare type RetryCondition = (request: IRequest, response: Maybe<IResponse>, error: Maybe<any>, retryCount: number) => boolean;
export declare class RetryableHttpClient extends HttpClient {
    static defaultRetryCondition(request: IRequest, response: Maybe<IResponse>, error: Maybe<any>, retryCount: number): boolean;
    private readonly _client;
    private readonly _retryCondition;
    private readonly _delaysInMilliseconds;
    constructor(client: HttpClient, opts?: {
        retryCondition?: RetryCondition;
        delaysInMilliseconds?: number[];
    });
    send(request: IRequest): IHttpClientSession;
}
