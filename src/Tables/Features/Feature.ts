//import { GrobBonusNode, GrobNodeType, keyManagerInstance, TTRPGSystem } from "../../../src/index";
import { keyManagerInstance } 		from '../../Abstractions/KeyManager';
import { IOutputHandler } 			from '../../Abstractions/IOutputHandler' ;
import { GrobNodeType } 			from '../../Graph/TTRPGSystemsGraphDependencies';
import { GrobBonusNode } 			from '../../Nodes/GrobBonusNode';
import { TTRPGSystemFeatureIndex } 	from '../../Graph/TTRPGSystemFeatureIndex';



export class FeatureSource {
    public name     :string;
    public source   :string;
    public feature  :Feature | null = null; 
	
}   

export abstract class Feature {

	public getType (){
		return 'Feature';
	};

    public type: string = this.getType();
    public name     :string;
    public source   :string;
    public text     :string;
	public _key : string = keyManagerInstance.getNewKey();
	
	protected systems: TTRPGSystemFeatureIndex[] = [];
	protected systemsNodechoices : Record<string,string[]> = {}

	public async dispose(){
	
	}

	/**
	 * get a structure that explains where this feature is applied. 
	 * @returns { sys:string , nodes : GrobNodeType[] }[]
	 */
	public getAppliancesStructure() : { sys:string , nodes : GrobNodeType[] }[] {
		
		var objs : any[] = [];
		for (let i = 0; i < this.systems.length; i++) {
			const sys = this.systems[i];
			var obj = {};
			obj['sys'] = sys;
			obj['nodes'] = this.systemsNodechoices[sys._key];
			objs.push(obj);
		}

		return objs;
	}

	/**
	 * 
	 * When reloaded we want to reload a feature with the reloaded data. 
	 * @param feature The reloaded feature
	 * @param out  outputhandler
	 * @returns true if it managed to update. false if not.
	 */
	abstract updateTo ( feature : Feature , out: IOutputHandler) : boolean ;

	abstract remove(sys?:TTRPGSystemFeatureIndex | null) : boolean;

	abstract apply(sys:TTRPGSystemFeatureIndex , ...args ) : boolean;

	abstract disposeNode_fromNode( node:GrobBonusNode )
}

