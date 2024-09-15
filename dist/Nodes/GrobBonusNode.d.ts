import { GrobCollection } from "../GrobCollection";
import { GrobDerivedNode } from "./GrobDerivedNode";
import { TTRPGSystemBonusDesigner } from "../Helpers/TTRPGSystemBonusDesigner";
import { TTRPGSystem } from "../";
export declare class GrobBonusNode extends GrobDerivedNode {
    constructor(name?: any, parent?: GrobCollection<GrobBonusNode>);
    static CreateNodeChain(sys: TTRPGSystem, name: string): TTRPGSystemBonusDesigner;
    static getTypeString(): string;
    getTypeString(): string;
}
