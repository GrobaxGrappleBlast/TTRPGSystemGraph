"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature_Multi = void 0;
var tslib_1 = require("tslib");
var AFeature_Multi_1 = require("./AFeature_Multi");
var Feature_Multi = /** @class */ (function (_super) {
    tslib_1.__extends(Feature_Multi, _super);
    function Feature_Multi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'Feature_Multi';
        return _this;
    }
    Feature_Multi.prototype.updateTo = function (feature, out) {
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
    Feature_Multi.prototype.apply = function (sys, args) {
        var _a;
        // if we KNOW before hand that they do not have the right amount, just error out. 
        if (args.length < this.features.length) {
            throw new Error('Supplied arguments did not have the same length as number of arguments ');
        }
        // first wee need to know that we have arguments for each feature
        // we track for each feature where arguments are suppliedm 
        // And wich have not.
        // create lists
        var fromListMap = {};
        this.features.forEach(function (p) { return fromListMap[p.name] = p; });
        var toListMap = {};
        // sort arguments by name. 
        args.sort(function (a, b) { if (a.featureName < b.featureName) {
            return -1;
        }
        else {
            return 1;
        } });
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            var feature = fromListMap[arg.featureName];
            if (!feature) {
                throw new Error('provided arguments for non existant feature by name "' + arg.featureName + '"');
            }
            // add to list
            toListMap[arg.featureName] = {};
            toListMap[arg.featureName]['feature'] = feature;
            toListMap[arg.featureName]['args'] = arg.args;
            // remove from old list 
            delete fromListMap[arg.featureName];
        }
        // check if anything have not gotten arguments 
        var fromKeys = (_a = Object.keys(fromListMap)) !== null && _a !== void 0 ? _a : [];
        if (fromKeys.length != 0) {
            throw new Error('did not provide arguments for features [' + fromKeys.join(',') + ']');
        }
        // now All arguments are ensured to have been provided.
        // now we loop through all of our features, but if even one fails to apply we remove 
        var keys = Object.keys(toListMap);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var set = toListMap[key];
            var succes = set.feature.apply(sys, set.args);
            this._addFeatureFromAppliedRecord(sys, set.feature);
            if (!succes) {
                this.remove();
                throw new Error('Error Happend trying to apply feature ' + key);
            }
        }
        this.systems.push(sys);
        return true;
    };
    Feature_Multi.prototype.disposeNode_fromNode = function (node) { };
    return Feature_Multi;
}(AFeature_Multi_1.AFeature_Multi));
exports.Feature_Multi = Feature_Multi;
