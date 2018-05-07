import * as Http from "http";
import * as Https from "https";
import {HttpClient, IHttpClientArgs, IRequest} from "../httpClient";
import {NodeHttpClientSession} from "./nodeHttpClientSession";

export class NodeHttpClient extends HttpClient {
  private readonly httpAgent: Http.Agent;
  private readonly httpsAgent: Https.Agent;

  constructor(args: IHttpClientArgs = {}) {
    super(args);
    this.httpAgent = new Http.Agent({keepAlive: true, keepAliveMsecs: 5000});
    this.httpsAgent = new Https.Agent({keepAlive: true, keepAliveMsecs: 5000});
  }

  public send(request: IRequest): NodeHttpClientSession {
    const session = new NodeHttpClientSession(this.httpAgent, this.httpsAgent);
    const actualRequest = {...request};
    if (this.headers.cookie) {
      actualRequest.headers = actualRequest.headers || {};
      actualRequest.headers.Cookie = this.headers.cookie;
    }
    actualRequest.timeout = actualRequest.timeout || this.timeout || 60000;
    session.start(actualRequest);

    return session;
  }

  public copy(args: IHttpClientArgs = {}): NodeHttpClient {
    return new NodeHttpClient({headers: this.headers, timeout: this.timeout, ...args});
  }
}
