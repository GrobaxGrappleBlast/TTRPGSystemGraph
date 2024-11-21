import { IOutputHandler } from '../../Abstractions/IOutputHandler';
import { GrobNodeType } from '../../Graph/TTRPGSystemsGraphDependencies';
import { GrobBonusNode } from '../../Nodes/GrobBonusNode';
import { TTRPGSystemFeatureIndex } from '../../Graph/TTRPGSystemFeatureIndex';
export declare class FeatureSource {
    name: string;
    source: string;
    feature: Feature | null;
}
export declare abstract class Feature {
    getType(): string;
    type: string;
    name: string;
    source: string;
    text: string;
    _key: string;
    protected systems: TTRPGSystemFeatureIndex[];
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
    abstract remove(sys?: TTRPGSystemFeatureIndex | null): boolean;
    abstract apply(sys: TTRPGSystemFeatureIndex, ...args: any[]): boolean;
    abstract disposeNode_fromNode(node: GrobBonusNode): any;
}
