"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature_Choice = void 0;
var tslib_1 = require("tslib");
var AFeature_Multi_1 = require("./AFeature_Multi");
var Feature_Choice = /** @class */ (function (_super) {
    tslib_1.__extends(Feature_Choice, _super);
    function Feature_Choice() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'Feature_Choice';
        return _this;
    }
    Feature_Choice.prototype.apply = function (sys, args) {
        var _a;
        // check if this has already been apllied to Max number of choices in this system
        if (this.appliedChoices && ((_a = this.appliedChoices[sys._key]) === null || _a === void 0 ? void 0 : _a.length) > this.maxChoices) {
            return false;
        }
        var len = args.length;
        len = len < this.maxChoices ? len : this.maxChoices;
        var _loop_1 = function (i) {
            var arg = args[i];
            var feature = this_1.features.find(function (p) { return p.name == arg.featureName; });
            if (!feature) {
                throw new Error('provided arguments for non existant feature by name "' + arg.featureName + '"');
            }
            var succes = feature.apply(sys, arg.args);
            if (!succes) {
                this_1.remove();
                throw new Error('Error Happend trying to apply feature ' + arg.featureName);
            }
            this_1._addFeatureFromAppliedRecord(sys, feature);
        };
        var this_1 = this;
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
        // register the system and the node and the choice
        this.systems.push(sys);
        return true;
    };
    Feature_Choice.prototype.disposeNode_fromNode = function (node) { };
    return Feature_Choice;
}(AFeature_Multi_1.AFeature_Multi));
exports.Feature_Choice = Feature_Choice;
