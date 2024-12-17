import { AGrobNode } from "./AGrobNodte";
export class GrobFixedNode extends AGrobNode {
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
