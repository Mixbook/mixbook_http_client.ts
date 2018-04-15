import {HttpClient, IRequest, IResponse} from "../httpClient";
import {MockHttpClientSession} from "./mockHttpClientSession";
import {MockResponse} from "./mockResponse";

export class MockHttpClient extends HttpClient {
  private _requests: Record<string, IResponse>;

  constructor() {
    super();
    this._requests = {};
  }

  public send(request: IRequest): MockHttpClientSession {
    const response = this._requests[this.getKey(request)];
    if (response != null) {
      return new MockHttpClientSession(request, response);
    } else {
      throw new Error(`The request for "${this.getKey(request)}" is not mocked`);
    }
  }

  public mockRequest(request: IRequest, response: MockResponse): void {
    this._requests[this.getKey(request)] = response;
  }

  public reset(): void {
    this._requests = {};
  }

  private getKey(request: IRequest): string {
    // TODO(anton): Should we also add body into the key?
    return `${request.method}_${request.url.toString()}`;
  }
}
