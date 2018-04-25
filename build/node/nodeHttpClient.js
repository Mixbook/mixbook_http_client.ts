"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Http = require("http");
var Https = require("https");
var httpClient_1 = require("../httpClient");
var nodeHttpClientSession_1 = require("./nodeHttpClientSession");
var NodeHttpClient = /** @class */ (function (_super) {
    __extends(NodeHttpClient, _super);
    function NodeHttpClient(headers) {
        if (headers === void 0) { headers = {}; }
        var _this = _super.call(this) || this;
        _this.headers = headers;
        _this.httpAgent = new Http.Agent({ keepAlive: true, keepAliveMsecs: 5000 });
        _this.httpsAgent = new Https.Agent({ keepAlive: true, keepAliveMsecs: 5000 });
        return _this;
    }
    NodeHttpClient.prototype.send = function (request) {
        var session = new nodeHttpClientSession_1.NodeHttpClientSession(this.httpAgent, this.httpsAgent);
        var actualRequest = __assign({}, request);
        if (this.headers.cookie) {
            actualRequest.headers = actualRequest.headers || {};
            actualRequest.headers.Cookie = this.headers.cookie;
        }
        session.start(actualRequest);
        return session;
    };
    return NodeHttpClient;
}(httpClient_1.HttpClient));
exports.NodeHttpClient = NodeHttpClient;
//# sourceMappingURL=nodeHttpClient.js.map