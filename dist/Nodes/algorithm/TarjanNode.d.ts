import { AGrobNode } from "../AGrobNodte";
export interface GrobNode extends AGrobNode<GrobNode> {
}
export interface TarjanAlgorithmLink {
    tarjanAlgorithmAlgorithmIndex: any;
    LowLinkValue: number;
    linkValue: number;
}
export declare class GrobAlgorithms {
    static algLevel: number;
    static TarjAlgo(nodes: GrobNode[], strongComponents?: Record<string, GrobNode>): (boolean | Record<string, GrobNode>)[];
}
