import { FeatureSource } from "../Tables/Features";
import { GrobBonusNode } from "../Nodes/GrobBonusNode";
export class TTRPGSystemBonusDesigner {
    /**
     *
     * @param sys The System Where this bonus is applied to
     * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
     * @returns
     */
    static createBonusNodeChain(sys, name, colectionName = 'bonus') {
        const instance = new TTRPGSystemBonusDesigner();
        if (!sys.hasCollection('extra', colectionName)) {
            sys.createCollection('extra', colectionName);
        }
        const col = sys.getCollection('extra', colectionName);
        // Create the Node.
        instance.activeNode = instance.createNewNode(name, col);
        return instance;
    }
    createNewNode(name, parent) {
        return new GrobBonusNode(name, parent);
    }
    /**
     *
     * @param calc A calulation string
     * @returns
     */
    addCalculation(calc) {
        this.activeNode.setCalc(calc);
        return this;
    }
    addFeatureSrc(feature) {
        this.activeNode.featureSrc = feature;
        return this;
    }
    addFeatureAsFeatureSrc(feature) {
        this.activeNode.featureSrc = new FeatureSource();
        this.activeNode.featureSrc.name = feature.name;
        this.activeNode.featureSrc.source = feature.source;
        this.activeNode.featureSrc.feature = feature;
        return this;
    }
    addOrigin(symbol, node) {
        this.activeNode.setOrigin(symbol, node);
        return this;
    }
    update() {
        this.activeNode.updateOrigins();
        return this;
    }
    getNode() {
        return this.activeNode;
    }
    getOriginStates() {
        return this.activeNode.parseCalculationToOrigins(this.activeNode.calc);
    }
    isValidCalculation() {
        return this.activeNode.testCalculate(this.activeNode.calc);
    }
    isValid() {
        return this.activeNode.isValid();
    }
}
