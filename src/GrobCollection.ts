import { AGraphItem } from "./Abstractions/AGraphItem"; 
//import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";  
import type { IGrobCollection } from "./IGrobCollection";
import type { IGrobGroup } from "./IGrobGroup"; 
import { IGrobNode } from "./Nodes/IGrobNode";



export class GrobCollection<T extends IGrobNode > extends AGraphItem implements IGrobCollection<T> {
	
	constructor(name? ,parent? : IGrobGroup<T> ) {
		super(name, 'C')
	} 
	
	nodes_names: Record<string, T> = {}
	parent: IGrobGroup<T>; 


	public getNodeNames(){
		return Object.keys( this.nodes_names );
	}
	public getNodes(){
		return Object.values( this.nodes_names );
	}

	public hasNode(name) {
		return this.nodes_names[name] ? true : false;
	}
	public getNode(name): T  {
		return this.nodes_names[name] ?? null ;
	}
	public addNode(node: T) {
		//@ts-ignore
		node.parent = this;
		this.nodes_names[node.getName()] = node; 
		return true;
	}  
	public removeNode(node : T){

		if(!node)
		{
			console.error('attempted to delete node "Null" ');
			return false
		}

		const name = node.getName(); 
		let n = this.nodes_names[name];
		if(!n)
			return false;

		n.dispose();

		delete this.nodes_names[name]; 
		return this.nodes_names[name] == null;
	}
	public update_node_name(oldName,newName){

		if (oldName == newName){
			return;
		}

		if (!this.nodes_names[oldName]){
			return;
		}

		
		this.nodes_names[oldName].setName(newName , true );
		this.nodes_names[newName] = this.nodes_names[oldName] ;
		delete this.nodes_names[oldName] ; 

		
		
	}

	public setName( name ){
		
		const oldname= this.getName();
		if(oldname == name){
			return;
		}
		
		super.setName(name);
		this.parent.update_collection_name(oldname,name); 
		this.updateLocation(this.parent);
	} 
	updateLocation( parent ){
		this.parent = parent;
		for(const name in this.nodes_names){
			const curr = this.nodes_names[name];
			curr.updateLocation( this );
		}

		this.getNodes().forEach( node => {
			node.update();
		});
		this.callUpdateListeners();
	}
	dispose () {
		
		for( const name in this.nodes_names ){
			const curr = this.nodes_names[name]; 
			curr.dispose(); 
			delete this.nodes_names[name];
		}

		// @ts-ignore
		this.parent = null; 
		//@ts-ignore
		this.name = null;
		
	} 

	protected colType : 'Node'|'Table'|null;
	public getCollectionType(){
		return this.colType;
	}
	public setCollectionType(  colType : 'Node'|'Table' ){
		if ( this.colType != null && colType != colType){
			throw new Error('tried to convert a group type after Setting. Denied Action');
			return;
		}
		this.colType = colType;
	}

	public update(){
		this.callUpdateListeners();
	}


	public updateListeners = {};
	private callUpdateListeners(){
		( Object.keys(this.updateListeners) ).forEach( key => {
			this.updateListeners[key]();
		})
		return true;
	}
	addUpdateListener( key , listener : () => any ){
		if (this.updateListeners[key] != undefined){
			console.error('tried to add updatelistener to node with key:' + key + '. but there was already a listener using that key');
			return false;
		}

		this.updateListeners[key] = listener;

	}
	removeUpdateListener( key ){
		delete this.updateListeners[key];
	}
	removeAllUpdateListeners(){
		this.updateListeners = {}
	}
}

  
export type GrobCollectionType = GrobCollection<IGrobNode>;

