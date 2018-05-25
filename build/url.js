"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility class for parsing and building URLs.
 */
var Url = /** @class */ (function () {
    function Url(parts) {
        this.parts = parts;
    }
    Url.prototype.appendPath = function (path) {
        var normalizedPath = path.replace(/^(\/+)/, "");
        var newPath = "/" + this.pathAsArray.concat(normalizedPath).join("/");
        return new Url(__assign({}, this.parts, { path: newPath }));
    };
    Url.prototype.replacePath = function (path) {
        var normalizedPath = normalizePath(path);
        return new Url(__assign({}, this.parts, { path: normalizedPath }));
    };
    Url.prototype.appendParams = function (params) {
        var newParams = __assign({}, (this.parts.params || {}), params);
        return new Url(__assign({}, this.parts, { params: newParams }));
    };
    Url.prototype.replaceParams = function (params) {
        return new Url(__assign({}, this.parts, { params: params }));
    };
    Url.prototype.equals = function (other) {
        return other instanceof Url && this.toString() === other.toString();
    };
    Url.prototype.toString = function () {
        var result = "";
        if (this.scheme.length > 0) {
            result += this.scheme + "://";
        }
        if (this.host.length > 0) {
            if (this.scheme.length === 0) {
                result += "//";
            }
            result += this.host;
        }
        if (this.port.length > 0) {
            result += ":" + this.port;
        }
        if (this.path.length > 0) {
            result += this.path;
        }
        result += this.paramsAsStringWithSeparator;
        if (this.hash.length > 0) {
            result += "#" + this.hash;
        }
        return result;
    };
    Object.defineProperty(Url.prototype, "pathWithParams", {
        get: function () {
            return "" + this.path + this.paramsAsStringWithSeparator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "host", {
        get: function () {
            return this.parts.host || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "hash", {
        get: function () {
            return this.parts.hash || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "scheme", {
        get: function () {
            return this.parts.scheme || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "port", {
        get: function () {
            return this.parts.port || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "path", {
        get: function () {
            var path = this.parts.path || "";
            if (path[0] !== "/") {
                path = "/" + path;
            }
            return path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "baseName", {
        get: function () {
            var pathArray = this.pathAsArray;
            return pathArray.length > 0 ? pathArray[pathArray.length - 1] : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "extension", {
        get: function () {
            var parts = this.baseName.split(".");
            return parts.length > 1 ? parts[parts.length - 1] : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "params", {
        get: function () {
            return __assign({}, (this.parts.params || {}));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "nonNullParams", {
        get: function () {
            var _this = this;
            return Object.keys(this.parts.params || {}).reduce(function (memo, key) {
                if (_this.parts.params[key] != null) {
                    memo[key] = _this.parts.params[key].toString();
                }
                return memo;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "paramsAsString", {
        get: function () {
            var _this = this;
            return Object.keys(this.params || {})
                .sort(function (a, b) { return (a < b ? -1 : a === b ? 0 : 1); })
                .reduce(function (memo, key) {
                if (_this.params[key] != null) {
                    memo.push(key + "=" + encodeURIComponent(_this.params[key].toString()));
                }
                else {
                    memo.push("" + key);
                }
                return memo;
            }, [])
                .join("&");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "paramsAsStringWithSeparator", {
        get: function () {
            if (Object.keys(this.params).length > 0) {
                return "?" + this.paramsAsString;
            }
            else {
                return "";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Url.prototype, "pathAsArray", {
        get: function () {
            return this.path.split("/").filter(function (str) { return str.length > 0; });
        },
        enumerable: true,
        configurable: true
    });
    return Url;
}());
exports.Url = Url;
function normalizePath(path) {
    var result = path.replace(/(\/+)/, "/");
    if (result.length > 0 && result[0] !== "/") {
        result = "/" + result;
    }
    return result;
}
(function (Url) {
    function fromString(input) {
        var parsed = {};
        var url = input;
        var schemeMatcher = /^(\w+):\/\//;
        var schemeMatch = schemeMatcher.exec(url);
        if (schemeMatch != null) {
            parsed.scheme = schemeMatch[1];
            url = url.substr(schemeMatch[0].length);
        }
        var hostMatcher = /^(?:\/\/)?(?!:\d+|\/)(.+?)(\/|:|\?|$)/;
        var hostMatch = hostMatcher.exec(url);
        if (hostMatch != null) {
            parsed.host = hostMatch[1];
            url = url.replace(/^\/\//, "").substr(parsed.host.length);
        }
        var portMatcher = /^:(\d+)/;
        var portMatch = portMatcher.exec(url);
        if (portMatch != null) {
            parsed.port = portMatch[1];
            url = url.substr(parsed.port.length + 1);
        }
        var hashMatcher = /#([^\#]*)$/;
        var hashMatch = hashMatcher.exec(url);
        if (hashMatch != null) {
            parsed.hash = hashMatch[1];
            url = url.replace(hashMatcher, "");
        }
        var paramsMatcher = /\?(.+)$/;
        var paramsMatch = paramsMatcher.exec(url);
        if (paramsMatch != null) {
            parsed.params = decodeQuery(paramsMatch[1]);
            url = url.replace(paramsMatcher, "");
        }
        else {
            parsed.params = {};
        }
        parsed.path = normalizePath(url);
        return new Url(parsed);
    }
    Url.fromString = fromString;
    function fromClientWindow(clientWindow) {
        if (clientWindow === void 0) { clientWindow = window; }
        var _a = clientWindow.location, protocol = _a.protocol, path = _a.pathname, search = _a.search, hash = _a.hash;
        var _b = clientWindow.location.host.split(":"), host = _b[0], port = _b[1];
        return new Url({
            scheme: protocol.replace(/\:$/, ""),
            host: host,
            port: port,
            path: path,
            params: decodeQuery(search.slice(1)),
            hash: hash.slice(1),
        });
    }
    Url.fromClientWindow = fromClientWindow;
    function decodeQuery(queryString) {
        if (!queryString) {
            return {};
        }
        return queryString
            .split("&")
            .map(function (part) { return part.split("="); })
            .reduce(function (memo, _a) {
            var param = _a[0], value = _a[1];
            if (param) {
                memo[decode(param)] = decode(value);
            }
            return memo;
        }, {});
    }
    Url.decodeQuery = decodeQuery;
    function decode(value) {
        // decodeURIComponent doesn't touch pluses, which encode spaces
        return decodeURIComponent(value).replace(/\+/g, " ");
    }
    Url.decode = decode;
})(Url = exports.Url || (exports.Url = {}));
exports.Url = Url;
//# sourceMappingURL=url.js.map