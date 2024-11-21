import { TTRPGSystem, GrobBonusNode } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";
import { Feature_Choice } from "./Feature_Choice";
import { AFeature_Multi, FeatureMultiArgs } from "./AFeature_Multi";


export class Feature_Multi extends AFeature_Multi {
	
	public getType(): string {
		return Feature_Choice.getType();
	}
	public static getType(): string {
		return 'Feature_Multi';
	}

	//public type: string = 'Feature_Multi';

	updateTo(feature: Feature, out: IOutputHandler) : boolean {

		// if this is the wrong type then we return false
		if (feature.type != this.type){
			return false;
		}

		

		// loop through choices and update
		for (let i = 0; i < this.features.length; i++) {

			// map oold and incoming 
			const o_choice = this.features[i];
			const i_choice = (feature as Feature_Choice).features.find(p=>p.name == o_choice.name);
			
			// if there is incoming choice, then remove the old.
			if (!i_choice){
				this._removeFeatureFromAppliedRecord(o_choice);
				continue;
			}

			// call update and save if it could update
			var could_update = o_choice.updateTo(i_choice, out);

			// if this could not update then remove the old.
			if (!could_update){
				this._removeFeatureFromAppliedRecord(o_choice);
				continue;
			}

		}

		// return succes
		return true;

	}

	apply(sys: TTRPGSystem, args : FeatureMultiArgs[] ): boolean {
		
		// if we KNOW before hand that they do not have the right amount, just error out. 
		if(args.length < this.features.length){
			throw new Error('Supplied arguments did not have the same length as number of arguments ');
		}

		// first wee need to know that we have arguments for each feature
		// we track for each feature where arguments are suppliedm 
		// And wich have not.
	
		// create lists
		let fromListMap = {};
		this.features.forEach( p => fromListMap[p.name] = p );
		let toListMap 		: Record<string,{feature:Feature, args : any[]}>= {};

		// sort arguments by name. 
		args.sort( (a,b) => { if (a.featureName < b.featureName){return -1} else { return 1} })
					
		for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			var feature = fromListMap[arg.featureName];
			if (!feature){
				throw new Error('provided arguments for non existant feature by name "' + arg.featureName + '"');
			}

			// add to list
			toListMap[arg.featureName] = {} as any;
			toListMap[arg.featureName]['feature'] 	= feature;
			toListMap[arg.featureName]['args'] 		= arg.args;

			// remove from old list 
			delete fromListMap[arg.featureName];
		}

		// check if anything have not gotten arguments 
		var fromKeys = Object.keys(fromListMap) ?? [];
		if (fromKeys.length != 0){
			throw new Error('did not provide arguments for features ['+ fromKeys.join(',') +']')
		}

		// now All arguments are ensured to have been provided.
	
		// now we loop through all of our features, but if even one fails to apply we remove 
		var keys = Object.keys(toListMap);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const set = toListMap[key];
			const succes = set.feature.apply( sys , set.args);

			this._addFeatureFromAppliedRecord(sys,set.feature);
			
			if (!succes){
				this.remove();
				throw new Error('Error Happend trying to apply feature ' + key );
			}

		}
		this.systems.push(sys);
		
		return true;
	}

	disposeNode_fromNode(node: GrobBonusNode) {}
}