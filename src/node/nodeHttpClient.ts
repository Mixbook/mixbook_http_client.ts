import * as Http from "http";
import * as Https from "https";
import {HttpClient, IRequest} from "../httpClient";
import {NodeHttpClientSession} from "./nodeHttpClientSession";

export class NodeHttpClient extends HttpClient {
  private readonly headers: Record<string, string>;
  private readonly httpAgent: Http.Agent;
  private readonly httpsAgent: Https.Agent;

  constructor(headers: Record<string, string>) {
    super();
    this.headers = headers;
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
    session.start(actualRequest);

    return session;
  }
}
