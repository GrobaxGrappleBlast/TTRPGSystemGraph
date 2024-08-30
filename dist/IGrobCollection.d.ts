import type { IGraphItem } from "./Abstractions/IGraphItem";
import type { GrobNodeType } from "./Graph/TTRPGSystemsGraphDependencies";
export interface IGrobCollection<T extends GrobNodeType> extends IGraphItem {
    hasNode(name: any): any;
    getNode(name: any): T;
    addNode(node: T): any;
    removeNode(node: T): any;
    update_node_name(oldName: any, newName: any): any;
    setName(name: any): any;
    updateLocation(parent: any): any;
    dispose(): any;
}
