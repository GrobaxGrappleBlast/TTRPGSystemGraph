"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADataRow = exports.ADataTable = void 0;
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
var ADataRow = /** @class */ (function () {
    function ADataRow() {
    }
    return ADataRow;
}());
exports.ADataRow = ADataRow;
