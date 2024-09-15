
import { GrobBonusNode } 	from "../Nodes/GrobBonusNode";
import { GrobDerivedNode } 	from "../Nodes/GrobDerivedNode";
import { GrobFixedNode } 	from "../Nodes/GrobFixedNode";

export const grobDerivedSymbolRegex =/@[a-zA-Z]/g;
export type GrobNodeType = GrobFixedNode | GrobDerivedNode | GrobBonusNode  ;
