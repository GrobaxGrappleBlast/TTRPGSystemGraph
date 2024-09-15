import { IGrobCollection } from "src/IGrobCollection";
import { GrobCollection } from "src/GrobCollection";
import { GrobGroup } from "src/GrobGroup";
import { IGrobNode } from "src/Nodes/IGrobNode";
export declare class tableGroup extends GrobGroup<ADataTable> {
}
export declare class tableCollection extends GrobCollection<ADataTable> {
}
export declare class ADataTable implements IGrobNode {
    parent: IGrobCollection<IGrobNode>;
    getName(): string;
    dispose(): void;
    updateLocation(this: any): void;
    data: Record<string, AdataRow>;
    name: string;
}
export declare class AdataRow {
    level: number;
}
