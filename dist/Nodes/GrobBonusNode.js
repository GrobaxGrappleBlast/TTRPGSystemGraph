"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobBonusNode = void 0;
var tslib_1 = require("tslib");
var GrobDerivedNode_1 = require("./GrobDerivedNode");
var TTRPGSystemBonusDesigner_1 = require("../Helpers/TTRPGSystemBonusDesigner");
var GrobBonusNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobBonusNode, _super);
    function GrobBonusNode(name, parent) {
        return _super.call(this, name, parent) || this;
    }
    GrobBonusNode.CreateNodeChain = function (sys, name) {
        return TTRPGSystemBonusDesigner_1.TTRPGSystemBonusDesigner.createBonusNodeChain(sys, name);
    };
    GrobBonusNode.getTypeString = function () {
        return 'bonusNode';
    };
    GrobBonusNode.prototype.getTypeString = function () {
        return GrobBonusNode.getTypeString();
    };
    return GrobBonusNode;
}(GrobDerivedNode_1.GrobDerivedNode));
exports.GrobBonusNode = GrobBonusNode;
