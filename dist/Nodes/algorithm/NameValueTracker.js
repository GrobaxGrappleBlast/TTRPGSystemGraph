"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameValueTracker = exports.DoubleKeyedIndexTracker = void 0;
class doubleKeyedTable {
    constructor() {
        this.index_one = {};
        this.index_two = {};
    }
    addData(key1, key2, data) {
        if (this.index_one[key1] == undefined)
            this.index_one[key1] = {};
        this.index_one[key1][key2] = data;
        if (this.index_two[key2] == undefined)
            this.index_two[key2] = {};
        this.index_two[key2][key1] = data;
    }
    shift_Two(keyTwo, newKey) {
        // get data
        var index_one = this.index_two[keyTwo];
        // delete and update
        delete this.index_two[keyTwo];
        this.index_two[newKey] = index_one;
        for (const key in index_one) {
            // if data exists, then update the data. 
            var data = this.index_one[key][keyTwo];
            if (data != null) {
                delete this.index_one[key][keyTwo];
                this.index_one[key][newKey] = data;
            }
        }
    }
    shift_One(keyOne, newKey) {
        // get data
        var index_two = this.index_one[keyOne];
        // delete and update
        delete this.index_one[keyOne];
        this.index_one[newKey] = index_two;
        for (const key in index_two) {
            // if data exists, then update the data. 
            var data = this.index_two[key][keyOne];
            if (data != null) {
                delete this.index_two[key][keyOne];
                this.index_two[key][newKey] = data;
            }
        }
    }
    remove_One(key) {
        var data = {};
        if (this.index_one[key] != undefined) {
            data = this.index_one[key];
            delete this.index_one[key];
        }
        for (const key2 in data) {
            delete this.index_two[key2][key];
        }
    }
    remove_Two(key) {
        var data = {};
        if (this.index_two[key] != undefined) {
            data = this.index_two[key];
            delete this.index_two[key];
        }
        for (const key1 in data) {
            delete this.index_one[key1][key];
        }
    }
    get_one(key) {
        var arr = [];
        for (const k in this.index_one[key]) {
            arr.push(this.index_one[key][k]);
        }
        return arr;
    }
    get_two(key) {
        var arr = [];
        for (const k in this.index_two[key]) {
            arr.push(this.index_two[key][k]);
        }
        return arr;
    }
}
class DoubleKeyedIndexTracker extends doubleKeyedTable {
    SymbolAndKeyToComponent(symbol, key, component) {
        this.remove_One(symbol);
        this.addData(symbol, key, component);
    }
}
exports.DoubleKeyedIndexTracker = DoubleKeyedIndexTracker;
class NameValueTracker extends doubleKeyedTable {
    nameToNumber(name, value, component) {
        this.remove_One(name);
        this.addData(name, value, component);
    }
    getName(name) {
        return this.get_one(name);
    }
    getAllFromValue(value) {
        return this.get_two(value);
    }
    shiftAllFromValue(value, newValue) {
        this.shift_Two(value, newValue);
    }
}
exports.NameValueTracker = NameValueTracker;
