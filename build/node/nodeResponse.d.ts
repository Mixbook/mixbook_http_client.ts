/// <reference types="node" />
import * as Http from "http";
import { IResponse } from "../httpClient";
export declare class NodeResponse implements IResponse {
    private readonly _res;
    private readonly _body;
    constructor(res: Http.IncomingMessage, body: Buffer | string);
    readonly text: string;
    readonly arrayBuffer: Promise<Buffer>;
    readonly json: any[] | Record<string, any>;
    readonly status: number;
    readonly headers: Record<string, string>;
}
