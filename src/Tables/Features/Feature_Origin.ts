import { Feature } from ".";
import { GrobCollection } from "src";  
import { IGrobNode } from "src/Nodes/IGrobNode";
 
type IncreaseMethod =  'countDown' | 'apply' ;

export class Feature_Origin_Node {
    public sourceString : string ;
    public source : IGrobNode;
}
 
export class Feature_Origin_Collection {
    public sourceString : string ;
    public source : GrobCollection<IGrobNode>;
}

