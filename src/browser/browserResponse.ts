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
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event: ProgressEvent) => {
        const target = event.target as FileReader;
        resolve(target.result);
      };
      fileReader.onerror = (event: ProgressEvent) => {
        reject(new Error("Failed to get the array buffer from response"));
      };
      if (this._xhr.response instanceof Blob) {
        fileReader.readAsArrayBuffer(this._xhr.response);
      } else {
        fileReader.readAsArrayBuffer(new Blob());
      }
    });
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
