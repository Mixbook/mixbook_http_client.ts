export declare type TUrlRawQuery = Record<string, string>;
export declare type TUrlQuery = Record<string, IStringifyable | undefined>;
export interface IStringifyable {
    toString(): string;
}
export interface IParts {
    scheme?: string;
    host?: string;
    port?: string;
    path?: string;
    params?: TUrlQuery;
    hash?: string;
}
/**
 * Utility class for parsing and building URLs.
 */
export declare class Url {
    private parts;
    constructor(parts: IParts);
    appendPath(path: string): Url;
    replacePath(path: string): Url;
    appendParams(params: TUrlQuery): Url;
    replaceParams(params: TUrlQuery): Url;
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
    readonly params: TUrlQuery;
    readonly nonNullParams: Record<string, string>;
    readonly paramsAsString: string;
    readonly paramsAsStringWithSeparator: string;
    readonly pathAsArray: string[];
}
export declare namespace Url {
    function fromString(input: string): Url;
    function fromClientWindow(clientWindow?: Window): Url;
    function decodeQuery(queryString: string): TUrlRawQuery;
    function decode(value: string): string;
}
