"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobBonusNode = void 0;
var tslib_1 = require("tslib");
var GrobDerivedNode_1 = require("./GrobDerivedNode");
var GrobBonusNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobBonusNode, _super);
    function GrobBonusNode(name, parent) {
        return _super.call(this, name, parent) || this;
    }
    GrobBonusNode.getTypeString = function () {
        return 'bonusNode';
    };
    GrobBonusNode.prototype.getTypeString = function () {
        return GrobBonusNode.getTypeString();
    };
    return GrobBonusNode;
}(GrobDerivedNode_1.GrobDerivedNode));
exports.GrobBonusNode = GrobBonusNode;
