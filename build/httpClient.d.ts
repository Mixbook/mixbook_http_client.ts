/// <reference types="node" />
import { Stream } from "./stream";
import { Url } from "./url";
export declare type THttpMethod = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE";
export interface IRequest {
    url: Url | string;
    method: THttpMethod;
    body?: string | Record<string, any>;
    headers?: Record<string, string>;
}
export interface IResponse {
    text: string;
    arrayBuffer: Promise<ArrayBuffer | Buffer>;
    json: Record<string, any>;
    status: number;
    headers: Record<string, string>;
}
export interface IProgress {
    total: number;
    loaded: number;
}
export interface IHttpClientSession {
    onUploadProgress: Stream<IProgress>;
    onDownloadProgress: Stream<IProgress>;
    promise: Promise<IResponse>;
    abort(): void;
}
export declare abstract class HttpClient {
    get(url: Url | string, headers?: Record<string, string>): Promise<IResponse>;
    post(url: Url | string, body: string | Record<string, any>, headers?: Record<string, string>): Promise<IResponse>;
    put(url: Url | string, body: string | Record<string, any>, headers?: Record<string, string>): Promise<IResponse>;
    abstract send(request: IRequest): IHttpClientSession;
}
