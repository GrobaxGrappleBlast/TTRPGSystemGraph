import { newOutputHandler } from "../../Abstractions/IOutputHandler";
import { Feature, Feature_Origin_Collection, Feature_Origin_Node, Feature_StatIncrease_apply } from ".";
import { GrobBonusNode, GrobCollection, GrobNodeType, TTRPGSystem } from "../..";  
import { IOutputHandler } from '../../Abstractions/IOutputHandler' ;
import { GrobOrigin } from "../../Nodes/GrobOrigin";
import { AGrobNode } from "src/Nodes/AGrobNodte";
import { GrobNode } from "src/Nodes/algorithm/TarjanNode";

interface CalcOriginSrc {
	symbol: string; 
	origin: string; 
}

/**
 * apply X at a time to Y targets 
 */
export class Feature_CalcReplacement extends Feature {
	
	
	public getType(): string {
		return Feature_CalcReplacement.getType();
	}
	public static getType(): string {
		return 'Feature_calcReplacement';
	}
	//public type: string = 'Feature_calcReplacement';
	public calc:string;
	public sources : Feature_Origin_Node[];

	protected getNodeFeatureName(){
		return this.name;
	}
	remove(sys: TTRPGSystem | null = null ): boolean {
		
		// if there is no system supplied remove from all. 
		if ( !sys ){

			// loop through all and call this remove.
			var length = this.systems.length;
			for (let i = 0; i < length; i++) {
				const _sys = this.systems[0];
				this.remove(_sys);
			}
			return true;
		}


		// fisrt if this system is not in the feature
		if (!this.systems.find( p => p._key == sys._key )){
			return false;
		}

		let selfKey = this._key;

		// get all the nodes in that system with this replacementfeatureon
		this.systemsNodechoices[sys._key].forEach( (loc) => {
			
			// Get the node and the node's replacement
			const node = sys.getNodeLocString(loc);
			var a = (node?.getReplacements() ?? [] );
			var b = a.map( p => p['featureSrc']?.feature?._key );
			var replacements = (node?.getReplacements() ?? [] ).filter( p => (( p as GrobBonusNode ).featureSrc.feature as Feature)._key == selfKey ) ?? [];
		
			// remove the replacement
			for (let i = 0; i < replacements.length; i++) {
				const curr = replacements[i];
				node?.remReplacement(curr);
			}

			// clean up reference
			delete this.systemsNodechoices[sys._key];

		});

		// remove system from systems
		this.systems = this.systems.filter( p => p._key != sys._key);

		return true;

	}
	apply(sys: TTRPGSystem , target : string , ...args ): boolean {
		
		// first get target , then add to list of systems and targets.
		const targetNode = sys.getNodeLocString(target);
		if(!targetNode){ throw new Error('Invalid Target string, must be a location string of a node') }
		
		// register the System and target
		this.systems.push(sys);
		if(!this.systemsNodechoices[sys._key])
			this.systemsNodechoices[sys._key] = [];
		this.systemsNodechoices[sys._key].push(target);
		
		// Create a new replacement node. 
		var chain = GrobBonusNode
		.CreateNodeChain(sys,this.getNodeFeatureName())
		.addCalculation(this.calc)
		.addFeatureAsFeatureSrc(this);

		for (let i = 0; i < this.sources.length; i++) {
			
			// get the source node. 
			const src = this.sources[i];
			if (!src.symbol){
				throw new Error('invalid src symbol provided :' + src.symbol +' ; for ' + src.sourceString );
			}
			const nod = sys.getNodeLocString(src.sourceString)

			// if the node is missing
			if (!nod){
				throw new Error('No Node at ' + src.sourceString );
			}
			
			// add the origin to the chain
			chain.addOrigin( src.symbol, nod )	

		}

		// resulting node.
		var resNode = chain.getNode();
		resNode.update();
		
		targetNode.addReplacement(resNode);
		return true;
	}
	updateTo(feature: Feature, out: IOutputHandler) {
		return false;
	}
	disposeNode_fromNode(node: GrobBonusNode) {
		throw new Error("Method not implemented.");
	}

	public async dispose(){

		for (let i = 0; i < this.systems.length; i++) {
			const sys = this.systems[i];
			this.remove(sys);
		}
		super.dispose();

	}
}