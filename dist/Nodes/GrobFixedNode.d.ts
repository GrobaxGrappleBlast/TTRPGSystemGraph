import { AGrobNode } from "./AGrobNodte";
import { GrobCollection } from "../GrobCollection";
export declare class GrobFixedNode extends AGrobNode<GrobFixedNode> {
    constructor(name: any, parent?: GrobCollection<GrobFixedNode>);
    ___value: number;
    _getValue(): number;
    setValue(value: number): void;
    static getTypeString(): string;
    getTypeString(): string;
    _update(): void;
}
