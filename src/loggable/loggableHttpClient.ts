import {HttpClient, IHttpClientArgs, IHttpClientSession, IRequest} from "../index";

export interface ILogger {
  debug(record: string): void;
  info(record: string): void;
  warn(record: string): void;
}

export class LoggableHttpClient extends HttpClient {
  private readonly _client: HttpClient;
  private readonly _logger: ILogger;

  constructor(client: HttpClient, logger: ILogger) {
    super();
    this._client = client;
    this._logger = logger;
  }

  public send(request: IRequest): IHttpClientSession {
    let startedMsg = `Started ${request.method} '${request.url.toString()}'`;
    if (request.headers != null) {
      startedMsg += `, headers: '${JSON.stringify(request.headers)}'`;
    }
    this._logger.info(startedMsg);
    const startTime = Date.now();
    if (request.body != null) {
      this._logger.debug(`Started with body: ${this.formatBody(JSON.stringify(request.body))}`);
    }
    const session = this._client.send(request);
    session.promise.then(response => {
      const time = Date.now() - startTime;
      const msg = `Completed ${request.method} '${request.url}' with '${response.status}' in ${time}ms`;
      if (response.status < 400) {
        this._logger.info(msg);
      } else {
        this._logger.warn(msg);
      }
      this._logger.debug(`Completed with body: ${this.formatBody(response.text)}`);
    });

    return session;
  }

  public copy(args: IHttpClientArgs = {}): LoggableHttpClient {
    return new LoggableHttpClient(this._client.copy(args), this._logger);
  }

  private formatBody(str: string): string {
    if (str.length > 1000) {
      return `${str.substr(0, 1000)}...`;
    } else {
      return str;
    }
  }
}
