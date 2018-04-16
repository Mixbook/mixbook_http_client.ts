import {IResponse} from "../httpClient";
import {Maybe} from "../types";

// TODO: Write specs
/* istanbul ignore next */
export class BrowserResponse implements IResponse {
  private readonly _xhr: XMLHttpRequest;
  private _headers: Maybe<Record<string, string>>;

  constructor(xhr: XMLHttpRequest) {
    this._xhr = xhr;
  }

  public get text(): string {
    return this._xhr.responseText;
  }

  public get arrayBuffer(): Promise<ArrayBuffer> {
    const response = new Response(this._xhr.response, {status: this._xhr.status, statusText: this._xhr.statusText});

    return response.arrayBuffer();
  }

  public get json(): any[] | Record<string, any> {
    return JSON.parse(this.text);
  }

  public get status(): number {
    return this._xhr.status;
  }

  public get headers(): Record<string, string> {
    if (this._headers == null) {
      const headerLines = this._xhr
        .getAllResponseHeaders()
        .trim()
        .split(/[\r\n]+/);
      this._headers = headerLines.reduce<Record<string, string>>((memo, line) => {
        const parts = line.split(": ");
        if (parts.length > 1) {
          const key = parts.shift()!;
          const value = parts.join(": ");
          memo[key] = value;
        }

        return memo;
      }, {});
    }

    return this._headers;
  }
}
