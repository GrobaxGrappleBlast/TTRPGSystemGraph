import { IGrobCollection } from "src/IGrobCollection";
import { IGrobNode } from "src/Nodes/IGrobNode";
export declare class ADataTable implements IGrobNode {
    parent: IGrobCollection<IGrobNode>;
    getName(): string;
    dispose(): void;
    updateLocation(this: any): void;
    data: Record<string, ADataRow>;
    name: string;
    getLocationKey(): string;
    getLocationKeySegments(): string[];
}
export declare class ADataRow {
    level: number;
}
