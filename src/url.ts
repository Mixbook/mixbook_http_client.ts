export type TUrlRawQuery = Record<string, string>;

export type TUrlQuery = Record<string, IStringifyable | undefined>;

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
export class Url {
  constructor(private parts: IParts) {}

  public appendPath(path: string): Url {
    const normalizedPath = path.replace(/^(\/+)/, "");
    const newPath = `/${this.pathAsArray.concat(normalizedPath).join("/")}`;

    return new Url({...this.parts, path: newPath});
  }

  public replacePath(path: string): Url {
    const normalizedPath = normalizePath(path);

    return new Url({...this.parts, path: normalizedPath});
  }

  public appendParams(params: TUrlQuery): Url {
    const newParams = {...(this.parts.params || {}), ...params};

    return new Url({...this.parts, params: newParams});
  }

  public replaceParams(params: TUrlQuery): Url {
    return new Url({...this.parts, params});
  }

  public equals(other: Url): boolean {
    return other instanceof Url && this.toString() === other.toString();
  }

  public toString(): string {
    let result = "";
    if (this.scheme.length > 0) {
      result += `${this.scheme}://`;
    }
    if (this.host.length > 0) {
      if (this.scheme.length === 0) {
        result += "//";
      }
      result += this.host;
    }
    if (this.port.length > 0) {
      result += `:${this.port}`;
    }
    if (this.path.length > 0) {
      result += this.path;
    }
    result += this.paramsAsStringWithSeparator;
    if (this.hash.length > 0) {
      result += `#${this.hash}`;
    }

    return result;
  }

  public get pathWithParams(): string {
    return `${this.path}${this.paramsAsStringWithSeparator}`;
  }

  get host(): string {
    return this.parts.host || "";
  }

  get hash(): string {
    return this.parts.hash || "";
  }

  get scheme(): string {
    return this.parts.scheme || "";
  }

  get port(): string {
    return this.parts.port || "";
  }

  get path(): string {
    return this.parts.path || "";
  }

  get baseName(): string {
    const pathArray = this.pathAsArray;

    return pathArray.length > 0 ? pathArray[pathArray.length - 1] : "";
  }

  get extension(): string {
    const parts = this.baseName.split(".");

    return parts.length > 1 ? parts[parts.length - 1] : "";
  }

  get params(): TUrlQuery {
    return {...(this.parts.params || {})};
  }

  get nonNullParams(): Record<string, string> {
    return Object.keys(this.parts.params || {}).reduce<Record<string, string>>((memo, key) => {
      if (this.parts.params![key] != null) {
        memo[key] = this.parts.params![key]!.toString();
      }

      return memo;
    }, {});
  }

  get paramsAsString(): string {
    return Object.keys(this.params || {})
      .sort((a, b) => (a < b ? -1 : a === b ? 0 : 1))
      .reduce((memo: string[], key: string) => {
        if (this.params[key] != null) {
          memo.push(`${key}=${encodeURIComponent(this.params[key]!.toString())}`);
        } else {
          memo.push(`${key}`);
        }

        return memo;
      }, [])
      .join("&");
  }

  get paramsAsStringWithSeparator(): string {
    if (Object.keys(this.params).length > 0) {
      return `?${this.paramsAsString}`;
    } else {
      return "";
    }
  }

  get pathAsArray(): string[] {
    return this.path.split("/").filter(str => str.length > 0);
  }
}

function normalizePath(path: string): string {
  let result = path.replace(/(\/+)/, "/");
  if (result.length > 0 && result[0] !== "/") {
    result = `/${result}`;
  }

  return result;
}

export namespace Url {
  export function fromString(input: string): Url {
    const parsed = {} as IParts;

    let url = input;

    const schemeMatcher = /^(\w+):\/\//;
    const schemeMatch = schemeMatcher.exec(url);
    if (schemeMatch != null) {
      parsed.scheme = schemeMatch[1];
      url = url.substr(schemeMatch[0].length);
    }

    const hostMatcher = /^(?:\/\/)?(?!:\d+|\/)(.+?)(\/|:|\?|$)/;
    const hostMatch = hostMatcher.exec(url);
    if (hostMatch != null) {
      parsed.host = hostMatch[1];
      url = url.replace(/^\/\//, "").substr(parsed.host.length);
    }

    const portMatcher = /^:(\d+)/;
    const portMatch = portMatcher.exec(url);
    if (portMatch != null) {
      parsed.port = portMatch[1];
      url = url.substr(parsed.port.length + 1);
    }

    const paramsMatcher = /\?(.+)$/;
    const paramsMatch = paramsMatcher.exec(url);
    if (paramsMatch != null) {
      parsed.params = decodeQuery(paramsMatch[1]);
      url = url.replace(paramsMatcher, "");
    } else {
      parsed.params = {};
    }

    const hashMatcher = /^#(.+)$/;
    const hashMatch = hashMatcher.exec(url);
    if (hashMatch != null) {
      parsed.hash = hashMatch[1];
      url = url.substr(parsed.hash.length + 1);
    }

    parsed.path = normalizePath(url);

    return new Url(parsed);
  }

  export function fromClientWindow(clientWindow: Window = window): Url {
    const {protocol, pathname: path, search, hash} = clientWindow.location;
    const [host, port] = clientWindow.location.host.split(":");

    return new Url({
      scheme: protocol.replace(/\:$/, ""),
      host,
      port,
      path,
      params: decodeQuery(search.slice(1)),
      hash: hash.slice(1),
    });
  }

  export function decodeQuery(queryString: string): TUrlRawQuery {
    if (!queryString) {
      return {};
    }

    return queryString
      .split("&")
      .map(part => part.split("="))
      .reduce(
        (memo, [param, value]) => {
          if (param) {
            memo[decode(param)] = decode(value);
          }

          return memo;
        },
        {} as TUrlRawQuery
      );
  }

  export function decode(value: string): string {
    // decodeURIComponent doesn't touch pluses, which encode spaces
    return decodeURIComponent(value).replace(/\+/g, " ");
  }
}
