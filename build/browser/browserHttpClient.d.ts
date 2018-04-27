import { HttpClient, IHttpClientSession, IRequest } from "../httpClient";
export declare class BrowserHttpClient extends HttpClient {
    private readonly headers;
    private readonly timeout?;
    constructor(args?: {
        headers?: Record<string, string>;
        timeout?: number;
    });
    send(request: IRequest): IHttpClientSession;
}
