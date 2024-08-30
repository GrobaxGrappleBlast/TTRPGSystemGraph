import type { IGraphItem } from "./Abstractions/IGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";  



export interface IGrobCollection<T extends GrobNodeType> extends IGraphItem {
	hasNode(name)
	getNode(name): T
	addNode(node: T)
	removeNode(node : T)
	update_node_name(oldName,newName) 
	setName( name ) 
	updateLocation( parent ) 
	dispose () 
}

   