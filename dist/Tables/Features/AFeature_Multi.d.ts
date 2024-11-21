import { TTRPGSystem } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";
export type FeatureMultiArgs = {
    featureName: string;
    args: any;
};
export declare abstract class AFeature_Multi extends Feature {
    features: Feature[];
    /**
     * Maps the system keys to Feature keys.
     * Such that a system can remember its choices independently of other systems
     */
    protected appliedChoices: Record<string, string[]>;
    /**
     * Maps the feature keys to system
     * reversed off applied choices
    */
    protected appliedChoices_r: Record<string, string[]>;
    protected _removeFeatureFromAppliedRecord(o_choice: Feature): void;
    protected _addFeatureFromAppliedRecord(sys: TTRPGSystem, o_choice: Feature): void;
    updateTo(feature: Feature, out: IOutputHandler): boolean;
    remove(sys?: TTRPGSystem | null): boolean;
}
