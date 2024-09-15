"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameValueTracker = exports.DoubleKeyedIndexTracker = void 0;
var tslib_1 = require("tslib");
var doubleKeyedTable = /** @class */ (function () {
    function doubleKeyedTable() {
        this.index_one = {};
        this.index_two = {};
    }
    doubleKeyedTable.prototype.addData = function (key1, key2, data) {
        if (this.index_one[key1] == undefined)
            this.index_one[key1] = {};
        this.index_one[key1][key2] = data;
        if (this.index_two[key2] == undefined)
            this.index_two[key2] = {};
        this.index_two[key2][key1] = data;
    };
    doubleKeyedTable.prototype.shift_Two = function (keyTwo, newKey) {
        // get data
        var index_one = this.index_two[keyTwo];
        // delete and update
        delete this.index_two[keyTwo];
        this.index_two[newKey] = index_one;
        for (var key in index_one) {
            // if data exists, then update the data. 
            var data = this.index_one[key][keyTwo];
            if (data != null) {
                delete this.index_one[key][keyTwo];
                this.index_one[key][newKey] = data;
            }
        }
    };
    doubleKeyedTable.prototype.shift_One = function (keyOne, newKey) {
        // get data
        var index_two = this.index_one[keyOne];
        // delete and update
        delete this.index_one[keyOne];
        this.index_one[newKey] = index_two;
        for (var key in index_two) {
            // if data exists, then update the data. 
            var data = this.index_two[key][keyOne];
            if (data != null) {
                delete this.index_two[key][keyOne];
                this.index_two[key][newKey] = data;
            }
        }
    };
    doubleKeyedTable.prototype.remove_One = function (key) {
        var data = {};
        if (this.index_one[key] != undefined) {
            data = this.index_one[key];
            delete this.index_one[key];
        }
        for (var key2 in data) {
            delete this.index_two[key2][key];
        }
    };
    doubleKeyedTable.prototype.remove_Two = function (key) {
        var data = {};
        if (this.index_two[key] != undefined) {
            data = this.index_two[key];
            delete this.index_two[key];
        }
        for (var key1 in data) {
            delete this.index_one[key1][key];
        }
    };
    doubleKeyedTable.prototype.get_one = function (key) {
        var arr = [];
        for (var k in this.index_one[key]) {
            arr.push(this.index_one[key][k]);
        }
        return arr;
    };
    doubleKeyedTable.prototype.get_two = function (key) {
        var arr = [];
        for (var k in this.index_two[key]) {
            arr.push(this.index_two[key][k]);
        }
        return arr;
    };
    return doubleKeyedTable;
}());
var DoubleKeyedIndexTracker = /** @class */ (function (_super) {
    tslib_1.__extends(DoubleKeyedIndexTracker, _super);
    function DoubleKeyedIndexTracker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoubleKeyedIndexTracker.prototype.SymbolAndKeyToComponent = function (symbol, key, component) {
        this.remove_One(symbol);
        this.addData(symbol, key, component);
    };
    return DoubleKeyedIndexTracker;
}(doubleKeyedTable));
exports.DoubleKeyedIndexTracker = DoubleKeyedIndexTracker;
var NameValueTracker = /** @class */ (function (_super) {
    tslib_1.__extends(NameValueTracker, _super);
    function NameValueTracker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NameValueTracker.prototype.nameToNumber = function (name, value, component) {
        this.remove_One(name);
        this.addData(name, value, component);
    };
    NameValueTracker.prototype.getName = function (name) {
        return this.get_one(name);
    };
    NameValueTracker.prototype.getAllFromValue = function (value) {
        return this.get_two(value);
    };
    NameValueTracker.prototype.shiftAllFromValue = function (value, newValue) {
        this.shift_Two(value, newValue);
    };
    return NameValueTracker;
}(doubleKeyedTable));
exports.NameValueTracker = NameValueTracker;
