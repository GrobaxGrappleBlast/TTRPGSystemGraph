import { Feature, Feature_OriginCollection, Feature_OriginNode } from ".";
type IncreaseMethod = 'countDown' | 'apply';
export declare class Feature_StatIncrease extends Feature {
    type: string;
    sourceItems: Feature_OriginNode[];
    sourceCollections: Feature_OriginCollection[];
    increaseMethod: IncreaseMethod;
    amounts: number[];
}
export {};
