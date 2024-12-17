import { keyManagerInstance } from './Abstractions/KeyManager';
import { TTRPGSystemFeatureIndex } from './Graph';
import { GrobCollection } from './GrobCollection';
import { GrobGroup } from './GrobGroup';
import { TTRPGSystemBonusDesigner } from './Helpers/TTRPGSystemReplacementDesigner';
import { GrobBonusNode } from './Nodes/GrobBonusNode';
import { GrobDerivedNode } from './Nodes/GrobDerivedNode';
import { GrobFixedNode } from './Nodes/GrobFixedNode';
import { GrobOrigin } from './Nodes/GrobOrigin';
import { ADataRow, ADataTable } from './Tables/DataTable';
import { Feature, Feature_CalcReplacement, Feature_Choice, Feature_Multi, Feature_Origin_Collection, Feature_Origin_Node, Feature_StatIncrease_apply, FeatureSource } from './Tables/Features';
export { keyManagerInstance };
export { GrobFixedNode, GrobOrigin as GrobDerivedOrigin, GrobDerivedNode, GrobBonusNode, GrobCollection, GrobGroup, ADataRow, ADataTable, TTRPGSystemFeatureIndex as TTRPGSystem, TTRPGSystemBonusDesigner as TTRPGSystemHelper, 
// specifik feature types 
Feature, Feature_StatIncrease_apply, Feature_CalcReplacement, Feature_Choice, Feature_Multi, 
// feature dependencies.
Feature_Origin_Node, Feature_Origin_Collection, FeatureSource };
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
