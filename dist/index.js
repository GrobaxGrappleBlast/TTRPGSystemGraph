"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureSource = exports.Feature_Origin_Collection = exports.Feature_Origin_Node = exports.Feature_Multi = exports.Feature_Choice = exports.Feature_CalcReplacement = exports.Feature_StatIncrease_apply = exports.Feature = exports.TTRPGSystemHelper = exports.TTRPGSystem = exports.ADataTable = exports.ADataRow = exports.GrobGroup = exports.GrobCollection = exports.GrobBonusNode = exports.GrobDerivedNode = exports.GrobDerivedOrigin = exports.GrobFixedNode = exports.keyManagerInstance = void 0;
exports.uuidv4 = uuidv4;
const KeyManager_1 = require("./Abstractions/KeyManager");
Object.defineProperty(exports, "keyManagerInstance", { enumerable: true, get: function () { return KeyManager_1.keyManagerInstance; } });
const Graph_1 = require("./Graph");
Object.defineProperty(exports, "TTRPGSystem", { enumerable: true, get: function () { return Graph_1.TTRPGSystemFeatureIndex; } });
const GrobCollection_1 = require("./GrobCollection");
Object.defineProperty(exports, "GrobCollection", { enumerable: true, get: function () { return GrobCollection_1.GrobCollection; } });
const GrobGroup_1 = require("./GrobGroup");
Object.defineProperty(exports, "GrobGroup", { enumerable: true, get: function () { return GrobGroup_1.GrobGroup; } });
const TTRPGSystemReplacementDesigner_1 = require("./Helpers/TTRPGSystemReplacementDesigner");
Object.defineProperty(exports, "TTRPGSystemHelper", { enumerable: true, get: function () { return TTRPGSystemReplacementDesigner_1.TTRPGSystemBonusDesigner; } });
const GrobBonusNode_1 = require("./Nodes/GrobBonusNode");
Object.defineProperty(exports, "GrobBonusNode", { enumerable: true, get: function () { return GrobBonusNode_1.GrobBonusNode; } });
const GrobDerivedNode_1 = require("./Nodes/GrobDerivedNode");
Object.defineProperty(exports, "GrobDerivedNode", { enumerable: true, get: function () { return GrobDerivedNode_1.GrobDerivedNode; } });
const GrobFixedNode_1 = require("./Nodes/GrobFixedNode");
Object.defineProperty(exports, "GrobFixedNode", { enumerable: true, get: function () { return GrobFixedNode_1.GrobFixedNode; } });
const GrobOrigin_1 = require("./Nodes/GrobOrigin");
Object.defineProperty(exports, "GrobDerivedOrigin", { enumerable: true, get: function () { return GrobOrigin_1.GrobOrigin; } });
const DataTable_1 = require("./Tables/DataTable");
Object.defineProperty(exports, "ADataRow", { enumerable: true, get: function () { return DataTable_1.ADataRow; } });
Object.defineProperty(exports, "ADataTable", { enumerable: true, get: function () { return DataTable_1.ADataTable; } });
const Features_1 = require("./Tables/Features");
Object.defineProperty(exports, "Feature", { enumerable: true, get: function () { return Features_1.Feature; } });
Object.defineProperty(exports, "Feature_CalcReplacement", { enumerable: true, get: function () { return Features_1.Feature_CalcReplacement; } });
Object.defineProperty(exports, "Feature_Choice", { enumerable: true, get: function () { return Features_1.Feature_Choice; } });
Object.defineProperty(exports, "Feature_Multi", { enumerable: true, get: function () { return Features_1.Feature_Multi; } });
Object.defineProperty(exports, "Feature_Origin_Collection", { enumerable: true, get: function () { return Features_1.Feature_Origin_Collection; } });
Object.defineProperty(exports, "Feature_Origin_Node", { enumerable: true, get: function () { return Features_1.Feature_Origin_Node; } });
Object.defineProperty(exports, "Feature_StatIncrease_apply", { enumerable: true, get: function () { return Features_1.Feature_StatIncrease_apply; } });
Object.defineProperty(exports, "FeatureSource", { enumerable: true, get: function () { return Features_1.FeatureSource; } });
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
