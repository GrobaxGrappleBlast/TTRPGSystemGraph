import { GrobBonusNode, keyManagerInstance, TTRPGSystem } from "../../../src";
import {Mutex} from 'async-mutex';
import { IOutputHandler } from '../../../src/Abstractions/IOutputHandler' ;



export class FeatureSource {
    public name     :string;
    public source   :string;
    public feature  :Feature | null = null; 
	
}   

export abstract class Feature {
    public abstract type: string;
    public name     :string;
    public source   :string;
    public text     :string;
	public _key : string = keyManagerInstance.getNewKey();
	
	protected systems: TTRPGSystem[] = [];
	protected systemsNodechoices : Record<string,string[]> = {}

	public async dispose(){
	
	}

	/**
	 * 
	 * When reloaded we want to reload a feature with the reloaded data. 
	 * @param feature The reloaded feature
	 * @param out  outputhandler
	 */
	abstract updateTo ( feature : Feature , out: IOutputHandler);

	abstract remove(sys:TTRPGSystem | null) : boolean;

	abstract apply(sys:TTRPGSystem , ...args ) : boolean;

	abstract disposeNode_fromNode( node:GrobBonusNode )
}


/**
 * Implements standard methods for Feature's With Bonuses to nodes
 */
export abstract class Feature_BonusNodes extends Feature{
 
    public bonusNodes : GrobBonusNode[] = []; 
    private lock : boolean = false;

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

        // set the lock
		this.lock = true;

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


		// now all the bonus' instance from this feature ought be gone
        this.lock = false;
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