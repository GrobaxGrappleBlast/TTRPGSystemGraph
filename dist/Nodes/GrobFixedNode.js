"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobFixedNode = void 0;
const AGrobNodte_1 = require("./AGrobNodte");
class GrobFixedNode extends AGrobNodte_1.AGrobNode {
    constructor(name, parent) {
        super(name, 'NF', parent);
        this.___value = 1;
    }
    _getValue() {
        return this.___value;
    }
    setValue(value) {
        this.___value = value;
        for (const key in this.dependents) {
            const curr = this.dependents[key];
            curr.update();
        }
    }
    static getTypeString() {
        return 'fixedNode';
    }
    getTypeString() {
        return GrobFixedNode.getTypeString();
    }
    _update() { }
}
exports.GrobFixedNode = GrobFixedNode;
