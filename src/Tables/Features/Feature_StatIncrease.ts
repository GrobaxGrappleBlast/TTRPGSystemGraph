import { newOutputHandler } from "../../../src/Abstractions/IOutputHandler";
import { Feature, Feature_BonusNodes, Feature_Origin_Collection, Feature_Origin_Node } from ".";
import { GrobBonusNode, GrobCollection, TTRPGSystem } from "../../../src";  
import { IOutputHandler } from '../../../src/Abstractions/IOutputHandler' ;

type IncreaseMethod =  'countDown' | 'apply' ;

 
/**
 * apply X at a time to Y targets 
 */
export class Feature_StatIncrease_apply extends Feature_BonusNodes {
	 
	
    public type = "Feature_StatIncrease_apply";
    public sourceItems		:Feature_Origin_Node[]			= [];
    public sourceCollections:Feature_Origin_Collection[]	= [];
    public increaseSize		: number;
    public increaseNumTargets: number;
    
    private validateTargets( targets : string[] ){
		let ownSrcStrings = this.sourceItems.map(p => p.sourceString);
		let ownSrcColStrings = this.sourceCollections.map(p => p.sourceString);
		
		targets.forEach( target => {

			if(ownSrcStrings.includes(target)){
				return;
			}

			let segs = target.split('.');
			if(ownSrcColStrings.includes( segs[0] + '.' + segs[1] )){
				return
			}

			throw new Error('Un-Allowed target string, string was not in source items , or belonged to any source collections ');
		});
	}
	/**
	 * 
	 * @param sys The system to apply this feature to. 
	 * @param targets The targets in that system to apply this feature to.
	 * @returns 
	 */
	
    public async apply (sys:TTRPGSystem , targets : string[] , ...args ) : Promise<boolean>{
		
		// ensure that the targets either are in its sourceItems or Collection
		this.validateTargets(targets);

		// get the bonus collection.
		let collection = ( sys.getCollection('extra','bonus') );
		if(!collection){
			sys.createCollection('extra','bonus');
			collection = ( sys.getCollection('extra','bonus') );
		}

		// add to list of systems register
		this.systems.push(sys);
		
		for (let i = 0; i < this.increaseNumTargets; i++) {
			
			// create the node.
			const node = GrobBonusNode.CreateNodeChain(sys,this.name + '_target_' + i,'bonus')
			.addCalculation( this.increaseSize + '' )
			.addFeatureAsFeatureSrc( this )
			.getNode();

			// Add the node to the collection
			collection?.addNode(node);
			this.bonusNodes.push(node)

			// get the target strings. 
			const target = targets[i];
			const segs = target.split('.');

			// handle wrong input 
			if(segs.length != 3){
				throw new Error('target of ' + target +' did not ahve three segments seperated by "."');
			}

			// get target
			const targetNode = sys.getNode(segs[0],segs[1],segs[2]);
			
			// Register the node 
			if (targetNode){
				this.registerNodeToSys(sys, target);
			}

			// Add bonus
			targetNode?.addBonus(node.name, node);
			
		}

		
		
		return true;
	}

	updateTo(feature: Feature_StatIncrease_apply , out: IOutputHandler) {
		
		// if trying to project a wrong type. 
		if(feature.type != this.type){
			throw new Error('Could not project feature of different type. ');
		}

		// Update this feature
		this.sourceItems		= feature.sourceItems	;
		this.sourceCollections	= feature.sourceCollections	;
		this.increaseSize		= feature.increaseSize	;
		this.increaseNumTargets	= feature.increaseNumTargets	;
		
		// get its targets , From the Feature
		for (let i = 0; i < this.systems.length; i++) {
	
			// get parameters 
			const sys = this.systems[i];
			const syskey = sys._key;
			const targets = this.systemsNodechoices[syskey];
	
			try {

				// first validate, this will throw Error if it doesent fit.
				this.validateTargets(targets)
			
				// if this is valid then its already added and need no update.

			} catch(e){

				// unapply feature on system.
				this.remove(sys);

				out.outError(`Character ${sys._key} has outdated feature ${this.name} unapplied, and must be reapplied, manually due to feature rules `);
			}
		}
		

	}
}