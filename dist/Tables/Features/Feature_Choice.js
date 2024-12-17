import { AFeature_Multi } from "./AFeature_Multi";
export class Feature_Choice extends AFeature_Multi {
    getType() {
        return Feature_Choice.getType();
    }
    static getType() {
        return 'Feature_Choice';
    }
    apply(sys, args) {
        var _a;
        // check if this has already been apllied to Max number of choices in this system
        if (this.appliedChoices && ((_a = this.appliedChoices[sys._key]) === null || _a === void 0 ? void 0 : _a.length) > this.maxChoices) {
            return false;
        }
        var len = args.length;
        len = len < this.maxChoices ? len : this.maxChoices;
        for (let i = 0; i < len; i++) {
            const arg = args[i];
            const feature = this.features.find(p => p.name == arg.featureName);
            if (!feature) {
                throw new Error('provided arguments for non existant feature by name "' + arg.featureName + '"');
            }
            const succes = feature.apply(sys, arg.args);
            if (!succes) {
                this.remove();
                throw new Error('Error Happend trying to apply feature ' + arg.featureName);
            }
            this._addFeatureFromAppliedRecord(sys, feature);
        }
        // register the system and the node and the choice
        this.systems.push(sys);
        return true;
    }
    disposeNode_fromNode(node) { }
}
