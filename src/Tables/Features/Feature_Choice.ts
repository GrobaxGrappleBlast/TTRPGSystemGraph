import { TTRPGSystem, GrobBonusNode } from "src";
import { IOutputHandler } from "src/Abstractions/IOutputHandler";
import { Feature } from "./Feature";

export class Feature_Choice extends Feature {
   
    public type: string = 'Feature_Choice';
	public choices : Feature[] = [];
    public activeChoice : Feature;

    updateTo(feature: Feature, out: IOutputHandler) {
        
        var oldActiveName : string | null = null;
        if (this.activeChoice){
            oldActiveName = this.activeChoice.name;
        }
    }
    remove(sys: TTRPGSystem): boolean {
        throw new Error("Method not implemented.");
    }
    apply(sys: TTRPGSystem, ...args: any[]): boolean {
        throw new Error("Method not implemented.");
    }
    disposeNode_fromNode(node: GrobBonusNode) {
        throw new Error("Method not implemented.");
    }

    public chooseFeature    ( feat:Feature ){

    }
    public chooseFeatureKey ( feat:string  ){

    }
    
}