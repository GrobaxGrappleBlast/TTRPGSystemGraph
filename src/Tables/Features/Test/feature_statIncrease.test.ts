import { JsonArrayClassTyped, JsonClassTyped, JSONHandler, JsonNumber, JsonObject, JsonString } from "grobax-json-handler";
import { Feature , Feature_Origin_Collection, Feature_Origin_Node, Feature_StatIncrease_apply } from "..";
import { TTRPGSystemJSONFormatting } from "../../../../Tests/ModuleTest/ttrpgTest.test";
import { IOutputHandler } from "../../../Abstractions/IOutputHandler";
import { GrobBonusNode } from "../../../Nodes/GrobBonusNode";
import { GrobNodeType, TTRPGSystem } from "../../..";
import { IFeatureLoader, TTRPGSystemFeatureIndex } from "../../../Graph";
import { JsonFeature, JsonFeature_StatIncrease_apply, startTest } from "./dependencies.test";
 

 
test('StatIncrease Feature', async () => {
    
	const sys = startTest();

	// Create 
	const mod = new Feature_StatIncrease_apply();

	// Create Normal Stat_increase
	mod.name = "My Feature Name";
	mod.text = "text asdasdad asdada sda";
	mod.sourceCollections = [{sourceString	: 'fixed.stats'}];
	mod.increaseSize = 1;
	mod.increaseNumTargets = 2;
	
	// get the nodes 
	const node1 = sys.getNode('fixed','stats','strength')	as GrobNodeType;
	const node2 = sys.getNode('fixed','stats','dexterity')	as GrobNodeType;

	// apply this mod.
	mod.apply(sys, [node1.getLocationKey() , node2.getLocationKey()]);

	node1.setValue(1);
	node2.setValue(2);
	expect(node1.getValue()).toBe(2);
	expect(node2.getValue()).toBe(3);

	// remove the feature. 
	await mod.remove( sys );
	let v = node2.getValue();
	expect(node1.getValue()).toBe(1);
	expect(node2.getValue()).toBe(2);


})

test('StatIncrease Feature Rwo Systems At the same time', async () => {
    
	const sys = startTest();
	const sys2 = startTest();


	// Create 
	const mod = new Feature_StatIncrease_apply();

	// Create Normal Stat_increase
	mod.name = "My Feature Name";
	mod.text = "text asdasdad asdada sda";
	mod.sourceCollections = [
		{
			sourceString	: 'fixed.stats'
		}
	];
	mod.increaseSize = 1;
	mod.increaseNumTargets = 2;
	
	// get the nodes 
	const node11 = sys.getNode('fixed','stats','strength')	as GrobNodeType;
	const node12 = sys.getNode('fixed','stats','dexterity')	as GrobNodeType;
	const node21 = sys2.getNode('fixed','stats','strength')	as GrobNodeType;
	const node22 = sys2.getNode('fixed','stats','dexterity')as GrobNodeType;

	// apply this mod.
	mod.apply(sys , [node11.getLocationKey() , node12.getLocationKey()]);
	mod.apply(sys2, [node21.getLocationKey() , node22.getLocationKey()]);

	node11.setValue(1);
	node12.setValue(2);
	expect(node11.getValue()).toBe(2);
	expect(node12.getValue()).toBe(3);
	node21.setValue(1);
	node22.setValue(2);
	expect(node21.getValue()).toBe(2);
	expect(node22.getValue()).toBe(3);


	// remove the feature. 
	await mod.remove( sys );
	await mod.remove( sys2 );
	
	expect(node11.getValue()).toBe(1);
	expect(node12.getValue()).toBe(2);
	expect(node21.getValue()).toBe(1);
	expect(node22.getValue()).toBe(2);

})

test('fetch Feature by Source ', async () => {
	
	// create system
	const sys = startTest();

	// create system Feature fetcher
	class AFeatureLoader implements IFeatureLoader {
		async loadFeatures(source: string): Promise<Feature[]> {
			switch(source){
				case 'classes.fighter':
					let incrThreeMainStats = new Feature_StatIncrease_apply();
					incrThreeMainStats.name = "Fighters Resolution";
					incrThreeMainStats.sourceItems			= []
					incrThreeMainStats.sourceCollections	= [{sourceString:'fixed.stats'}]
					incrThreeMainStats.increaseSize			= 1;
					incrThreeMainStats.increaseNumTargets	= 3;

					return [incrThreeMainStats];
				break;
				case 'general.feats':

					let incrTwoMainStats = new Feature_StatIncrease_apply();
					incrTwoMainStats.name = "stat increase";
					incrTwoMainStats.sourceItems		= []
					incrTwoMainStats.sourceCollections	= [{sourceString:'fixed.stats'}]
					incrTwoMainStats.increaseSize		= 1;
					incrTwoMainStats.increaseNumTargets	= 2;

					return [incrTwoMainStats];
				break;
				default: 
					return [];
			}
		}
	}

	// add a system loader and load a source
	TTRPGSystemFeatureIndex.setfeatureLoader( new AFeatureLoader() );
	await TTRPGSystemFeatureIndex.loadFeatureSource('classes.fighter');
	const fts = await TTRPGSystemFeatureIndex.getFeatures('classes.fighter') ?? [];
	const mod = fts[0];
	
	// get the nodes 
	const node1 = sys.getNode('fixed','stats','strength')	as GrobNodeType;
	const node2 = sys.getNode('fixed','stats','dexterity')	as GrobNodeType;
	const node3 = sys.getNode('fixed','stats','charisma')	as GrobNodeType;

	// apply this mod.
	mod.apply(sys, [node1.getLocationKey() , node2.getLocationKey(), node3.getLocationKey() ]);

	node1.setValue(1);
	node2.setValue(2);
	node3.setValue(3);
	expect(node1.getValue()).toBe(2);
	expect(node2.getValue()).toBe(3);
	expect(node3.getValue()).toBe(4);

	// remove the feature. 
	await mod.remove( sys );
	expect(node1.getValue()).toBe(1);
	expect(node2.getValue()).toBe(2);
	expect(node3.getValue()).toBe(3);

})

test('Load And Save as Json', () => {

	// create system
	//const sys = startTest();

	// create Feaure 
	let org = new JsonFeature_StatIncrease_apply();
	org.name = "Fighters Resolution";
	org.sourceItems			= []
	org.sourceCollections	= [{sourceString:'fixed.stats'}]
	org.increaseSize		= 1;
	org.increaseNumTargets	= 3;

	const json	= JSONHandler.serialize(org);
	const obj	= JSONHandler.deserialize(JsonFeature,json) as JsonFeature_StatIncrease_apply;

	expect(obj.sourceItems)			.toEqual(org.sourceItems);
	expect(obj.sourceCollections)	.toEqual(org.sourceCollections);
	expect(obj.increaseSize)		.toEqual(org.increaseSize);
	expect(obj.increaseNumTargets)	.toEqual(org.increaseNumTargets);
})
