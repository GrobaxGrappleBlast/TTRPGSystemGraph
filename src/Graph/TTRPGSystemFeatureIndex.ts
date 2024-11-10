import { GrobCollection } from "../GrobCollection";
import { type GrobGroupType } from "../GrobGroup";
import { newOutputHandler } from "../Abstractions/IOutputHandler"; 
import type { GrobNodeType } from "./TTRPGSystemsGraphDependencies"; 

import { GrobBonusNode, GrobFixedNode } from 	"../index";
import { GrobDerivedNode } from "../index";
import { TTRPGSystemGraphModel } from ".";
import { Feature, FeatureSource } from "src/Tables/Features";

 
type featureSourceToNode =  { src:FeatureSource , node : GrobBonusNode };
export interface IFeatureLoader {
	loadFeatures () : Promise<{str:string, feature : Feature}[]>;
}

/**
 *  handles Model operations and Data Containment, 
 * Ensures that data is maintained, as well as graphlinks
*/ 
export  class TTRPGSystemFeatureIndex extends TTRPGSystemGraphModel {

	protected	featureLoader	: IFeatureLoader;
	protected	featureQue		: featureSourceToNode[] = []; 
	public		loadedFeatures	: Record<string,Feature> = {};
	
	public async processFeatureQue_getSources ( iterative : boolean = false ){
		
		// ensure that there is a Feature loader Module.
		if (!this.featureLoader){
			console.warn('Attempted to load features without Adding a FeatureLoader first');
			return;
		}

		// create array, for to hold all sources in.
		let sources : string [] = [];
		
		// go through all items in the que. and ensure that 
		for (let i = 0; i < this.featureQue.length; i++) {
			
			// get source from each item.
			const src = this.featureQue[i].src.source;
			sources.push(src);
			
		}

		// call the implemented loed function. 
		await this.loadFeaturesFromSources(sources);
 
		// in case that things have changed in the meantime
		// we create a list of unfetched Features
		let unfetchedSources : featureSourceToNode[] = [];

		// for each feature in the que 
		while ( this.featureQue.length != 0 ){
			
			// get the next item.
			let source = this.featureQue.pop()
			if( !source ){ 
				continue;
			}

			// get src
			let src = source.src;
			if( !src ){ 
				continue;
			}

			// if this source is not loaded yet, add it to unloaded. 
			if ( this.loadedFeatures[ src.source ?? ''] == null ){
				unfetchedSources.push( source );
				continue;
			}
			else if ( this.loadedFeatures[src.source][src.name] == null ){
				console.error('No Feature at ' + src.source + ' with the name ' + src.name );
				continue;
			}

			// get Feature and add it to the node.
			let feature = this.loadedFeatures[src.source][src.name]; 
			let node = source.node;
			node.featureSrc = feature;

		}

		// add all to this process que
		this.featureQue.push(...unfetchedSources);
		if (iterative){
			return this.processFeatureQue_getSources();
		}
		return ;
	}

	protected async loadFeaturesFromSources( sources : string [] ){}

	public setfeatureLoader(featureLoader	: IFeatureLoader){
		this.featureLoader = featureLoader;
	}
	
}



