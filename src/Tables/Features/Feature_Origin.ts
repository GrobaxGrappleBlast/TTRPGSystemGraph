import { Feature } from ".";
import { GrobCollection } from "src";  
import { IGrobNode } from "src/Nodes/IGrobNode";
 
type IncreaseMethod =  'countDown' | 'apply' ;

export class Feature_Origin_Node {
    public symbol?:string;
    public sourceString : string ; 
}
 
export class Feature_Origin_Collection {
    public symbol?:string;
    public sourceString : string ;
}

