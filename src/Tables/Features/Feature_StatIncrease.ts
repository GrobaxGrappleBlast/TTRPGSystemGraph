import { feature } from "./Feature";


type IncreaseMethod =  'countDown' | 'apply' ;

export class Feature_StatIncrease extends feature {
    
    public sourceItems      :string[];
    public sourceCollections:string[];
    public increaseMethod : IncreaseMethod; 
    public amounts : number[];

}
