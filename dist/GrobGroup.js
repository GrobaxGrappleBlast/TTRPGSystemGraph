"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobGroup = void 0;
const AGraphItem_1 = require("./Abstractions/AGraphItem");
class GrobGroup extends AGraphItem_1.AGraphItem {
    constructor(name, parent) {
        super(name, 'G');
        this.collections_names = {};
        this.updateListeners = {};
    }
    getCollectionsNames() {
        return Object.keys(this.collections_names);
    }
    hasCollection(name) {
        return this.collections_names[name] ? true : false;
    }
    getCollection(name) {
        return this.collections_names[name];
    }
    addCollection(collection) {
        collection.parent = this;
        this.collections_names[collection.getName()] = collection;
        collection.setCollectionType(this.groupType);
        this.callUpdateListeners();
        return true;
    }
    removeCollection(collection) {
        const name = collection.getName();
        let c = this.collections_names[name];
        if (!c)
            return false;
        collection.dispose();
        delete this.collections_names[name];
        this.callUpdateListeners();
        return this.collections_names[name] == null;
    }
    update_collection_name(oldName, newName) {
        if (!this.collections_names[oldName])
            return;
        this.collections_names[newName] = this.collections_names[oldName];
        delete this.collections_names[oldName];
        this.collections_names[newName].setName(newName);
    }
    setName(name) {
        super.setName(name);
        for (const name in this.collections_names) {
            const curr = this.collections_names[name];
            curr.updateLocation(this);
        }
        this.callUpdateListeners();
    }
    dispose() {
        for (const name in this.collections_names) {
            const curr = this.collections_names[name];
            curr.dispose();
            delete this.collections_names[name];
        }
        //@ts-ignore
        this.name = null;
    }
    getGroupType() {
        return this.groupType;
    }
    setGroupType(groupType) {
        if (this.groupType != null && groupType != groupType) {
            throw new Error('tried to convert a group type after Setting. Denied Action');
            return;
        }
        this.groupType = groupType;
        Object.values(this.collections_names).forEach(col => {
            col.setCollectionType(groupType);
        });
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
exports.GrobGroup = GrobGroup;
