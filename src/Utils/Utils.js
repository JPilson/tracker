"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.generateUId = function () {
        var date = new Date();
        return "" + date.getMilliseconds() + date.getHours() + date.getSeconds() + date.getMonth() + date.getTime();
    };
    return Utils;
}());
exports.default = Utils;
