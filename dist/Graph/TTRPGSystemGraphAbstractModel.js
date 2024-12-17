import { GrobCollection } from "../GrobCollection";
import { GrobGroup } from "../GrobGroup";
import { newOutputHandler } from "../Abstractions/IOutputHandler";
import { keyManagerInstance } from "../Abstractions/KeyManager";
/**
* a general and flexible implementation of TTRPG system. it focusses on not diskrimination or sorting data.
* simply having logic that is the same for everything.
*/
export class TTRPGSystemGraphAbstractModel {
    constructor() {
        this._key = keyManagerInstance.getNewKey();
        this.data = {};
    }
    setOut(out) {
        this.out = out ? out : newOutputHandler();
    }
    _deleteGroup(group) {
        if (typeof group == 'string') {
            let g = this.getGroup(group);
            if (!g)
                return false;
            group = g;
        }
        const key = group.getName();
        let g = this.data[key];
        if (!g) {
            this.out.outError('tried to delete non existant group');
            return false;
        }
        group.dispose();
        delete this.data[key];
    }
    _createGroup(name) {
        if (this._hasGroup(name)) {
            this.out.outError('attempted to add new group, however group already existed');
            return null;
        }
        let gp = new GrobGroup(name, this);
        this.data[gp.getName()] = gp;
        return gp;
    }
    _hasGroup(name) {
        for (const key in this.data) {
            if (this.data[key].getName() == name) {
                return true;
            }
        }
        return false;
    }
    _getGroup_key(key) {
        return this.data[key];
    }
    getGroup(name) {
        for (const key in this.data) {
            if (this.data[key].getName() == name) {
                return this.data[key];
            }
        }
        return null;
    }
    _deleteCollection(collection) {
        if (!collection) {
            this.out.outError(`tried to delete collection, but supplied collection was invalid`);
        }
        const group = collection.parent;
        return group.removeCollection(collection);
    }
    _createCollection(group, name) {
        if (!group) {
            this.out.outError(`tried to create collection, but supplied group was invalid`);
        }
        if (group.hasCollection(name)) {
            this.out.outError(`Collection by that name already existed in '${group.getName()}'`);
            return null;
        }
        const collection = new GrobCollection(name, group);
        group.addCollection(collection);
        return collection;
    }
    _AddNode(collection, node) {
        if (!collection) {
            this.out.outError(`tried to add node, but supplied collection was invalid`);
        }
        if (collection.getCollectionType() != 'Node') {
            throw new Error('Tried to Add Node to Non Node Collecton');
        }
        return collection.addNode(node);
    }
    _deleteNode(node) {
        const col = node.parent;
        let r = col.removeNode(node);
        node.dispose();
        return r;
    }
    _addNodeDependency(node, dep) {
        let o1 = node.addDependency(dep);
        let o2 = dep.addDependent(node);
        if (!(o1 && o2)) {
            if (!o1) {
                this.out.outError(`Could not add dependency ${dep.getName()}, on node ${node.getName()}`);
            }
            if (!o2) {
                this.out.outError(`Could not add dependent ${node.getName()}, on node ${dep.getName()}`);
            }
            return false;
        }
        return true;
    }
    _removeNodeDependency(node, dep) {
        let o1 = node.removeDependency(dep);
        let o2 = dep.removeDependent(node);
        if (!(o1 && o2)) {
            if (!o1) {
                this.out.outError(`Could not remove dependency ${dep.getName()}, on node ${node.getName()}`);
            }
            if (!o2) {
                this.out.outError(`Could not remove dependent ${node.getName()}, on node ${dep.getName()}`);
            }
            return false;
        }
        return true;
    }
    _addTable(collection, table) {
        if (!collection) {
            this.out.outError(`tried to add node, but supplied collection was invalid`);
            return;
        }
        if (collection.getCollectionType() != 'Table') {
            this.out.outError('Tried to Add table to Non Table Collecton');
            return;
        }
        return collection.addNode(table);
    }
}
