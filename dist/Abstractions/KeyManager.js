"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyManagerInstance = exports.KeyManager = void 0;
var KeyManager = /** @class */ (function () {
    function KeyManager() {
        this.keyCounter = 12;
    }
    KeyManager.prototype.getNewKey = function () {
        var num = this.keyCounter++;
        return num.toString(16);
    };
    return KeyManager;
}());
exports.KeyManager = KeyManager;
exports.keyManagerInstance = new KeyManager();
