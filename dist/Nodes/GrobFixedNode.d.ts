import { AGrobNode } from "./AGrobNodte";
import { GrobCollection } from "../GrobCollection";
import type { GrobNodeType } from "../Graph/TTRPGSystemsGraphDependencies";
export declare class GrobFixedNode extends AGrobNode<GrobFixedNode> {
    constructor(name: any, parent?: GrobCollection<GrobFixedNode>);
    ___value: number;
    getValue(): number;
    setValue(value: number): void;
    static getTypeString(): string;
    getTypeString(): string;
    addDependency(node: GrobNodeType): boolean;
    removeDependency(node: GrobNodeType): boolean;
    nullifyDependency(node: GrobNodeType): boolean;
    _update(): void;
}
