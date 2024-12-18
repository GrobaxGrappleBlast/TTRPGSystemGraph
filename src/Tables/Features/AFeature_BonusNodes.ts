import { GrobBonusNode, TTRPGSystem } from "src";
import { Feature } from ".";

/**
 * Implements standard methods for Feature's With Bonuses to nodes
 */
export abstract class AFeature_BonusNodes extends Feature{
 
    public bonusNodes : GrobBonusNode[] = []; 

	protected registerNodeToSys( system:TTRPGSystem, nodeStr : string  ){
		if ( !this.systemsNodechoices[system._key] ){
			this.systemsNodechoices[system._key] = [];
		}
		this.systemsNodechoices[system._key].push(nodeStr);
	}

    public remove( sys : TTRPGSystem | null = null ) {
        
		// if there is no system supplied remove from all. 
		if ( !sys ){

			// loop through all and call this remove.
			var length = this.systems.length;
			for (let i = 0; i < length; i++) {
				const _sys = this.systems[0];
				this.remove(_sys );
			}
			return true;
		}


		// get the bonus collection.
		let collection = ( sys.getCollection('extra','bonus') );
		if(!collection){
			console.error("Could not find collection in group 'extra' by name of 'bonus'")
			return false;
		}

		// loop through all bonuses from this specifik feature. and remove them
		let l = this.bonusNodes.length;
        for (let i = 0; i < l; i++) {
			// get nodes from the bonus collection. 
			const node = this.bonusNodes[0]; // 0 because for each of these, the array becomes shorter
            collection?.removeNode(node);
		} 

		// remove system from references 
		this.systems = this.systems.filter( p => p._key != sys._key );
		delete this.systemsNodechoices[sys._key];


		return true
    }

    /**
     * provides a dispose call that doesent call remove, 
     * this method should be called from the node when disposed.
     */
    public disposeNode_fromNode( node:GrobBonusNode ){

        // remove the node reference from this feature
        const _n = this.bonusNodes.findIndex( p => p._key == node._key );
        if(_n != -1){
            this.bonusNodes = this.bonusNodes.filter(p=> p._key != node._key)
        }   
    }

	public async dispose(){

		for (let i = 0; i < this.systems.length; i++) {
			const sys = this.systems[i];
			this.remove(sys);
		}
		super.dispose();

	}
	
}