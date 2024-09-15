"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobGroup = void 0;
var tslib_1 = require("tslib");
var AGraphItem_1 = require("./Abstractions/AGraphItem");
var GrobGroup = /** @class */ (function (_super) {
    tslib_1.__extends(GrobGroup, _super);
    function GrobGroup(name, parent) {
        var _this = _super.call(this, name, 'G') || this;
        _this.collections_names = {};
        return _this;
    }
    GrobGroup.prototype.getCollectionsNames = function () {
        return Object.keys(this.collections_names);
    };
    GrobGroup.prototype.hasCollection = function (name) {
        return this.collections_names[name] ? true : false;
    };
    GrobGroup.prototype.getCollection = function (name) {
        return this.collections_names[name];
    };
    GrobGroup.prototype.addCollection = function (collection) {
        collection.parent = this;
        this.collections_names[collection.getName()] = collection;
        collection.setCollectionType(this.groupType);
        return true;
    };
    GrobGroup.prototype.removeCollection = function (collection) {
        var name = collection.getName();
        var c = this.collections_names[name];
        if (!c)
            return false;
        collection.dispose();
        delete this.collections_names[name];
        return this.collections_names[name] == null;
    };
    GrobGroup.prototype.update_collection_name = function (oldName, newName) {
        this.collections_names[newName] = this.collections_names[oldName];
        delete this.collections_names[oldName];
    };
    GrobGroup.prototype.setName = function (name) {
        _super.prototype.setName.call(this, name);
        for (var name_1 in this.collections_names) {
            var curr = this.collections_names[name_1];
            curr.updateLocation(this);
        }
    };
    GrobGroup.prototype.dispose = function () {
        for (var name in this.collections_names) {
            var curr = this.collections_names[name];
            curr.dispose();
            delete this.collections_names[name];
        }
        //@ts-ignore
        this.name = null;
    };
    GrobGroup.prototype.getGroupType = function () {
        return this.groupType;
    };
    GrobGroup.prototype.setGroupType = function (groupType) {
        if (this.groupType != null && groupType != groupType) {
            throw new Error('tried to convert a group type after Setting. Denied Action');
            return;
        }
        this.groupType = groupType;
        Object.values(this.collections_names).forEach(function (col) {
            col.setCollectionType(groupType);
        });
    };
    return GrobGroup;
}(AGraphItem_1.AGraphItem));
exports.GrobGroup = GrobGroup;
