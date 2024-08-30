import type { IGraphItem } from "./IGraphItem";
export declare abstract class AGraphItem implements IGraphItem {
    constructor(name?: string, key?: string);
    name: string;
    _key: any;
    getName(): string;
    setName(name: any): void;
    getKey(): any;
}
