import { HttpClient, IHttpClientArgs, IRequest } from "../httpClient";
import { NodeHttpClientSession } from "./nodeHttpClientSession";
export declare class NodeHttpClient extends HttpClient {
    private readonly httpAgent;
    private readonly httpsAgent;
    constructor(args?: IHttpClientArgs);
    send(request: IRequest): NodeHttpClientSession;
    copy(args?: IHttpClientArgs): NodeHttpClient;
}
