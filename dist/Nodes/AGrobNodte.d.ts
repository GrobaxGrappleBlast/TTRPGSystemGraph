import { GrobCollection } from "../GrobCollection";
import { AGraphItem } from "../Abstractions/AGraphItem";
import { GrobDerivedNode } from "./GrobDerivedNode";
import { TarjanAlgorithmLink } from "./algorithm/TarjanNode";
import { GrobNodeType } from "../";
export declare abstract class AGrobNode<T extends AGrobNode<T>> extends AGraphItem implements TarjanAlgorithmLink {
    constructor(name?: any, keystart?: any, parent?: GrobCollection<GrobNodeType>);
    parent: GrobCollection<GrobNodeType>;
    dependencies: Record<any, GrobNodeType>;
    dependents: Record<any, GrobNodeType>;
    updateListeners: {};
    protected replacementsRec: Record<string, GrobNodeType>;
    protected replacementsActive: GrobNodeType | null;
    protected _addReplacement(repl: GrobNodeType): void;
    protected _remReplacement(key: string): boolean;
    protected _setActiveReplacement(key: string): void;
    addReplacement(repl: GrobNodeType): void;
    remReplacement(repl: GrobNodeType): void;
    remReplacementByKey(key: string): void;
    activateReplacement(repl: GrobNodeType): void;
    activateReplacementByKey(key: string): void;
    getReplacements(): GrobNodeType[];
    getReplacementNames(): string[];
    bonuses: Record<any, GrobNodeType>;
    addBonus(bonusIndex: string, bonus: GrobDerivedNode, errors?: {
        msg: string;
        key: string;
    }[]): boolean;
    remBonus(bonus: GrobDerivedNode): boolean;
    hasBonus(bonus: GrobDerivedNode): string[] | null;
    remBonusIndex(bonusIndex: string): boolean;
    hasBonusIndex(key: string): boolean;
    static getTypeString(): string;
    addDependent(node: GrobNodeType): boolean;
    removeDependent(node: GrobNodeType): boolean;
    getDependents(): GrobNodeType[];
    addDependency(node: GrobNodeType): boolean;
    removeDependency(node: GrobNodeType): boolean;
    nullifyDependency(node: GrobNodeType): boolean;
    getDependencies(): GrobNodeType[];
    getValue(): number;
    abstract _getValue(): number;
    getLocationKey(): string;
    getLocationKeySegments(): string[];
    update(): any;
    abstract _update(): any;
    dispose(): void;
    setName(name: any, parentCall?: boolean): void;
    updateLocation(parent: any): void;
    updateDependecysLocation(dependency: any): void;
    isValid(): boolean;
    addUpdateListener(key: any, listener: () => any): false | undefined;
    removeUpdateListener(key: any): void;
    removeAllUpdateListeners(): void;
    tarjanAlgorithmAlgorithmIndex: number;
    LowLinkValue: number;
    linkValue: number;
}
