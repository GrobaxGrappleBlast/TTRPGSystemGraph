
import { GrobDerivedNode } from "src/Nodes/GrobDerivedNode";
import { GrobFixedNode } from "src/Nodes/GrobFixedNode";

export const grobDerivedSymbolRegex =/@[a-zA-Z]/g;
export type GrobNodeType = GrobFixedNode | GrobDerivedNode  ;
