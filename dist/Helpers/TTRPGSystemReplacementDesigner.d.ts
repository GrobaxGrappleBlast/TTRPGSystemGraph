import { Feature, FeatureSource } from "../Tables/Features";
import { GrobCollection, GrobNodeType, TTRPGSystem } from "..";
import { GrobBonusNode } from "../Nodes/GrobBonusNode";
export declare class TTRPGSystemBonusDesigner {
    /**
     *
     * @param sys The System Where this bonus is applied to
     * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
     * @returns
     */
    static createBonusNodeChain(sys: TTRPGSystem, name: string, colectionName?: string): TTRPGSystemBonusDesigner;
    protected activeNode: GrobBonusNode;
    protected createNewNode<T extends GrobBonusNode>(name: any, parent: GrobCollection<T>): GrobBonusNode;
    /**
     *
     * @param calc A calulation string
     * @returns
     */
    addCalculation(calc: string): this;
    addFeatureSrc(feature: FeatureSource): this;
    addFeatureAsFeatureSrc(feature: Feature): this;
    addOrigin(symbol: string, node: GrobNodeType): this;
    update(): this;
    getNode(): GrobBonusNode;
    getOriginStates(): {
        symbolsToRem: string[];
        symbolsToAdd: string[];
        totalSymbols: string[];
    } | null;
    isValidCalculation(): {
        success: boolean;
        value: number;
    };
    isValid(): boolean;
}
