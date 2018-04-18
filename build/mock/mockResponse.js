"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MockResponse = /** @class */ (function () {
    function MockResponse(status, body, headers) {
        if (headers === void 0) { headers = {}; }
        this.status = status;
        this.headers = headers || {};
        this._body = body;
    }
    Object.defineProperty(MockResponse.prototype, "text", {
        get: function () {
            if (typeof this._body === "string") {
                return this._body;
            }
            else {
                return this._body.toString("utf8");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockResponse.prototype, "arrayBuffer", {
        get: function () {
            if (typeof this._body === "string") {
                return Promise.resolve(Buffer.from(this._body, "utf8"));
            }
            else {
                return Promise.resolve(this._body);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockResponse.prototype, "json", {
        get: function () {
            return JSON.parse(this.text);
        },
        enumerable: true,
        configurable: true
    });
    return MockResponse;
}());
exports.MockResponse = MockResponse;
//# sourceMappingURL=mockResponse.js.map