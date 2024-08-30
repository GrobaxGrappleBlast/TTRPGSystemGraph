import { GrobCollection } from "./GrobCollection";
import { AGraphItem } from "./Abstractions/AGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";
export declare class GrobDerivedOrigin {
    static UnkownLocationKey: string;
    symbol: string;
    standardValue: number;
    origin: GrobNodeType | null;
    originKey: string;
}
export declare abstract class GrobNode<T extends GrobNode<T>> extends AGraphItem {
    constructor(name?: any, keystart?: any, parent?: GrobCollection<GrobNodeType>);
    parent: GrobCollection<GrobNodeType>;
    dependencies: Record<any, GrobNodeType>;
    dependents: Record<any, GrobNodeType>;
    updateListeners: {};
    static getTypeString(): string;
    addDependent(node: GrobNodeType): boolean;
    removeDependent(node: GrobNodeType): boolean;
    getDependents(): GrobNodeType[];
    abstract addDependency(node: GrobNodeType): boolean;
    abstract removeDependency(node: GrobNodeType): boolean;
    abstract nullifyDependency(node: GrobNodeType): boolean;
    getDependencies(): GrobNodeType[];
    abstract getValue(): number;
    getLocationKey(): string;
    getLocationKeySegments(): string[];
    update(): boolean;
    abstract _update(): any;
    dispose(): void;
    setName(name: any): void;
    updateLocation(parent: any): void;
    updateDependecysLocation(dependency: any): void;
    isValid(): boolean;
    addUpdateListener(key: any, listener: () => any): false | undefined;
    removeUpdateListener(key: any): void;
    removeAllUpdateListeners(): void;
}
export declare class GrobFixedNode extends GrobNode<GrobFixedNode> {
    constructor(name: any, parent?: GrobCollection<GrobFixedNode>);
    ___value: number;
    getValue(): number;
    setValue(value: number): void;
    static getTypeString(): string;
    getTypeString(): string;
    addDependency(node: GrobNodeType): boolean;
    removeDependency(node: GrobNodeType): boolean;
    nullifyDependency(node: GrobNodeType): boolean;
    _update(): void;
}
export declare class GrobDerivedNode extends GrobNode<GrobDerivedNode> {
    constructor(name?: any, parent?: GrobCollection<GrobDerivedNode>);
    calc: string;
    origins: GrobDerivedOrigin[];
    private _value;
    getValue(): number;
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
    private _recalculate;
    private static recalculate;
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
