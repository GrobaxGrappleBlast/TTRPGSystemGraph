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
    ADataTable.prototype.getLocationKey = function () {
        var segs = this.getLocationKeySegments();
        return segs.join('.');
    };
    ADataTable.prototype.getLocationKeySegments = function () {
        var _a, _b, _c, _d, _e, _f;
        var seg = ['', '', ''];
        seg[0] = (_c = (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.getName()) !== null && _c !== void 0 ? _c : 'unknown';
        seg[1] = (_e = (_d = this.parent) === null || _d === void 0 ? void 0 : _d.getName()) !== null && _e !== void 0 ? _e : 'unknown';
        seg[2] = (_f = this.getName()) !== null && _f !== void 0 ? _f : 'unknown';
        return seg;
    };
    ADataTable.prototype.update = function () { };
    return ADataTable;
}());
exports.ADataTable = ADataTable;
var ADataRow = /** @class */ (function () {
    function ADataRow() {
    }
    return ADataRow;
}());
exports.ADataRow = ADataRow;
