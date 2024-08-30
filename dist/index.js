"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidv4 = exports.TTRPGSystem = exports.GrobGroup = exports.GrobCollection = exports.GrobDerivedNode = exports.GrobDerivedOrigin = exports.GrobFixedNode = exports.keyManagerInstance = void 0;
var KeyManager_1 = require("./Abstractions/KeyManager");
Object.defineProperty(exports, "keyManagerInstance", { enumerable: true, get: function () { return KeyManager_1.keyManagerInstance; } });
var TTRPGSystemGraphModel_1 = require("./Graph/TTRPGSystemGraphModel");
Object.defineProperty(exports, "TTRPGSystem", { enumerable: true, get: function () { return TTRPGSystemGraphModel_1.TTRPGSystemGraphModel; } });
var GrobCollection_1 = require("./GrobCollection");
Object.defineProperty(exports, "GrobCollection", { enumerable: true, get: function () { return GrobCollection_1.GrobCollection; } });
var GrobGroup_1 = require("./GrobGroup");
Object.defineProperty(exports, "GrobGroup", { enumerable: true, get: function () { return GrobGroup_1.GrobGroup; } });
var GrobNodte_1 = require("./GrobNodte");
Object.defineProperty(exports, "GrobDerivedNode", { enumerable: true, get: function () { return GrobNodte_1.GrobDerivedNode; } });
Object.defineProperty(exports, "GrobDerivedOrigin", { enumerable: true, get: function () { return GrobNodte_1.GrobDerivedOrigin; } });
Object.defineProperty(exports, "GrobFixedNode", { enumerable: true, get: function () { return GrobNodte_1.GrobFixedNode; } });
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.uuidv4 = uuidv4;
