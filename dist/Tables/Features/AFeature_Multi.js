"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AFeature_Multi = void 0;
var tslib_1 = require("tslib");
var Feature_1 = require("./Feature");
var AFeature_Multi = /** @class */ (function (_super) {
    tslib_1.__extends(AFeature_Multi, _super);
    function AFeature_Multi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.features = [];
        /**
         * Maps the system keys to Feature keys.
         * Such that a system can remember its choices independently of other systems
         */
        _this.appliedChoices = {};
        /**
         * Maps the feature keys to system
         * reversed off applied choices
        */
        _this.appliedChoices_r = {};
        return _this;
    }
    // we write a scope level feature to contian a sub remove feature
    AFeature_Multi.prototype._removeFeatureFromAppliedRecord = function (o_choice) {
        // get all systems that this choice is bound to
        var systems = this.appliedChoices_r[o_choice._key];
        // for each of the systems, remove the reference to the choices 
        for (var i = 0; i < systems.length; i++) {
            var syskey = systems[i];
            this.appliedChoices[syskey] = this.appliedChoices[syskey].filter(function (p) { return p != o_choice._key; });
            // if applied choices array has length of 0 remove it
            if (this.appliedChoices[syskey].length == 0) {
                delete this.appliedChoices[syskey];
            }
        }
        // delete from applied sources reversed
        delete this.appliedChoices_r[o_choice._key];
        // then remove the feature
        o_choice.remove();
    };
    AFeature_Multi.prototype._addFeatureFromAppliedRecord = function (sys, o_choice) {
        // add to Applied choices "reversed"
        if (!this.appliedChoices_r[o_choice._key]) {
            this.appliedChoices_r[o_choice._key] = [];
        }
        this.appliedChoices_r[o_choice._key].push(sys._key);
        // add the applied choices 
        if (!this.appliedChoices[sys._key]) {
            this.appliedChoices[sys._key] = [];
        }
        this.appliedChoices[sys._key].push(o_choice._key);
    };
    AFeature_Multi.prototype.updateTo = function (feature, out) {
        // if this is the wrong type then we return false
        if (feature.type != this.type) {
            return false;
        }
        var _loop_1 = function (i) {
            // map oold and incoming 
            var o_choice = this_1.features[i];
            var i_choice = feature.features.find(function (p) { return p.name == o_choice.name; });
            // if there is incoming choice, then remove the old.
            if (!i_choice) {
                this_1._removeFeatureFromAppliedRecord(o_choice);
                return "continue";
            }
            // call update and save if it could update
            could_update = o_choice.updateTo(i_choice, out);
            // if this could not update then remove the old.
            if (!could_update) {
                this_1._removeFeatureFromAppliedRecord(o_choice);
                return "continue";
            }
        };
        var this_1 = this, could_update;
        // loop through choices and update
        for (var i = 0; i < this.features.length; i++) {
            _loop_1(i);
        }
        // return succes
        return true;
    };
    AFeature_Multi.prototype.remove = function (sys) {
        if (sys === void 0) { sys = null; }
        // if there is no system supplied remove from all. 
        if (!sys) {
            // loop through all and call this remove.
            var length = this.systems.length;
            for (var i = 0; i < length; i++) {
                var _sys = this.systems[0];
                this.remove(_sys);
            }
            return true;
        }
        // fisrt if this system is not in the feature
        if (!this.systems.find(function (p) { return p._key == sys._key; })) {
            return false;
        }
        // remove choices 
        for (var i = 0; i < this.features.length; i++) {
            var choice = this.features[i];
            // if this is not in the applied record skip it.
            if (!this.appliedChoices_r[choice._key]) {
                continue;
            }
            // Remove it
            choice.remove(sys);
            this._removeFeatureFromAppliedRecord(choice);
        }
        // de register this system from extended class
        this.systems = this.systems.filter(function (p) { return p._key != sys._key; });
        return true;
    };
    return AFeature_Multi;
}(Feature_1.Feature));
exports.AFeature_Multi = AFeature_Multi;
