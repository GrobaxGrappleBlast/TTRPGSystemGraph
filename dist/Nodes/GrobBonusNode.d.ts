import { GrobCollection } from "../GrobCollection";
import { GrobDerivedNode } from "./GrobDerivedNode";
import { TTRPGSystemBonusDesigner } from "../../src/Helpers/TTRPGSystemBonusDesigner";
import { TTRPGSystem } from "../../src";
export declare class GrobBonusNode extends GrobDerivedNode {
    constructor(name?: any, parent?: GrobCollection<GrobBonusNode>);
    static CreateNodeChain(sys: TTRPGSystem, name: string): TTRPGSystemBonusDesigner;
    static getTypeString(): string;
    getTypeString(): string;
}
