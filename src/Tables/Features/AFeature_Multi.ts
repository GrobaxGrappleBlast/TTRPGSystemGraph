import { TTRPGSystem, GrobBonusNode } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";

export type FeatureMultiArgs = { featureName : string , args : any }
export abstract class AFeature_Multi extends Feature {

	public features : Feature[] = []; 

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
			const syskey = systems[i];
			this.appliedChoices[syskey] = this.appliedChoices[syskey].filter( p => p != o_choice._key);


			// if applied choices array has length of 0 remove it
			if (this.appliedChoices[syskey].length == 0){
				delete this.appliedChoices[syskey];
			}
		}


		// delete from applied sources reversed
		delete this.appliedChoices_r[o_choice._key];

		// then remove the feature
		o_choice.remove();	
	}
	protected _addFeatureFromAppliedRecord ( sys: TTRPGSystem , o_choice : Feature ){

		// add to Applied choices "reversed"
		if (!this.appliedChoices_r[o_choice._key]) {
			this.appliedChoices_r[o_choice._key] = [];
		}
		this.appliedChoices_r[o_choice._key].push(sys._key);

		// add the applied choices 
		if (!this.appliedChoices[sys._key]){
			this.appliedChoices[sys._key] = [];
		}
		this.appliedChoices[sys._key].push(o_choice._key);

	}

	updateTo(feature: Feature, out: IOutputHandler) : boolean {

		// if this is the wrong type then we return false
		if (feature.type != this.type){
			return false;
		}

		

		// loop through choices and update
		for (let i = 0; i < this.features.length; i++) {

			// map oold and incoming 
			const o_choice = this.features[i];
			const i_choice = (feature as AFeature_Multi).features.find(p=>p.name == o_choice.name);
			
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
		for (let i = 0; i < this.features.length; i++) {
			const choice = this.features[i];
			
			// if this is not in the applied record skip it.
			if (!this.appliedChoices_r[choice._key]){
				continue;
			}
			
			// Remove it
			choice.remove(sys);
			this._removeFeatureFromAppliedRecord(choice);
		}

		// de register this system from extended class
		this.systems = this.systems.filter( p => p._key != sys._key );
		
		return true;
	}

}