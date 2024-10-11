import { AGraphItem } from "./Abstractions/AGraphItem";
import { GrobCollection } from "./GrobCollection";
import type { IGrobGroup } from "./IGrobGroup";
import { IGrobNode } from "./Nodes/IGrobNode";
export type GrobGroupType = GrobGroup<IGrobNode>;
export declare class GrobGroup<T extends IGrobNode> extends AGraphItem implements IGrobGroup<T> {
    constructor(name?: any, parent?: any);
    collections_names: Record<string, GrobCollection<T>>;
    getCollectionsNames(): string[];
    hasCollection(name: any): boolean;
    getCollection(name: any): GrobCollection<T>;
    addCollection(collection: GrobCollection<T>): boolean;
    removeCollection(collection: GrobCollection<T>): boolean;
    update_collection_name(oldName: any, newName: any): void;
    setName(name: any): void;
    dispose(): void;
    protected groupType: 'Node' | 'Table';
    getGroupType(): "Node" | "Table";
    setGroupType(groupType: 'Node' | 'Table'): void;
    updateListeners: {};
    private callUpdateListeners;
    addUpdateListener(key: any, listener: () => any): false | undefined;
    removeUpdateListener(key: any): void;
    removeAllUpdateListeners(): void;
}
