import { IGrobCollection } from "../IGrobCollection";
import { IGrobNode } from "../Nodes/IGrobNode";
export declare class ADataTable implements IGrobNode {
    parent: IGrobCollection<IGrobNode>;
    getName(): string;
    dispose(): void;
    updateLocation(this: any): void;
    data: Record<string, ADataRow>;
    name: string;
    getLocationKey(): string;
    getLocationKeySegments(): string[];
    update(): void;
}
export declare class ADataRow {
    level: number;
}
