import { AGraphItem } from "./Abstractions/AGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";
import type { IGrobCollection } from "./IGrobCollection";
import type { IGrobGroup } from "./IGrobGroup";
export declare class GrobCollection<T extends GrobNodeType> extends AGraphItem implements IGrobCollection<T> {
    constructor(name?: any, parent?: IGrobGroup<T>);
    nodes_names: Record<string, T>;
    parent: IGrobGroup<T>;
    getNodeNames(): string[];
    getNodes(): T[];
    hasNode(name: any): boolean;
    getNode(name: any): T;
    addNode(node: T): boolean;
    removeNode(node: T): boolean;
    update_node_name(oldName: any, newName: any): void;
    setName(name: any): void;
    updateLocation(parent: any): void;
    dispose(): void;
}
export type GrobCollectionType = GrobCollection<GrobNodeType>;