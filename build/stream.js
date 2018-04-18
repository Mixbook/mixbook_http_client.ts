"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stream = /** @class */ (function () {
    function Stream(initial) {
        this._current = initial;
        this._subscriptions = [];
    }
    Stream.merge = function () {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        var mergedStream = new Stream();
        var mergedStreamHandler = function (value) { return mergedStream.push(value); };
        streams.forEach(function (stream) {
            stream.listen(mergedStreamHandler).start();
        });
        return mergedStream;
    };
    Object.defineProperty(Stream.prototype, "current", {
        get: function () {
            return this._current;
        },
        enumerable: true,
        configurable: true
    });
    Stream.prototype.listen = function (handler, autoStart) {
        var _this = this;
        if (autoStart === void 0) { autoStart = false; }
        var isSubscribed = false;
        var subscription = {
            start: function () {
                if (!isSubscribed) {
                    isSubscribed = true;
                    _this._subscriptions.push(handler);
                    return true;
                }
                return false;
            },
            stop: function () {
                if (isSubscribed) {
                    isSubscribed = false;
                    var index = _this._subscriptions.indexOf(handler);
                    if (index !== -1) {
                        _this._subscriptions.splice(index, 1);
                    }
                    return true;
                }
                return false;
            },
        };
        autoStart && subscription.start();
        return subscription;
    };
    Stream.prototype.push = function (value) {
        this._current = value;
        this._subscriptions.forEach(function (subscription) { return subscription(value); });
    };
    return Stream;
}());
exports.Stream = Stream;
//# sourceMappingURL=stream.js.map