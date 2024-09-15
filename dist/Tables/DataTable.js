"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdataRow = exports.ADataTable = void 0;
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
