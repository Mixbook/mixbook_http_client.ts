import {HttpClient, IRequest, IResponse} from "../httpClient";
import {MockHttpClientSession} from "./mockHttpClientSession";
import {MockResponse} from "./mockResponse";

export class MockHttpClient extends HttpClient {
  public readonly isRepeating: boolean;
  public readonly shouldUseBody: boolean;
  public readonly shouldUseHeaders: boolean;
  public requests: Record<string, IResponse[]>;

  constructor(args: {isRepeating?: boolean; shouldUseBody?: boolean; shouldUseHeaders?: boolean} = {}) {
    super();
    this.isRepeating = args.isRepeating === undefined ? true : args.isRepeating;
    this.shouldUseBody = !!args.shouldUseBody;
    this.shouldUseHeaders = !!args.shouldUseHeaders;
    this.requests = {};
  }

  public send(request: IRequest): MockHttpClientSession {
    const responses = this.requests[this.getKey(request)] || [];
    const response = (this.isRepeating ? responses : responses.splice(0, 1))[0];
    if (response != null) {
      return new MockHttpClientSession(request, response);
    } else {
      throw new Error(`The request for "${this.getKey(request)}" is not mocked`);
    }
  }

  public mockRequest(request: IRequest, response: MockResponse): void {
    if (this.isRepeating) {
      this.requests[this.getKey(request)] = [response];
    } else {
      this.requests[this.getKey(request)] = this.requests[this.getKey(request)] || [];
      this.requests[this.getKey(request)].push(response);
    }
  }

  public reset(): void {
    this.requests = {};
  }

  private getKey(request: IRequest): string {
    let key = `${request.method}_${request.url.toString()}`;
    if (this.shouldUseHeaders) {
      key = `${key}_${JSON.stringify(request.headers)}`;
    }
    if (this.shouldUseBody) {
      key = `${key}_${JSON.stringify(request.body)}`;
    }

    return key;
  }
}
