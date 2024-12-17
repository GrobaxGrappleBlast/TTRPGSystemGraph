import { KeyManager } from "./KeyManager";
var keyManager = new KeyManager();
export class AGraphItem {
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
