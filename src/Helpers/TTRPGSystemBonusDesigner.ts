import { GrobCollection, TTRPGSystem } from "../";
import { GrobBonusNode } from "../Nodes/GrobBonusNode";

export class TTRPGSystemBonusDesigner{

	public static createBonusNodeChain( sys:TTRPGSystem , name:string ){
		const instance = new TTRPGSystemBonusDesigner();
		if (!sys.hasCollection( 'extra' , 'bonus')){
			sys.createCollection( 'extra' , 'bonus' );
		}
		const col = sys.getCollection('extra','bonus') as GrobCollection<GrobBonusNode>;

		// Create the Node.
		instance.activeNode = instance.createNewNode(name, col);
		return instance;
	}

	protected activeNode : GrobBonusNode;
	protected createNewNode<T extends GrobBonusNode>(name, parent : GrobCollection<T>){
		return new GrobBonusNode(name , parent);
	}
	public addCalculation	( calc : string ){
		this.activeNode.setCalc(calc);
		return this;
	}
	public addOrigin		( symbol : string, node : GrobBonusNode){
		this.activeNode.setOrigin(symbol,node);
		return this;
	}
	public update(){
		this.activeNode.updateOrigins();
		return this;
	}
	public getNode(){
		return this.activeNode;
	}

	public getOriginStates(){
		return this.activeNode.parseCalculationToOrigins( this.activeNode.calc );
	}
	public isValidCalculation (){
		return this.activeNode.testCalculate( this.activeNode.calc );
	}
	public isValid (){
		return this.activeNode.isValid();
		
	}

}