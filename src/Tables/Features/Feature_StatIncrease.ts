import { Feature, Feature_BonusNodes, Feature_Origin_Collection, Feature_Origin_Node } from ".";
import { GrobBonusNode, GrobCollection, TTRPGSystem } from "../../../src";  
 
type IncreaseMethod =  'countDown' | 'apply' ;

 
/**
 * apply X at a time to Y targets 
 */
export class Feature_StatIncrease_apply extends Feature_BonusNodes {
    public type = "Feature_StatIncrease";
    public sourceItems		:Feature_Origin_Node[]			= [];
    public sourceCollections:Feature_Origin_Collection[]	= [];
    public increaseSize		: number;
    public increaseNumTargets: number;
    
    
	/**
	 * 
	 * @param sys The system to apply this feature to. 
	 * @param targets The targets in that system to apply this feature to.
	 * @returns 
	 */
    public apply ( sys : TTRPGSystem , targets : string[] ) {
		
		// ensure that the targets either are in its sourceItems or Collection
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

		// get the bonus collection.
		let collection = ( sys.getCollection('extra','bonus') );
		if(!collection){
			sys.createCollection('extra','bonus');
			collection = ( sys.getCollection('extra','bonus') );
		}
		
		for (let i = 0; i < this.increaseNumTargets; i++) {
			
			// create the node.
			const node = GrobBonusNode.CreateNodeChain(sys,this.name + '_target_' + i)
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
			
			// Add bonus
			targetNode?.addBonus(node.name, node);
			
		}

		return true;
	}
}