import { GrobCollection } from "../GrobCollection";
import { type GrobGroupType } from "../GrobGroup";
import type { GrobNodeType } from "./TTRPGSystemsGraphDependencies";
import { GrobFixedNode } from "../index";
import { GrobDerivedNode } from "../index";
import { TTRPGSystemGraphAbstractModel } from ".";
export type groupKeyType = 'fixed' | 'derived' | string;
/**
 *  handles Model operations and Data Containment,
 * Ensures that data is maintained, as well as graphlinks
*/
export declare class TTRPGSystemGraphModel extends TTRPGSystemGraphAbstractModel {
    constructor();
    initAsNew(): void;
    createCollection(group: groupKeyType, name: string): GrobCollection<import("../Nodes/IGrobNode").IGrobNode> | null;
    createDerivedCollection(name: string): GrobCollection<GrobDerivedNode>;
    createFixedCollection(name: string): GrobCollection<GrobFixedNode>;
    createNode(group: groupKeyType, col: GrobCollection<GrobNodeType> | string, name: string): GrobNodeType | null;
    createDerivedNode(col: GrobCollection<GrobDerivedNode> | string, name: string): GrobDerivedNode | null;
    createFixedNode(col: GrobCollection<GrobFixedNode> | string, name: string): GrobFixedNode | null;
    hasCollection(group: groupKeyType, name: string): boolean;
    hasDerivedCollection(name: string): boolean;
    hasFixedCollection(name: string): boolean;
    hasNode(group: groupKeyType, col: GrobCollection<GrobNodeType> | string, name: string): boolean;
    hasDerivedNode(col: GrobCollection<GrobDerivedNode> | string, name: string): boolean;
    hasFixedNode(col: GrobCollection<GrobFixedNode> | string, name: string): boolean;
    getCollectionNames(group: groupKeyType | GrobGroupType): string[];
    getCollectionLoc(location: string): GrobCollection<GrobNodeType> | null;
    getCollection(group: groupKeyType | GrobGroupType, name: string): GrobCollection<GrobNodeType> | null;
    getDerivedCollection(name: string): GrobCollection<GrobDerivedNode>;
    getFixedCollection(name: string): GrobCollection<GrobFixedNode>;
    getNodeLocString(location: string): GrobFixedNode | GrobDerivedNode | null;
    getNode(group: groupKeyType, col: GrobCollection<GrobNodeType> | string, name: string): GrobFixedNode | GrobDerivedNode | null;
    getDerivedNode(col: GrobCollection<GrobDerivedNode> | string, name: string): GrobDerivedNode;
    getFixedNode(col: GrobCollection<GrobFixedNode> | string, name: string): GrobFixedNode;
    getNodeNames(group: groupKeyType, col: GrobCollection<GrobNodeType> | string): string[] | null;
    protected _deleteGroup(group: GrobGroupType | string): false | undefined;
    deleteCollection(group: groupKeyType, col: string | GrobCollection<GrobNodeType>): any;
    deleteDerivedCollection(col: string | GrobCollection<GrobDerivedNode> | string): any;
    deleteFixedCollection(col: string | GrobCollection<GrobFixedNode>): any;
    deleteNode(group: groupKeyType, col: GrobCollection<GrobNodeType> | string, name: string): boolean;
    deleteDerivedNode(col: GrobCollection<GrobDerivedNode> | string, name: string): boolean;
    deleteFixedNode(col: GrobCollection<GrobFixedNode> | string, name: string): boolean;
    renameCollection(group: groupKeyType | GrobGroupType, col: GrobCollection<GrobNodeType> | string, newName: string): void | null;
    renameItem(group: groupKeyType | GrobGroupType, col: GrobCollection<GrobNodeType> | string, oldName: string, newName: string): void | null;
    isValid(errorMessages?: {
        msg: string;
        key: string[];
    }[]): boolean;
    getGroup(name: any): import("../GrobGroup").GrobGroup<GrobNodeType | import("../Nodes/IGrobNode").IGrobNode>;
    addNodeDependency(node: GrobDerivedNode, dep: GrobNodeType): void;
    removeNodeDependency(node: GrobDerivedNode, dep: GrobNodeType): void;
}
