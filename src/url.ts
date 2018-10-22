export type TUrlParams = Record<string, string[]>;

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
export class Url {
  private _parts: IParts;

  constructor(parts: IParts) {
    this._parts = parts;
  }

  public appendPath(path: string): Url {
    const normalizedPath = path.replace(/^(\/+)/, "");
    const newPath = `/${this.pathAsArray.concat(normalizedPath).join("/")}`;

    return new Url({...this._parts, path: newPath});
  }

  public replacePath(path: string): Url {
    const normalizedPath = normalizePath(path);

    return new Url({...this._parts, path: normalizedPath});
  }

  public appendParams(params: TUrlParams): Url {
    const oldParams = this._parts.params || {};
    const keys = Object.keys(oldParams).concat(Object.keys(params));

    const newParams = keys.reduce(
      (memo: TUrlParams, name: string) => {
        !memo[name] && (memo[name] = (oldParams[name] || []).concat(params[name] || []));

        return memo;
      },
      {} as TUrlParams
    );

    return new Url({...this._parts, params: newParams});
  }

  public replaceParams(params: TUrlParams): Url {
    return new Url({...this._parts, params});
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
    return this._parts.host || "";
  }

  get hash(): string {
    return this._parts.hash || "";
  }

  get scheme(): string {
    return this._parts.scheme || "";
  }

  get port(): string {
    return this._parts.port || "";
  }

  get path(): string {
    let path = this._parts.path || "";
    if (path[0] !== "/") {
      path = `/${path}`;
    }

    return path;
  }

  get baseName(): string {
    const pathArray = this.pathAsArray;

    return pathArray.length > 0 ? pathArray[pathArray.length - 1] : "";
  }

  get extension(): string {
    const parts = this.baseName.split(".");

    return parts.length > 1 ? parts[parts.length - 1] : "";
  }

  get params(): TUrlParams {
    return {...(this._parts.params || {})};
  }

  get paramsAsString(): string {
    const {params = {}} = this._parts;

    return Object.keys(params)
      .sort((a, b) => (a < b ? -1 : a === b ? 0 : 1))
      .reduce((memo: string[], name: string) => {
        const values = params[name];
        const encodedName = Url.encode(name);

        if (values.length > 0) {
          memo.push(...values.map(value => `${encodedName}=${Url.encode(value)}`));
        } else {
          memo.push(encodedName);
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

    const hashMatcher = /#([^\#]*)$/;
    const hashMatch = hashMatcher.exec(url);
    if (hashMatch != null) {
      parsed.hash = hashMatch[1];
      url = url.replace(hashMatcher, "");
    }

    const paramsMatcher = /(?:\?|&)(.+)$/;
    const paramsMatch = paramsMatcher.exec(url);
    if (paramsMatch != null) {
      parsed.params = decodeQuery(paramsMatch[1]);
      url = url.replace(paramsMatcher, "");
    } else {
      parsed.params = {};
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

  export function decodeQuery(queryString: string): TUrlParams {
    if (!queryString) {
      return {};
    }

    return queryString
      .split("&")
      .map(part => part.split("="))
      .reduce(
        (memo, [encodedName, encodedValue]) => {
          const name = decode(encodedName);
          const value = decode(encodedValue);
          const values = memo[name] || (memo[name] = []);
          values.push(value);

          return memo;
        },
        {} as TUrlParams
      );
  }

  export function decode(value: string): string {
    // decodeURIComponent doesn't touch pluses, which encode spaces
    return decodeURIComponent(value).replace(/\+/g, " ");
  }

  export function encode(value: string): string {
    return encodeURIComponent((value || "").replace(/\s/g, "+"));
  }
}
