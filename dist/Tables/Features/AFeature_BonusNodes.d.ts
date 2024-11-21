import { GrobBonusNode, TTRPGSystem } from "src";
import { Feature } from ".";
/**
 * Implements standard methods for Feature's With Bonuses to nodes
 */
export declare abstract class AFeature_BonusNodes extends Feature {
    bonusNodes: GrobBonusNode[];
    protected registerNodeToSys(system: TTRPGSystem, nodeStr: string): void;
    remove(sys?: TTRPGSystem | null): boolean;
    /**
     * provides a dispose call that doesent call remove,
     * this method should be called from the node when disposed.
     */
    disposeNode_fromNode(node: GrobBonusNode): void;
    dispose(): Promise<void>;
}
