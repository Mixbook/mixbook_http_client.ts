import { IHttpClientSession, IProgress, IRequest, IResponse } from "../httpClient";
import { Stream } from "../stream";
export declare class BrowserHttpClientSession implements IHttpClientSession {
    readonly onUploadProgress: Stream<IProgress>;
    readonly onDownloadProgress: Stream<IProgress>;
    private _promise?;
    private readonly _xhr;
    constructor();
    readonly promise: Promise<IResponse>;
    start(request: IRequest): Promise<void>;
    abort(): void;
}
