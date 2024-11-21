"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AFeature_BonusNodes = void 0;
var tslib_1 = require("tslib");
var _1 = require(".");
/**
 * Implements standard methods for Feature's With Bonuses to nodes
 */
var AFeature_BonusNodes = /** @class */ (function (_super) {
    tslib_1.__extends(AFeature_BonusNodes, _super);
    function AFeature_BonusNodes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bonusNodes = [];
        return _this;
    }
    AFeature_BonusNodes.prototype.registerNodeToSys = function (system, nodeStr) {
        if (!this.systemsNodechoices[system._key]) {
            this.systemsNodechoices[system._key] = [];
        }
        this.systemsNodechoices[system._key].push(nodeStr);
    };
    AFeature_BonusNodes.prototype.remove = function (sys) {
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
        // get the bonus collection.
        var collection = (sys.getCollection('extra', 'bonus'));
        if (!collection) {
            console.error("Could not find collection in group 'extra' by name of 'bonus'");
            return false;
        }
        // loop through all bonuses from this specifik feature. and remove them
        var l = this.bonusNodes.length;
        for (var i = 0; i < l; i++) {
            // get nodes from the bonus collection. 
            var node = this.bonusNodes[0]; // 0 because for each of these, the array becomes shorter
            collection === null || collection === void 0 ? void 0 : collection.removeNode(node);
        }
        // remove system from references 
        this.systems = this.systems.filter(function (p) { return p._key != sys._key; });
        delete this.systemsNodechoices[sys._key];
        return true;
    };
    /**
     * provides a dispose call that doesent call remove,
     * this method should be called from the node when disposed.
     */
    AFeature_BonusNodes.prototype.disposeNode_fromNode = function (node) {
        // remove the node reference from this feature
        var _n = this.bonusNodes.findIndex(function (p) { return p._key == node._key; });
        if (_n != -1) {
            this.bonusNodes = this.bonusNodes.filter(function (p) { return p._key != node._key; });
        }
    };
    AFeature_BonusNodes.prototype.dispose = function () {
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
    return AFeature_BonusNodes;
}(_1.Feature));
exports.AFeature_BonusNodes = AFeature_BonusNodes;
