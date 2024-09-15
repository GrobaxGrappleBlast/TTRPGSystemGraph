import { AGrobNode } from "./AGrobNodte";
import { GrobCollection } from "../GrobCollection"; 
import { AGraphItem } from "../Abstractions/AGraphItem"; 
import { grobDerivedSymbolRegex } from "../Graph/TTRPGSystemsGraphDependencies";  
import { GrobOrigin } from "./GrobOrigin";
import { GrobDerivedNode } from "./GrobDerivedNode";
import { TTRPGSystemBonusDesigner } from "../Helpers/TTRPGSystemBonusDesigner";
import { TTRPGSystem } from "../";


export class GrobBonusNode extends GrobDerivedNode{//AGrobNode<GrobBonusNode> {
	
	constructor(name? , parent? : GrobCollection<GrobBonusNode> ) {  
		super(name , parent)  
	}
 
	public static CreateNodeChain( sys:TTRPGSystem , name:string ){
		return TTRPGSystemBonusDesigner.createBonusNodeChain(sys,name);
	}

	public static getTypeString(): string {
		return 'bonusNode';
	}	
	public getTypeString(){
		return GrobBonusNode.getTypeString();
	}
  
}
