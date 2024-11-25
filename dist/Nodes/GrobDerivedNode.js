"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobDerivedNode = void 0;
const AGrobNodte_1 = require("./AGrobNodte");
const TTRPGSystemsGraphDependencies_1 = require("../Graph/TTRPGSystemsGraphDependencies");
const GrobOrigin_1 = require("./GrobOrigin");
class GrobDerivedNode extends AGrobNodte_1.AGrobNode {
    constructor(name, parent) {
        super(name, 'ND', parent);
        this.calc = '@a';
        this.origins = [];
        this._value = NaN;
    }
    _getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
    }
    static getTypeString() {
        return 'derivedNode';
    }
    getTypeString() {
        return GrobDerivedNode.getTypeString();
    }
    removeDependency(node) {
        super.removeDependency(node);
        const key = node.getKey();
        // remove origin dependency 
        // we find the origin, with the key value, and remove it.
        for (let i = 0; i < this.origins.length; i++) {
            const orig = this.origins[i];
            if (orig.origin != null && orig.origin.getKey() == key) {
                orig.origin = null;
            }
        }
        return this.dependencies[key] == null;
    }
    nullifyDependency(node) {
        // first Empty the origin.
        let key = node.getKey();
        let orig = this.origins.find(p => { var _a; return ((_a = p.origin) === null || _a === void 0 ? void 0 : _a.getKey()) == key; });
        if (orig) {
            orig.origin = null;
            orig.originKey = GrobOrigin_1.GrobOrigin.UnkownLocationKey;
        }
        // then nulify the dependency
        return this.removeDependency(node);
    }
    setOrigin(symbol, node, standardValue = null) {
        var _a, _b;
        let origin = this.origins.find(p => p.symbol == symbol);
        if (!origin) {
            return false;
        }
        if (origin.origin) {
            this.removeDependency(origin.origin);
        }
        // ensure that this is the right type of object.
        const nodeKey = (_a = node === null || node === void 0 ? void 0 : node.getTypeString()) !== null && _a !== void 0 ? _a : '';
        if (!['derivedNode', 'fixedNode'].find(p => p == nodeKey)) {
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
    }
    isValid() {
        let hadNullOrigin = false;
        this.origins.forEach(o => {
            if (!o.origin) {
                hadNullOrigin = true;
            }
        });
        if (hadNullOrigin) {
            return false;
        }
        let originsWithLinks = this.origins.filter(p => p.origin != null);
        if (originsWithLinks.length != this.getDependencies().length) {
            return false;
        }
        return true;
    }
    updateOrigins() {
        let originRes = this.parseCalculationToOrigins(this.calc);
        if (originRes) {
            let symbolsToRem = originRes.symbolsToRem;
            let symbolsToAdd = originRes.symbolsToAdd;
            // remove symbols 
            if (symbolsToRem.length != 0) {
                this.origins = this.origins.filter(p => !symbolsToRem.includes(p.symbol));
            }
            // add items if there is anything to add.  
            if (symbolsToAdd.length != 0) {
                for (let i = 0; i < symbolsToAdd.length; i++) {
                    const orig = new GrobOrigin_1.GrobOrigin();
                    orig.symbol = symbolsToAdd[i];
                    orig.standardValue = 1;
                    orig.origin = null;
                    orig.originKey = GrobOrigin_1.GrobOrigin.UnkownLocationKey;
                    this.origins.push(orig);
                }
            }
            // handle Dependencies 
            let oldDependencies = {};
            this.getDependencies().forEach(p => oldDependencies[p.getName()] = p);
            let newDependencies = {};
            this.origins.forEach(p => { var _a; if (p.origin != null) {
                newDependencies[(_a = p.origin) === null || _a === void 0 ? void 0 : _a.getName()] = p.origin;
            } });
            // remove old Dependencies 
            for (const key in oldDependencies) {
                if (!newDependencies[key]) {
                    this.removeDependency(oldDependencies[key]);
                }
            }
            return { added: symbolsToAdd, removed: symbolsToRem.length };
        }
        else {
            return { added: 0, removed: 0 };
        }
    }
    setCalc(calc, updateOrigins = true) {
        // reset This' Value;
        this._value = NaN;
        // test if it is calculateable
        let testCalc = this.testCalculate(calc);
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
    }
    /**
     * Parses calculation To a Number of Origins.
     * @returns
     */
    parseCalculationToOrigins(calc) {
        var _a;
        const calcValue = calc;
        // get symbols from the calc. and turn it into an array. important, the array is an array of unique keys.
        let symbols = (_a = calcValue.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex)) !== null && _a !== void 0 ? _a : [];
        symbols = Array.from(new Set(symbols));
        // get the keys that are already there.
        let existingKeysArray = this.origins.map(p => p.symbol);
        // get a list of symbols to add and remove.
        let symbolsToAdd = symbols.filter(p => !existingKeysArray.includes(p));
        let symbolsToRem = existingKeysArray.filter(p => !symbols.includes(p));
        return { symbolsToRem: symbolsToRem, symbolsToAdd: symbolsToAdd, totalSymbols: symbols };
    }
    static staticParseCalculationToOrigins(calc) {
        var _a;
        const calcValue = calc;
        // get symbols from the calc. and turn it into an array. important, the array is an array of unique keys.
        let symbols = (_a = calcValue.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex)) !== null && _a !== void 0 ? _a : [];
        symbols = Array.from(new Set(symbols));
        return symbols;
    }
    recalculate(useTempValues = false) {
        //const symbols = this.calc.match( grobDerivedSymbolRegex );  
        let rec = useTempValues ?
            Object.fromEntries(this.origins.map(p => [p.symbol, p.standardValue])) :
            Object.fromEntries(this.origins.map(p => { var _a; return [p.symbol, (_a = p.origin) === null || _a === void 0 ? void 0 : _a.getValue()]; }));
        let statement = this.calc;
        let res = this._recalculate(rec, statement);
        this._value = res.value;
        return res.success;
    }
    _recalculate(rec = {}, statement) {
        return GrobDerivedNode.recalculate(rec, statement);
    }
    static recalculate(rec = {}, statement) {
        const symbols = statement.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex);
        //let rec = 
        //	useTempValues ?
        //	Object.fromEntries( origins.map(p => [ p.symbol, p.standardValue])):	
        //	Object.fromEntries( origins.map(p => [ p.symbol, p.origin?.getValue() ]));
        let _statement = statement;
        symbols === null || symbols === void 0 ? void 0 : symbols.forEach(key => {
            const v = rec[key];
            _statement = _statement.replace(key, v + "");
        });
        var recalcSuccess = false;
        let value = 0;
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
    }
    testCalculate(statement) {
        const symbols = statement.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex);
        let rec = symbols ? Object.fromEntries(symbols.map(s => [s, 1])) : {};
        let res = this._recalculate(rec, statement);
        return res;
    }
    static testCalculate(statement, symbolsToValue = {}, allowDefaultIfMissingDependency = true) {
        const symbols = statement.match(TTRPGSystemsGraphDependencies_1.grobDerivedSymbolRegex);
        function mapValueToSymbol(s, m) {
            if (m[s]) {
                return m[s];
            }
            if (allowDefaultIfMissingDependency) {
                return 1;
            }
            return NaN;
        }
        let rec = symbols ? Object.fromEntries(symbols.map(s => [s, mapValueToSymbol(s, symbolsToValue)])) : {};
        let res = GrobDerivedNode.recalculate(rec, statement);
        return res;
    }
    _update() {
        if (!this.isValid()) {
            console.error(`Node isent Valid ${this.getName()} ${this.getLocationKey()} Stopping update`);
            return false;
        }
        // first recalculate
        this.recalculate();
    }
    updateDependecysLocation(dependency) {
        let orig = this.origins.find(p => { var _a; return ((_a = p.origin) === null || _a === void 0 ? void 0 : _a.getName()) == dependency.getName(); });
        if (!orig)
            return;
        orig.originKey = dependency.getLocationKey();
    }
}
exports.GrobDerivedNode = GrobDerivedNode;
