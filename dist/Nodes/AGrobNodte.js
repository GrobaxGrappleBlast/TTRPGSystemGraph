"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGrobNode = void 0;
var tslib_1 = require("tslib");
var AGraphItem_1 = require("../Abstractions/AGraphItem");
var TarjanNode_1 = require("./algorithm/TarjanNode");
var AGrobNode = /** @class */ (function (_super) {
    tslib_1.__extends(AGrobNode, _super);
    function AGrobNode(name, keystart, parent) {
        var _this = _super.call(this, name, keystart) || this;
        _this.dependencies = {};
        _this.dependents = {};
        _this.updateListeners = {};
        _this.replacementsRec = {};
        _this.replacementsActive = null;
        _this.bonuses = {};
        // --- --- --- --- --- --- --- --- --- --- --- --- ---
        // --- Tarjan Algorithm Implementation --- --- --- ---
        // --- --- --- --- --- --- --- --- --- --- --- --- ---
        _this.tarjanAlgorithmAlgorithmIndex = 0;
        _this.LowLinkValue = 0;
        _this.linkValue = 0;
        if (parent)
            _this.parent = parent;
        return _this;
    }
    AGrobNode.prototype._addReplacement = function (repl) {
        this.replacementsRec[repl._key] = repl;
        if (!this.replacementsActive) {
            this.replacementsActive = repl;
        }
    };
    AGrobNode.prototype._remReplacement = function (key) {
        var _a;
        // if the item does not exist, then just return
        var exists = !!this.replacementsRec[key];
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
    };
    AGrobNode.prototype._setActiveReplacement = function (key) {
        // if we do not have this key return.
        if (!this.replacementsRec[key]) {
            throw new Error('No Replacement with key ' + key);
        }
        // get and set active obj. 
        var obj = this.replacementsRec[key];
        this.replacementsActive = obj;
    };
    AGrobNode.prototype.addReplacement = function (repl) {
        var _a;
        // update
        this._addReplacement(repl);
        // if this selected a new Active node, trigger update
        if (((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) == repl._key) {
            this.update();
        }
    };
    AGrobNode.prototype.remReplacement = function (repl) {
        this.remReplacementByKey(repl._key);
    };
    AGrobNode.prototype.remReplacementByKey = function (key) {
        var _a;
        // remove node.
        var removedWasActiveNode = ((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) == key;
        this._remReplacement(key);
        // if this removed the active node.
        if (this.replacementsActive == null) {
            //rule, when removing a replacement take on of the next.
            var keys = Object.keys(this.replacementsRec);
            if (keys.length != 0) {
                this._setActiveReplacement(keys[0]);
            }
        }
        // update
        if (removedWasActiveNode) {
            this.update();
        }
    };
    AGrobNode.prototype.activateReplacement = function (repl) {
        var _a;
        // if this replacement is not in the list add it. 
        if (!this.replacementsRec[repl._key]) {
            this.addReplacement(repl);
        }
        // activate by key;
        var key = repl._key;
        var hasChanged = ((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) == key;
        this._setActiveReplacement(key);
        // if we have changed call update
        if (hasChanged) {
            this.update();
        }
    };
    AGrobNode.prototype.activateReplacementByKey = function (key) {
        var _a;
        // note if we have changed, and call activate.
        var hasChanged = ((_a = this.replacementsActive) === null || _a === void 0 ? void 0 : _a._key) != key;
        this._setActiveReplacement(key);
        // if we have changed call update
        if (hasChanged) {
            this.update();
        }
    };
    AGrobNode.prototype.getReplacements = function () {
        return Object.values(this.replacementsRec);
    };
    AGrobNode.prototype.getReplacementNames = function () {
        return Object.keys(this.replacementsRec);
    };
    AGrobNode.prototype.addBonus = function (bonusIndex, bonus, errors) {
        if (errors === void 0) { errors = []; }
        bonus.update();
        // first see if there is a circular dependency, if there already is dont do a thing. 
        var tarAlgoRequest = TarjanNode_1.GrobAlgorithms.TarjAlgo([this]);
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
        var StrongComps = TarjanNode_1.GrobAlgorithms.TarjAlgo([this]);
        if (StrongComps[0]) {
            errors.push({ key: 'Pre-AddBonusError', msg: 'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused' });
            this.remBonusIndex(bonusIndex);
            return false;
        }
        this.update();
        return true;
    };
    AGrobNode.prototype.remBonus = function (bonus) {
        var indicies = this.hasBonus(bonus);
        if (!indicies)
            return false;
        for (var i in indicies) {
            var index = indicies[i];
            delete this.bonuses[index];
        }
        this.removeDependency(bonus);
        this.update();
        return true;
    };
    AGrobNode.prototype.hasBonus = function (bonus) {
        var keys = [];
        for (var key in this.bonuses) {
            var value = this.bonuses[key];
            if (value._key == bonus._key) {
                keys.push(key);
            }
        }
        if (keys.length == 0)
            return null;
        return keys;
    };
    AGrobNode.prototype.remBonusIndex = function (bonusIndex) {
        if (!this.bonuses[bonusIndex])
            return true;
        var node = this.bonuses[bonusIndex];
        this.removeDependency(node);
        delete this.bonuses[bonusIndex];
        if (!this.hasBonus(node)) {
            this.removeDependency(node);
            return true;
        }
        return true;
    };
    AGrobNode.prototype.hasBonusIndex = function (key) {
        if (this.bonuses[key])
            return true;
        return false;
    };
    AGrobNode.getTypeString = function () {
        return 'Nodte<T extends Nodte<T>>';
    };
    AGrobNode.prototype.addDependent = function (node) {
        var key = node.getKey();
        if (this.dependents[key]) {
            return true;
        }
        this.dependents[key] = node;
        return true;
    };
    AGrobNode.prototype.removeDependent = function (node) {
        delete this.dependents[node.getKey()];
        return this.dependents[node.getKey()] == null;
    };
    AGrobNode.prototype.getDependents = function () {
        var _a;
        //@ts-ignore
        return (_a = Object.values(this.dependents)) !== null && _a !== void 0 ? _a : [];
    };
    AGrobNode.prototype.addDependency = function (node) {
        var key = node.getKey();
        this.dependencies[key] = node;
        node.addDependent(this);
        return true;
    };
    AGrobNode.prototype.removeDependency = function (node) {
        // delete the dependency
        var key = node.getKey();
        if (this.dependencies[key]) {
            delete this.dependencies[key];
            node.removeDependent(this);
        }
        return this.dependencies[key] == null;
    };
    AGrobNode.prototype.nullifyDependency = function (node) {
        return false;
    };
    AGrobNode.prototype.getDependencies = function () {
        var _a;
        //@ts-ignore
        return (_a = Object.values(this.dependencies)) !== null && _a !== void 0 ? _a : [];
    };
    AGrobNode.prototype.getValue = function () {
        // get initial value
        var initialValue = this._getValue();
        // if this has an active replacement, 
        if (this.replacementsActive) {
            initialValue = this.replacementsActive.getValue();
        }
        // add bonuses 
        for (var key in this.bonuses) {
            var bonus = this.bonuses[key];
            var value = bonus._getValue();
            initialValue += value;
        }
        return initialValue;
    };
    AGrobNode.prototype.getLocationKey = function () {
        var segs = this.getLocationKeySegments();
        return segs.join('.');
    };
    AGrobNode.prototype.getLocationKeySegments = function () {
        var _a, _b, _c, _d, _e, _f;
        var seg = ['', '', ''];
        seg[0] = (_c = (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.getName()) !== null && _c !== void 0 ? _c : 'unknown';
        seg[1] = (_e = (_d = this.parent) === null || _d === void 0 ? void 0 : _d.getName()) !== null && _e !== void 0 ? _e : 'unknown';
        seg[2] = (_f = this.getName()) !== null && _f !== void 0 ? _f : 'unknown';
        return seg;
    };
    AGrobNode.prototype.update = function () {
        var _this = this;
        // call implemented update
        this._update();
        // update all of update listeners. 
        (Object.keys(this.updateListeners)).forEach(function (key) {
            _this.updateListeners[key]();
        });
        // call all dependents and return success state.
        var success = true;
        for (var k in this.dependents) {
            var dep = this.dependents[k];
            success = success && dep.update();
        }
        return success;
    };
    AGrobNode.prototype.dispose = function () {
        // delete references all 
        for (var key in this.dependencies) {
            var curr = this.dependencies[key];
            curr.removeDependent(this);
        }
        for (var key in this.dependents) {
            var curr = this.dependents[key];
            curr.nullifyDependency(this);
        }
        //@ts-ignore
        this.parent = null;
        //@ts-ignore
        this.name = null;
    };
    AGrobNode.prototype.setName = function (name, parentCall) {
        if (parentCall === void 0) { parentCall = false; }
        var oldname = this.getName();
        _super.prototype.setName.call(this, name);
        if (!parentCall) {
            this.parent.update_node_name(oldname, name);
        }
        this.updateLocation(this.parent);
    };
    /* by location we mean this items group - collection - node key.  */
    AGrobNode.prototype.updateLocation = function (parent) {
        this.parent = parent;
        for (var key in this.dependents) {
            var dep = this.dependents[key];
            dep.updateDependecysLocation(this);
        }
        this.update();
    };
    AGrobNode.prototype.updateDependecysLocation = function (dependency) {
    };
    AGrobNode.prototype.isValid = function () {
        return true;
    };
    // --- --- --- --- --- --- --- --- --- --- --- --- ---
    // -For independent UI implementation's to have soemthing to attach a node's update to. 
    // --- --- --- --- --- --- --- --- --- --- --- --- ---
    AGrobNode.prototype.addUpdateListener = function (key, listener) {
        if (this.updateListeners[key] != undefined) {
            console.error('tried to add updatelistener to node with key:' + key + '. but there was already a listener using that key');
            return false;
        }
        this.updateListeners[key] = listener;
    };
    AGrobNode.prototype.removeUpdateListener = function (key) {
        delete this.updateListeners[key];
    };
    AGrobNode.prototype.removeAllUpdateListeners = function () {
        this.updateListeners = {};
    };
    return AGrobNode;
}(AGraphItem_1.AGraphItem));
exports.AGrobNode = AGrobNode;
