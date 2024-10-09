import { IGrobCollection } from "../IGrobCollection";
export interface IGrobNode {
    parent: IGrobCollection<IGrobNode>;
    getName(): string;
    dispose(): void;
    updateLocation(parent: any): any;
    update(): any;
    setName(name: string, parentCall?: boolean): any;
}
