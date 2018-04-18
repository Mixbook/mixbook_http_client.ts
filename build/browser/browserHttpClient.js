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
var browserHttpClientSession_1 = require("./browserHttpClientSession");
// TODO: Write specs
/* istanbul ignore next */
var BrowserHttpClient = /** @class */ (function (_super) {
    __extends(BrowserHttpClient, _super);
    function BrowserHttpClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowserHttpClient.prototype.send = function (request) {
        var session = new browserHttpClientSession_1.BrowserHttpClientSession();
        session.start(request);
        return session;
    };
    return BrowserHttpClient;
}(httpClient_1.HttpClient));
exports.BrowserHttpClient = BrowserHttpClient;
//# sourceMappingURL=browserHttpClient.js.map