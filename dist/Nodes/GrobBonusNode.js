"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobBonusNode = void 0;
const GrobDerivedNode_1 = require("./GrobDerivedNode");
const TTRPGSystemReplacementDesigner_1 = require("../Helpers/TTRPGSystemReplacementDesigner");
class GrobBonusNode extends GrobDerivedNode_1.GrobDerivedNode {
    constructor(name, parent) {
        super(name, parent);
    }
    /**
     *
     * @param sys The System Where this bonus is applied to
     * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
     * @returns
     */
    static CreateNodeChain(sys, name) {
        return TTRPGSystemReplacementDesigner_1.TTRPGSystemBonusDesigner.createBonusNodeChain(sys, name);
    }
    static getTypeString() {
        return 'bonusNode';
    }
    getTypeString() {
        return GrobBonusNode.getTypeString();
    }
    dispose() {
        for (const key in this.dependents) {
            const node = this.dependents[key];
            node.remBonus(this);
        }
        if (this.featureSrc && this.featureSrc.feature) {
            this.featureSrc.feature.disposeNode_fromNode(this);
        }
        super.dispose();
    }
}
exports.GrobBonusNode = GrobBonusNode;
