import * as FormData from "form-data";
import * as Http from "http";
import * as Https from "https";
import {IHttpClientSession, IProgress, IRequest, IResponse} from "../httpClient";
import {Stream} from "../stream";
import {Url} from "../url";
import {NodeResponse} from "./nodeResponse";

export class NodeHttpClientSession implements IHttpClientSession {
  public readonly onUploadProgress = new Stream<IProgress>();
  public readonly onDownloadProgress = new Stream<IProgress>();
  private readonly httpAgent: Http.Agent;
  private readonly httpsAgent: Https.Agent;

  private _promise?: Promise<IResponse>;
  private _request?: Http.ClientRequest;

  constructor(httpAgent: Http.Agent, httpsAgent: Https.Agent) {
    this.httpAgent = httpAgent;
    this.httpsAgent = httpsAgent;
    this.onUploadProgress = new Stream<IProgress>();
    this.onDownloadProgress = new Stream<IProgress>();
  }

  public get promise(): Promise<IResponse> {
    // TODO: Revise it, try avoid using !
    return this._promise!;
  }

  public start(request: IRequest): void {
    this._promise = new Promise((resolve, reject) => {
      const handler = (res: Http.IncomingMessage): void => {
        let bodyString = "";
        const bodyBuffer: Buffer[] = [];
        const isBinary = (request.headers || {}).accept === "application/msgpack";
        if (!isBinary) {
          res.setEncoding("utf8");
        }
        // For chunked, we don't know the content length
        const total = parseInt(res.headers["content-length"] || "-1", 10);
        let loaded = 0;

        res.on("data", chunk => {
          loaded += chunk.length;
          this.onDownloadProgress.push({total, loaded});
          if (isBinary) {
            bodyBuffer.push(chunk as Buffer);
          } else {
            bodyString += chunk as string;
          }
        });
        res.on("end", () => {
          resolve(new NodeResponse(res, isBinary ? Buffer.concat(bodyBuffer) : bodyString));
        });
        rawRequest.on("error", error => {
          reject(error);
        });
      };

      const url = request.url instanceof Url ? request.url : Url.fromString(request.url);
      const rawRequest =
        url.scheme === "https"
          ? Https.request(this.requestOptions(url, request), handler)
          : Http.request(this.requestOptions(url, request), handler);

      if (request.headers != null) {
        for (const headerName of Object.getOwnPropertyNames(request.headers)) {
          rawRequest.setHeader(headerName, request.headers[headerName]);
        }
      }

      if (request.body != null) {
        if (typeof request.body === "string") {
          rawRequest.setHeader("content-length", request.body.length);
          rawRequest.write(request.body);
        } else {
          const body = new FormData();

          for (const name of Object.getOwnPropertyNames(request.body)) {
            body.append(name, request.body[name]);
          }

          const headers = body.getHeaders();
          for (const key of Object.keys(headers)) {
            rawRequest.setHeader(key, headers[key]);
          }
          rawRequest.setHeader("content-length", body.getLengthSync());
          body.pipe(rawRequest);
        }
      }

      rawRequest.end();

      this._request = rawRequest;
    });
  }

  public abort(): void {
    this._request && this._request.abort();
  }

  private requestOptions(url: Url, request: IRequest): Https.RequestOptions {
    const doesHavePort = url.port != null;
    const port = doesHavePort ? url.port : url.scheme === "https" ? 443 : 80;

    return {
      timeout: 30000,
      method: request.method,
      host: url.host,
      port,
      path: url.pathWithParams,
      agent: url.scheme === "https" ? this.httpsAgent : this.httpAgent,
      // TODO(anton): Remove the following lines
      rejectUnauthorized: false,
    };
  }
}
