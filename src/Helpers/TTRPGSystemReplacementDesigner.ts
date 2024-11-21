import { Feature, FeatureSource } from "../Tables/Features";
import { GrobCollection, GrobNodeType, TTRPGSystem } from "..";
import { GrobBonusNode } from "../Nodes/GrobBonusNode";
import { GrobNode } from "src/Nodes/algorithm/TarjanNode";

export class TTRPGSystemBonusDesigner{

	/**
	 * 
	 * @param sys The System Where this bonus is applied to
	 * @param name The UniqueName for the Bonus, Wich is Also its uniqueKey
	 * @returns 
	 */
	public static createBonusNodeChain( sys:TTRPGSystem , name:string , colectionName:string = 'bonus'){
		const instance = new TTRPGSystemBonusDesigner();
		if (!sys.hasCollection( 'extra' , colectionName)){
			sys.createCollection( 'extra' , colectionName );
		}
		const col = sys.getCollection('extra',colectionName) as GrobCollection<GrobBonusNode>;

		// Create the Node.
		instance.activeNode = instance.createNewNode(name, col);
		return instance;
	}

	protected activeNode : GrobBonusNode;
	protected createNewNode<T extends GrobBonusNode>(name, parent : GrobCollection<T>){
		return new GrobBonusNode(name , parent);
	}

	/**
	 * 
	 * @param calc A calulation string
	 * @returns 
	 */
	public addCalculation	( calc : string ){
		this.activeNode.setCalc(calc);
		return this;
	}
	public addFeatureSrc ( feature : FeatureSource ){
		this.activeNode.featureSrc = feature;
		return this;
	}
	public addFeatureAsFeatureSrc( feature:Feature ){
		this.activeNode.featureSrc = new FeatureSource()
		this.activeNode.featureSrc.name		= feature.name;
		this.activeNode.featureSrc.source	= feature.source;
		this.activeNode.featureSrc.feature	= feature;
		return this;
	}
	public addOrigin		( symbol : string, node : GrobNodeType ){
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