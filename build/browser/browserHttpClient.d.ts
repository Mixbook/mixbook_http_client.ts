import { HttpClient, IHttpClientSession, IRequest } from "../httpClient";
export declare class BrowserHttpClient extends HttpClient {
    send(request: IRequest): IHttpClientSession;
}
