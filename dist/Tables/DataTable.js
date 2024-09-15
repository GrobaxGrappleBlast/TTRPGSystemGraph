"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdataRow = exports.ADataTable = exports.tableCollection = exports.tableGroup = void 0;
var tslib_1 = require("tslib");
var GrobCollection_1 = require("src/GrobCollection");
var GrobGroup_1 = require("src/GrobGroup");
var tableGroup = /** @class */ (function (_super) {
    tslib_1.__extends(tableGroup, _super);
    function tableGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return tableGroup;
}(GrobGroup_1.GrobGroup));
exports.tableGroup = tableGroup;
var tableCollection = /** @class */ (function (_super) {
    tslib_1.__extends(tableCollection, _super);
    function tableCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return tableCollection;
}(GrobCollection_1.GrobCollection));
exports.tableCollection = tableCollection;
var ADataTable = /** @class */ (function () {
    function ADataTable() {
        this.data = {};
    }
    ADataTable.prototype.getName = function () {
        throw new Error("Method not implemented.");
    };
    ADataTable.prototype.dispose = function () {
        throw new Error("Method not implemented.");
    };
    ADataTable.prototype.updateLocation = function () {
        throw new Error("Method not implemented.");
    };
    return ADataTable;
}());
exports.ADataTable = ADataTable;
var AdataRow = /** @class */ (function () {
    function AdataRow() {
    }
    return AdataRow;
}());
exports.AdataRow = AdataRow;
