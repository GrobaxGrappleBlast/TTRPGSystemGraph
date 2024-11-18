import { AGrobNode } from "./AGrobNodte";
import { GrobCollection } from "../GrobCollection"; 
import { AGraphItem } from "../Abstractions/AGraphItem"; 
import type { GrobNodeType } from "../Graph/TTRPGSystemsGraphDependencies";  
import { GrobDerivedNode } from "./GrobDerivedNode";

  
export class GrobFixedNode extends AGrobNode<GrobFixedNode>{
	
	constructor(name ,  parent? : GrobCollection<GrobFixedNode>) {  
		super(name ,'NF',parent) 
	}
 
	public ___value:number= 1;

	_getValue(): number {
		return this.___value;
	} 
	setValue( value : number ) {
		this.___value = value;
		for(const key in this.dependents){
			const curr = this.dependents[key] as GrobDerivedNode;
			curr.update();
		}
	} 
	

	public static  getTypeString(): string {
		return 'fixedNode';
	}  
	public getTypeString(){
		return GrobFixedNode.getTypeString();
	}
	
	public _update(){}
}
 
