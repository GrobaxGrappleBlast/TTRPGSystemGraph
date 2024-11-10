import { GrobCollection } from "../GrobCollection";
import { GrobDerivedNode } from "./GrobDerivedNode";
export declare class GrobBonusNode extends GrobDerivedNode {
    constructor(name?: any, parent?: GrobCollection<GrobBonusNode>);
    static getTypeString(): string;
    getTypeString(): string;
}
