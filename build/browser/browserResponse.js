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
            var _this = this;
            return new Promise(function (resolve, reject) {
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    var target = event.target;
                    resolve(target.result);
                };
                fileReader.onerror = function (event) {
                    reject(new Error("Failed to get the array buffer from response"));
                };
                if (_this._xhr.response instanceof Blob) {
                    fileReader.readAsArrayBuffer(_this._xhr.response);
                }
                else {
                    fileReader.readAsArrayBuffer(new Blob());
                }
            });
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