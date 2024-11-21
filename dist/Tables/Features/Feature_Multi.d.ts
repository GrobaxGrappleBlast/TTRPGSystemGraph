import { TTRPGSystem, GrobBonusNode } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";
import { AFeature_Multi, FeatureMultiArgs } from "./AFeature_Multi";
export declare class Feature_Multi extends AFeature_Multi {
    type: string;
    updateTo(feature: Feature, out: IOutputHandler): boolean;
    apply(sys: TTRPGSystem, args: FeatureMultiArgs[]): boolean;
    disposeNode_fromNode(node: GrobBonusNode): void;
}
