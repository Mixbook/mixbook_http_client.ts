"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var functionUtils_1 = require("../functionUtils");
var stream_1 = require("../stream");
var browserResponse_1 = require("./browserResponse");
// TODO: Write specs
/* istanbul ignore next */
var BrowserHttpClientSession = /** @class */ (function () {
    function BrowserHttpClientSession() {
        this.onUploadProgress = new stream_1.Stream();
        this.onDownloadProgress = new stream_1.Stream();
        this._xhr = new XMLHttpRequest();
        this.onUploadProgress = new stream_1.Stream();
        this.onDownloadProgress = new stream_1.Stream();
    }
    Object.defineProperty(BrowserHttpClientSession.prototype, "promise", {
        get: function () {
            // TODO: Revise it, try avoid using !
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    BrowserHttpClientSession.prototype.start = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._promise = new Promise(function (resolve, reject) {
                    _this._xhr.upload.onprogress = functionUtils_1.FunctionUtils.throttle(function (e) { return _this.onUploadProgress.push(e); }, 1000);
                    _this._xhr.onprogress = functionUtils_1.FunctionUtils.throttle(function (e) { return _this.onDownloadProgress.push(e); }, 1000);
                    _this._xhr.onerror = function () { return reject(new Error("Failed request to " + request.url.toString())); };
                    _this._xhr.ontimeout = function () { return reject(new Error("Request to " + request.url.toString() + " timed out")); };
                    _this._xhr.onload = function () {
                        resolve(new browserResponse_1.BrowserResponse(_this._xhr));
                    };
                    _this._xhr.open(request.method, request.url.toString());
                    if (request.timeout != null) {
                        _this._xhr.timeout = request.timeout;
                    }
                    var headers = request.headers || {};
                    if (headers.accept === "application/msgpack") {
                        _this._xhr.responseType = "blob";
                    }
                    for (var _i = 0, _a = Object.getOwnPropertyNames(headers); _i < _a.length; _i++) {
                        var headerName = _a[_i];
                        _this._xhr.setRequestHeader(headerName, headers[headerName]);
                    }
                    var body;
                    if (request.body != null) {
                        if (typeof request.body === "string") {
                            body = request.body;
                        }
                        else {
                            body = new FormData();
                            for (var _b = 0, _c = Object.getOwnPropertyNames(request.body); _b < _c.length; _b++) {
                                var name_1 = _c[_b];
                                body.append(name_1, request.body[name_1]);
                            }
                        }
                    }
                    _this._xhr.send(body);
                });
                return [2 /*return*/];
            });
        });
    };
    BrowserHttpClientSession.prototype.abort = function () {
        return this._xhr.abort();
    };
    return BrowserHttpClientSession;
}());
exports.BrowserHttpClientSession = BrowserHttpClientSession;
//# sourceMappingURL=browserHttpClientSession.js.map