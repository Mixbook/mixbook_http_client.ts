import { HttpClient, IHttpClientArgs, IHttpClientSession, IRequest } from "./httpClient";
import { Url } from "./url";
export declare class MsgPackHttpClient extends HttpClient {
    private readonly _client;
    constructor(client: HttpClient);
    send(request: IRequest): IHttpClientSession;
    copy(args?: IHttpClientArgs): MsgPackHttpClient;
    getMsgPack<T>(url: Url | string, headers?: Record<string, string>): Promise<T>;
    postMsgPack<T>(url: Url | string, body: string | Record<string, any>, headers?: Record<string, string>): Promise<T>;
    sendMsgPack<T>(request: IRequest): Promise<T>;
}
