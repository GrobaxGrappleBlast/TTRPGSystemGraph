import { GrobCollection, TTRPGSystem } from "../../src";
import { GrobBonusNode } from "../../src/Nodes/GrobBonusNode";
export declare class TTRPGSystemBonusDesigner {
    static createBonusNodeChain(sys: TTRPGSystem, name: string): TTRPGSystemBonusDesigner;
    protected activeNode: GrobBonusNode;
    protected createNewNode<T extends GrobBonusNode>(name: any, parent: GrobCollection<T>): GrobBonusNode;
    addCalculation(calc: string): this;
    addOrigin(symbol: string, node: GrobBonusNode): this;
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
