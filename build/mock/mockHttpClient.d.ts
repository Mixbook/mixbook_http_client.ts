import { HttpClient, IRequest } from "../httpClient";
import { MockHttpClientSession } from "./mockHttpClientSession";
import { MockResponse } from "./mockResponse";
export declare class MockHttpClient extends HttpClient {
    private _requests;
    constructor();
    send(request: IRequest): MockHttpClientSession;
    mockRequest(request: IRequest, response: MockResponse): void;
    reset(): void;
    private getKey(request);
}
