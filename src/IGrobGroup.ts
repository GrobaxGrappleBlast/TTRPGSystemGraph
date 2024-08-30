import type { IGraphItem } from "./Abstractions/IGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";
import type { IGrobCollection } from "./IGrobCollection";

export interface IGrobGroup<T extends GrobNodeType> extends IGraphItem {
	 
	name: string
	hasCollection(name) 
	getCollection(name) 
	addCollection(collection: IGrobCollection<T>) 
	removeCollection( collection : IGrobCollection<T> )
	update_collection_name(oldName,newName)
	setName( name )
	dispose () :void;

}

