import { GrobCollection } from "../GrobCollection"; 
import { AGraphItem } from "../Abstractions/AGraphItem";  
import { GrobDerivedNode } from "./GrobDerivedNode"; 
import { GrobAlgorithms, TarjanAlgorithmLink } from "./algorithm/TarjanNode";
import { IGrobNode } from "./IGrobNode";
import { GrobNodeType } from "src";

 

export abstract class AGrobNode<T extends AGrobNode<T>> extends AGraphItem implements TarjanAlgorithmLink {

	constructor(name? , keystart? , parent? : GrobCollection<GrobNodeType> ) {  
		super(name, keystart) 
		if(parent)
			this.parent = parent;
	}
	
	// @ts-ignore
 	parent: GrobCollection<GrobNodeType>;

	public dependencies :Record<any,GrobNodeType> = {};
	public dependents : Record<any,GrobNodeType> = {};

	public updateListeners = {};

	
	public bonuses : Record<any,GrobNodeType> = {};
	public addBonus( bonusIndex:string , bonus : GrobDerivedNode, errors:{msg: string,key: string}[] = [] ){
		
		bonus.update();
		
		// first see if there is a circular dependency, if there already is dont do a thing. 
		let preStrongComponents = {};
		let alreadyHadStrongComps = GrobAlgorithms.TarjAlgo( [this] , preStrongComponents );
		if (alreadyHadStrongComps[0]){
			errors.push({key:'Pre-AddBonusError',msg:'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused'});
			return false;
		}

		if(this.bonuses[bonusIndex]){
			this.remBonus(bonusIndex);
		}
		this.bonuses[bonusIndex] = bonus;
		this.addDependency( bonus );
		

		// first see if there is a circular dependency, if there already is dont do a thing. 
		let StrongComponents = {};
		let StrongComps = GrobAlgorithms.TarjAlgo( [this] , StrongComponents );
		if (StrongComps[0]){
			errors.push({key:'Pre-AddBonusError',msg:'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused'});
			this.remBonus(bonusIndex); 
			return false;
		}
		return true;
	}
	public remBonus( bonusIndex:string ){

		if(!this.bonuses[bonusIndex])
			return true;

		const node = this.bonuses[bonusIndex];
		delete this.bonuses[bonusIndex];
		this.removeDependency( node );
		return true;
	}

	public static getTypeString(): string{
		return 'Nodte<T extends Nodte<T>>';
	}
	public addDependent(node: GrobNodeType ) : boolean {
		const key = node.getKey();

		if(this.dependents[key]){
			return true;
		}

		this.dependents[key] = node;
		return true;
	} 
	public removeDependent(node:GrobNodeType) : boolean{
		delete this.dependents[node.getKey()];
		return this.dependents[node.getKey()] == null;
	}
	public getDependents(): GrobNodeType[] {
		//@ts-ignore
		return Object.values( this.dependents ) as GrobNodeType[] ?? [];
	}

	public addDependency( node:GrobNodeType) : boolean 		{
		return false;
	}
	public removeDependency( node:GrobNodeType)  : boolean 	{
		return false;
	}
	public nullifyDependency( node:GrobNodeType ): boolean 	{
		return false;
	}

	public getDependencies(): GrobNodeType[] {
		//@ts-ignore
		return Object.values( this.dependencies ) as GrobNodeType[] ?? [];
	}

	public getValue() : number  {

		var initialValue = this._getValue();
		for(const key in this.bonuses){
			const bonus = this.bonuses[key];
			const value = bonus._getValue();
			initialValue += value;
		}
		return initialValue;
	}
	abstract _getValue() : number  



	public getLocationKey(){
		let segs = this.getLocationKeySegments();
		return segs.join('.');
	}
	public getLocationKeySegments() : string [] {
		let seg : string[] = ['','',''];
		seg[0] = this.parent?.parent?.getName() ?? 'unknown';
		seg[1] = this.parent?.getName () ?? 'unknown';
		seg[2] = this.getName() ?? 'unknown';
		return seg;
	}
	public update( ){
		this._update();
		( Object.keys(this.updateListeners) ).forEach( key => {
			this.updateListeners[key]();
		})
		return true;
	}
	abstract _update(); 
	dispose () {
		// delete references all 
		for(const key in this.dependencies){
			const curr = this.dependencies[key]
			curr.removeDependent(this as any)
		}
		
		for(const key in this.dependents){
			const curr = this.dependents[key]
			curr.nullifyDependency(this as any)
		}

		//@ts-ignore
		this.parent = null;
		//@ts-ignore
		this.name = null;

	}
	public setName( name ){
		const oldname= this.getName();
		super.setName(name);
		this.parent.update_node_name(oldname,name); 
		this.updateLocation(this.parent);
	} 


	/* by location we mean this items group - collection - node key.  */
	updateLocation( parent ){
		this.parent = parent;
		for(const key in this.dependents){
			const dep = this.dependents [key];
			dep.updateDependecysLocation(this)
		}
	}
	public updateDependecysLocation( dependency ){

	}
	public isValid(  ){
		return true;
	}

	// --- --- --- --- --- --- --- --- --- --- --- --- ---
	// -For independent UI implementation's to have soemthing to attach a node's update to. 
	// --- --- --- --- --- --- --- --- --- --- --- --- ---
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


	// --- --- --- --- --- --- --- --- --- --- --- --- ---
	// --- Tarjan Algorithm Implementation --- --- --- ---
	// --- --- --- --- --- --- --- --- --- --- --- --- ---
	public tarjanAlgorithmAlgorithmIndex = 0;
	public LowLinkValue = 0;
	public linkValue = 0;

}

