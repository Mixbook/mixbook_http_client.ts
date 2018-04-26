import { HttpClient, IRequest, IResponse } from "../httpClient";
import { MockHttpClientSession } from "./mockHttpClientSession";
import { MockResponse } from "./mockResponse";
export declare class MockHttpClient extends HttpClient {
    readonly isRepeating: boolean;
    readonly shouldUseBody: boolean;
    readonly shouldUseHeaders: boolean;
    requests: Record<string, IResponse[]>;
    executedRequests: {
        request: IRequest;
        response: IResponse;
    }[];
    constructor(args?: {
        isRepeating?: boolean;
        shouldUseBody?: boolean;
        shouldUseHeaders?: boolean;
    });
    send(request: IRequest): MockHttpClientSession;
    mockRequest(request: IRequest, response: MockResponse): void;
    reset(): void;
    private getKey(request);
}
