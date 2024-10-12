import { GrobCollection, type GrobCollectionType } from "../GrobCollection";
import { GrobGroup, type GrobGroupType } from "../GrobGroup";
import { type IOutputHandler } from "../Abstractions/IOutputHandler";
import type { GrobNodeType } from "./TTRPGSystemsGraphDependencies";
import { GrobDerivedNode } from "../Nodes/GrobDerivedNode";
import { ADataTable } from "../Tables/DataTable";
import { IGrobNode } from "../Nodes/IGrobNode";
/**
* a general and flexible implementation of TTRPG system. it focusses on not diskrimination or sorting data.
* simply having logic that is the same for everything.
*/
export declare abstract class TTRPGSystemGraphAbstractModel {
    data: Record<string, GrobGroup<GrobNodeType | IGrobNode>>;
    protected out: IOutputHandler;
    setOut(out: IOutputHandler | null): void;
    protected _deleteGroup(group: GrobGroupType | string): false | undefined;
    protected _createGroup(name: string): GrobGroup<IGrobNode> | null;
    protected _hasGroup(name: string): boolean;
    protected _getGroup_key(key: string): GrobGroup<GrobNodeType | IGrobNode>;
    protected getGroup(name: string): GrobGroup<GrobNodeType | IGrobNode> | null;
    protected _deleteCollection(collection: GrobCollectionType): any;
    protected _createCollection(group: GrobGroupType, name: string): GrobCollection<IGrobNode> | null;
    protected _AddNode(collection: GrobCollectionType, node: GrobNodeType): boolean;
    protected _deleteNode(node: GrobNodeType): boolean;
    protected _addNodeDependency(node: GrobDerivedNode, dep: GrobNodeType): boolean;
    protected _removeNodeDependency(node: GrobDerivedNode, dep: GrobNodeType): boolean;
    protected _addTable(collection: GrobCollectionType, table: ADataTable): boolean | undefined;
}
