import { GrobBonusNode, TTRPGSystem } from "src";
import {Mutex} from 'async-mutex';

export class FeatureSource {
    public name     :string;
    public source   :string;
    public feature  :Feature_BonusNodes | null = null; 
}   

export abstract class Feature {
    public abstract type: string;
    public name     :string;
    public source   :string;
    public text     :string;
}


/**
 * Implements standard methods for Feature's With Bonuses to nodes
 */
export abstract class Feature_BonusNodes extends Feature{
 
    public bonusNodes : GrobBonusNode[] = [];
    private mutex : Mutex = new Mutex();

    public async remove( sys : TTRPGSystem ) {
        
        // await all clear
        const release = await this.mutex.acquire();

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

		// now all the bonus' instance from this feature ought be gone
        release();
		return true
    }

    /**
     * provides a dispose call that doesent call remove, 
     * this method should be called from the node when disposed.
     */
    public disposeNode_fromNode( node:GrobBonusNode ){

        // remove the node reference from this feature
        const _n = this.bonusNodes.findIndex( p => p._key == node._key );
        let test = [... this.bonusNodes];
        
        if(_n != -1){
            this.bonusNodes = this.bonusNodes.filter(p=> p._key != node._key)
        }   
    }
}