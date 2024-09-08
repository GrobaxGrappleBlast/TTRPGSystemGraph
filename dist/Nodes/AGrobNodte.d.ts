import { GrobCollection } from "../GrobCollection";
import { AGraphItem } from "../Abstractions/AGraphItem";
import type { GrobNodeType } from "../Graph/TTRPGSystemsGraphDependencies";
import { GrobDerivedNode } from "./GrobDerivedNode";
export declare abstract class AGrobNode<T extends AGrobNode<T>> extends AGraphItem {
    constructor(name?: any, keystart?: any, parent?: GrobCollection<GrobNodeType>);
    parent: GrobCollection<GrobNodeType>;
    dependencies: Record<any, GrobNodeType>;
    dependents: Record<any, GrobNodeType>;
    updateListeners: {};
    addBonus(sourceKey: string, bonus: GrobDerivedNode): void;
    remBonus(sourceKey: string): void;
    static getTypeString(): string;
    addDependent(node: GrobNodeType): boolean;
    removeDependent(node: GrobNodeType): boolean;
    getDependents(): GrobNodeType[];
    addDependency(node: GrobNodeType): boolean;
    removeDependency(node: GrobNodeType): boolean;
    nullifyDependency(node: GrobNodeType): boolean;
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
