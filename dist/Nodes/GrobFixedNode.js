"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobFixedNode = void 0;
var tslib_1 = require("tslib");
var AGrobNodte_1 = require("./AGrobNodte");
var GrobFixedNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobFixedNode, _super);
    function GrobFixedNode(name, parent) {
        var _this = _super.call(this, name, 'NF', parent) || this;
        _this.___value = 1;
        return _this;
    }
    GrobFixedNode.prototype._getValue = function () {
        return this.___value;
    };
    GrobFixedNode.prototype.setValue = function (value) {
        this.___value = value;
        for (var key in this.dependents) {
            var curr = this.dependents[key];
            curr.update();
        }
    };
    GrobFixedNode.getTypeString = function () {
        return 'fixedNode';
    };
    GrobFixedNode.prototype.getTypeString = function () {
        return GrobFixedNode.getTypeString();
    };
    GrobFixedNode.prototype.addDependency = function (node) { return false; };
    GrobFixedNode.prototype.removeDependency = function (node) { return false; };
    GrobFixedNode.prototype.nullifyDependency = function (node) { return false; };
    GrobFixedNode.prototype._update = function () {
        for (var k in this.dependents) {
            var dep = this.dependents[k];
            dep.update();
        }
    };
    return GrobFixedNode;
}(AGrobNodte_1.AGrobNode));
exports.GrobFixedNode = GrobFixedNode;
