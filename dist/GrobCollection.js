"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobCollection = void 0;
const AGraphItem_1 = require("./Abstractions/AGraphItem");
class GrobCollection extends AGraphItem_1.AGraphItem {
    constructor(name, parent) {
        super(name, 'C');
        this.nodes_names = {};
        this.updateListeners = {};
    }
    getNodeNames() {
        return Object.keys(this.nodes_names);
    }
    getNodes() {
        return Object.values(this.nodes_names);
    }
    hasNode(name) {
        return this.nodes_names[name] ? true : false;
    }
    getNode(name) {
        var _a;
        return (_a = this.nodes_names[name]) !== null && _a !== void 0 ? _a : null;
    }
    addNode(node) {
        //@ts-ignore
        node.parent = this;
        this.nodes_names[node.getName()] = node;
        return true;
    }
    removeNode(node) {
        if (!node) {
            console.error('attempted to delete node "Null" ');
            return false;
        }
        const name = node.getName();
        let n = this.nodes_names[name];
        if (!n)
            return false;
        n.dispose();
        delete this.nodes_names[name];
        return this.nodes_names[name] == null;
    }
    update_node_name(oldName, newName) {
        if (oldName == newName) {
            return;
        }
        if (!this.nodes_names[oldName]) {
            return;
        }
        this.nodes_names[oldName].setName(newName, true);
        this.nodes_names[newName] = this.nodes_names[oldName];
        delete this.nodes_names[oldName];
    }
    setName(name) {
        const oldname = this.getName();
        if (oldname == name) {
            return;
        }
        super.setName(name);
        this.parent.update_collection_name(oldname, name);
        this.updateLocation(this.parent);
    }
    updateLocation(parent) {
        this.parent = parent;
        for (const name in this.nodes_names) {
            const curr = this.nodes_names[name];
            curr.updateLocation(this);
        }
        this.getNodes().forEach(node => {
            node.update();
        });
        this.callUpdateListeners();
    }
    dispose() {
        for (const name in this.nodes_names) {
            const curr = this.nodes_names[name];
            curr.dispose();
            delete this.nodes_names[name];
        }
        // @ts-ignore
        this.parent = null;
        //@ts-ignore
        this.name = null;
    }
    getCollectionType() {
        return this.colType;
    }
    setCollectionType(colType) {
        if (this.colType != null && colType != colType) {
            throw new Error('tried to convert a group type after Setting. Denied Action');
            return;
        }
        this.colType = colType;
    }
    update() {
        this.callUpdateListeners();
    }
    callUpdateListeners() {
        (Object.keys(this.updateListeners)).forEach(key => {
            this.updateListeners[key]();
        });
        return true;
    }
    addUpdateListener(key, listener) {
        if (this.updateListeners[key] != undefined) {
            console.error('tried to add updatelistener to node with key:' + key + '. but there was already a listener using that key');
            return false;
        }
        this.updateListeners[key] = listener;
    }
    removeUpdateListener(key) {
        delete this.updateListeners[key];
    }
    removeAllUpdateListeners() {
        this.updateListeners = {};
    }
}
exports.GrobCollection = GrobCollection;
