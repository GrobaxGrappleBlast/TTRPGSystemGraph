import { AGraphItem } from "./Abstractions/AGraphItem";
import { GrobCollection } from "./GrobCollection";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";
import type { IGrobGroup } from "./IGrobGroup";
export type GrobGroupType = GrobGroup<GrobNodeType>;
export declare class GrobGroup<T extends GrobNodeType> extends AGraphItem implements IGrobGroup<T> {
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
}
