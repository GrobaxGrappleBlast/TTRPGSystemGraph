"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTRPGSystemBonusDesigner = void 0;
var Features_1 = require("../Tables/Features");
var GrobBonusNode_1 = require("../Nodes/GrobBonusNode");
var TTRPGSystemBonusDesigner = /** @class */ (function () {
    function TTRPGSystemBonusDesigner() {
    }
    /**
     *
     * @param sys The System Where this bonus is applied to
     * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
     * @returns
     */
    TTRPGSystemBonusDesigner.createBonusNodeChain = function (sys, name, colectionName) {
        if (colectionName === void 0) { colectionName = 'bonus'; }
        var instance = new TTRPGSystemBonusDesigner();
        if (!sys.hasCollection('extra', colectionName)) {
            sys.createCollection('extra', colectionName);
        }
        var col = sys.getCollection('extra', colectionName);
        // Create the Node.
        instance.activeNode = instance.createNewNode(name, col);
        return instance;
    };
    TTRPGSystemBonusDesigner.prototype.createNewNode = function (name, parent) {
        return new GrobBonusNode_1.GrobBonusNode(name, parent);
    };
    /**
     *
     * @param calc A calulation string
     * @returns
     */
    TTRPGSystemBonusDesigner.prototype.addCalculation = function (calc) {
        this.activeNode.setCalc(calc);
        return this;
    };
    TTRPGSystemBonusDesigner.prototype.addFeatureSrc = function (feature) {
        this.activeNode.featureSrc = feature;
        return this;
    };
    TTRPGSystemBonusDesigner.prototype.addFeatureAsFeatureSrc = function (feature) {
        this.activeNode.featureSrc = new Features_1.FeatureSource();
        this.activeNode.featureSrc.name = feature.name;
        this.activeNode.featureSrc.source = feature.source;
        this.activeNode.featureSrc.feature = feature;
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
