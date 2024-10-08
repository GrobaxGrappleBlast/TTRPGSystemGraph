import type { IGraphItem } from "./Abstractions/IGraphItem";
import type { IGrobCollection } from "./IGrobCollection";
import { IGrobNode } from "./Nodes/IGrobNode";
export interface IGrobGroup<T extends IGrobNode> extends IGraphItem {
    name: string;
    hasCollection(name: any): any;
    getCollection(name: any): any;
    addCollection(collection: IGrobCollection<T>): any;
    removeCollection(collection: IGrobCollection<T>): any;
    update_collection_name(oldName: any, newName: any): any;
    setName(name: string): any;
    dispose(): void;
}
