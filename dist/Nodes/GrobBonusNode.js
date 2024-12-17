import { GrobDerivedNode } from "./GrobDerivedNode";
import { TTRPGSystemBonusDesigner } from "../Helpers/TTRPGSystemReplacementDesigner";
export class GrobBonusNode extends GrobDerivedNode {
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
        return TTRPGSystemBonusDesigner.createBonusNodeChain(sys, name);
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
