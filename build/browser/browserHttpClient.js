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
var browserHttpClientSession_1 = require("./browserHttpClientSession");
/* istanbul ignore next */
var BrowserHttpClient = /** @class */ (function (_super) {
    __extends(BrowserHttpClient, _super);
    function BrowserHttpClient(args) {
        if (args === void 0) { args = {}; }
        var _this = _super.call(this) || this;
        _this.headers = args.headers || {};
        _this.timeout = args.timeout;
        return _this;
    }
    BrowserHttpClient.prototype.send = function (request) {
        var session = new browserHttpClientSession_1.BrowserHttpClientSession();
        var actualRequest = __assign({}, request);
        if (this.headers.cookie) {
            actualRequest.headers = actualRequest.headers || {};
            actualRequest.headers.Cookie = this.headers.cookie;
        }
        actualRequest.timeout = actualRequest.timeout || this.timeout;
        session.start(actualRequest);
        return session;
    };
    return BrowserHttpClient;
}(httpClient_1.HttpClient));
exports.BrowserHttpClient = BrowserHttpClient;
//# sourceMappingURL=browserHttpClient.js.map