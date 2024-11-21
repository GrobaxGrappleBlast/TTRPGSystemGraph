import { TTRPGSystem, GrobBonusNode } from "src";
import { AFeature_Multi, FeatureMultiArgs } from "./AFeature_Multi";
export declare class Feature_Choice extends AFeature_Multi {
    getType(): string;
    static getType(): string;
    maxChoices: number;
    apply(sys: TTRPGSystem, args: FeatureMultiArgs[]): boolean;
    disposeNode_fromNode(node: GrobBonusNode): void;
}
