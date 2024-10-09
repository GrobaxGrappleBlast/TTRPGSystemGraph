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

	public addDependency(node:GrobNodeType){ return false } 
	public removeDependency(node:GrobNodeType){ return false  }
	public nullifyDependency(node:GrobNodeType){return false}
	
	public _update(){
		for( const k in this.dependents ){
			const dep = this.dependents[k] as GrobDerivedNode;
			dep.update();
		} 
	}
}
 
