import {IHttpClientSession, IProgress, IRequest, IResponse} from "../httpClient";
import {Stream} from "../stream";

export class MockHttpClientSession implements IHttpClientSession {
  public readonly promise: Promise<IResponse>;
  public readonly onUploadProgress = new Stream<IProgress>();
  public readonly onDownloadProgress = new Stream<IProgress>();

  constructor(request: IRequest, response: IResponse) {
    this.onUploadProgress = new Stream<IProgress>();
    this.onDownloadProgress = new Stream<IProgress>();

    this.promise = Promise.resolve(response);
    this.onUploadProgress.push({loaded: 100, total: 100});
    this.onDownloadProgress.push({loaded: 100, total: 100});
  }

  /* istanbul ignore next */
  public abort(): void {
    // Nothing to do here
  }
}
