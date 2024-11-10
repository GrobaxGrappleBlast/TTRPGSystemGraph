import { GrobCollection } from "src";
import { GrobNodeType } from "src/Graph/TTRPGSystemsGraphDependencies";
import { IGrobNode } from "src/Nodes/IGrobNode";
export declare class Feature_OriginNode {
    symbol: string;
    origin: GrobNodeType | null;
    originKey: string;
}
export declare class Feature_OriginCollection {
    symbol: string;
    origin: GrobCollection<IGrobNode> | null;
    originKey: string;
}
