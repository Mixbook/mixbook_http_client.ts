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
var index_1 = require("../index");
var LoggableHttpClient = /** @class */ (function (_super) {
    __extends(LoggableHttpClient, _super);
    function LoggableHttpClient(client, logger) {
        var _this = _super.call(this) || this;
        _this._client = client;
        _this._logger = logger;
        return _this;
    }
    LoggableHttpClient.prototype.send = function (request) {
        var _this = this;
        var startedMsg = "Started " + request.method + " '" + request.url.toString() + "'";
        if (request.headers != null) {
            startedMsg += ", headers: '" + JSON.stringify(request.headers) + "'";
        }
        this._logger.info(startedMsg);
        var startTime = Date.now();
        if (request.body != null) {
            this._logger.debug("Started with body: " + this.formatBody(JSON.stringify(request.body)));
        }
        var session = this._client.send(request);
        session.promise.then(function (response) {
            var time = Date.now() - startTime;
            var msg = "Completed " + request.method + " '" + request.url + "' with '" + response.status + "' in " + time + "ms";
            if (response.status < 400) {
                _this._logger.info(msg);
            }
            else {
                _this._logger.warn(msg);
            }
            _this._logger.debug("Completed with body: " + _this.formatBody(response.text));
        });
        return session;
    };
    LoggableHttpClient.prototype.formatBody = function (str) {
        if (str.length > 1000) {
            return str.substr(0, 1000) + "...";
        }
        else {
            return str;
        }
    };
    return LoggableHttpClient;
}(index_1.HttpClient));
exports.LoggableHttpClient = LoggableHttpClient;
//# sourceMappingURL=loggableHttpClient.js.map