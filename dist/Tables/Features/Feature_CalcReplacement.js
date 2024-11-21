"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature_CalcReplacement = void 0;
var tslib_1 = require("tslib");
var _1 = require(".");
var __1 = require("../..");
/**
 * apply X at a time to Y targets
 */
var Feature_CalcReplacement = /** @class */ (function (_super) {
    tslib_1.__extends(Feature_CalcReplacement, _super);
    function Feature_CalcReplacement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'Feature_calcReplacement';
        return _this;
    }
    Feature_CalcReplacement.prototype.getNodeFeatureName = function () {
        return this.name;
    };
    Feature_CalcReplacement.prototype.remove = function (sys) {
        var _this = this;
        if (sys === void 0) { sys = null; }
        // if there is no system supplied remove from all. 
        if (!sys) {
            // loop through all and call this remove.
            var length = this.systems.length;
            for (var i = 0; i < length; i++) {
                var _sys = this.systems[0];
                this.remove(_sys);
            }
            return true;
        }
        // fisrt if this system is not in the feature
        if (!this.systems.find(function (p) { return p._key == sys._key; })) {
            return false;
        }
        var selfKey = this._key;
        // get all the nodes in that system with this replacementfeatureon
        this.systemsNodechoices[sys._key].forEach(function (loc) {
            var _a, _b, _c;
            // Get the node and the node's replacement
            var node = sys.getNodeLocString(loc);
            var a = ((_a = node === null || node === void 0 ? void 0 : node.getReplacements()) !== null && _a !== void 0 ? _a : []);
            var b = a.map(function (p) { var _a, _b; return (_b = (_a = p['featureSrc']) === null || _a === void 0 ? void 0 : _a.feature) === null || _b === void 0 ? void 0 : _b._key; });
            var replacements = (_c = ((_b = node === null || node === void 0 ? void 0 : node.getReplacements()) !== null && _b !== void 0 ? _b : []).filter(function (p) { return p.featureSrc.feature._key == selfKey; })) !== null && _c !== void 0 ? _c : [];
            // remove the replacement
            for (var i = 0; i < replacements.length; i++) {
                var curr = replacements[i];
                node === null || node === void 0 ? void 0 : node.remReplacement(curr);
            }
            // clean up reference
            delete _this.systemsNodechoices[sys._key];
        });
        // remove system from systems
        this.systems = this.systems.filter(function (p) { return p._key != sys._key; });
        return true;
    };
    Feature_CalcReplacement.prototype.apply = function (sys, target) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // first get target , then add to list of systems and targets.
        var targetNode = sys.getNodeLocString(target);
        if (!targetNode) {
            throw new Error('Invalid Target string, must be a location string of a node');
        }
        // register the System and target
        this.systems.push(sys);
        if (!this.systemsNodechoices[sys._key])
            this.systemsNodechoices[sys._key] = [];
        this.systemsNodechoices[sys._key].push(target);
        // Create a new replacement node. 
        var chain = __1.GrobBonusNode
            .CreateNodeChain(sys, this.getNodeFeatureName())
            .addCalculation(this.calc)
            .addFeatureAsFeatureSrc(this);
        for (var i = 0; i < this.sources.length; i++) {
            // get the source node. 
            var src = this.sources[i];
            if (!src.symbol) {
                throw new Error('invalid src symbol provided :' + src.symbol + ' ; for ' + src.sourceString);
            }
            var nod = sys.getNodeLocString(src.sourceString);
            // if the node is missing
            if (!nod) {
                throw new Error('No Node at ' + src.sourceString);
            }
            // add the origin to the chain
            chain.addOrigin(src.symbol, nod);
        }
        // resulting node.
        var resNode = chain.getNode();
        resNode.update();
        targetNode.addReplacement(resNode);
        return true;
    };
    Feature_CalcReplacement.prototype.updateTo = function (feature, out) {
        return false;
    };
    Feature_CalcReplacement.prototype.disposeNode_fromNode = function (node) {
        throw new Error("Method not implemented.");
    };
    Feature_CalcReplacement.prototype.dispose = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var i, sys;
            return tslib_1.__generator(this, function (_a) {
                for (i = 0; i < this.systems.length; i++) {
                    sys = this.systems[i];
                    this.remove(sys);
                }
                _super.prototype.dispose.call(this);
                return [2 /*return*/];
            });
        });
    };
    return Feature_CalcReplacement;
}(_1.Feature));
exports.Feature_CalcReplacement = Feature_CalcReplacement;
