import type { IGraphItem } from "./Abstractions/IGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";  
import { IGrobNode } from "./Nodes/IGrobNode";


export interface IGrobCollection<T extends IGrobNode > extends IGraphItem {
	hasNode(name)
	getNode(name): T
	addNode(node: T)
	removeNode(node : T)
	update_node_name(oldName,newName) 
	setName( name ) 
	updateLocation( parent ) 
	dispose () 
}

   