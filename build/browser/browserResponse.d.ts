import { IResponse } from "../httpClient";
export declare class BrowserResponse implements IResponse {
    private readonly _xhr;
    private _headers;
    constructor(xhr: XMLHttpRequest);
    readonly text: string;
    readonly arrayBuffer: Promise<ArrayBuffer>;
    readonly json: any[] | Record<string, any>;
    readonly status: number;
    readonly headers: Record<string, string>;
}
