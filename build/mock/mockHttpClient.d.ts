import { HttpClient, IHttpClientArgs, IRequest, IResponse } from "../httpClient";
import { MockHttpClientSession } from "./mockHttpClientSession";
import { MockResponse } from "./mockResponse";
export interface IMockHttpClientArgs {
    isRepeating?: boolean;
    shouldUseBody?: boolean;
    shouldUseHeaders?: boolean;
}
export declare class MockHttpClient extends HttpClient {
    readonly isRepeating: boolean;
    readonly shouldUseBody: boolean;
    readonly shouldUseHeaders: boolean;
    requests: Record<string, IResponse[]>;
    executedRequests: Array<{
        request: IRequest;
        response: IResponse;
    }>;
    constructor(args?: IHttpClientArgs & IMockHttpClientArgs);
    send(request: IRequest): MockHttpClientSession;
    copy(args?: IHttpClientArgs & IMockHttpClientArgs): MockHttpClient;
    mockRequest(request: IRequest, response: MockResponse): void;
    reset(): void;
    private getKey(request);
}
