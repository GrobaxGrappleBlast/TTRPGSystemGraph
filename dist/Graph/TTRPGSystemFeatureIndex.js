"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTRPGSystemFeatureIndex = void 0;
const tslib_1 = require("tslib");
const IOutputHandler_1 = require("../Abstractions/IOutputHandler");
const _1 = require(".");
/**
 *  handles Model operations and Data Containment,
 * Ensures that data is maintained, as well as graphlinks
*/
class TTRPGSystemFeatureIndex extends _1.TTRPGSystemGraphModel {
    static processFeatureQue_getSources() {
        return tslib_1.__awaiter(this, arguments, void 0, function* (iterative = false) {
            var _a;
            // ensure that there is a Feature loader Module.
            if (!TTRPGSystemFeatureIndex.featureLoader) {
                console.warn('Attempted to load features without Adding a FeatureLoader first');
                return;
            }
            // create array, for to hold all sources in.
            let sources = [];
            // go through all items in the que. and ensure that 
            for (let i = 0; i < TTRPGSystemFeatureIndex.featureQue.length; i++) {
                // get source from each item.
                const src = TTRPGSystemFeatureIndex.featureQue[i].src.source;
                sources.push(src);
            }
            // call the implemented loed function. 
            yield this.loadFeatureSources(sources);
            // in case that things have changed in the meantime
            // we create a list of unfetched Features
            let unfetchedSources = [];
            // for each feature in the que 
            while (TTRPGSystemFeatureIndex.featureQue.length != 0) {
                // get the next item.
                let source = TTRPGSystemFeatureIndex.featureQue.pop();
                if (!source) {
                    continue;
                }
                // get src
                let src = source.src;
                if (!src) {
                    continue;
                }
                // if this source is not loaded yet, add it to unloaded. 
                if (TTRPGSystemFeatureIndex.loadedFeatures[(_a = src.source) !== null && _a !== void 0 ? _a : ''] == null) {
                    unfetchedSources.push(source);
                    continue;
                }
                else if (TTRPGSystemFeatureIndex.loadedFeatures[src.source][src.name] == null) {
                    console.error('No Feature at ' + src.source + ' with the name ' + src.name);
                    continue;
                }
                // get Feature and add it to the node.
                let feature = TTRPGSystemFeatureIndex.loadedFeatures[src.source][src.name];
                let node = source.node;
                node.featureSrc = feature;
            }
            // add all to this process que
            TTRPGSystemFeatureIndex.featureQue.push(...unfetchedSources);
            if (iterative) {
                return this.processFeatureQue_getSources();
            }
            return;
        });
    }
    static loadFeatureSources(sources) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // if the feature loader is not added, then return
            if (!TTRPGSystemFeatureIndex.featureLoader) {
                console.error('Tried to load features, but no feature loader was installed');
                return false;
            }
            for (let i = 0; i < sources.length; i++) {
                const source = sources[i];
                yield this.loadFeatureSource(source);
            }
        });
    }
    static loadFeatureSource(source_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (source, reload = false, out = (0, IOutputHandler_1.newOutputHandler)()) {
            var _a;
            // if the feature loader is not added, then return
            if (!TTRPGSystemFeatureIndex.featureLoader) {
                console.error('Tried to load feature, but no feature loader was installed');
                return false;
            }
            // if it is already loaded, and reload is off, then return true.
            if (TTRPGSystemFeatureIndex.loadedFeatures[source])
                return true;
            // load the source
            let features = yield TTRPGSystemFeatureIndex.featureLoader.loadFeatures(source);
            // finding the missing features. 
            let newNames = features.map(p => p.name);
            let _loadedFeatures = (_a = TTRPGSystemFeatureIndex.loadedFeatures[source]) !== null && _a !== void 0 ? _a : [];
            let nonShared_missing = _loadedFeatures.filter(p => !newNames.includes(p.name));
            // remove the missing features 
            nonShared_missing.forEach(p => p.dispose());
            // add or update 
            for (let i = 0; i < features.length; i++) {
                const curr = features[i];
                // if it already exist, either reload or remove and replace
                if (TTRPGSystemFeatureIndex.loadedNameFeatures[source] && TTRPGSystemFeatureIndex.loadedNameFeatures[source][curr.name]) {
                    // Get old feature and the matching new feature
                    let oldFeature = TTRPGSystemFeatureIndex.loadedNameFeatures[source][curr.name];
                    let newFeature = curr;
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
            // if the features are not already loaded, then just load em. 
        });
    }
    static setfeatureLoader(featureLoader) {
        TTRPGSystemFeatureIndex.featureLoader = featureLoader;
    }
    static getFeature(source, name) {
        const src = TTRPGSystemFeatureIndex.loadedNameFeatures[source];
        if (!src)
            return null;
        const feat = src[name];
        if (!feat)
            return null;
        return feat;
    }
    static getFeatures(source) {
        const features = TTRPGSystemFeatureIndex.loadedFeatures[source];
        if (!features)
            return null;
        return features;
    }
}
exports.TTRPGSystemFeatureIndex = TTRPGSystemFeatureIndex;
TTRPGSystemFeatureIndex.featureQue = [];
TTRPGSystemFeatureIndex.loadedFeatures = {};
TTRPGSystemFeatureIndex.loadedNameFeatures = {};
