"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormData = require("form-data");
var Http = require("http");
var Https = require("https");
var stream_1 = require("../stream");
var url_1 = require("../url");
var nodeResponse_1 = require("./nodeResponse");
var NodeHttpClientSession = /** @class */ (function () {
    function NodeHttpClientSession(httpAgent, httpsAgent) {
        this.onUploadProgress = new stream_1.Stream();
        this.onDownloadProgress = new stream_1.Stream();
        this.httpAgent = httpAgent;
        this.httpsAgent = httpsAgent;
        this.onUploadProgress = new stream_1.Stream();
        this.onDownloadProgress = new stream_1.Stream();
    }
    Object.defineProperty(NodeHttpClientSession.prototype, "promise", {
        get: function () {
            // TODO: Revise it, try avoid using !
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    NodeHttpClientSession.prototype.start = function (request) {
        var _this = this;
        this._promise = new Promise(function (resolve, reject) {
            var handler = function (res) {
                var bodyString = "";
                var bodyBuffer = [];
                var isBinary = (request.headers || {}).accept === "application/msgpack";
                if (!isBinary) {
                    res.setEncoding("utf8");
                }
                // For chunked, we don't know the content length
                var total = parseInt(res.headers["content-length"] || "-1", 10);
                var loaded = 0;
                res.on("data", function (chunk) {
                    loaded += chunk.length;
                    _this.onDownloadProgress.push({ total: total, loaded: loaded });
                    if (isBinary) {
                        bodyBuffer.push(chunk);
                    }
                    else {
                        bodyString += chunk;
                    }
                });
                res.on("end", function () {
                    resolve(new nodeResponse_1.NodeResponse(res, isBinary ? Buffer.concat(bodyBuffer) : bodyString));
                });
            };
            var url = request.url instanceof url_1.Url ? request.url : url_1.Url.fromString(request.url);
            var rawRequest = url.scheme === "https"
                ? Https.request(_this.requestOptions(url, request), handler)
                : Http.request(_this.requestOptions(url, request), handler);
            rawRequest.on("error", function (error) {
                reject(error);
            });
            var timeout = request.timeout;
            if (timeout != null && timeout > 0) {
                rawRequest.on("socket", function () {
                    // tslint:disable-next-line no-string-based-set-timeout
                    rawRequest.setTimeout(timeout);
                    rawRequest.on("timeout", function () {
                        rawRequest.abort();
                        reject(new Error("Timeout"));
                    });
                });
            }
            if (request.headers != null) {
                for (var _i = 0, _a = Object.getOwnPropertyNames(request.headers); _i < _a.length; _i++) {
                    var headerName = _a[_i];
                    rawRequest.setHeader(headerName, request.headers[headerName]);
                }
            }
            if (request.body != null) {
                if (typeof request.body === "string") {
                    rawRequest.setHeader("content-length", request.body.length);
                    rawRequest.write(request.body);
                }
                else {
                    var body = new FormData();
                    for (var _b = 0, _c = Object.getOwnPropertyNames(request.body); _b < _c.length; _b++) {
                        var name_1 = _c[_b];
                        body.append(name_1, request.body[name_1]);
                    }
                    var headers = body.getHeaders();
                    for (var _d = 0, _e = Object.keys(headers); _d < _e.length; _d++) {
                        var key = _e[_d];
                        rawRequest.setHeader(key, headers[key]);
                    }
                    rawRequest.setHeader("content-length", body.getLengthSync());
                    body.pipe(rawRequest);
                }
            }
            rawRequest.end();
            _this._request = rawRequest;
        });
    };
    NodeHttpClientSession.prototype.abort = function () {
        this._request && this._request.abort();
    };
    NodeHttpClientSession.prototype.requestOptions = function (url, request) {
        var doesHavePort = url.port != null;
        var port = doesHavePort ? url.port : url.scheme === "https" ? 443 : 80;
        return {
            method: request.method,
            host: url.host,
            port: port,
            path: url.pathWithParams,
            agent: url.scheme === "https" ? this.httpsAgent : this.httpAgent,
            // TODO(anton): Remove the following lines
            rejectUnauthorized: false,
        };
    };
    return NodeHttpClientSession;
}());
exports.NodeHttpClientSession = NodeHttpClientSession;
//# sourceMappingURL=nodeHttpClientSession.js.map