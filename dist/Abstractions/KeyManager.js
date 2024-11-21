"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyManagerInstance = exports.KeyManager = void 0;
class KeyManager {
    constructor() {
        this.keyCounter = 12;
    }
    getNewKey() {
        let num = this.keyCounter++;
        return num.toString(16);
    }
}
exports.KeyManager = KeyManager;
exports.keyManagerInstance = new KeyManager();
