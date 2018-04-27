import {HttpClient, IHttpClientSession, IRequest} from "../httpClient";
import {BrowserHttpClientSession} from "./browserHttpClientSession";

/* istanbul ignore next */
export class BrowserHttpClient extends HttpClient {
  private readonly headers: Record<string, string>;
  private readonly timeout?: number;

  constructor(args: {headers?: Record<string, string>; timeout?: number} = {}) {
    super();
    this.headers = args.headers || {};
    this.timeout = args.timeout;
  }

  public send(request: IRequest): IHttpClientSession {
    const session = new BrowserHttpClientSession();
    const actualRequest = {...request};
    if (this.headers.cookie) {
      actualRequest.headers = actualRequest.headers || {};
      actualRequest.headers.Cookie = this.headers.cookie;
    }
    actualRequest.timeout = actualRequest.timeout || this.timeout;
    session.start(actualRequest);

    return session;
  }
}
