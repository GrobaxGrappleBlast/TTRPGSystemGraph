"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTRPGSystemFeatureIndex = void 0;
var tslib_1 = require("tslib");
var IOutputHandler_1 = require("../Abstractions/IOutputHandler");
var _1 = require(".");
/**
 *  handles Model operations and Data Containment,
 * Ensures that data is maintained, as well as graphlinks
*/
var TTRPGSystemFeatureIndex = /** @class */ (function (_super) {
    tslib_1.__extends(TTRPGSystemFeatureIndex, _super);
    function TTRPGSystemFeatureIndex() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TTRPGSystemFeatureIndex.processFeatureQue_getSources = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (iterative) {
            var sources, i, src, unfetchedSources, source, src, feature, node;
            var _a;
            var _b;
            if (iterative === void 0) { iterative = false; }
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // ensure that there is a Feature loader Module.
                        if (!TTRPGSystemFeatureIndex.featureLoader) {
                            console.warn('Attempted to load features without Adding a FeatureLoader first');
                            return [2 /*return*/];
                        }
                        sources = [];
                        // go through all items in the que. and ensure that 
                        for (i = 0; i < TTRPGSystemFeatureIndex.featureQue.length; i++) {
                            src = TTRPGSystemFeatureIndex.featureQue[i].src.source;
                            sources.push(src);
                        }
                        // call the implemented loed function. 
                        return [4 /*yield*/, this.loadFeatureSources(sources)];
                    case 1:
                        // call the implemented loed function. 
                        _c.sent();
                        unfetchedSources = [];
                        // for each feature in the que 
                        while (TTRPGSystemFeatureIndex.featureQue.length != 0) {
                            source = TTRPGSystemFeatureIndex.featureQue.pop();
                            if (!source) {
                                continue;
                            }
                            src = source.src;
                            if (!src) {
                                continue;
                            }
                            // if this source is not loaded yet, add it to unloaded. 
                            if (TTRPGSystemFeatureIndex.loadedFeatures[(_b = src.source) !== null && _b !== void 0 ? _b : ''] == null) {
                                unfetchedSources.push(source);
                                continue;
                            }
                            else if (TTRPGSystemFeatureIndex.loadedFeatures[src.source][src.name] == null) {
                                console.error('No Feature at ' + src.source + ' with the name ' + src.name);
                                continue;
                            }
                            feature = TTRPGSystemFeatureIndex.loadedFeatures[src.source][src.name];
                            node = source.node;
                            node.featureSrc = feature;
                        }
                        // add all to this process que
                        (_a = TTRPGSystemFeatureIndex.featureQue).push.apply(_a, unfetchedSources);
                        if (iterative) {
                            return [2 /*return*/, this.processFeatureQue_getSources()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TTRPGSystemFeatureIndex.loadFeatureSources = function (sources) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var i, source;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if the feature loader is not added, then return
                        if (!TTRPGSystemFeatureIndex.featureLoader) {
                            console.error('Tried to load features, but no feature loader was installed');
                            return [2 /*return*/, false];
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < sources.length)) return [3 /*break*/, 4];
                        source = sources[i];
                        return [4 /*yield*/, this.loadFeatureSource(source)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TTRPGSystemFeatureIndex.loadFeatureSource = function (source_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (source, reload, out) {
            var features, newNames, _loadedFeatures, nonShared_missing, i, curr, oldFeature, newFeature;
            var _a;
            if (reload === void 0) { reload = false; }
            if (out === void 0) { out = (0, IOutputHandler_1.newOutputHandler)(); }
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // if the feature loader is not added, then return
                        if (!TTRPGSystemFeatureIndex.featureLoader) {
                            console.error('Tried to load feature, but no feature loader was installed');
                            return [2 /*return*/, false];
                        }
                        // if it is already loaded, and reload is off, then return true.
                        if (TTRPGSystemFeatureIndex.loadedFeatures[source])
                            return [2 /*return*/, true];
                        return [4 /*yield*/, TTRPGSystemFeatureIndex.featureLoader.loadFeatures(source)];
                    case 1:
                        features = _b.sent();
                        newNames = features.map(function (p) { return p.name; });
                        _loadedFeatures = (_a = TTRPGSystemFeatureIndex.loadedFeatures[source]) !== null && _a !== void 0 ? _a : [];
                        nonShared_missing = _loadedFeatures.filter(function (p) { return !newNames.includes(p.name); });
                        // remove the missing features 
                        nonShared_missing.forEach(function (p) { return p.dispose(); });
                        // add or update 
                        for (i = 0; i < features.length; i++) {
                            curr = features[i];
                            // if it already exist, either reload or remove and replace
                            if (TTRPGSystemFeatureIndex.loadedNameFeatures[source] && TTRPGSystemFeatureIndex.loadedNameFeatures[source][curr.name]) {
                                oldFeature = TTRPGSystemFeatureIndex.loadedNameFeatures[source][curr.name];
                                newFeature = curr;
                                // if reload, reload
                                if (reload) {
                                    oldFeature.updateTo(newFeature, out);
                                }
                                // else remove and replace
                                else {
                                    oldFeature.dispose();
                                    oldFeature.updateTo(newFeature, out);
                                }
                            }
                            else {
                                // ensure no null indices
                                if (!this.loadedFeatures[source]) {
                                    this.loadedFeatures[source] = [];
                                }
                                if (!this.loadedNameFeatures[source]) {
                                    this.loadedNameFeatures[source] = {};
                                }
                                // register the new feature
                                this.loadedFeatures[source].push(curr);
                                this.loadedNameFeatures[source][curr.name] = curr;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TTRPGSystemFeatureIndex.setfeatureLoader = function (featureLoader) {
        TTRPGSystemFeatureIndex.featureLoader = featureLoader;
    };
    TTRPGSystemFeatureIndex.getFeature = function (source, name) {
        var src = TTRPGSystemFeatureIndex.loadedNameFeatures[source];
        if (!src)
            return null;
        var feat = src[name];
        if (!feat)
            return null;
        return feat;
    };
    TTRPGSystemFeatureIndex.getFeatures = function (source) {
        var features = TTRPGSystemFeatureIndex.loadedFeatures[source];
        if (!features)
            return null;
        return features;
    };
    TTRPGSystemFeatureIndex.featureQue = [];
    TTRPGSystemFeatureIndex.loadedFeatures = {};
    TTRPGSystemFeatureIndex.loadedNameFeatures = {};
    return TTRPGSystemFeatureIndex;
}(_1.TTRPGSystemGraphModel));
exports.TTRPGSystemFeatureIndex = TTRPGSystemFeatureIndex;
