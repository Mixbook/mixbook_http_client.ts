export declare type TUrlParams = Record<string, string[]>;
export interface IParts {
    scheme?: string;
    host?: string;
    port?: string;
    path?: string;
    params?: TUrlParams;
    hash?: string;
}
/**
 * Utility class for parsing and building URLs.
 */
export declare class Url {
    private _parts;
    constructor(parts: IParts);
    appendPath(path: string): Url;
    replacePath(path: string): Url;
    appendParams(params: TUrlParams): Url;
    replaceParams(params: TUrlParams): Url;
    equals(other: Url): boolean;
    toString(): string;
    readonly pathWithParams: string;
    readonly host: string;
    readonly hash: string;
    readonly scheme: string;
    readonly port: string;
    readonly path: string;
    readonly baseName: string;
    readonly extension: string;
    readonly params: TUrlParams;
    readonly paramsAsString: string;
    readonly paramsAsStringWithSeparator: string;
    readonly pathAsArray: string[];
}
export declare namespace Url {
    function fromString(input: string): Url;
    function fromClientWindow(clientWindow?: Window): Url;
    function decodeQuery(queryString: string): TUrlParams;
    function decode(value: string): string;
    function encode(value: string): string;
}
