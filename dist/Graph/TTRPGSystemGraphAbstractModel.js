"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTRPGSystemGraphAbstractModel = void 0;
var GrobCollection_1 = require("../GrobCollection");
var GrobGroup_1 = require("../GrobGroup");
var IOutputHandler_1 = require("../Abstractions/IOutputHandler");
/**
* a general and flexible implementation of TTRPG system. it focusses on not diskrimination or sorting data.
* simply having logic that is the same for everything.
*/
var TTRPGSystemGraphAbstractModel = /** @class */ (function () {
    function TTRPGSystemGraphAbstractModel() {
        this.data = {};
    }
    TTRPGSystemGraphAbstractModel.prototype.setOut = function (out) {
        this.out = out ? out : (0, IOutputHandler_1.newOutputHandler)();
    };
    TTRPGSystemGraphAbstractModel.prototype.deleteGroup = function (group) {
        if (typeof group == 'string') {
            var g_1 = this.getGroup(group);
            if (!g_1)
                return false;
            group = g_1;
        }
        var key = group.getName();
        var g = this.data[key];
        if (!g) {
            this.out.outError('tried to delete non existant group');
            return false;
        }
        group.dispose();
        delete this.data[key];
    };
    TTRPGSystemGraphAbstractModel.prototype._createGroup = function (name) {
        if (this._hasGroup(name)) {
            this.out.outError('attempted to add new group, however group already existed');
            return null;
        }
        var gp = new GrobGroup_1.GrobGroup(name, this);
        this.data[gp.getName()] = gp;
        return gp;
    };
    TTRPGSystemGraphAbstractModel.prototype._hasGroup = function (name) {
        for (var key in this.data) {
            if (this.data[key].getName() == name) {
                return true;
            }
        }
        return false;
    };
    TTRPGSystemGraphAbstractModel.prototype._getGroup_key = function (key) {
        return this.data[key];
    };
    TTRPGSystemGraphAbstractModel.prototype.getGroup = function (name) {
        for (var key in this.data) {
            if (this.data[key].getName() == name) {
                return this.data[key];
            }
        }
        return null;
    };
    TTRPGSystemGraphAbstractModel.prototype._deleteCollection = function (collection) {
        if (!collection) {
            this.out.outError("tried to delete collection, but supplied collection was invalid");
        }
        var group = collection.parent;
        return group.removeCollection(collection);
    };
    TTRPGSystemGraphAbstractModel.prototype._createCollection = function (group, name) {
        if (!group) {
            this.out.outError("tried to create collection, but supplied group was invalid");
        }
        if (group.hasCollection(name)) {
            this.out.outError("Collection by that name already existed in '".concat(group.getName(), "'"));
            return null;
        }
        var collection = new GrobCollection_1.GrobCollection(name, group);
        group.addCollection(collection);
        return collection;
    };
    TTRPGSystemGraphAbstractModel.prototype._AddNode = function (collection, node) {
        if (!collection) {
            this.out.outError("tried to add node, but supplied collection was invalid");
        }
        if (collection.getCollectionType() != 'Node') {
            throw new Error('Tried to Add Node to Non Node Collecton');
        }
        return collection.addNode(node);
    };
    TTRPGSystemGraphAbstractModel.prototype._deleteNode = function (node) {
        var col = node.parent;
        var r = col.removeNode(node);
        node.dispose();
        return r;
    };
    TTRPGSystemGraphAbstractModel.prototype._addNodeDependency = function (node, dep) {
        var o1 = node.addDependency(dep);
        var o2 = dep.addDependent(node);
        if (!(o1 && o2)) {
            if (!o1) {
                this.out.outError("Could not add dependency ".concat(dep.getName(), ", on node ").concat(node.getName()));
            }
            if (!o2) {
                this.out.outError("Could not add dependent ".concat(node.getName(), ", on node ").concat(dep.getName()));
            }
            return false;
        }
        return true;
    };
    TTRPGSystemGraphAbstractModel.prototype._removeNodeDependency = function (node, dep) {
        var o1 = node.removeDependency(dep);
        var o2 = dep.removeDependent(node);
        if (!(o1 && o2)) {
            if (!o1) {
                this.out.outError("Could not remove dependency ".concat(dep.getName(), ", on node ").concat(node.getName()));
            }
            if (!o2) {
                this.out.outError("Could not remove dependent ".concat(node.getName(), ", on node ").concat(dep.getName()));
            }
            return false;
        }
        return true;
    };
    TTRPGSystemGraphAbstractModel.prototype._addTable = function (collection, table) {
        if (!collection) {
            this.out.outError("tried to add node, but supplied collection was invalid");
            return;
        }
        if (collection.getCollectionType() != 'Table') {
            this.out.outError('Tried to Add table to Non Table Collecton');
            return;
        }
        return collection.addNode(table);
    };
    return TTRPGSystemGraphAbstractModel;
}());
exports.TTRPGSystemGraphAbstractModel = TTRPGSystemGraphAbstractModel;
