"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.prototype.get = function (url, headers) {
        return this.send({ url: url, method: "GET", headers: headers }).promise;
    };
    HttpClient.prototype.post = function (url, body, headers) {
        return this.send({ url: url, method: "POST", body: body, headers: headers }).promise;
    };
    HttpClient.prototype.put = function (url, body, headers) {
        return this.send({ url: url, method: "PUT", body: body, headers: headers }).promise;
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
//# sourceMappingURL=httpClient.js.map