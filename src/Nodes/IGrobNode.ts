import { IGrobCollection } from "src/IGrobCollection";

export interface IGrobNode {
	parent: IGrobCollection<IGrobNode>;
	getName() : string ,
	dispose() : void,
	updateLocation( parent : any ),
}