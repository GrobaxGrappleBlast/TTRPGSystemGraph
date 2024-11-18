import { GrobCollection } from "../GrobCollection"; 
import { AGraphItem } from "../Abstractions/AGraphItem";  
import { GrobDerivedNode } from "./GrobDerivedNode"; 
import { GrobAlgorithms, TarjanAlgorithmLink } from "./algorithm/TarjanNode";
import { IGrobNode } from "./IGrobNode";
import { GrobNodeType } from "../";

 

export abstract class AGrobNode<T extends AGrobNode<T>> extends AGraphItem implements TarjanAlgorithmLink {

	constructor(name? , keystart? , parent? : GrobCollection<GrobNodeType> ) {  
		super(name, keystart) 
		if(parent)
			this.parent = parent;
	}
	
	// @ts-ignore
 	parent: GrobCollection<GrobNodeType>;

	public dependencies : Record<any,GrobNodeType> = {};
	public dependents	: Record<any,GrobNodeType> = {};
	public updateListeners = {};



	protected replacementsRec		: Record<string,GrobNodeType> = {}
	protected replacementsActive	: GrobNodeType | null = null
	protected _addReplacement( repl : GrobNodeType ){
		this.replacementsRec[repl._key] = repl;
		if ( !this.replacementsActive ){
			this.replacementsActive = repl;
		}
	}
	protected _remReplacement( key : string )		{

		// if the item does not exist, then just return
		const exists = !!this.replacementsRec[key];
		if(!exists)
			return false;

		// delete item, and if this is the active, nullify it.
		delete this.replacementsRec[key];
		if (this.replacementsActive?._key == key){
			this.replacementsActive = null;
		}

		// return if it exists, after a succesfull delete. 
		if( !this.replacementsRec[key] ){
			return true
		}
		return false;
		
	}
	protected _setActiveReplacement( key : string )	{

		// if we do not have this key return.
		if (!this.replacementsRec[key]){
			throw new Error('No Replacement with key ' + key );
		}

		// get and set active obj. 
		const obj = this.replacementsRec[key];
		this.replacementsActive = obj;
	}
	public addReplacement( repl : GrobNodeType )		{
		
		// update
		this._addReplacement(repl);
		
		// if this selected a new Active node, trigger update
		if (this.replacementsActive?._key == repl._key){
			this.update();
		}

	}
	public remReplacement( repl : GrobNodeType )		{
		this.remReplacementByKey(repl._key);
	}
	public remReplacementByKey( key : string )			{

		// remove node.
		const removedWasActiveNode = this.replacementsActive?._key == key;
		this._remReplacement(key);
		
		// if this removed the active node.
		if (this.replacementsActive == null){

			//rule, when removing a replacement take on of the next.
			const keys = Object.keys(this.replacementsRec);
			if ( keys.length != 0){
				this._setActiveReplacement(keys[0]);
			}
		}

		// update
		if (removedWasActiveNode){
			this.update();
		}
	}
	public activateReplacement( repl:GrobNodeType )		{
		
		// if this replacement is not in the list add it. 
		if (!this.replacementsRec[repl._key]){
			this.addReplacement(repl);
		}

		// activate by key;
		const key = repl._key;
		const hasChanged = this.replacementsActive?._key == key;
		this._setActiveReplacement(key);

		// if we have changed call update
		if (hasChanged){
			this.update();
		}
		
	}
	public activateReplacementByKey( key:string )		{

		// note if we have changed, and call activate.
		const hasChanged = this.replacementsActive?._key != key;
		this._setActiveReplacement(key);

		// if we have changed call update
		if (hasChanged){
			this.update();
		}
	}
	public getReplacements()							{
		return Object.values(this.replacementsRec);
	}
	public getReplacementNames()							{
		return Object.keys(this.replacementsRec);
	}


