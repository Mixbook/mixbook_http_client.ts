"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var stream_1 = require("../stream");
var RetryableHttpClientSession = /** @class */ (function () {
    function RetryableHttpClientSession(request, client, retryCondition, delaysInMilliseconds) {
        this._sessions = [];
        this.onUploadProgress = new stream_1.Stream();
        this.onDownloadProgress = new stream_1.Stream();
        this._request = request;
        this._client = client;
        this._retryCondition = retryCondition;
        this._delaysInMilliseconds = delaysInMilliseconds;
    }
    RetryableHttpClientSession.prototype.start = function () {
        var _this = this;
        this._promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.attemptRequest(1)
                    .then(resolve)
                    .catch(reject);
                return [2 /*return*/];
            });
        }); });
    };
    Object.defineProperty(RetryableHttpClientSession.prototype, "promise", {
        get: function () {
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    /* istanbul ignore next */
    RetryableHttpClientSession.prototype.abort = function () {
        for (var _i = 0, _a = this._sessions; _i < _a.length; _i++) {
            var session = _a[_i];
            session.abort();
        }
        if (this._timeoutId != null) {
            clearTimeout(this._timeoutId);
        }
    };
    RetryableHttpClientSession.prototype.addSession = function (session) {
        var _this = this;
        this._sessions.push(session);
        session.onDownloadProgress.listen(function (v) { return _this.onDownloadProgress.push(v); }, true);
        session.onUploadProgress.listen(function (v) { return _this.onUploadProgress.push(v); }, true);
    };
    RetryableHttpClientSession.prototype.attemptRequest = function (retryCount) {
        return __awaiter(this, void 0, void 0, function () {
            var session, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = this._client.send(__assign({}, this._request));
                        this.addSession(session);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, session.promise];
                    case 2:
                        response = _a.sent();
                        if (this._retryCondition(this._request, response, undefined, retryCount)) {
                            return [2 /*return*/, this.handleRetry(retryCount)];
                        }
                        else {
                            return [2 /*return*/, response];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        /* istanbul ignore next */
                        if (this._retryCondition(this._request, undefined, e_1, retryCount)) {
                            return [2 /*return*/, this.handleRetry(retryCount)];
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RetryableHttpClientSession.prototype.handleRetry = function (retryCount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var delay = _this._delaysInMilliseconds[retryCount - 1] || _this._delaysInMilliseconds[_this._delaysInMilliseconds.length - 1];
            _this._timeoutId = setTimeout(function () {
                _this._timeoutId = undefined;
                resolve(_this.attemptRequest(retryCount + 1));
            }, delay);
        });
    };
    return RetryableHttpClientSession;
}());
exports.RetryableHttpClientSession = RetryableHttpClientSession;
//# sourceMappingURL=retryableHttpClientSession.js.map