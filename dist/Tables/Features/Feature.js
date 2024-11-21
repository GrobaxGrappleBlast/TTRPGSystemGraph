"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = exports.FeatureSource = void 0;
var tslib_1 = require("tslib");
var src_1 = require("../../../src");
var FeatureSource = /** @class */ (function () {
    function FeatureSource() {
        this.feature = null;
    }
    return FeatureSource;
}());
exports.FeatureSource = FeatureSource;
var Feature = /** @class */ (function () {
    function Feature() {
        this.type = this.getType();
        this._key = src_1.keyManagerInstance.getNewKey();
        this.systems = [];
        this.systemsNodechoices = {};
    }
    Feature.prototype.getType = function () {
        return 'Feature';
    };
    ;
    Feature.prototype.dispose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * get a structure that explains where this feature is applied.
     * @returns { sys:string , nodes : GrobNodeType[] }[]
     */
    Feature.prototype.getAppliancesStructure = function () {
        var objs = [];
        for (var i = 0; i < this.systems.length; i++) {
            var sys = this.systems[i];
            var obj = {};
            obj['sys'] = sys;
            obj['nodes'] = this.systemsNodechoices[sys._key];
            objs.push(obj);
        }
        return objs;
    };
    return Feature;
}());
exports.Feature = Feature;
