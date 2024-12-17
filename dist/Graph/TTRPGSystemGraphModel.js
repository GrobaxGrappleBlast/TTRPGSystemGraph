import { newOutputHandler } from "../Abstractions/IOutputHandler";
import { GrobFixedNode } from "../index";
import { GrobDerivedNode } from "../index";
import { TTRPGSystemGraphAbstractModel } from ".";
const derived = 'derived';
const fixed = 'fixed';
/**
 *  handles Model operations and Data Containment,
 * Ensures that data is maintained, as well as graphlinks
*/
export class TTRPGSystemGraphModel extends TTRPGSystemGraphAbstractModel {
    constructor() {
        super();
        this._createGroup('fixed');
        this._createGroup('derived');
        this._createGroup('extra');
        this.setOut(newOutputHandler());
    }
    //TODO : find better solution than this.
    // r 
    initAsNew() {
        this._createGroup('fixed');
        this._createGroup('derived');
        this._createGroup('extra');
        this.data['fixed'].setGroupType('Node');
        this.data['derived'].setGroupType('Node');
        this.data['extra'].setGroupType('Table');
    }
    /// Create Statements 
    createCollection(group, name) {
        // ensure that group exists, same way as the others
        if (!this._hasGroup(group)) {
            this.out.outError(`No group existed by name ${group}`);
        }
        let grp = this.getGroup(group);
        if (!grp)
            return null;
        return this._createCollection(grp, name);
    }
    createDerivedCollection(name) {
        return this.createCollection(derived, name);
    }
    createFixedCollection(name) {
        return this.createCollection(fixed, name);
    }
    createNode(group, col, name) {
        // ensure that group exists, same way as the others
        if (!this._hasGroup(group)) {
            this.out.outError(`No group existed by name ${group}`);
            return null;
        }
        if (this.hasNode(group, col, name)) {
            this.out.outError(`Node by this name already existed ${group}`);
            return null;
        }
        if (group == 'fixed') {
            return this.createFixedNode(col, name);
        }
        else if (group == 'derived') {
            return this.createDerivedNode(col, name);
        }
        return null;
    }
    createDerivedNode(col, name) {
        let colName = col;
        if (typeof col == 'string') {
            let grp = this.getGroup(derived);
            if (!grp)
                return null;
            col = grp.getCollection(col);
        }
        else {
            colName = col.getName();
        }
        if (!col) {
            this.out.outError(`No Derived collection found by name: ${colName} `);
            return null;
        }
        const node = new GrobDerivedNode(name, col);
        col.addNode(node);
        return node;
    }
    createFixedNode(col, name) {
        let grp = this.getGroup(fixed);
        if (!grp)
            return null;
        let colName = col;
        if (typeof col !== 'string') {
            // @ts-ignore
            colName = col.getName();
        }
        else {
            col = grp.getCollection(colName);
        }
        if (!col) {
            this.out.outError(`No Fixed collection found by name: ${colName} `);
            return null;
        }
        const node = new GrobFixedNode(name, col);
        col.addNode(node);
        return node;
    }
    // has Statements 
    hasCollection(group, name) {
        const grp = this.getGroup(group);
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return false;
        }
        return grp.hasCollection(name);
    }
    hasDerivedCollection(name) {
        return this.hasCollection(derived, name);
    }
    hasFixedCollection(name) {
        return this.hasCollection(fixed, name);
    }
    hasNode(group, col, name) {
        const grp = this.getGroup(group);
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return false;
        }
        let _col = col;
        if (typeof col === 'string') {
            // @ts-ignore
            _col = this.getCollection(grp, col);
            if (!_col) {
                this.out.outError(`attempted to get ${group} collection ${name}, but no collection existed by that name`);
                return false;
            }
        }
        return _col.hasNode(name);
    }
    hasDerivedNode(col, name) {
        return this.hasNode(derived, col, name);
    }
    hasFixedNode(col, name) {
        return this.hasNode(fixed, col, name);
    }
    // get Statements 
    getCollectionNames(group) {
        let grp;
        if (typeof group == 'string') {
            grp = this.getGroup(group);
        }
        else {
            grp = group;
        }
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return [];
        }
        return grp.getCollectionsNames();
    }
    getCollectionLoc(location) {
        // if falsey
        if (!location) {
            throw new Error(' getNodeLocString : invalid location string, nodestring was ' + location);
        }
        // Get segments 
        const segs = location.split('.');
        if (segs.length != 2) {
            throw new Error('invalid source string. Source string must be three names seperated by a . , namely group.collection , location string was ' + location);
        }
        // get node
        return this.getCollection(segs[0], segs[1]);
    }
    getCollection(group, name) {
        let grp;
        if (typeof group == 'string') {
            grp = this.getGroup(group);
        }
        else {
            grp = group;
        }
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return null;
        }
        const col = grp.getCollection(name);
        if (!col) {
            this.out.outError(`attempted to get ${group} collection ${name}, but no collection existed by that name`);
            return null;
        }
        return col;
    }
    getDerivedCollection(name) {
        return this.getCollection(derived, name);
    }
    getFixedCollection(name) {
        return this.getCollection(fixed, name);
    }
    getNodeLocString(location) {
        // if falsey
        if (!location) {
            throw new Error(' getNodeLocString : invalid location string, nodestring was ' + location);
        }
        // Get segments 
        const segs = location.split('.');
        if (segs.length != 3) {
            throw new Error('invalid source string. Source string must be three names seperated by a . , namely group.collection.node , location string was ' + location);
        }
        // get node
        return this.getNode(segs[0], segs[1], segs[2]);
    }
    getNode(group, col, name) {
        const grp = this.getGroup(group);
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return null;
        }
        // define output
        let node;
        // if this is a collection, just get the node.
        if (typeof col !== 'string') {
            node = col.getNode(name);
        }
        // if col is a string, then let it be seen as the name of the collection, and fetch it.
        else {
            // get data
            const colName = col;
            col = grp.getCollection(col);
            // error handling.
            if (!col) {
                this.out.outError(`attempted to get ${group} collection ${colName}, but did not exist`);
                return null;
            }
            // defined output
            node = col.getNode(name);
        }
        // error handling
        if (!node) {
            this.out.outError(`attempted to get ${group}.${col.getName()} Node ${name}, but did not exist`);
            return null;
        }
        return node;
    }
    getDerivedNode(col, name) {
        return this.getNode(derived, col, name);
    }
    getFixedNode(col, name) {
        return this.getNode(fixed, col, name);
    }
    getNodeNames(group, col) {
        const grp = this.getGroup(group);
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return null;
        }
        let _col;
        if (typeof col === 'string') {
            _col = grp.getCollection(col);
        }
        else {
            _col = col;
        }
        return _col.getNodeNames();
    }
    // delete Statements 
    _deleteGroup(group) {
        if (typeof group == 'string') {
            const name = group;
            group = this.getGroup(group);
            if (!group) {
                this.out.outError('No Collection by name ' + name);
                return false;
            }
        }
        super._deleteGroup(group);
    }
    deleteCollection(group, col) {
        const grp = this.getGroup(group);
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return false;
        }
        if (typeof col === 'string') {
            col =
                col = grp.getCollection(col);
            if (!col)
                return false;
        }
        return this._deleteCollection(col);
    }
    deleteDerivedCollection(col) {
        return this.deleteCollection(derived, col);
    }
    deleteFixedCollection(col) {
        return this.deleteCollection(fixed, col);
    }
    deleteNode(group, col, name) {
        const grp = this.getGroup(group);
        if (!grp) {
            this.out.outError(`No group existed by name ${group}`);
            return false;
        }
        if (typeof col === 'string') {
            col = grp.getCollection(col);
        }
        if (!col) {
            this.out.outError(`attempted to get ${group} collection ${name}, but no collection existed by that name`);
            return false;
        }
        let node = col.getNode(name);
        return col.removeNode(node);
    }
    deleteDerivedNode(col, name) {
        return this.deleteNode(derived, col, name);
    }
    deleteFixedNode(col, name) {
        return this.deleteNode(fixed, col, name);
    }
    // Renaming functions
    renameCollection(group, col, newName) {
        // check that group exists, and get the values. 
        let grp;
        let grpName;
        if (typeof group == 'string') {
            grpName = group;
            grp = this.getGroup(group);
        }
        else {
            grpName = group.getName();
            grp = group;
        }
        if (!grp) {
            this.out.outError(`No group existed by name ${grpName}`);
            return null;
        }
        // Check that Collection exists and get the values 
        let colName = col;
        if (typeof col == 'string') {
            colName = col;
            col = grp.getCollection(col);
        }
        else {
            colName = col.getName();
        }
        if (!col) {
            this.out.outError(`No Collection existed by name ${colName} in ${grpName}`);
            return null;
        }
        // check that the new Name collection doesent already exist.
        if (grp.getCollection(newName)) {
            this.out.outError(`Collection already existed by name ${newName} in ${grpName}`);
            return null;
        }
        // update 
        return col.setName(newName);
    }
    renameItem(group, col, oldName, newName) {
        // check that group exists, and get the values. 
        let grp;
        let grpName;
        if (typeof group == 'string') {
            grpName = group;
            grp = this.getGroup(group);
        }
        else {
            grpName = group.getName();
            grp = group;
        }
        if (!grp) {
            this.out.outError(`No group existed by name ${grpName}`);
            return null;
        }
        // Check that Collection exists and get the values 
        let colName = col;
        if (typeof col == 'string') {
            colName = col;
            col = grp.getCollection(col);
        }
        else {
            colName = col.getName();
        }
        if (!col) {
            this.out.outError(`No Collection existed by name ${colName} in ${grpName}`);
            return null;
        }
        // check that the Node exists
        if (!col.hasNode(oldName)) {
            this.out.outError(`No Item existed by name ${oldName} in ${grpName}.${colName}`);
            return null;
        }
        // update 
        return col.update_node_name(oldName, newName);
    }
    // Validation Functions
    isValid(errorMessages = []) {
        let key_group, key_collection, key_node;
        let collectionNames, nodeNames;
        let group, collection, node;
        let isValid;
        // foreach group, get do this for all collections.
        for (key_group in this.data) {
            group = this.data[key_group];
            collectionNames = group.getCollectionsNames();
            // forach collection do this for all nodes 
            for (let c = 0; c < collectionNames.length; c++) {
                const colIndex = c;
                //for ( const colIndex in group.getCollectionsNames() ){
                key_collection = collectionNames[colIndex];
                collection = group.getCollection(key_collection);
                nodeNames = collection.getNodeNames();
                // do this for each node. 
                for (let n = 0; n < nodeNames.length; n++) {
                    const nodeIndex = n;
                    //for ( const nodeIndex in nodeNames ){
                    key_node = nodeNames[nodeIndex];
                    node = collection.getNode(key_node);
                    isValid = node.isValid();
                    if (!isValid) {
                        let msg = `${key_group}.${key_collection}.${key_node} was invalid`;
                        let keys = [key_group, key_collection, key_node];
                        errorMessages.push({ msg: msg, key: keys });
                    }
                }
            }
        }
        return errorMessages.length == 0;
    }
    getGroup(name) {
        let grp = this.data[name];
        return grp !== null && grp !== void 0 ? grp : null;
    }
    // add dependency
    addNodeDependency(node, dep) {
        this._addNodeDependency(node, dep);
    }
    removeNodeDependency(node, dep) {
        this._removeNodeDependency(node, dep);
    }
}
