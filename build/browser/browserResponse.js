"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Write specs
/* istanbul ignore next */
var BrowserResponse = /** @class */ (function () {
    function BrowserResponse(xhr) {
        this._xhr = xhr;
    }
    Object.defineProperty(BrowserResponse.prototype, "text", {
        get: function () {
            return this._xhr.responseText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserResponse.prototype, "arrayBuffer", {
        get: function () {
            var response = new Response(this._xhr.response, { status: this._xhr.status, statusText: this._xhr.statusText });
            return response.arrayBuffer();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserResponse.prototype, "json", {
        get: function () {
            return JSON.parse(this.text);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserResponse.prototype, "status", {
        get: function () {
            return this._xhr.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserResponse.prototype, "headers", {
        get: function () {
            if (this._headers == null) {
                var headerLines = this._xhr
                    .getAllResponseHeaders()
                    .trim()
                    .split(/[\r\n]+/);
                this._headers = headerLines.reduce(function (memo, line) {
                    var parts = line.split(": ");
                    if (parts.length > 1) {
                        var key = parts.shift();
                        var value = parts.join(": ");
                        memo[key] = value;
                    }
                    return memo;
                }, {});
            }
            return this._headers;
        },
        enumerable: true,
        configurable: true
    });
    return BrowserResponse;
}());
exports.BrowserResponse = BrowserResponse;
//# sourceMappingURL=browserResponse.js.map