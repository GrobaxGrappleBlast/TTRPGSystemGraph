
export class KeyManager {
	private keyCounter = 12;	
	getNewKey(){
		let num = this.keyCounter++;
		return num.toString(16);
	}
}

export const keyManagerInstance = new KeyManager();