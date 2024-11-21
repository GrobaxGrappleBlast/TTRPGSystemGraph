"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGrobNode = void 0;
const AGraphItem_1 = require("../Abstractions/AGraphItem");
const TarjanNode_1 = require("./algorithm/TarjanNode");
class AGrobNode extends AGraphItem_1.AGraphItem {
    constructor(name, keystart, parent) {
        super(name, keystart);
        this.dependencies = {};
        this.dependents = {};
        this.updateListeners = {};
        this.replacementsRec = {};
        this.replacementsActive = null;
        this.bonuses = {};
        // --- --- --- --- --- --- --- --- --- --- --- --- ---
        // --- Tarjan Algorithm Implementation --- --- --- ---
        // --- --- --- --- --- --- --- --- --- --- --- --- ---
        this.tarjanAlgorithmAlgorithmIndex = 0;
        this.LowLinkValue = 0;
        this.linkValue = 0;
        if (parent)
            this.parent = parent;
    }
    _addReplacement(repl) {
        this.replacementsRec[repl._key] = repl;
        if (!this.replacementsActive) {
            this.replacementsActive = repl;
        }
    }
    _remReplacement(key) {
        var _a;
        // if the item does not exist, then just return
        const exists = !!this.replacementsRec[key];
        if (!exists)
            return false;
        // delete item, and if this is the active, nullify it.
        delete this.replacementsRec[key];
        if (((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) == key) {
            this.replacementsActive = null;
        }
        // return if it exists, after a succesfull delete. 
        if (!this.replacementsRec[key]) {
            return true;
        }
        return false;
    }
    _setActiveReplacement(key) {
        // if we do not have this key return.
        if (!this.replacementsRec[key]) {
            throw new Error('No Replacement with key ' + key);
        }
        // get and set active obj. 
        const obj = this.replacementsRec[key];
        this.replacementsActive = obj;
    }
    addReplacement(repl) {
        var _a;
        // update
        this._addReplacement(repl);
        // if this selected a new Active node, trigger update
        if (((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) == repl._key) {
            this.update();
        }
    }
    remReplacement(repl) {
        this.remReplacementByKey(repl._key);
    }
    remReplacementByKey(key) {
        var _a;
        // remove node.
        const removedWasActiveNode = ((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) == key;
        this._remReplacement(key);
        // if this removed the active node.
        if (this.replacementsActive == null) {
            //rule, when removing a replacement take on of the next.
            const keys = Object.keys(this.replacementsRec);
            if (keys.length != 0) {
                this._setActiveReplacement(keys[0]);
            }
        }
        // update
        if (removedWasActiveNode) {
            this.update();
        }
    }
    activateReplacement(repl) {
        var _a;
        // if this replacement is not in the list add it. 
        if (!this.replacementsRec[repl._key]) {
            this.addReplacement(repl);
        }
        // activate by key;
        const key = repl._key;
        const hasChanged = ((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) == key;
        this._setActiveReplacement(key);
        // if we have changed call update
        if (hasChanged) {
            this.update();
        }
    }
    activateReplacementByKey(key) {
        var _a;
        // note if we have changed, and call activate.
        const hasChanged = ((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) != key;
        this._setActiveReplacement(key);
        // if we have changed call update
        if (hasChanged) {
            this.update();
        }
    }
    getReplacements() {
        return Object.values(this.replacementsRec);
    }
    getReplacementNames() {
        return Object.keys(this.replacementsRec);
    }
    addBonus(bonusIndex, bonus, errors = []) {
        bonus.update();
        // first see if there is a circular dependency, if there already is dont do a thing. 
        let tarAlgoRequest = TarjanNode_1.GrobAlgorithms.TarjAlgo([this]);
        if (tarAlgoRequest[0]) {
            errors.push({ key: 'Pre-AddBonusError', msg: 'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused' });
            return false;
        }
        if (this.bonuses[bonusIndex]) {
            this.remBonusIndex(bonusIndex);
        }
        this.bonuses[bonusIndex] = bonus;
        this.addDependency(bonus);
        // first see if there is a circular dependency, if there already is dont do a thing. 
        let StrongComps = TarjanNode_1.GrobAlgorithms.TarjAlgo([this]);
        if (StrongComps[0]) {
            errors.push({ key: 'Pre-AddBonusError', msg: 'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused' });
            this.remBonusIndex(bonusIndex);
            return false;
        }
        this.update();
        return true;
    }
    remBonus(bonus) {
        const indicies = this.hasBonus(bonus);
        if (!indicies)
            return false;
        for (let i in indicies) {
            const index = indicies[i];
            delete this.bonuses[index];
        }
        this.removeDependency(bonus);
        this.update();
        return true;
    }
    hasBonus(bonus) {
        let keys = [];
        for (const key in this.bonuses) {
            const value = this.bonuses[key];
            if (value._key == bonus._key) {
                keys.push(key);
            }
        }
        if (keys.length == 0)
            return null;
        return keys;
    }
    remBonusIndex(bonusIndex) {
        if (!this.bonuses[bonusIndex])
            return true;
        const node = this.bonuses[bonusIndex];
        this.removeDependency(node);
        delete this.bonuses[bonusIndex];
        if (!this.hasBonus(node)) {
            this.removeDependency(node);
            return true;
        }
        return true;
    }
    hasBonusIndex(key) {
        if (this.bonuses[key])
            return true;
        return false;
    }
    static getTypeString() {
        return 'Nodte<T extends Nodte<T>>';
    }
    addDependent(node) {
        const key = node.getKey();
        if (this.dependents[key]) {
            return true;
        }
        this.dependents[key] = node;
        return true;
    }
    removeDependent(node) {
        delete this.dependents[node.getKey()];
        return this.dependents[node.getKey()] == null;
    }
    getDependents() {
        var _a;
        //@ts-ignore
        return (_a = Object.values(this.dependents)) !== null && _a !== void 0 ? _a : [];
    }
    addDependency(node) {
        const key = node.getKey();
        this.dependencies[key] = node;
        node.addDependent(this);
        return true;
    }
    removeDependency(node) {
        // delete the dependency
        const key = node.getKey();
        if (this.dependencies[key]) {
            delete this.dependencies[key];
            node.removeDependent(this);
        }
        return this.dependencies[key] == null;
    }
    nullifyDependency(node) {
        return false;
    }
    getDependencies() {
        var _a;
        //@ts-ignore
        return (_a = Object.values(this.dependencies)) !== null && _a !== void 0 ? _a : [];
    }
    getValue() {
        // get initial value
        var initialValue = this._getValue();
        // if this has an active replacement, 
        if (this.replacementsActive) {
            initialValue = this.replacementsActive.getValue();
        }
        // add bonuses 
        for (const key in this.bonuses) {
            const bonus = this.bonuses[key];
            const value = bonus._getValue();
            initialValue += value;
        }
        return initialValue;
    }
    getLocationKey() {
        let segs = this.getLocationKeySegments();
        return segs.join('.');
    }
    getLocationKeySegments() {
        var _a, _b, _c, _d, _e, _f;
        let seg = ['', '', ''];
        seg[0] = (_c = (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.getName()) !== null && _c !== void 0 ? _c : 'unknown';
        seg[1] = (_e = (_d = this.parent) === null || _d === void 0 ? void 0 : _d.getName()) !== null && _e !== void 0 ? _e : 'unknown';
        seg[2] = (_f = this.getName()) !== null && _f !== void 0 ? _f : 'unknown';
        return seg;
    }
    update() {
        // call implemented update
        this._update();
        // update all of update listeners. 
        (Object.keys(this.updateListeners)).forEach(key => {
            this.updateListeners[key]();
        });
        // call all dependents and return success state.
        let success = true;
        for (const k in this.dependents) {
            const dep = this.dependents[k];
            success = success && dep.update();
        }
        return success;
    }
    dispose() {
        // delete references all 
        for (const key in this.dependencies) {
            const curr = this.dependencies[key];
            curr.removeDependent(this);
        }
        for (const key in this.dependents) {
            const curr = this.dependents[key];
            curr.nullifyDependency(this);
        }
        //@ts-ignore
        this.parent = null;
        //@ts-ignore
        this.name = null;
    }
    setName(name, parentCall = false) {
        const oldname = this.getName();
        super.setName(name);
        if (!parentCall) {
            this.parent.update_node_name(oldname, name);
        }
        this.updateLocation(this.parent);
    }
    /* by location we mean this items group - collection - node key.  */
    updateLocation(parent) {
        this.parent = parent;
        for (const key in this.dependents) {
            const dep = this.dependents[key];
            dep.updateDependecysLocation(this);
        }
        this.update();
    }
    updateDependecysLocation(dependency) {
    }
    isValid() {
        return true;
    }
    // --- --- --- --- --- --- --- --- --- --- --- --- ---
    // -For independent UI implementation's to have soemthing to attach a node's update to. 
    // --- --- --- --- --- --- --- --- --- --- --- --- ---
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
exports.AGrobNode = AGrobNode;
