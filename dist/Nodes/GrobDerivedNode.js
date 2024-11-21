"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobDerivedNode = void 0;
var tslib_1 = require("tslib");
var AGrobNodte_1 = require("./AGrobNodte");
var TTRPGSystemsGraphDependencies_1 = require("../Graph/TTRPGSystemsGraphDependencies");
var GrobOrigin_1 = require("./GrobOrigin");
var GrobDerivedNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobDerivedNode, _super);
    function GrobDerivedNode(name, parent) {
        var _this = _super.call(this, name, 'ND', parent) || this;
        _this.calc = '@a';
        _this.origins = [];
        _this._value = NaN;
        return _this;
    }
    GrobDerivedNode.prototype._getValue = function () {
        return this._value;
    };
    GrobDerivedNode.prototype.setValue = function (value) {
        this._value = value;
    };
    GrobDerivedNode.getTypeString = function () {
        return 'derivedNode';
    };
    GrobDerivedNode.prototype.getTypeString = function () {
        return GrobDerivedNode.getTypeString();
    };
    GrobDerivedNode.prototype.removeDependency = function (node) {
        _super.prototype.removeDependency.call(this, node);
        var key = node.getKey();
        // remove origin dependency 
        // we find the origin, with the key value, and remove it.
        for (var i = 0; i < this.origins.length; i++) {
            var orig = this.origins[i];
            if (orig.origin != null && orig.origin.getKey() == key) {
                orig.origin = null;
            }
        }
        return this.dependencies[key] == null;
    };
    GrobDerivedNode.prototype.nullifyDependency = function (node) {
        // first Empty the origin.
        var key = node.getKey();
        var orig = this.origins.find(function (p) { var _a; return ((_a = p.origin) === null || _a === void 0 ? void 0 : _a.getKey()) == key; });
        if (orig) {
            orig.origin = null;
            orig.originKey = GrobOrigin_1.GrobOrigin.UnkownLocationKey;
        }
        // then nulify the dependency
        return this.removeDependency(node);
    };
    GrobDerivedNode.prototype.setOrigin = function (symbol, node, standardValue) {
        var _a, _b;
        if (standardValue === void 0) { standardValue = null; }
        var origin = this.origins.find(function (p) { return p.symbol == symbol; });
        if (!origin) {
            return false;
        }
        if (origin.origin) {
            this.removeDependency(origin.origin);
        }
        // ensure that this is the right type of object.
        var nodeKey = (_a = node === null || node === void 0 ? void 0 : node.getTypeString()) !== null && _a !== void 0 ? _a : '';
        if (!['derivedNode', 'fixedNode'].find(function (p) { return p == nodeKey; })) {
            //@ts-ignore
            node = null;
        }
        if (node) {
            this.addDependency(node);
        }
        origin.origin = node;
        origin.standardValue = (_b = (standardValue !== null && standardValue !== void 0 ? standardValue : origin.standardValue)) !== null && _b !== void 0 ? _b : 1;
        if (origin.origin)
            origin.originKey = origin.origin.getLocationKey();
        if (this.isValid()) {
            this.recalculate(false);
        }
        return true;
    };
    GrobDerivedNode.prototype.isValid = function () {
        var hadNullOrigin = false;
        this.origins.forEach(function (o) {
            if (!o.origin) {
                hadNullOrigin = true;
            }
        });
        if (hadNullOrigin) {
            return false;
        }
        var originsWithLinks = this.origins.filter(function (p) { return p.origin != null; });
        if (originsWithLinks.length != this.getDependencies().length) {
            return false;
        }
        return true;
    };
    GrobDerivedNode.prototype.updateOrigins = function () {
        var originRes = this.parseCalculationToOrigins(this.calc);
        if (originRes) {
            var symbolsToRem_1 = originRes.symbolsToRem;
            var symbolsToAdd = originRes.symbolsToAdd;
            // remove symbols 
            if (symbolsToRem_1.length != 0) {
                this.origins = this.origins.filter(function (p) { return !symbolsToRem_1.includes(p.symbol); });
            }
            // add items if there is anything to add.  
            if (symbolsToAdd.length != 0) {
                for (var i = 0; i < symbolsToAdd.length; i++) {
                    var orig = new GrobOrigin_1.GrobOrigin();
                    orig.symbol = symbolsToAdd[i];
                    orig.standardValue = 1;
                    orig.origin = null;
                    orig.originKey = GrobOrigin_1.GrobOrigin.UnkownLocationKey;
                    this.origins.push(orig);
                }
            }
            // handle Dependencies 
            var oldDependencies_1 = {};
            this.getDependencies().forEach(function (p) { return oldDependencies_1[p.getName()] = p; });
            var newDependencies_1 = {};
            this.origins.forEach(function (p) { var _a; if (p.origin != null) {
                newDependencies_1[(_a = p.origin) === null || _a === void 0 ? void 0 : _a.getName()] = p.origin;
            } });
            // remove old Dependencies 
            for (var key in oldDependencies_1) {
                if (!newDependencies_1[key]) {
                    this.removeDependency(oldDependencies_1[key]);
                }
            }
            return { added: symbolsToAdd, removed: symbolsToRem_1.length };
        }
        else {
            return { added: 0, removed: 0 };
        }
    };
    GrobDerivedNode.prototype.setCalc = function (calc, updateOrigins) {
        if (updateOrigins === void 0) { updateOrigins = true; }
        // reset This' Value;
        this._value = NaN;
        // test if it is calculateable
        var testCalc = this.testCalculate(calc);
        if (testCalc == null || !testCalc.success) {
            return false;
        }
        this.calc = calc;
        // update origins.
        if (updateOrigins) {
            this.updateOrigins();
        }
        if (this.isValid()) {
            this.recalculate(false);
        }
        return true;
    };
    /**
     * Parses calculation To a Number of Origins.
     * @returns
     */
    GrobDerivedNode.prototype.parseCalculationToOrigins = function (calc) {
        var _a;
        var calcValue = calc;
        // get symbols from the calc. and turn it into an array. important, the array is an array of unique keys.
        var symbols = (_a = calcValue.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex)) !== null && _a !== void 0 ? _a : [];
        symbols = Array.from(new Set(symbols));
        // get the keys that are already there.
        var existingKeysArray = this.origins.map(function (p) { return p.symbol; });
        // get a list of symbols to add and remove.
        var symbolsToAdd = symbols.filter(function (p) { return !existingKeysArray.includes(p); });
        var symbolsToRem = existingKeysArray.filter(function (p) { return !symbols.includes(p); });
        return { symbolsToRem: symbolsToRem, symbolsToAdd: symbolsToAdd, totalSymbols: symbols };
    };
    GrobDerivedNode.staticParseCalculationToOrigins = function (calc) {
        var _a;
        var calcValue = calc;
        // get symbols from the calc. and turn it into an array. important, the array is an array of unique keys.
        var symbols = (_a = calcValue.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex)) !== null && _a !== void 0 ? _a : [];
        symbols = Array.from(new Set(symbols));
        return symbols;
    };
    GrobDerivedNode.prototype.recalculate = function (useTempValues) {
        if (useTempValues === void 0) { useTempValues = false; }
        //const symbols = this.calc.match( grobDerivedSymbolRegex );  
        var rec = useTempValues ?
            Object.fromEntries(this.origins.map(function (p) { return [p.symbol, p.standardValue]; })) :
            Object.fromEntries(this.origins.map(function (p) { var _a; return [p.symbol, (_a = p.origin) === null || _a === void 0 ? void 0 : _a.getValue()]; }));
        var statement = this.calc;
        var res = this._recalculate(rec, statement);
        this._value = res.value;
        return res.success;
    };
    GrobDerivedNode.prototype._recalculate = function (rec, statement) {
        if (rec === void 0) { rec = {}; }
        return GrobDerivedNode.recalculate(rec, statement);
    };
    GrobDerivedNode.recalculate = function (rec, statement) {
        if (rec === void 0) { rec = {}; }
        var symbols = statement.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex);
        //let rec = 
        //	useTempValues ?
        //	Object.fromEntries( origins.map(p => [ p.symbol, p.standardValue])):	
        //	Object.fromEntries( origins.map(p => [ p.symbol, p.origin?.getValue() ]));
        var _statement = statement;
        symbols === null || symbols === void 0 ? void 0 : symbols.forEach(function (key) {
            var v = rec[key];
            _statement = _statement.replace(key, v + "");
        });
        var recalcSuccess = false;
        var value = 0;
        try {
            var res = eval(_statement);
            if (typeof res === 'number') {
                recalcSuccess = true;
                value = res;
            }
            else {
                recalcSuccess = false;
                value = NaN;
            }
        }
        catch (e) {
            recalcSuccess = false;
            value = NaN;
        }
        return { success: recalcSuccess, value: value };
    };
    GrobDerivedNode.prototype.testCalculate = function (statement) {
        var symbols = statement.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex);
        var rec = symbols ? Object.fromEntries(symbols.map(function (s) { return [s, 1]; })) : {};
        var res = this._recalculate(rec, statement);
        return res;
    };
    GrobDerivedNode.testCalculate = function (statement, symbolsToValue) {
        if (symbolsToValue === void 0) { symbolsToValue = {}; }
        var symbols = statement.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex);
        function mapValueToSymbol(s, m) {
            if (m[s]) {
                return m[s];
            }
            return 1;
        }
        var rec = symbols ? Object.fromEntries(symbols.map(function (s) { return [s, mapValueToSymbol(s, symbolsToValue)]; })) : {};
        var res = GrobDerivedNode.recalculate(rec, statement);
        return res;
    };
    GrobDerivedNode.prototype._update = function () {
        if (!this.isValid()) {
            console.error("Node isent Valid ".concat(this.getName(), " ").concat(this.getLocationKey(), " Stopping update"));
            return false;
        }
        // first recalculate
        this.recalculate();
    };
    GrobDerivedNode.prototype.updateDependecysLocation = function (dependency) {
        var orig = this.origins.find(function (p) { var _a; return ((_a = p.origin) === null || _a === void 0 ? void 0 : _a.getName()) == dependency.getName(); });
        if (!orig)
            return;
        orig.originKey = dependency.getLocationKey();
    };
    return GrobDerivedNode;
}(AGrobNodte_1.AGrobNode));
exports.GrobDerivedNode = GrobDerivedNode;
