import { __awaiter } from "tslib";
import { Feature } from ".";
/**
 * Implements standard methods for Feature's With Bonuses to nodes
 */
export class AFeature_BonusNodes extends Feature {
    constructor() {
        super(...arguments);
        this.bonusNodes = [];
    }
    registerNodeToSys(system, nodeStr) {
        if (!this.systemsNodechoices[system._key]) {
            this.systemsNodechoices[system._key] = [];
        }
        this.systemsNodechoices[system._key].push(nodeStr);
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
        // get the bonus collection.
        let collection = (sys.getCollection('extra', 'bonus'));
        if (!collection) {
            console.error("Could not find collection in group 'extra' by name of 'bonus'");
            return false;
        }
        // loop through all bonuses from this specifik feature. and remove them
        let l = this.bonusNodes.length;
        for (let i = 0; i < l; i++) {
            // get nodes from the bonus collection. 
            const node = this.bonusNodes[0]; // 0 because for each of these, the array becomes shorter
            collection === null || collection === void 0 ? void 0 : collection.removeNode(node);
        }
        // remove system from references 
        this.systems = this.systems.filter(p => p._key != sys._key);
        delete this.systemsNodechoices[sys._key];
        return true;
    }
    /**
     * provides a dispose call that doesent call remove,
     * this method should be called from the node when disposed.
     */
    disposeNode_fromNode(node) {
        // remove the node reference from this feature
        const _n = this.bonusNodes.findIndex(p => p._key == node._key);
        if (_n != -1) {
            this.bonusNodes = this.bonusNodes.filter(p => p._key != node._key);
        }
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
