import { HttpClient, IHttpClientSession, IRequest } from "../index";
export interface ILogger {
    debug(record: string): void;
    info(record: string): void;
    warn(record: string): void;
}
export declare class LoggableHttpClient extends HttpClient {
    private readonly _client;
    private readonly _logger;
    constructor(client: HttpClient, logger: ILogger);
    send(request: IRequest): IHttpClientSession;
    private formatBody(str);
}
