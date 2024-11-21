import { AGrobNode } from "./AGrobNodte";
import { GrobCollection } from "../GrobCollection"; 
import { AGraphItem } from "../Abstractions/AGraphItem"; 
import { grobDerivedSymbolRegex } from "../Graph/TTRPGSystemsGraphDependencies";  
import { GrobOrigin } from "./GrobOrigin";
import { GrobDerivedNode } from "./GrobDerivedNode";

import { TTRPGSystem } from "../";
import { Feature, FeatureSource } from 		"../Tables/Features";
import { TTRPGSystemBonusDesigner } from	"../Helpers/TTRPGSystemReplacementDesigner";


export class GrobBonusNode extends GrobDerivedNode{//AGrobNode<GrobBonusNode> {
	
	constructor(name? , parent? : GrobCollection<GrobBonusNode> ) {  
		super(name , parent)  
	}

	public featureSrc : FeatureSource;

 
	/**
	 * 
	 * @param sys The System Where this bonus is applied to
	 * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
	 * @returns 
	 */
	public static CreateNodeChain( sys:TTRPGSystem , name:string ){
		return TTRPGSystemBonusDesigner.createBonusNodeChain(sys,name);
	}

	public static getTypeString(): string {
		return 'bonusNode';
	}	
	public getTypeString(){
		return GrobBonusNode.getTypeString();
	}

	public dispose(): void {
		
		for ( const key in this.dependents ){
			const node = this.dependents[key];
			node.remBonus(this);
		}	

		if (this.featureSrc && this.featureSrc.feature){
			this.featureSrc.feature.disposeNode_fromNode(this);
		}

		super.dispose();
	}

	
}
