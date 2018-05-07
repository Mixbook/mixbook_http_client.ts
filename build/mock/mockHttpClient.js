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
var httpClient_1 = require("../httpClient");
var mockHttpClientSession_1 = require("./mockHttpClientSession");
var MockHttpClient = /** @class */ (function (_super) {
    __extends(MockHttpClient, _super);
    function MockHttpClient(args) {
        if (args === void 0) { args = {}; }
        var _this = _super.call(this) || this;
        _this.isRepeating = args.isRepeating === undefined ? true : args.isRepeating;
        _this.shouldUseBody = !!args.shouldUseBody;
        _this.shouldUseHeaders = !!args.shouldUseHeaders;
        _this.executedRequests = [];
        _this.requests = {};
        return _this;
    }
    MockHttpClient.prototype.send = function (request) {
        var responses = this.requests[this.getKey(request)] || [];
        var response = (this.isRepeating ? responses : responses.splice(0, 1))[0];
        this.executedRequests.push({ request: request, response: response });
        if (response != null) {
            return new mockHttpClientSession_1.MockHttpClientSession(request, response);
        }
        else {
            throw new Error("The request for \"" + this.getKey(request) + "\" is not mocked");
        }
    };
    MockHttpClient.prototype.copy = function (args) {
        if (args === void 0) { args = {}; }
        var client = new MockHttpClient(__assign({ isRepeating: this.isRepeating, shouldUseBody: this.shouldUseBody, shouldUseHeaders: this.shouldUseHeaders }, args));
        client.requests = this.requests;
        client.executedRequests = this.executedRequests;
        return client;
    };
    MockHttpClient.prototype.mockRequest = function (request, response) {
        if (this.isRepeating) {
            this.requests[this.getKey(request)] = [response];
        }
        else {
            this.requests[this.getKey(request)] = this.requests[this.getKey(request)] || [];
            this.requests[this.getKey(request)].push(response);
        }
    };
    MockHttpClient.prototype.reset = function () {
        this.requests = {};
        this.executedRequests = [];
    };
    MockHttpClient.prototype.getKey = function (request) {
        var key = request.method + "_" + request.url.toString();
        if (this.shouldUseHeaders) {
            key = key + "_" + JSON.stringify(request.headers);
        }
        if (this.shouldUseBody) {
            key = key + "_" + JSON.stringify(request.body);
        }
        return key;
    };
    return MockHttpClient;
}(httpClient_1.HttpClient));
exports.MockHttpClient = MockHttpClient;
//# sourceMappingURL=mockHttpClient.js.map