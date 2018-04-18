import * as MsgPack from "msgpack-lite";

import {HttpClient, IHttpClientSession, IRequest} from "./httpClient";
import {Url} from "./url";

/* istanbul ignore next */
export class MsgPackHttpClient extends HttpClient {
  private readonly _client: HttpClient;

  constructor(client: HttpClient) {
    super();
    this._client = client;
  }

  public send(request: IRequest): IHttpClientSession {
    return this._client.send(request);
  }

  public async getMsgPack<T>(url: Url | string, headers?: Record<string, string>): Promise<T> {
    return this.sendMsgPack<T>({url, method: "GET", headers});
  }

  public async postMsgPack<T>(
    url: Url | string,
    body: string | Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.sendMsgPack<T>({url, method: "POST", body, headers});
  }

  public async sendMsgPack<T>(request: IRequest): Promise<T> {
    const actualRequest = {...request};
    actualRequest.headers = {...(actualRequest.headers || {})};
    actualRequest.headers.accept = "application/msgpack";

    const response = await this.send(actualRequest).promise;
    const buffer = await response.arrayBuffer;

    return MsgPack.decode(new Uint8Array(buffer));
  }
}
