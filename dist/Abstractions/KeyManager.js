export class KeyManager {
    constructor() {
        this.keyCounter = 12;
    }
    getNewKey() {
        let num = this.keyCounter++;
        return num.toString(16);
    }
}
export const keyManagerInstance = new KeyManager();
