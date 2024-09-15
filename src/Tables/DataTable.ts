import { IGrobCollection } 	from "../IGrobCollection"; 
import { GrobCollection } 	from "../GrobCollection";
import { GrobGroup } 		from "../GrobGroup";
import { IGrobGroup } 		from "../IGrobGroup";
import { IGrobNode } 		from "../Nodes/IGrobNode";


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

	public getLocationKey(){
		let segs = this.getLocationKeySegments();
		return segs.join('.');
	}
	public getLocationKeySegments() : string [] {
		let seg : string[] = ['','',''];
		seg[0] = this.parent?.parent?.getName() ?? 'unknown';
		seg[1] = this.parent?.getName () ?? 'unknown';
		seg[2] = this.getName() ?? 'unknown';
		return seg;
	}
}

export class ADataRow { 
	public level : number ; 
}

