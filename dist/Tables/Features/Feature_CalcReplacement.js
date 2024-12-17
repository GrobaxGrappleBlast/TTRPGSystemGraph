import { __awaiter } from "tslib";
import { Feature } from ".";
import { GrobBonusNode } from "../..";
/**
 * apply X at a time to Y targets
 */
export class Feature_CalcReplacement extends Feature {
    getType() {
        return Feature_CalcReplacement.getType();
    }
    static getType() {
        return 'Feature_calcReplacement';
    }
    getNodeFeatureName() {
        return this.name;
    }
    remove(sys = null) {
        // if there is no system supplied remove from all. 
        if (!sys) {
            // loop through all and call this remove.
            var length = this.systems.length;
            for (let i = 0; i < length; i++) {
                const _sys = this.systems[0];
                this.remove(_sys);
            }
            return true;
        }
        // fisrt if this system is not in the feature
        if (!this.systems.find(p => p._key == sys._key)) {
            return false;
        }
        let selfKey = this._key;
        // get all the nodes in that system with this replacementfeatureon
        this.systemsNodechoices[sys._key].forEach((loc) => {
            var _a, _b, _c;
            // Get the node and the node's replacement
            const node = sys.getNodeLocString(loc);
            var a = ((_a = node === null || node === void 0 ? void 0 : node.getReplacements()) !== null && _a !== void 0 ? _a : []);
            var b = a.map(p => { var _a, _b; return (_b = (_a = p['featureSrc']) === null || _a === void 0 ? void 0 : _a.feature) === null || _b === void 0 ? void 0 : _b._key; });
            var replacements = (_c = ((_b = node === null || node === void 0 ? void 0 : node.getReplacements()) !== null && _b !== void 0 ? _b : []).filter(p => p.featureSrc.feature._key == selfKey)) !== null && _c !== void 0 ? _c : [];
            // remove the replacement
            for (let i = 0; i < replacements.length; i++) {
                const curr = replacements[i];
                node === null || node === void 0 ? void 0 : node.remReplacement(curr);
            }
            // clean up reference
            delete this.systemsNodechoices[sys._key];
        });
        // remove system from systems
        this.systems = this.systems.filter(p => p._key != sys._key);
        return true;
    }
    apply(sys, target, ...args) {
        // first get target , then add to list of systems and targets.
        const targetNode = sys.getNodeLocString(target);
        if (!targetNode) {
            throw new Error('Invalid Target string, must be a location string of a node');
        }
        // register the System and target
        this.systems.push(sys);
        if (!this.systemsNodechoices[sys._key])
            this.systemsNodechoices[sys._key] = [];
        this.systemsNodechoices[sys._key].push(target);
        // Create a new replacement node. 
        var chain = GrobBonusNode
            .CreateNodeChain(sys, this.getNodeFeatureName())
            .addCalculation(this.calc)
            .addFeatureAsFeatureSrc(this);
        for (let i = 0; i < this.sources.length; i++) {
            // get the source node. 
            const src = this.sources[i];
            if (!src.symbol) {
                throw new Error('invalid src symbol provided :' + src.symbol + ' ; for ' + src.sourceString);
            }
            const nod = sys.getNodeLocString(src.sourceString);
            // if the node is missing
            if (!nod) {
                throw new Error('No Node at ' + src.sourceString);
            }
            // add the origin to the chain
            chain.addOrigin(src.symbol, nod);
        }
        // resulting node.
        var resNode = chain.getNode();
        resNode.update();
        targetNode.addReplacement(resNode);
        return true;
    }
    updateTo(feature, out) {
        return false;
    }
    disposeNode_fromNode(node) {
        throw new Error("Method not implemented.");
    }
    dispose() {
        const _super = Object.create(null, {
            dispose: { get: () => super.dispose }
        });
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.systems.length; i++) {
                const sys = this.systems[i];
                this.remove(sys);
            }
            _super.dispose.call(this);
        });
    }
}