	public bonuses : Record<any,GrobNodeType> = {};
	public addBonus( bonusIndex:string , bonus : GrobDerivedNode, errors:{msg: string,key: string}[] = [] ){
		
		bonus.update();
		
		// first see if there is a circular dependency, if there already is dont do a thing. 
		let tarAlgoRequest = GrobAlgorithms.TarjAlgo( [this] );
		if (tarAlgoRequest[0]){
			errors.push({key:'Pre-AddBonusError',msg:'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused'});
			return false;
		}

		if(this.bonuses[bonusIndex]){
			this.remBonusIndex(bonusIndex);
		}
		this.bonuses[bonusIndex] = bonus;
		this.addDependency( bonus );
		

		// first see if there is a circular dependency, if there already is dont do a thing. 
		let StrongComps = GrobAlgorithms.TarjAlgo( [this] );
		if (StrongComps[0]){
			errors.push({key:'Pre-AddBonusError',msg:'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused'});
			this.remBonusIndex(bonusIndex); 
			return false;
		}

		this.update();
		return true;
	}
	public remBonus( bonus : GrobDerivedNode ){

		const indicies = this.hasBonus(bonus);
		if(!indicies)
			return false;

		for (let i in indicies) {
			const index = indicies[i];
			delete this.bonuses[index];
			
		}
		this.removeDependency( bonus );
		return true;

	}
	public hasBonus( bonus : GrobDerivedNode ){
		let keys : string []= [];
		for ( const key in this.bonuses ){
			const value = this.bonuses[key];
			if (value._key == bonus._key){
				keys.push(key);
			}
		}

		if (keys.length == 0)
			return null;
		return keys;
	}
	public remBonusIndex( bonusIndex:string ){

		if(!this.bonuses[bonusIndex])
			return true;

		const node : GrobDerivedNode= this.bonuses[bonusIndex] as GrobDerivedNode;
		this.removeDependency(node);
		delete this.bonuses[bonusIndex];
		
		if (!this.hasBonus(node)){
			this.removeDependency( node );
			return true;
		}
		return true;
		
	}
	public hasBonusIndex( key : string ){
		if (this.bonuses[key])
			return true;
		return false;
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


	public addDependency(node:GrobNodeType){
		const key = node.getKey()
		this.dependencies[key] = node; 

		node.addDependent(this as any);
		return true;
	}
	public removeDependency(node:GrobNodeType){
		 
		// delete the dependency
		const key = node.getKey()
		if(this.dependencies[key]){
			delete this.dependencies[key];
			node.removeDependent(this as any);
		}

		return this.dependencies[key] == null ;
	}
	public nullifyDependency( node:GrobNodeType ){
		return false;
	}

	public getDependencies(): GrobNodeType[] {
		//@ts-ignore
		return Object.values( this.dependencies ) as GrobNodeType[] ?? [];
	}
	public getValue() : number  {

		// get initial value
		var initialValue = this._getValue();

		// if this has an active replacement, 
		if ( this.replacementsActive ){
			initialValue = this.replacementsActive.getValue();
		}

		// add bonuses 
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
		
		// call implemented update
		this._update();

		// update all of update listeners. 
		( Object.keys(this.updateListeners) ).forEach( key => {
			this.updateListeners[key]();
		})

		// call all dependents and return success state.
		let success = true;
		for( const k in this.dependents ){
			const dep = this.dependents[k] as GrobDerivedNode;
			success = success && dep.update();
		} 
		return success;
		
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
	public setName( name , parentCall : boolean = false ){
		const oldname= this.getName();
		super.setName(name);
		if (!parentCall){
			this.parent.update_node_name(oldname,name); 
		}
		this.updateLocation(this.parent);
	} 


	/* by location we mean this items group - collection - node key.  */
	updateLocation( parent ){
		this.parent = parent;
		for(const key in this.dependents){
			const dep = this.dependents [key];
			dep.updateDependecysLocation(this)
		}
		this.update();
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

