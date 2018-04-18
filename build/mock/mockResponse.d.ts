/// <reference types="node" />
import { IResponse } from "../httpClient";
export declare class MockResponse implements IResponse {
    readonly headers: Record<string, string>;
    readonly status: number;
    private readonly _body;
    constructor(status: number, body: string | Buffer, headers?: Record<string, string>);
    readonly text: string;
    readonly arrayBuffer: Promise<Buffer>;
    readonly json: any[] | Record<string, any>;
}
