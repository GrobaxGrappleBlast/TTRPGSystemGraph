import { Feature, Feature_Origin_Node } from ".";
import { GrobBonusNode, TTRPGSystem } from "../..";
import { IOutputHandler } from '../../Abstractions/IOutputHandler';
/**
 * apply X at a time to Y targets
 */
export declare class Feature_CalcReplacement extends Feature {
    getType(): string;
    static getType(): string;
    calc: string;
    sources: Feature_Origin_Node[];
    protected getNodeFeatureName(): string;
    remove(sys?: TTRPGSystem | null): boolean;
    apply(sys: TTRPGSystem, target: string, ...args: any[]): boolean;
    updateTo(feature: Feature, out: IOutputHandler): boolean;
    disposeNode_fromNode(node: GrobBonusNode): void;
    dispose(): Promise<void>;
}
