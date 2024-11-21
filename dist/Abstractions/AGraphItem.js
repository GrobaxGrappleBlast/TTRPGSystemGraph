"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGraphItem = void 0;
const KeyManager_1 = require("./KeyManager");
var keyManager = new KeyManager_1.KeyManager();
class AGraphItem {
    constructor(name = '', key = '') {
        this.name = name;
        this._key = key + keyManager.getNewKey();
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getKey() {
        return this._key;
    }
}
exports.AGraphItem = AGraphItem;
