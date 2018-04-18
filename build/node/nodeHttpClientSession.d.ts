/// <reference types="node" />
import * as Http from "http";
import * as Https from "https";
import { IHttpClientSession, IProgress, IRequest, IResponse } from "../httpClient";
import { Stream } from "../stream";
export declare class NodeHttpClientSession implements IHttpClientSession {
    readonly onUploadProgress: Stream<IProgress>;
    readonly onDownloadProgress: Stream<IProgress>;
    private readonly httpAgent;
    private readonly httpsAgent;
    private _promise?;
    private _request?;
    constructor(httpAgent: Http.Agent, httpsAgent: Https.Agent);
    readonly promise: Promise<IResponse>;
    start(request: IRequest): void;
    abort(): void;
    private requestOptions(url, request);
}
