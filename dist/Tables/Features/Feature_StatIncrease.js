"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature_StatIncrease_apply = void 0;
var tslib_1 = require("tslib");
var index_1 = require("../../../src/index");
var AFeature_BonusNodes_1 = require("./AFeature_BonusNodes");
/**
 * apply X at a time to Y targets
 */
var Feature_StatIncrease_apply = /** @class */ (function (_super) {
    tslib_1.__extends(Feature_StatIncrease_apply, _super);
    function Feature_StatIncrease_apply() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //public type = "Feature_StatIncrease_apply";
        _this.sourceItems = [];
        _this.sourceCollections = [];
        return _this;
    }
    Feature_StatIncrease_apply.prototype.getType = function () {
        return Feature_StatIncrease_apply.getType();
    };
    Feature_StatIncrease_apply.getType = function () {
        return 'Feature_StatIncrease_apply';
    };
    Feature_StatIncrease_apply.prototype.validateTargets = function (targets) {
        var ownSrcStrings = this.sourceItems.map(function (p) { return p.sourceString; });
        var ownSrcColStrings = this.sourceCollections.map(function (p) { return p.sourceString; });
        targets.forEach(function (target) {
            if (ownSrcStrings.includes(target)) {
                return;
            }
            var segs = target.split('.');
            if (ownSrcColStrings.includes(segs[0] + '.' + segs[1])) {
                return;
            }
            throw new Error('Un-Allowed target string, string was not in source items , or belonged to any source collections ');
        });
    };
    /**
     *
     * @param sys The system to apply this feature to.
     * @param targets The targets in that system to apply this feature to.
     * @returns
     */
    Feature_StatIncrease_apply.prototype.apply = function (sys, targets) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (targets.length != this.increaseNumTargets) {
            console.error('Different number of targets provided than increase numtargets');
        }
        // ensure that the targets either are in its sourceItems or Collection
        this.validateTargets(targets);
        // get the bonus collection.
        var collection = (sys.getCollection('extra', 'bonus'));
        if (!collection) {
            sys.createCollection('extra', 'bonus');
            collection = (sys.getCollection('extra', 'bonus'));
        }
        // add to list of systems register
        this.systems.push(sys);
        for (var i = 0; i < this.increaseNumTargets; i++) {
            // create the node.
            var node = index_1.GrobBonusNode.CreateNodeChain(sys, this.name + '_target_' + i)
                .addCalculation(this.increaseSize + '')
                .addFeatureAsFeatureSrc(this)
                .getNode();
            // Add the node to the collection
            collection === null || collection === void 0 ? void 0 : collection.addNode(node);
            this.bonusNodes.push(node);
            // get the target strings. 
            var target = targets[i];
            var segs = target.split('.');
            // handle wrong input 
            if (segs.length != 3) {
                throw new Error('target of ' + target + ' did not ahve three segments seperated by "."');
            }
            // get target
            var targetNode = sys.getNode(segs[0], segs[1], segs[2]);
            // Register the node 
            if (targetNode) {
                this.registerNodeToSys(sys, target);
            }
            // Add bonus
            targetNode === null || targetNode === void 0 ? void 0 : targetNode.addBonus(node.name, node);
        }
        return true;
    };
    Feature_StatIncrease_apply.prototype.updateTo = function (feature, out) {
        // if trying to project a wrong type. 
        if (feature.type != this.type) {
            return false;
        }
        // Update this feature
        this.sourceItems = feature.sourceItems;
        this.sourceCollections = feature.sourceCollections;
        this.increaseSize = feature.increaseSize;
        this.increaseNumTargets = feature.increaseNumTargets;
        // get its targets , From the Feature
        for (var i = 0; i < this.systems.length; i++) {
            // get parameters 
            var sys = this.systems[i];
            var syskey = sys._key;
            var targets = this.systemsNodechoices[syskey];
            try {
                // first validate, this will throw Error if it doesent fit.
                this.validateTargets(targets);
                // if this is valid then its already added and need no update.
            }
            catch (e) {
                // unapply feature on system.
                this.remove(sys);
                out.outError("Character ".concat(sys._key, " has outdated feature ").concat(this.name, " unapplied, and must be reapplied, manually due to feature rules "));
            }
        }
        return true;
    };
    return Feature_StatIncrease_apply;
}(AFeature_BonusNodes_1.AFeature_BonusNodes));
exports.Feature_StatIncrease_apply = Feature_StatIncrease_apply;
