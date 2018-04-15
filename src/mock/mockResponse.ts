import {IResponse} from "../httpClient";

export class MockResponse implements IResponse {
  public readonly headers: Record<string, string>;
  public readonly status: number;
  private readonly _body: string | Buffer;

  constructor(status: number, body: string | Buffer, headers: Record<string, string> = {}) {
    this.status = status;
    this.headers = headers || {};
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
}
