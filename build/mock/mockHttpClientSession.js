"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("../stream");
var MockHttpClientSession = /** @class */ (function () {
    function MockHttpClientSession(request, response) {
        this.onUploadProgress = new stream_1.Stream();
        this.onDownloadProgress = new stream_1.Stream();
        this.onUploadProgress = new stream_1.Stream();
        this.onDownloadProgress = new stream_1.Stream();
        this.promise = Promise.resolve(response);
        this.onUploadProgress.push({ loaded: 100, total: 100 });
        this.onDownloadProgress.push({ loaded: 100, total: 100 });
    }
    /* istanbul ignore next */
    MockHttpClientSession.prototype.abort = function () {
        // Nothing to do here
    };
    return MockHttpClientSession;
}());
exports.MockHttpClientSession = MockHttpClientSession;
//# sourceMappingURL=mockHttpClientSession.js.map