import { AGrobNode } from "./AGrobNodte";
import { GrobCollection } from "../GrobCollection";
import { type GrobNodeType } from "../Graph/TTRPGSystemsGraphDependencies";
import { GrobOrigin } from "./GrobOrigin";
export declare class GrobDerivedNode extends AGrobNode<GrobDerivedNode> {
    constructor(name?: any, parent?: GrobCollection<GrobDerivedNode>);
    calc: string;
    origins: GrobOrigin[];
    protected _value: number;
    _getValue(): number;
    setValue(value: number): void;
    static getTypeString(): string;
    getTypeString(): string;
    addDependency(node: GrobNodeType): boolean;
    removeDependency(node: GrobNodeType): boolean;
    nullifyDependency(node: GrobNodeType): boolean;
    setOrigin(symbol: any, node: GrobNodeType, standardValue?: number | null): boolean;
    isValid(): boolean;
    updateOrigins(): {
        added: string[];
        removed: number;
    } | {
        added: number;
        removed: number;
    };
    setCalc(calc: any, updateOrigins?: boolean): boolean;
    /**
     * Parses calculation To a Number of Origins.
     * @returns
     */
    parseCalculationToOrigins(calc: string): {
        symbolsToRem: string[];
        symbolsToAdd: string[];
        totalSymbols: string[];
    } | null;
    static staticParseCalculationToOrigins(calc: string): string[];
    recalculate(useTempValues?: boolean): boolean;
    protected _recalculate(rec: Record<string, number> | undefined, statement: any): {
        success: boolean;
        value: number;
    };
    protected static recalculate(rec: Record<string, number> | undefined, statement: any): {
        success: boolean;
        value: number;
    };
    testCalculate(statement: any): {
        success: boolean;
        value: number;
    };
    static testCalculate(statement: string, symbolsToValue?: Record<string, number>): {
        success: boolean;
        value: number;
    };
    _update(): boolean;
    updateDependecysLocation(dependency: any): void;
}
