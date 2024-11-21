import { GrobCollection } from "../GrobCollection";
import { GrobDerivedNode } from "./GrobDerivedNode";
import { TTRPGSystem } from "../";
import { FeatureSource } from "../Tables/Features";
import { TTRPGSystemBonusDesigner } from "../Helpers/TTRPGSystemReplacementDesigner";
export declare class GrobBonusNode extends GrobDerivedNode {
    constructor(name?: any, parent?: GrobCollection<GrobBonusNode>);
    featureSrc: FeatureSource;
    /**
     *
     * @param sys The System Where this bonus is applied to
     * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
     * @returns
     */
    static CreateNodeChain(sys: TTRPGSystem, name: string): TTRPGSystemBonusDesigner;
    static getTypeString(): string;
    getTypeString(): string;
    dispose(): void;
}
