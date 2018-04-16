import {HttpClient, IHttpClientSession, IRequest} from "../httpClient";
import {BrowserHttpClientSession} from "./browserHttpClientSession";

// TODO: Write specs
/* istanbul ignore next */
export class BrowserHttpClient extends HttpClient {
  public send(request: IRequest): IHttpClientSession {
    const session = new BrowserHttpClientSession();
    session.start(request);

    return session;
  }
}
