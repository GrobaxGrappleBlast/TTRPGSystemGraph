import type { IGraphItem } from "./Abstractions/IGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";  
import { IGrobGroup } from "./IGrobGroup";
import { IGrobNode } from "./Nodes/IGrobNode";


export interface IGrobCollection<T extends IGrobNode > extends IGraphItem {
	parent: IGrobGroup<IGrobNode>
	hasNode(name)
	getNode(name): T
	addNode(node: T)
	removeNode(node : T)
	update_node_name(oldName,newName) 
	setName( name ) 
	updateLocation( parent ) 
	dispose () 
}

   