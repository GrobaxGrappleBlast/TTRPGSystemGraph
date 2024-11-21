"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobBonusNode = void 0;
var tslib_1 = require("tslib");
var GrobDerivedNode_1 = require("./GrobDerivedNode");
var TTRPGSystemReplacementDesigner_1 = require("../../src/Helpers/TTRPGSystemReplacementDesigner");
var GrobBonusNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobBonusNode, _super);
    function GrobBonusNode(name, parent) {
        return _super.call(this, name, parent) || this;
    }
    /**
     *
     * @param sys The System Where this bonus is applied to
     * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
     * @returns
     */
    GrobBonusNode.CreateNodeChain = function (sys, name) {
        return TTRPGSystemReplacementDesigner_1.TTRPGSystemBonusDesigner.createBonusNodeChain(sys, name);
    };
    GrobBonusNode.getTypeString = function () {
        return 'bonusNode';
    };
    GrobBonusNode.prototype.getTypeString = function () {
        return GrobBonusNode.getTypeString();
    };
    GrobBonusNode.prototype.dispose = function () {
        for (var key in this.dependents) {
            var node = this.dependents[key];
            node.remBonus(this);
        }
        if (this.featureSrc && this.featureSrc.feature) {
            this.featureSrc.feature.disposeNode_fromNode(this);
        }
        _super.prototype.dispose.call(this);
    };
    return GrobBonusNode;
}(GrobDerivedNode_1.GrobDerivedNode));
exports.GrobBonusNode = GrobBonusNode;
