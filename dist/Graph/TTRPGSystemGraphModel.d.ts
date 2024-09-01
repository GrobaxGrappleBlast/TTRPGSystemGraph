import { GrobCollection } from "../GrobCollection";
import { type GrobGroupType } from "../GrobGroup";
import type { GrobNodeType } from "./TTRPGSystemsGraphDependencies";
import { GrobDerivedNode, GrobFixedNode } from "../GrobNodte";
import { TTRPGSystemGraphAbstractModel } from "./TTRPGSystemGraphAbstractModel";
export type groupKeyType = 'fixed' | 'derived';
/**
 *  handles Model operations and Data Containment,
 * Ensures that data is maintained, as well as graphlinks
*/
export declare class TTRPGSystemGraphModel extends TTRPGSystemGraphAbstractModel {
    constructor();
    initAsNew(): void;
    createCollection(group: groupKeyType, name: string): GrobCollection<GrobNodeType> | null;
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
    getCollection(group: groupKeyType | GrobGroupType, name: string): GrobCollection<GrobNodeType> | null;
    getDerivedCollection(name: string): GrobCollection<GrobDerivedNode>;
    getFixedCollection(name: string): GrobCollection<GrobFixedNode>;
    getNode(group: groupKeyType, col: GrobCollection<GrobNodeType> | string, name: string): GrobNodeType | null;
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
    protected _getGroup(name: any): import("../GrobGroup").GrobGroup<GrobNodeType>;
    addNodeDependency(node: GrobDerivedNode, dep: GrobNodeType): void;
    removeNodeDependency(node: GrobDerivedNode, dep: GrobNodeType): void;
}
