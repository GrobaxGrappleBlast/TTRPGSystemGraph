"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = exports.FeatureSource = void 0;
const tslib_1 = require("tslib");
//import { GrobBonusNode, GrobNodeType, keyManagerInstance, TTRPGSystem } from "../../../src/index";
const KeyManager_1 = require("../../Abstractions/KeyManager");
class FeatureSource {
    constructor() {
        this.feature = null;
    }
}
exports.FeatureSource = FeatureSource;
class Feature {
    constructor() {
        this.type = this.getType();
        this._key = KeyManager_1.keyManagerInstance.getNewKey();
        this.systems = [];
        this.systemsNodechoices = {};
    }
    getType() {
        return 'Feature';
    }
    ;
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
exports.Feature = Feature;
