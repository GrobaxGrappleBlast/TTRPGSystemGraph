
import { GrobCollection } from "../GrobCollection"; 
import { AGraphItem } from "../Abstractions/AGraphItem"; 
import type { GrobNodeType } from "../Graph/TTRPGSystemsGraphDependencies";  

export class GrobOrigin {

	public static UnkownLocationKey = 'unknown.unknown.unknown'
 
	public symbol: string;
	public standardValue:number = 1;
	public origin: GrobNodeType | null;
	 
	public originKey: string ;

}
