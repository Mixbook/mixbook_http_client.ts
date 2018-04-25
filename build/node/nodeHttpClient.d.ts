import { HttpClient, IRequest } from "../httpClient";
import { NodeHttpClientSession } from "./nodeHttpClientSession";
export declare class NodeHttpClient extends HttpClient {
    private readonly headers;
    private readonly httpAgent;
    private readonly httpsAgent;
    constructor(headers?: Record<string, string>);
    send(request: IRequest): NodeHttpClientSession;
}
