import * as Http from "http";
import {IResponse} from "../httpClient";

export class NodeResponse implements IResponse {
  private readonly _res: Http.IncomingMessage;
  private readonly _body: Buffer | string;

  constructor(res: Http.IncomingMessage, body: Buffer | string) {
    this._res = res;
    this._body = body;
  }

  public get text(): string {
    if (typeof this._body === "string") {
      return this._body;
    } else {
      return this._body.toString("utf8");
    }
  }

  public get arrayBuffer(): Promise<Buffer> {
    if (typeof this._body === "string") {
      return Promise.resolve(Buffer.from(this._body, "utf8"));
    } else {
      return Promise.resolve(this._body);
    }
  }

  public get json(): any[] | Record<string, any> {
    return JSON.parse(this.text);
  }

  public get status(): number {
    return this._res.statusCode || 0;
  }

  public get headers(): Record<string, string> {
    return this._res.headers as Record<string, string>;
  }
}
