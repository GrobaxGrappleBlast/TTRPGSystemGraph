import { GrobCollection } from "../GrobCollection";
import { type GrobGroupType } from "../GrobGroup";
import { IOutputHandler, newOutputHandler } from "../Abstractions/IOutputHandler"; 
import type { GrobNodeType } from "./TTRPGSystemsGraphDependencies"; 

import { GrobBonusNode, GrobFixedNode } from 	"../index";
import { GrobDerivedNode } from "../index";
import { TTRPGSystemGraphModel } from ".";
import { Feature, FeatureSource } from "src/Tables/Features";

 
type featureSourceToNode =  { src:FeatureSource , node : GrobBonusNode };
export interface IFeatureLoader {
	loadFeatures ( source:string ) : Promise<Feature[]>;
}

/**
 *  handles Model operations and Data Containment, 
 * Ensures that data is maintained, as well as graphlinks
*/ 
export  class TTRPGSystemFeatureIndex extends TTRPGSystemGraphModel {

	protected	static featureLoader		: IFeatureLoader;
	protected	static featureQue			: featureSourceToNode[] = []; 
	public		static loadedFeatures		: Record<string,Feature[]> = {};
	public		static loadedNameFeatures	: Record<string,Record<string,Feature>> = {};
	
	public static async processFeatureQue_getSources ( iterative : boolean = false ){
		
		// ensure that there is a Feature loader Module.
		if (!TTRPGSystemFeatureIndex.featureLoader){
			console.warn('Attempted to load features without Adding a FeatureLoader first');
			return;
		}

		// create array, for to hold all sources in.
		let sources : string [] = [];
		
		// go through all items in the que. and ensure that 
		for (let i = 0; i < TTRPGSystemFeatureIndex.featureQue.length; i++) {
			
			// get source from each item.
			const src = TTRPGSystemFeatureIndex.featureQue[i].src.source;
			sources.push(src);
			
		}

		// call the implemented loed function. 
		await this.loadFeatureSources(sources);
 
		// in case that things have changed in the meantime
		// we create a list of unfetched Features
		let unfetchedSources : featureSourceToNode[] = [];

		// for each feature in the que 
		while ( TTRPGSystemFeatureIndex.featureQue.length != 0 ){
			
			// get the next item.
			let source = TTRPGSystemFeatureIndex.featureQue.pop()
			if( !source ){ 
				continue;
			}

			// get src
			let src = source.src;
			if( !src ){ 
				continue;
			}

			// if this source is not loaded yet, add it to unloaded. 
			if ( TTRPGSystemFeatureIndex.loadedFeatures[ src.source ?? ''] == null ){
				unfetchedSources.push( source );
				continue;
			}
			else if ( TTRPGSystemFeatureIndex.loadedFeatures[src.source][src.name] == null ){
				console.error('No Feature at ' + src.source + ' with the name ' + src.name );
				continue;
			}

			// get Feature and add it to the node.
			let feature = TTRPGSystemFeatureIndex.loadedFeatures[src.source][src.name]; 
			let node = source.node;
			node.featureSrc = feature;

		}

		// add all to this process que
		TTRPGSystemFeatureIndex.featureQue.push(...unfetchedSources);
		if (iterative){
			return this.processFeatureQue_getSources();
		}
		return ;
	}

	public static async loadFeatureSources ( sources : string [] ){
		
		// if the feature loader is not added, then return
		if ( !TTRPGSystemFeatureIndex.featureLoader ){
			console.error('Tried to load features, but no feature loader was installed');
			return false;
		}

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
			await this.loadFeatureSource(source);	
		}
		
	}

	public static async loadFeatureSource ( source : string , reload : boolean = false , out : IOutputHandler = newOutputHandler() ){
		
		// if the feature loader is not added, then return
		if ( !TTRPGSystemFeatureIndex.featureLoader ){
			console.error('Tried to load feature, but no feature loader was installed');
			return false;
		}

		// if it is already loaded, and reload is off, then return true.
		if (TTRPGSystemFeatureIndex.loadedFeatures[source])
			return true;

		// load the source
		let features = await TTRPGSystemFeatureIndex.featureLoader.loadFeatures(source);

		// finding the missing features. 
		let newNames = features.map( p => p.name ); 
		let _loadedFeatures : Feature[] = TTRPGSystemFeatureIndex.loadedFeatures[source] ?? [];
		let nonShared_missing	= _loadedFeatures.filter( p => !newNames.includes(p.name) )

		// remove the missing features 
		nonShared_missing.forEach( p => p.dispose() )

		// add or update 
		for (let i = 0; i < features.length; i++) {
			const curr = features[i];
			
			// if it already exist, either reload or remove and replace
			if ( TTRPGSystemFeatureIndex.loadedNameFeatures[source] && TTRPGSystemFeatureIndex.loadedNameFeatures[source][curr.name] ){
				
				// Get old feature and the matching new feature
				let oldFeature = TTRPGSystemFeatureIndex.loadedNameFeatures[source][curr.name];
				let newFeature = curr;

				// if reload, reload
				if ( reload ){
					oldFeature.updateTo( newFeature , out );
				}

				// else remove and replace
				else {
					oldFeature.dispose();
					oldFeature.updateTo(newFeature, out );
				}
			}
			else { 

				// ensure no null indices
				if (!this.loadedFeatures[source]){
					this.loadedFeatures[source] = [];
				}
				if(!this.loadedNameFeatures[source]){
					this.loadedNameFeatures[source] = {};
				}

				// register the new feature
				this.loadedFeatures[source].push(curr)
				this.loadedNameFeatures[source][curr.name] = curr;

			}
			
			
		}
			
		// if the features are not already loaded, then just load em. 
	}

	public static setfeatureLoader(featureLoader	: IFeatureLoader){
		TTRPGSystemFeatureIndex.featureLoader = featureLoader;
	}
	
	public static getFeature( source : string , name : string ){
		
		const src = TTRPGSystemFeatureIndex.loadedNameFeatures[source];
		if (!src)
			return null;

		const feat = src[name];
		if (!feat)
			return null;
		
		return feat;
	}
	public static getFeatures( source : string ){
		
		const features = TTRPGSystemFeatureIndex.loadedFeatures[source];
		if (!features)
			return null;
		return features;
	}
}



