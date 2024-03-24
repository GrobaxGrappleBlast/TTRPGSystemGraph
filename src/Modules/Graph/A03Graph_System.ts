import { Collection } from "../Designer/Collection";
import { Group } from "../Designer/Group";
import type { IOutputHandler } from "../Designer/Abstractions/IOutputHandler";
import { Nodte, derivedNode, fixedNode, type NodeType } from "../Designer/Nodte";
import { type typeSystemKeys } from "./A01BaseAccess_System";
import { AHiarchy_system } from "./A02Hiarchy_system";

/**
 * Handles Graph Links 
 * asummes higher levels does not exists, and that errors cannot happen
 */
export abstract class AGraph_System extends AHiarchy_system {

	
	// this here is an access point for a single Nodes, Who it depends apon
	public dependencyGraph_outgoing : Record< string , Nodte<any>[] > = {}

	// this here is an access point for a single Nodes, Who depends on this
	public dependencyGraph_ingoing  : Record< string , Nodte<any>[] > = {}



	protected _deleteCollection(groupKey:typeSystemKeys , colKey:string, out: IOutputHandler )													{ 
		return super._deleteCollection	(groupKey , colKey , out )	
	}
	protected _updateCollection(groupKey:typeSystemKeys , colKey:string, col:Collection<any>, out: IOutputHandler )								{ 
		const update =  super._updateCollection	(groupKey , colKey , col , out );

		return	update;
	}
	protected _createCollection(groupKey:typeSystemKeys , colKey:string, out: IOutputHandler )													{ 
		const collection =  super._createCollection	(groupKey , colKey , out );
		return collection	
	}
	protected _createNode(groupKey: typeSystemKeys, colKey: string, nodeKey: string, out: IOutputHandler) {
		
		// create the node
		const key = groupKey +'.'+ colKey +'.'+ nodeKey ;
		let newNode = super._createNode (groupKey , colKey , nodeKey , out ) ;

		// this node is not dependent on anyone. 
		this.dependencyGraph_outgoing[key] = [];

		return newNode;
	}
	protected _updateNode(oldGroupKey: typeSystemKeys, oldCollectionKey: string, oldNodeKey: string, nodeobj: NodeType, out: IOutputHandler ) {
		
		const oldCombinedKey = oldGroupKey +'.'+ oldCollectionKey +'.'+ oldNodeKey ;
		const newCombinedKey = oldGroupKey +'.'+ oldCollectionKey +'.'+ nodeobj.name ;  
		let oldDeps_out = this.dependencyGraph_outgoing[ oldCombinedKey ]; 		 // who is this depending on
		let oldDeps_in	= this.dependencyGraph_ingoing [ oldCombinedKey ]; // who depents on this

		// Handle on object dependencies;
			// Outgoing
				// remove at dependent from all the old dependencies 
				for (let i = 0; i < oldDeps_out.length; i++) {
					const e = oldDeps_out[i];
					e.removeDependentByKey(oldCombinedKey);
				}
				  
				// add as dependent at all the new dependencies 
				for( const key in nodeobj.dependencies ){
					const dep = nodeobj.dependencies[key] as NodeType;
					dep.addDependent(nodeobj);
				} 

			// inGoing
				// remove replace all the old pointers to the new one.
				if(oldDeps_in)
				for (let i = 0; i < oldDeps_in.length; i++) {
					const e = oldDeps_in[i];
					e.removeDependencyByKey(oldCombinedKey);
					e.addDependency(nodeobj);
				}				 

		// handle record graph;
		delete this.dependencyGraph_outgoing[ oldCombinedKey ];
		delete this.dependencyGraph_ingoing [ oldCombinedKey ]; 
		this.dependencyGraph_outgoing[ newCombinedKey ] = Object.values(nodeobj.dependencies);
		this.dependencyGraph_ingoing [ newCombinedKey ] = oldDeps_in;

		return super._updateNode			(oldGroupKey , oldCollectionKey , oldNodeKey, nodeobj, out )	
	}
	protected _deleteNode(groupKey: typeSystemKeys, collectionKey: string, nodeKey: string, out: IOutputHandler ) 								{ return super._deleteNode			(groupKey , collectionKey , nodeKey ,out )	} 
}
