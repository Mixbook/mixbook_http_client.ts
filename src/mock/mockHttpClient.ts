import {HttpClient, IHttpClientArgs, IRequest, IResponse} from "../httpClient";
import {MockHttpClientSession} from "./mockHttpClientSession";
import {MockResponse} from "./mockResponse";

export interface IMockHttpClientArgs {
  isRepeating?: boolean;
  shouldUseBody?: boolean;
  shouldUseHeaders?: boolean;
}

export class MockHttpClient extends HttpClient {
  public readonly isRepeating: boolean;
  public readonly shouldUseBody: boolean;
  public readonly shouldUseHeaders: boolean;
  public requests: Record<string, IResponse[]>;
  public executedRequests: Array<{request: IRequest; response: IResponse}>;

  constructor(args: IHttpClientArgs & IMockHttpClientArgs = {}) {
    super();
    this.isRepeating = args.isRepeating === undefined ? true : args.isRepeating;
    this.shouldUseBody = !!args.shouldUseBody;
    this.shouldUseHeaders = !!args.shouldUseHeaders;
    this.executedRequests = [];
    this.requests = {};
  }

  public send(request: IRequest): MockHttpClientSession {
    const responses = this.requests[this.getKey(request)] || [];
    const response = (this.isRepeating ? responses : responses.splice(0, 1))[0];
    this.executedRequests.push({request, response});
    if (response != null) {
      return new MockHttpClientSession(request, response);
    } else {
      throw new Error(`The request for "${this.getKey(request)}" is not mocked`);
    }
  }

  public copy(args: IHttpClientArgs & IMockHttpClientArgs = {}): MockHttpClient {
    const client = new MockHttpClient({
      isRepeating: this.isRepeating,
      shouldUseBody: this.shouldUseBody,
      shouldUseHeaders: this.shouldUseHeaders,
      ...args,
    });
    client.requests = this.requests;
    client.executedRequests = this.executedRequests;

    return client;
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
    this.executedRequests = [];
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
