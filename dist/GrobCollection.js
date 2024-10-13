"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobCollection = void 0;
var tslib_1 = require("tslib");
var AGraphItem_1 = require("./Abstractions/AGraphItem");
var GrobCollection = /** @class */ (function (_super) {
    tslib_1.__extends(GrobCollection, _super);
    function GrobCollection(name, parent) {
        var _this = _super.call(this, name, 'C') || this;
        _this.nodes_names = {};
        _this.updateListeners = {};
        return _this;
    }
    GrobCollection.prototype.getNodeNames = function () {
        return Object.keys(this.nodes_names);
    };
    GrobCollection.prototype.getNodes = function () {
        return Object.values(this.nodes_names);
    };
    GrobCollection.prototype.hasNode = function (name) {
        return this.nodes_names[name] ? true : false;
    };
    GrobCollection.prototype.getNode = function (name) {
        var _a;
        return (_a = this.nodes_names[name]) !== null && _a !== void 0 ? _a : null;
    };
    GrobCollection.prototype.addNode = function (node) {
        //@ts-ignore
        node.parent = this;
        this.nodes_names[node.getName()] = node;
        return true;
    };
    GrobCollection.prototype.removeNode = function (node) {
        if (!node) {
            console.error('attempted to delete node "Null" ');
            return false;
        }
        var name = node.getName();
        var n = this.nodes_names[name];
        if (!n)
            return false;
        n.dispose();
        delete this.nodes_names[name];
        return this.nodes_names[name] == null;
    };
    GrobCollection.prototype.update_node_name = function (oldName, newName) {
        if (oldName == newName) {
            return;
        }
        if (!this.nodes_names[oldName]) {
            return;
        }
        this.nodes_names[oldName].setName(newName, true);
        this.nodes_names[newName] = this.nodes_names[oldName];
        delete this.nodes_names[oldName];
    };
    GrobCollection.prototype.setName = function (name) {
        var oldname = this.getName();
        if (oldname == name) {
            return;
        }
        _super.prototype.setName.call(this, name);
        this.parent.update_collection_name(oldname, name);
        this.updateLocation(this.parent);
    };
    GrobCollection.prototype.updateLocation = function (parent) {
        this.parent = parent;
        for (var name in this.nodes_names) {
            var curr = this.nodes_names[name];
            curr.updateLocation(this);
        }
        this.getNodes().forEach(function (node) {
            node.update();
        });
        this.callUpdateListeners();
    };
    GrobCollection.prototype.dispose = function () {
        for (var name in this.nodes_names) {
            var curr = this.nodes_names[name];
            curr.dispose();
            delete this.nodes_names[name];
        }
        // @ts-ignore
        this.parent = null;
        //@ts-ignore
        this.name = null;
    };
    GrobCollection.prototype.getCollectionType = function () {
        return this.colType;
    };
    GrobCollection.prototype.setCollectionType = function (colType) {
        if (this.colType != null && colType != colType) {
            throw new Error('tried to convert a group type after Setting. Denied Action');
            return;
        }
        this.colType = colType;
    };
    GrobCollection.prototype.update = function () {
        this.callUpdateListeners();
    };
    GrobCollection.prototype.callUpdateListeners = function () {
        var _this = this;
        (Object.keys(this.updateListeners)).forEach(function (key) {
            _this.updateListeners[key]();
        });
        return true;
    };
    GrobCollection.prototype.addUpdateListener = function (key, listener) {
        if (this.updateListeners[key] != undefined) {
            console.error('tried to add updatelistener to node with key:' + key + '. but there was already a listener using that key');
            return false;
        }
        this.updateListeners[key] = listener;
    };
    GrobCollection.prototype.removeUpdateListener = function (key) {
        delete this.updateListeners[key];
    };
    GrobCollection.prototype.removeAllUpdateListeners = function () {
        this.updateListeners = {};
    };
    return GrobCollection;
}(AGraphItem_1.AGraphItem));
exports.GrobCollection = GrobCollection;
