"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeResponse = /** @class */ (function () {
    function NodeResponse(res, body) {
        this._res = res;
        this._body = body;
    }
    Object.defineProperty(NodeResponse.prototype, "text", {
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
    Object.defineProperty(NodeResponse.prototype, "arrayBuffer", {
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
    Object.defineProperty(NodeResponse.prototype, "json", {
        get: function () {
            return JSON.parse(this.text);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeResponse.prototype, "status", {
        get: function () {
            return this._res.statusCode || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeResponse.prototype, "headers", {
        get: function () {
            return this._res.headers;
        },
        enumerable: true,
        configurable: true
    });
    return NodeResponse;
}());
exports.NodeResponse = NodeResponse;
//# sourceMappingURL=nodeResponse.js.map