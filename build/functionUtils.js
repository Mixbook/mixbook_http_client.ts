"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionUtils;
(function (FunctionUtils) {
    function throttle(fn, threshold) {
        var timer;
        var args;
        var defered = false;
        function throttleFn() {
            var _this = this;
            args = arguments;
            if (!timer) {
                fn.apply(this, args);
                timer = window.setTimeout(function () {
                    timer = 0;
                    if (defered) {
                        defered = false;
                        fn.apply(_this, args);
                    }
                }, threshold);
            }
            else {
                defered = true;
            }
        }
        return throttleFn;
    }
    FunctionUtils.throttle = throttle;
})(FunctionUtils = exports.FunctionUtils || (exports.FunctionUtils = {}));
//# sourceMappingURL=functionUtils.js.map