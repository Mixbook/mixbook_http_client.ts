import { HttpClient, IRequest } from "../httpClient";
import { NodeHttpClientSession } from "./nodeHttpClientSession";
export declare class NodeHttpClient extends HttpClient {
    private readonly headers;
    private readonly httpAgent;
    private readonly httpsAgent;
    private readonly timeout?;
    constructor(args?: {
        headers?: Record<string, string>;
        timeout?: number;
    });
    send(request: IRequest): NodeHttpClientSession;
}
