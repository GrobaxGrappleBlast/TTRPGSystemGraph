"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTRPGSystemBonusDesigner = void 0;
var GrobBonusNode_1 = require("../Nodes/GrobBonusNode");
var TTRPGSystemBonusDesigner = /** @class */ (function () {
    function TTRPGSystemBonusDesigner() {
    }
    TTRPGSystemBonusDesigner.createBonusNodeChain = function (sys, name) {
        var instance = new TTRPGSystemBonusDesigner();
        if (!sys.hasCollection('extra', 'bonus')) {
            sys.createCollection('extra', 'bonus');
        }
        var col = sys.getCollection('extra', 'bonus');
        // Create the Node.
        instance.activeNode = instance.createNewNode(name, col);
        return instance;
    };
    TTRPGSystemBonusDesigner.prototype.createNewNode = function (name, parent) {
        return new GrobBonusNode_1.GrobBonusNode(name, parent);
    };
    TTRPGSystemBonusDesigner.prototype.addCalculation = function (calc) {
        this.activeNode.setCalc(calc);
        return this;
    };
    TTRPGSystemBonusDesigner.prototype.addOrigin = function (symbol, node) {
        this.activeNode.setOrigin(symbol, node);
        return this;
    };
    TTRPGSystemBonusDesigner.prototype.update = function () {
        this.activeNode.updateOrigins();
        return this;
    };
    TTRPGSystemBonusDesigner.prototype.getNode = function () {
        return this.activeNode;
    };
    TTRPGSystemBonusDesigner.prototype.getOriginStates = function () {
        return this.activeNode.parseCalculationToOrigins(this.activeNode.calc);
    };
    TTRPGSystemBonusDesigner.prototype.isValidCalculation = function () {
        return this.activeNode.testCalculate(this.activeNode.calc);
    };
    TTRPGSystemBonusDesigner.prototype.isValid = function () {
        return this.activeNode.isValid();
    };
    return TTRPGSystemBonusDesigner;
}());
exports.TTRPGSystemBonusDesigner = TTRPGSystemBonusDesigner;
