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
var mockHttpClientSession_1 = require("./mockHttpClientSession");
var MockHttpClient = /** @class */ (function (_super) {
    __extends(MockHttpClient, _super);
    function MockHttpClient() {
        var _this = _super.call(this) || this;
        _this._requests = {};
        return _this;
    }
    MockHttpClient.prototype.send = function (request) {
        var response = this._requests[this.getKey(request)];
        if (response != null) {
            return new mockHttpClientSession_1.MockHttpClientSession(request, response);
        }
        else {
            throw new Error("The request for \"" + this.getKey(request) + "\" is not mocked");
        }
    };
    MockHttpClient.prototype.mockRequest = function (request, response) {
        this._requests[this.getKey(request)] = response;
    };
    MockHttpClient.prototype.reset = function () {
        this._requests = {};
    };
    MockHttpClient.prototype.getKey = function (request) {
        // TODO(anton): Should we also add body into the key?
        return request.method + "_" + request.url.toString();
    };
    return MockHttpClient;
}(httpClient_1.HttpClient));
exports.MockHttpClient = MockHttpClient;
//# sourceMappingURL=mockHttpClient.js.map