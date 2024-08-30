"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGraphItem = void 0;
var KeyManager_1 = require("./KeyManager");
var keyManager = new KeyManager_1.KeyManager();
var AGraphItem = /** @class */ (function () {
    function AGraphItem(name, key) {
        if (name === void 0) { name = ''; }
        if (key === void 0) { key = ''; }
        this.name = name;
        this._key = key + keyManager.getNewKey();
    }
    AGraphItem.prototype.getName = function () {
        return this.name;
    };
    AGraphItem.prototype.setName = function (name) {
        this.name = name;
    };
    AGraphItem.prototype.getKey = function () {
        return this._key;
    };
    return AGraphItem;
}());
exports.AGraphItem = AGraphItem;
