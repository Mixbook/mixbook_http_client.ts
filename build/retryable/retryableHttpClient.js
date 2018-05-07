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
Object.defineProperty(exports, "__esModule", { value: true });
var httpClient_1 = require("../httpClient");
var retryableHttpClientSession_1 = require("./retryableHttpClientSession");
var RetryableHttpClient = /** @class */ (function (_super) {
    __extends(RetryableHttpClient, _super);
    function RetryableHttpClient(client, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this._client = client;
        _this._retryCondition = opts.retryCondition || RetryableHttpClient.defaultRetryCondition;
        _this._delaysInMilliseconds = opts.delaysInMilliseconds || [100, 500, 1000];
        return _this;
    }
    RetryableHttpClient.defaultRetryCondition = function (request, response, error, retryCount) {
        return retryCount < 4 && request.method === "GET" && (response == null || response.status >= 500);
    };
    RetryableHttpClient.prototype.send = function (request) {
        var session = new retryableHttpClientSession_1.RetryableHttpClientSession(request, this._client, this._retryCondition, this._delaysInMilliseconds);
        session.start();
        return session;
    };
    RetryableHttpClient.prototype.copy = function (args) {
        if (args === void 0) { args = {}; }
        return new RetryableHttpClient(this._client.copy(args), {
            retryCondition: this._retryCondition,
            delaysInMilliseconds: this._delaysInMilliseconds,
        });
    };
    return RetryableHttpClient;
}(httpClient_1.HttpClient));
exports.RetryableHttpClient = RetryableHttpClient;
//# sourceMappingURL=retryableHttpClient.js.map