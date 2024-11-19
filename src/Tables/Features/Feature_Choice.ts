import { TTRPGSystem, GrobBonusNode } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";
import { AFeature_Multi, FeatureMultiArgs } from "./AFeature_Multi";

export class Feature_Choice extends AFeature_Multi {

	public type: string = 'Feature_Choice';
	public maxChoices: number;

	apply(sys: TTRPGSystem, args : FeatureMultiArgs[] ): boolean {
		
		// check if this has already been apllied to Max number of choices in this system
		if (this.appliedChoices && this.appliedChoices[sys._key]?.length > this.maxChoices){
			return false;
		}

		var len = args.length;
		len = len < this.maxChoices ? len : this.maxChoices;
		for (let i = 0; i < len; i++) {
			const arg =  args[i];
			const feature = this.features.find(p => p.name == arg.featureName );
			if (!feature){
				throw new Error('provided arguments for non existant feature by name "' + arg.featureName + '"');
			}
			
			const succes = feature.apply( sys , arg.args );
			if (!succes){
				this.remove();
				throw new Error('Error Happend trying to apply feature ' + arg.featureName );
			}

			this._addFeatureFromAppliedRecord( sys , feature );
		}
	
		// register the system and the node and the choice
		this.systems.push(sys);
		return true;

	}

	disposeNode_fromNode(node: GrobBonusNode) {}

}