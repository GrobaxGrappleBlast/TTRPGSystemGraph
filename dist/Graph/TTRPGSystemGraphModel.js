"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTRPGSystemGraphModel = void 0;
var tslib_1 = require("tslib");
var IOutputHandler_1 = require("../Abstractions/IOutputHandler");
var TTRPGSystemGraphAbstractModel_1 = require("./TTRPGSystemGraphAbstractModel");
var index_1 = require("../index");
var index_2 = require("../index");
var derived = 'derived';
var fixed = 'fixed';
/**
 *  handles Model operations and Data Containment,
 * Ensures that data is maintained, as well as graphlinks
*/
var TTRPGSystemGraphModel = /** @class */ (function (_super) {
    tslib_1.__extends(TTRPGSystemGraphModel, _super);
    function TTRPGSystemGraphModel() {
        var _this = _super.call(this) || this;
        _this.setOut((0, IOutputHandler_1.newOutputHandler)());
        return _this;
    }
    //TODO : find better solution than this.
    // r 
    TTRPGSystemGraphModel.prototype.initAsNew = function () {
        this._createGroup('fixed');
        this._createGroup('derived');
        this._createGroup('extra');
        this.data['fixed'].setGroupType('Node');
        this.data['derived'].setGroupType('Node');
        this.data['extra'].setGroupType('Table');
    };
    /// Create Statements 
    TTRPGSystemGraphModel.prototype.createCollection = function (group, name) {
        // ensure that group exists, same way as the others
        if (!this._hasGroup(group)) {
            this.out.outError("No group existed by name ".concat(group));
        }
        var grp = this._getGroup(group);
        if (!grp)
            return null;
        return this._createCollection(grp, name);
    };
    TTRPGSystemGraphModel.prototype.createDerivedCollection = function (name) {
        return this.createCollection(derived, name);
    };
    TTRPGSystemGraphModel.prototype.createFixedCollection = function (name) {
        return this.createCollection(fixed, name);
    };
    TTRPGSystemGraphModel.prototype.createNode = function (group, col, name) {
        // ensure that group exists, same way as the others
        if (!this._hasGroup(group)) {
            this.out.outError("No group existed by name ".concat(group));
            return null;
        }
        if (this.hasNode(group, col, name)) {
            this.out.outError("Node by this name already existed ".concat(group));
            return null;
        }
        if (group == 'fixed') {
            return this.createFixedNode(col, name);
        }
        else if (group == 'derived') {
            return this.createDerivedNode(col, name);
        }
        return null;
    };
    TTRPGSystemGraphModel.prototype.createDerivedNode = function (col, name) {
        var colName = col;
        if (typeof col == 'string') {
            var grp = this._getGroup(derived);
            if (!grp)
                return null;
            col = grp.getCollection(col);
        }
        else {
            colName = col.getName();
        }
        if (!col) {
            this.out.outError("No Derived collection found by name: ".concat(colName, " "));
            return null;
        }
        var node = new index_2.GrobDerivedNode(name, col);
        col.addNode(node);
        return node;
    };
    TTRPGSystemGraphModel.prototype.createFixedNode = function (col, name) {
        var grp = this._getGroup(fixed);
        if (!grp)
            return null;
        var colName = col;
        if (typeof col !== 'string') {
            // @ts-ignore
            colName = col.getName();
        }
        else {
            col = grp.getCollection(colName);
        }
        if (!col) {
            this.out.outError("No Fixed collection found by name: ".concat(colName, " "));
            return null;
        }
        var node = new index_1.GrobFixedNode(name, col);
        col.addNode(node);
        return node;
    };
    // has Statements 
    TTRPGSystemGraphModel.prototype.hasCollection = function (group, name) {
        var grp = this._getGroup(group);
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return false;
        }
        return grp.hasCollection(name);
    };
    TTRPGSystemGraphModel.prototype.hasDerivedCollection = function (name) {
        return this.hasCollection(derived, name);
    };
    TTRPGSystemGraphModel.prototype.hasFixedCollection = function (name) {
        return this.hasCollection(fixed, name);
    };
    TTRPGSystemGraphModel.prototype.hasNode = function (group, col, name) {
        var grp = this._getGroup(group);
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return false;
        }
        var _col = col;
        if (typeof col === 'string') {
            // @ts-ignore
            _col = this.getCollection(grp, col);
            if (!_col) {
                this.out.outError("attempted to get ".concat(group, " collection ").concat(name, ", but no collection existed by that name"));
                return false;
            }
        }
        return _col.hasNode(name);
    };
    TTRPGSystemGraphModel.prototype.hasDerivedNode = function (col, name) {
        return this.hasNode(derived, col, name);
    };
    TTRPGSystemGraphModel.prototype.hasFixedNode = function (col, name) {
        return this.hasNode(fixed, col, name);
    };
    // get Statements 
    TTRPGSystemGraphModel.prototype.getCollectionNames = function (group) {
        var grp;
        if (typeof group == 'string') {
            grp = this._getGroup(group);
        }
        else {
            grp = group;
        }
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return [];
        }
        return grp.getCollectionsNames();
    };
    TTRPGSystemGraphModel.prototype.getCollection = function (group, name) {
        var grp;
        if (typeof group == 'string') {
            grp = this._getGroup(group);
        }
        else {
            grp = group;
        }
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return null;
        }
        var col = grp.getCollection(name);
        if (!col) {
            this.out.outError("attempted to get ".concat(group, " collection ").concat(name, ", but no collection existed by that name"));
            return null;
        }
        return col;
    };
    TTRPGSystemGraphModel.prototype.getDerivedCollection = function (name) {
        return this.getCollection(derived, name);
    };
    TTRPGSystemGraphModel.prototype.getFixedCollection = function (name) {
        return this.getCollection(fixed, name);
    };
    TTRPGSystemGraphModel.prototype.getNode = function (group, col, name) {
        var grp = this._getGroup(group);
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return null;
        }
        // define output
        var node;
        // if this is a collection, just get the node.
        if (typeof col !== 'string') {
            node = col.getNode(name);
        }
        // if col is a string, then let it be seen as the name of the collection, and fetch it.
        else {
            // get data
            var colName = col;
            col = grp.getCollection(col);
            // error handling.
            if (!col) {
                this.out.outError("attempted to get ".concat(group, " collection ").concat(colName, ", but did not exist"));
                return null;
            }
            // defined output
            node = col.getNode(name);
        }
        // error handling
        if (!node) {
            this.out.outError("attempted to get ".concat(group, ".").concat(col.getName(), " Node ").concat(name, ", but did not exist"));
            return null;
        }
        return node;
    };
    TTRPGSystemGraphModel.prototype.getDerivedNode = function (col, name) {
        return this.getNode(derived, col, name);
    };
    TTRPGSystemGraphModel.prototype.getFixedNode = function (col, name) {
        return this.getNode(fixed, col, name);
    };
    TTRPGSystemGraphModel.prototype.getNodeNames = function (group, col) {
        var grp = this._getGroup(group);
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return null;
        }
        var _col;
        if (typeof col === 'string') {
            _col = grp.getCollection(col);
        }
        else {
            _col = col;
        }
        return _col.getNodeNames();
    };
    // delete Statements 
    TTRPGSystemGraphModel.prototype._deleteGroup = function (group) {
        if (typeof group == 'string') {
            var name = group;
            group = this._getGroup(group);
            if (!group) {
                this.out.outError('No Collection by name ' + name);
                return false;
            }
        }
        _super.prototype._deleteGroup.call(this, group);
    };
    TTRPGSystemGraphModel.prototype.deleteCollection = function (group, col) {
        var grp = this._getGroup(group);
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return false;
        }
        if (typeof col === 'string') {
            col =
                col = grp.getCollection(col);
            if (!col)
                return false;
        }
        return this._deleteCollection(col);
    };
    TTRPGSystemGraphModel.prototype.deleteDerivedCollection = function (col) {
        return this.deleteCollection(derived, col);
    };
    TTRPGSystemGraphModel.prototype.deleteFixedCollection = function (col) {
        return this.deleteCollection(fixed, col);
    };
    TTRPGSystemGraphModel.prototype.deleteNode = function (group, col, name) {
        var grp = this._getGroup(group);
        if (!grp) {
            this.out.outError("No group existed by name ".concat(group));
            return false;
        }
        if (typeof col === 'string') {
            col = grp.getCollection(col);
        }
        if (!col) {
            this.out.outError("attempted to get ".concat(group, " collection ").concat(name, ", but no collection existed by that name"));
            return false;
        }
        var node = col.getNode(name);
        return col.removeNode(node);
    };
    TTRPGSystemGraphModel.prototype.deleteDerivedNode = function (col, name) {
        return this.deleteNode(derived, col, name);
    };
    TTRPGSystemGraphModel.prototype.deleteFixedNode = function (col, name) {
        return this.deleteNode(fixed, col, name);
    };
    // Renaming functions
    TTRPGSystemGraphModel.prototype.renameCollection = function (group, col, newName) {
        // check that group exists, and get the values. 
        var grp;
        var grpName;
        if (typeof group == 'string') {
            grpName = group;
            grp = this._getGroup(group);
        }
        else {
            grpName = group.getName();
            grp = group;
        }
        if (!grp) {
            this.out.outError("No group existed by name ".concat(grpName));
            return null;
        }
        // Check that Collection exists and get the values 
        var colName = col;
        if (typeof col == 'string') {
            colName = col;
            col = grp.getCollection(col);
        }
        else {
            colName = col.getName();
        }
        if (!col) {
            this.out.outError("No Collection existed by name ".concat(colName, " in ").concat(grpName));
            return null;
        }
        // check that the new Name collection doesent already exist.
        if (grp.getCollection(newName)) {
            this.out.outError("Collection already existed by name ".concat(newName, " in ").concat(grpName));
            return null;
        }
        // update 
        return col.setName(newName);
    };
    TTRPGSystemGraphModel.prototype.renameItem = function (group, col, oldName, newName) {
        // check that group exists, and get the values. 
        var grp;
        var grpName;
        if (typeof group == 'string') {
            grpName = group;
            grp = this._getGroup(group);
        }
        else {
            grpName = group.getName();
            grp = group;
        }
        if (!grp) {
            this.out.outError("No group existed by name ".concat(grpName));
            return null;
        }
        // Check that Collection exists and get the values 
        var colName = col;
        if (typeof col == 'string') {
            colName = col;
            col = grp.getCollection(col);
        }
        else {
            colName = col.getName();
        }
        if (!col) {
            this.out.outError("No Collection existed by name ".concat(colName, " in ").concat(grpName));
            return null;
        }
        // check that the Node exists
        if (!col.hasNode(oldName)) {
            this.out.outError("No Item existed by name ".concat(oldName, " in ").concat(grpName, ".").concat(colName));
            return null;
        }
        // update 
        return col.update_node_name(oldName, newName);
    };
    // Validation Functions
    TTRPGSystemGraphModel.prototype.isValid = function (errorMessages) {
        if (errorMessages === void 0) { errorMessages = []; }
        var key_group, key_collection, key_node;
        var collectionNames, nodeNames;
        var group, collection, node;
        var isValid;
        // foreach group, get do this for all collections.
        for (key_group in this.data) {
            group = this.data[key_group];
            collectionNames = group.getCollectionsNames();
            // forach collection do this for all nodes 
            for (var c = 0; c < collectionNames.length; c++) {
                var colIndex = c;
                //for ( const colIndex in group.getCollectionsNames() ){
                key_collection = collectionNames[colIndex];
                collection = group.getCollection(key_collection);
                nodeNames = collection.getNodeNames();
                // do this for each node. 
                for (var n = 0; n < nodeNames.length; n++) {
                    var nodeIndex = n;
                    //for ( const nodeIndex in nodeNames ){
                    key_node = nodeNames[nodeIndex];
                    node = collection.getNode(key_node);
                    isValid = node.isValid();
                    if (!isValid) {
                        var msg = "".concat(key_group, ".").concat(key_collection, ".").concat(key_node, " was invalid");
                        var keys = [key_group, key_collection, key_node];
                        errorMessages.push({ msg: msg, key: keys });
                    }
                }
            }
        }
        return errorMessages.length == 0;
    };
    TTRPGSystemGraphModel.prototype._getGroup = function (name) {
        var grp = this.data[name];
        return grp !== null && grp !== void 0 ? grp : null;
    };
    // add dependency
    TTRPGSystemGraphModel.prototype.addNodeDependency = function (node, dep) {
        this._addNodeDependency(node, dep);
    };
    TTRPGSystemGraphModel.prototype.removeNodeDependency = function (node, dep) {
        this._removeNodeDependency(node, dep);
    };
    return TTRPGSystemGraphModel;
}(TTRPGSystemGraphAbstractModel_1.TTRPGSystemGraphAbstractModel));
exports.TTRPGSystemGraphModel = TTRPGSystemGraphModel;
