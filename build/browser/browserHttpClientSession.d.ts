import { IHttpClientSession, IProgress, IRequest, IResponse } from "../httpClient";
import { Stream } from "../stream";
export declare class BrowserHttpClientSession implements IHttpClientSession {
    readonly promise: Promise<IResponse>;
    readonly onUploadProgress: Stream<IProgress>;
    readonly onDownloadProgress: Stream<IProgress>;
    private readonly _xhr;
    constructor();
    start(request: IRequest): Promise<void>;
    abort(): void;
}
