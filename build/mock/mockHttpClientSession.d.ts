import { IHttpClientSession, IProgress, IRequest, IResponse } from "../httpClient";
import { Stream } from "../stream";
export declare class MockHttpClientSession implements IHttpClientSession {
    readonly promise: Promise<IResponse>;
    readonly onUploadProgress: Stream<IProgress>;
    readonly onDownloadProgress: Stream<IProgress>;
    constructor(request: IRequest, response: IResponse);
    abort(): void;
}
