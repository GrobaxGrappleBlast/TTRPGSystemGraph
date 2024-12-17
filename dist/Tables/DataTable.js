export class ADataTable {
    constructor() {
        this.data = {};
    }
    setName(name) {
        throw new Error("Method not implemented.");
    }
    getName() {
        throw new Error("Method not implemented.");
    }
    dispose() {
        throw new Error("Method not implemented.");
    }
    updateLocation() {
        throw new Error("Method not implemented.");
    }
    getLocationKey() {
        let segs = this.getLocationKeySegments();
        return segs.join('.');
    }
    getLocationKeySegments() {
        var _a, _b, _c, _d, _e, _f;
        let seg = ['', '', ''];
        seg[0] = (_c = (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.getName()) !== null && _c !== void 0 ? _c : 'unknown';
        seg[1] = (_e = (_d = this.parent) === null || _d === void 0 ? void 0 : _d.getName()) !== null && _e !== void 0 ? _e : 'unknown';
        seg[2] = (_f = this.getName()) !== null && _f !== void 0 ? _f : 'unknown';
        return seg;
    }
    update() { }
}
export class ADataRow {
}
