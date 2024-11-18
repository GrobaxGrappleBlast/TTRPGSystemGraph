import { TTRPGSystem, GrobBonusNode } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";

export class Feature_Choice extends Feature {

	public type: string = 'Feature_Choice';
	public choices : Feature[] = []; 
	public maxChoices: number;

	/**
	 * Maps the system keys to Feature keys.
	 * Such that a system can remember its choices independently of other systems
	 */
	protected appliedChoices   : Record<string,string[]> = {};
	/**
	 * Maps the feature keys to system 
	 * reversed off applied choices 
	*/
	protected appliedChoices_r : Record<string,string[]> = {};

	// we write a scope level feature to contian a sub remove feature
	protected _removeFeatureFromAppliedRecord ( o_choice : Feature ){

		// get all systems that this choice is bound to
		var systems :string[] = this.appliedChoices_r[o_choice._key];

		// for each of the systems, remove the reference to the choices 
		for (let i = 0; i < systems.length; i++) {
			const sys = systems[i];
			this.appliedChoices[sys] = this.appliedChoices[sys].filter( p => p != o_choice._key);
		}

		// then remove the feature
		o_choice.remove();	
	}
	protected _addFeatureFromAppliedRecord ( sys: TTRPGSystem , o_choice : Feature ){

	}

	updateTo(feature: Feature, out: IOutputHandler) : boolean {

		// if this is the wrong type then we return false
		if (feature.type != this.type){
			return false;
		}

		

		// loop through choices and update
		for (let i = 0; i < this.choices.length; i++) {

			// map oold and incoming 
			const o_choice = this.choices[i];
			const i_choice = (feature as Feature_Choice).choices.find(p=>p.name == o_choice.name);
			
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

	remove(sys: TTRPGSystem|null = null ): boolean {
		
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

		// remove choices 
		for (let i = 0; i < this.choices.length; i++) {
			const choice = this.choices[i];
			choice.remove(sys);
			this._removeFeatureFromAppliedRecord(choice);
		}

		// de register this system from extended class
		this.systems = this.systems.filter( p => p._key == sys._key );
		delete this.systemsNodechoices[sys._key];
		
		return true;
	}

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