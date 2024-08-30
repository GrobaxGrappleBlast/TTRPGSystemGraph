import type { IGraphItem } from "./Abstractions/IGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";
import type { IGrobCollection } from "./IGrobCollection";
export interface IGrobGroup<T extends GrobNodeType> extends IGraphItem {
    name: string;
    hasCollection(name: any): any;
    getCollection(name: any): any;
    addCollection(collection: IGrobCollection<T>): any;
    removeCollection(collection: IGrobCollection<T>): any;
    update_collection_name(oldName: any, newName: any): any;
    setName(name: any): any;
    dispose(): void;
}
