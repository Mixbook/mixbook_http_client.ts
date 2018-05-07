import {HttpClient, IHttpClientArgs, IHttpClientSession, IRequest} from "../httpClient";
import {BrowserHttpClientSession} from "./browserHttpClientSession";

/* istanbul ignore next */
export class BrowserHttpClient extends HttpClient {
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

  public copy(args: IHttpClientArgs = {}): BrowserHttpClient {
    return new BrowserHttpClient({headers: this.headers, timeout: this.timeout, ...args});
  }
}
