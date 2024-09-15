import { IGrobCollection } from "src/IGrobCollection"; 
import { GrobCollection } from "src/GrobCollection";
import { GrobGroup } from "src/GrobGroup";
import { IGrobGroup } from "src/IGrobGroup";
import { IGrobNode } from "src/Nodes/IGrobNode";


export class ADataTable implements IGrobNode {
	parent: IGrobCollection<IGrobNode>;
	getName(): string {
		throw new Error("Method not implemented.");
	}
	dispose(): void {
		throw new Error("Method not implemented.");
	}
	updateLocation(this: any) {
		throw new Error("Method not implemented.");
	}

	public data : Record<string,ADataRow> = {};

	public name : string ;
}

export class ADataRow { 
	public level : number ; 
}

