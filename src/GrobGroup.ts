import { AGraphItem } from "./Abstractions/AGraphItem"; 
import { GrobCollection } from "./GrobCollection"; 
//import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies"; 
import type { IGrobGroup } from "./IGrobGroup";
import { IGrobNode } from "./Nodes/IGrobNode";

export type GrobGroupType = GrobGroup<IGrobNode>;
export class GrobGroup<T extends IGrobNode > extends AGraphItem implements IGrobGroup<T>{
	 
	constructor(name? , parent? : any ) { 
		super(name,'G' ) 
	}
    
	collections_names: Record<string, GrobCollection<T>> = {};
	 
	public getCollectionsNames(){
		return Object.keys(this.collections_names);
	}
	public hasCollection(name) {
		return this.collections_names[name] ? true : false;
	}
	public getCollection(name) {
		return this.collections_names[name];
	}
	public addCollection(collection: GrobCollection<T>) {
		collection.parent = this;
		this.collections_names[collection.getName()] = collection;
		collection.setCollectionType(this.groupType);
		this.callUpdateListeners();
		return true;
	}  
	public removeCollection( collection : GrobCollection<T> ){  
		const name = collection.getName();
		let c = this.collections_names[name];
		if(!c)
			return false;

		collection.dispose();
		delete this.collections_names[name]; 
		this.callUpdateListeners();
		return this.collections_names[name] == null;
	}
	public update_collection_name(oldName,newName){ 

		if (!this.collections_names[oldName])
			return;

		this.collections_names[newName] = this.collections_names[oldName] ;
		delete this.collections_names[oldName] ;
		this.collections_names[newName].setName(newName);

	}
	
	public setName( name ){
		super.setName(name);
		for(const name in this.collections_names){
			const curr = this.collections_names[name];
			curr.updateLocation( this );
		}
		this.callUpdateListeners();
	} 
	
	dispose () {
		for( const name in this.collections_names ){
			const curr = this.collections_names[name]; 
			curr.dispose(); 
			delete this.collections_names[name];
		}

		//@ts-ignore
		this.name = null;
	}

	protected groupType : 'Node'|'Table';
	public getGroupType(){
		return this.groupType;
	}
	public setGroupType(  groupType : 'Node'|'Table' ){
		if ( this.groupType != null && groupType != groupType){
			throw new Error('tried to convert a group type after Setting. Denied Action');
			return;
		}
		this.groupType = groupType;
		
		Object.values(this.collections_names).forEach( col => {
			col.setCollectionType(groupType);
		});
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


