import { __awaiter } from "tslib";
//import { GrobBonusNode, GrobNodeType, keyManagerInstance, TTRPGSystem } from "../../../src/index";
import { keyManagerInstance } from '../../Abstractions/KeyManager';
export class FeatureSource {
    constructor() {
        this.feature = null;
    }
}
export class Feature {
    constructor() {
        this.type = this.getType();
        this._key = keyManagerInstance.getNewKey();
        this.systems = [];
        this.systemsNodechoices = {};
    }
    getType() {
        return 'Feature';
    }
    ;
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * get a structure that explains where this feature is applied.
     * @returns { sys:string , nodes : GrobNodeType[] }[]
     */
    getAppliancesStructure() {
        var objs = [];
        for (let i = 0; i < this.systems.length; i++) {
            const sys = this.systems[i];
            var obj = {};
            obj['sys'] = sys;
            obj['nodes'] = this.systemsNodechoices[sys._key];
            objs.push(obj);
        }
        return objs;
    }
}
