import { AGraphItem } from "./Abstractions/AGraphItem";
import type { IGrobCollection } from "./IGrobCollection";
import type { IGrobGroup } from "./IGrobGroup";
import { IGrobNode } from "./Nodes/IGrobNode";
export declare class GrobCollection<T extends IGrobNode> extends AGraphItem implements IGrobCollection<T> {
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
    protected colType: 'Node' | 'Table' | null;
    getCollectionType(): "Node" | "Table" | null;
    setCollectionType(colType: 'Node' | 'Table'): void;
    updateListeners: {};
    private callUpdateListeners;
    addUpdateListener(key: any, listener: () => any): false | undefined;
    removeUpdateListener(key: any): void;
    removeAllUpdateListeners(): void;
}
export type GrobCollectionType = GrobCollection<IGrobNode>;
