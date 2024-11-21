import { GrobBonusNode, GrobNodeType, TTRPGSystem } from "../../../src";
import { IOutputHandler } from '../../../src/Abstractions/IOutputHandler';
export declare class FeatureSource {
    name: string;
    source: string;
    feature: Feature | null;
}
export declare abstract class Feature {
    abstract type: string;
    name: string;
    source: string;
    text: string;
    _key: string;
    protected systems: TTRPGSystem[];
    protected systemsNodechoices: Record<string, string[]>;
    dispose(): Promise<void>;
    /**
     * get a structure that explains where this feature is applied.
     * @returns { sys:string , nodes : GrobNodeType[] }[]
     */
    getAppliancesStructure(): {
        sys: string;
        nodes: GrobNodeType[];
    }[];
    /**
     *
     * When reloaded we want to reload a feature with the reloaded data.
     * @param feature The reloaded feature
     * @param out  outputhandler
     * @returns true if it managed to update. false if not.
     */
    abstract updateTo(feature: Feature, out: IOutputHandler): boolean;
    abstract remove(sys?: TTRPGSystem | null): boolean;
    abstract apply(sys: TTRPGSystem, ...args: any[]): boolean;
    abstract disposeNode_fromNode(node: GrobBonusNode): any;
}
