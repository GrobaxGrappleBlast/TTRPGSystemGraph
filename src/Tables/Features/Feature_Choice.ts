import { TTRPGSystem, GrobBonusNode } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";
import { AFeature_Multi } from "./AFeature_Multi";

export class Feature_Choice extends AFeature_Multi {

	public type: string = 'Feature_Choice';
	public maxChoices: number;

	apply(sys: TTRPGSystem, choice: string , ...args ): boolean {
		
		// check if this has already been apllied to Max number of choices in this system
		if (this.appliedChoices && this.appliedChoices[sys._key]?.length > this.maxChoices){
			return false;
		}

		// get the feature in question
		var feature = this.choices.find(p => p.name == choice);
		
		// said feature is not in the choices
		if (!feature){
			return false;
		}

		// try to apply the feature
		var wasApplied = feature.apply( sys , ...args );
		if (!wasApplied){
			return false
		}

		// register the system and the node and the choice
		this._addFeatureFromAppliedRecord( sys , feature );
		this.systems.push(sys);
		return true;

	}

	disposeNode_fromNode(node: GrobBonusNode) {}

}