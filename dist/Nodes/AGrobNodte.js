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
    AGrobNode.prototype.addBonus = function (bonusIndex, bonus, errors) {
        if (errors === void 0) { errors = []; }
        bonus.update();
        // first see if there is a circular dependency, if there already is dont do a thing. 
        var preStrongComponents = {};
        var alreadyHadStrongComps = TarjanNode_1.GrobAlgorithms.TarjAlgo([this], preStrongComponents);
        if (alreadyHadStrongComps[0]) {
            errors.push({ key: 'Pre-AddBonusError', msg: 'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused' });
            return false;
        }
        if (this.bonuses[bonusIndex]) {
            this.remBonus(bonusIndex);
        }
        this.bonuses[bonusIndex] = bonus;
        this.addDependency(bonus);
        // first see if there is a circular dependency, if there already is dont do a thing. 
        var StrongComponents = {};
        var StrongComps = TarjanNode_1.GrobAlgorithms.TarjAlgo([this], StrongComponents);
        if (StrongComps[0]) {
            errors.push({ key: 'Pre-AddBonusError', msg: 'this node already had circular dependencies, before adding another node. Added Bonus is therefore refused' });
            this.remBonus(bonusIndex);
            return false;
        }
        return true;
    };
    AGrobNode.prototype.remBonus = function (bonusIndex) {
        if (!this.bonuses[bonusIndex])
            return true;
        var node = this.bonuses[bonusIndex];
        delete this.bonuses[bonusIndex];
        this.removeDependency(node);
        return true;
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
        return false;
    };
    AGrobNode.prototype.removeDependency = function (node) {
        return false;
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
        var initialValue = this._getValue();
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
        this._update();
        (Object.keys(this.updateListeners)).forEach(function (key) {
            _this.updateListeners[key]();
        });
        return true;
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
    AGrobNode.prototype.setName = function (name) {
        var oldname = this.getName();
        _super.prototype.setName.call(this, name);
        this.parent.update_node_name(oldname, name);
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
