import type { IGraphItem } from "./Abstractions/IGraphItem";
import { IGrobGroup } from "./IGrobGroup";
import { IGrobNode } from "./Nodes/IGrobNode";
export interface IGrobCollection<T extends IGrobNode> extends IGraphItem {
    parent: IGrobGroup<IGrobNode>;
    hasNode(name: any): any;
    getNode(name: any): T;
    addNode(node: T): any;
    removeNode(node: T): any;
    update_node_name(oldName: any, newName: any): any;
    setName(name: any): any;
    updateLocation(parent: any): any;
    dispose(): any;
}
