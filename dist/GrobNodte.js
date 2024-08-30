"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobDerivedNode = exports.GrobFixedNode = exports.GrobNode = exports.GrobDerivedOrigin = void 0;
var tslib_1 = require("tslib");
var AGraphItem_1 = require("./Abstractions/AGraphItem");
var grobax_json_handler_1 = require("grobax-json-handler");
var grobDerivedSymbolRegex = /@[a-zA-Z]/g;
var GrobDerivedOrigin = /** @class */ (function () {
    function GrobDerivedOrigin() {
        this.standardValue = 1;
    }
    GrobDerivedOrigin.UnkownLocationKey = 'unknown.unknown.unknown';
    tslib_1.__decorate([
        (0, grobax_json_handler_1.JsonString)(),
        tslib_1.__metadata("design:type", String)
    ], GrobDerivedOrigin.prototype, "symbol", void 0);
    tslib_1.__decorate([
        (0, grobax_json_handler_1.JsonString)(),
        tslib_1.__metadata("design:type", String)
    ], GrobDerivedOrigin.prototype, "originKey", void 0);
    return GrobDerivedOrigin;
}());
exports.GrobDerivedOrigin = GrobDerivedOrigin;
var GrobNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobNode, _super);
    function GrobNode(name, keystart, parent) {
        var _this = _super.call(this, name, keystart) || this;
        _this.dependencies = {};
        _this.dependents = {};
        _this.updateListeners = {};
        if (parent)
            _this.parent = parent;
        return _this;
    }
    GrobNode.getTypeString = function () {
        return 'Nodte<T extends Nodte<T>>';
    };
    GrobNode.prototype.addDependent = function (node) {
        var key = node.getKey();
        if (this.dependents[key]) {
            return true;
        }
        this.dependents[key] = node;
        return true;
    };
    GrobNode.prototype.removeDependent = function (node) {
        delete this.dependents[node.getKey()];
        return this.dependents[node.getKey()] == null;
    };
    GrobNode.prototype.getDependents = function () {
        var _a;
        //@ts-ignore
        return (_a = Object.values(this.dependents)) !== null && _a !== void 0 ? _a : [];
    };
    GrobNode.prototype.getDependencies = function () {
        var _a;
        //@ts-ignore
        return (_a = Object.values(this.dependencies)) !== null && _a !== void 0 ? _a : [];
    };
    GrobNode.prototype.getLocationKey = function () {
        var segs = this.getLocationKeySegments();
        return segs.join('.');
    };
    GrobNode.prototype.getLocationKeySegments = function () {
        var _a, _b, _c, _d, _e, _f;
        var seg = ['', '', ''];
        seg[0] = (_c = (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.getName()) !== null && _c !== void 0 ? _c : 'unknown';
        seg[1] = (_e = (_d = this.parent) === null || _d === void 0 ? void 0 : _d.getName()) !== null && _e !== void 0 ? _e : 'unknown';
        seg[2] = (_f = this.getName()) !== null && _f !== void 0 ? _f : 'unknown';
        return seg;
    };
    GrobNode.prototype.update = function () {
        var _this = this;
        this._update();
        (Object.keys(this.updateListeners)).forEach(function (key) {
            _this.updateListeners[key]();
        });
        return true;
    };
    GrobNode.prototype.dispose = function () {
        // delete references all
        for (var key in this.dependencies) {
            var curr = this.dependencies[key];
            curr.removeDependent(this);
        }
        for (var key in this.dependents) {
            var curr = this.dependents[key];
            curr.nullifyDependency(this);
        }
        //@ts-ignore
        this.parent = null;
        //@ts-ignore
        this.name = null;
    };
    GrobNode.prototype.setName = function (name) {
        var oldname = this.getName();
        _super.prototype.setName.call(this, name);
        this.parent.update_node_name(oldname, name);
        this.updateLocation(this.parent);
    };
    GrobNode.prototype.updateLocation = function (parent) {
        this.parent = parent;
        for (var key in this.dependents) {
            var dep = this.dependents[key];
            dep.updateDependecysLocation(this);
        }
    };
    GrobNode.prototype.updateDependecysLocation = function (dependency) { };
    GrobNode.prototype.isValid = function () {
        return true;
    };
    GrobNode.prototype.addUpdateListener = function (key, listener) {
        if (this.updateListeners[key] != undefined) {
            console.error('tried to add updatelistener to node with key:' + key + '. but there was already a listener using that key');
            return false;
        }
        this.updateListeners[key] = listener;
    };
    GrobNode.prototype.removeUpdateListener = function (key) {
        delete this.updateListeners[key];
    };
    GrobNode.prototype.removeAllUpdateListeners = function () {
        this.updateListeners = {};
    };
    return GrobNode;
}(AGraphItem_1.AGraphItem));
exports.GrobNode = GrobNode;
var GrobFixedNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobFixedNode, _super);
    function GrobFixedNode(name, parent) {
        var _this = _super.call(this, name, 'NF', parent) || this;
        _this.___value = 1;
        return _this;
    }
    GrobFixedNode.prototype.getValue = function () {
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
    GrobFixedNode.prototype._update = function () { };
    tslib_1.__decorate([
        (0, grobax_json_handler_1.JsonNumber)({ name: 'standardValue' }),
        tslib_1.__metadata("design:type", Number)
    ], GrobFixedNode.prototype, "___value", void 0);
    return GrobFixedNode;
}(GrobNode));
exports.GrobFixedNode = GrobFixedNode;
var GrobDerivedNode = /** @class */ (function (_super) {
    tslib_1.__extends(GrobDerivedNode, _super);
    function GrobDerivedNode(name, parent) {
        var _this = _super.call(this, name, 'ND', parent) || this;
        _this.calc = '@a';
        _this.origins = [];
        _this._value = NaN;
        return _this;
    }
    GrobDerivedNode.prototype.getValue = function () {
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
    GrobDerivedNode.prototype.addDependency = function (node) {
        var key = node.getKey();
        this.dependencies[key] = node;
        node.addDependent(this);
        return true;
    };
    GrobDerivedNode.prototype.removeDependency = function (node) {
        // delete the dependency
        var key = node.getKey();
        if (this.dependencies[key]) {
            delete this.dependencies[key];
            node.removeDependent(this);
        }
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
            orig.originKey = GrobDerivedOrigin.UnkownLocationKey;
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
                    var orig = new GrobDerivedOrigin();
                    orig.symbol = symbolsToAdd[i];
                    orig.standardValue = 1;
                    orig.origin = null;
                    orig.originKey = GrobDerivedOrigin.UnkownLocationKey;
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
        var symbols = (_a = calcValue.match(grobDerivedSymbolRegex)) !== null && _a !== void 0 ? _a : [];
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
        var symbols = (_a = calcValue.match(grobDerivedSymbolRegex)) !== null && _a !== void 0 ? _a : [];
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
        var symbols = statement.match(grobDerivedSymbolRegex);
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
        var symbols = statement.match(grobDerivedSymbolRegex);
        var rec = symbols ? Object.fromEntries(symbols.map(function (s) { return [s, 1]; })) : {};
        var res = this._recalculate(rec, statement);
        return res;
    };
    GrobDerivedNode.testCalculate = function (statement, symbolsToValue) {
        if (symbolsToValue === void 0) { symbolsToValue = {}; }
        var symbols = statement.match(grobDerivedSymbolRegex);
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
        // then call update for all dependents 
        var success = true;
        for (var k in this.dependents) {
            var dep = this.dependents[k];
            success = success && dep.update();
        }
        return success;
    };
    GrobDerivedNode.prototype.updateDependecysLocation = function (dependency) {
        var orig = this.origins.find(function (p) { var _a; return ((_a = p.origin) === null || _a === void 0 ? void 0 : _a.getName()) == dependency.getName(); });
        if (!orig)
            return;
        orig.originKey = dependency.getLocationKey();
    };
    tslib_1.__decorate([
        (0, grobax_json_handler_1.JsonString)({ name: 'calculationString' }),
        tslib_1.__metadata("design:type", String)
    ], GrobDerivedNode.prototype, "calc", void 0);
    tslib_1.__decorate([
        (0, grobax_json_handler_1.JsonArrayClassTyped)(GrobDerivedOrigin, { name: 'calcOrigins' }),
        tslib_1.__metadata("design:type", Array)
    ], GrobDerivedNode.prototype, "origins", void 0);
    return GrobDerivedNode;
}(GrobNode));
exports.GrobDerivedNode = GrobDerivedNode;
