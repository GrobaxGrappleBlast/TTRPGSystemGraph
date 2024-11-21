import { Feature_Origin_Collection, Feature_Origin_Node } from ".";
import { TTRPGSystem } from "../../../src";
import { IOutputHandler } from '../../../src/Abstractions/IOutputHandler';
import { AFeature_BonusNodes } from "./AFeature_BonusNodes";
/**
 * apply X at a time to Y targets
 */
export declare class Feature_StatIncrease_apply extends AFeature_BonusNodes {
    getType(): string;
    static getType(): string;
    sourceItems: Feature_Origin_Node[];
    sourceCollections: Feature_Origin_Collection[];
    increaseSize: number;
    increaseNumTargets: number;
    private validateTargets;
    /**
     *
     * @param sys The system to apply this feature to.
     * @param targets The targets in that system to apply this feature to.
     * @returns
     */
    apply(sys: TTRPGSystem, targets: string[], ...args: any[]): boolean;
    updateTo(feature: Feature_StatIncrease_apply, out: IOutputHandler): boolean;
}
