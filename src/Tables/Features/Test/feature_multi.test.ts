import { JsonArrayClassTyped, JsonClassTyped, JSONHandler, JsonNumber, JsonObject, JsonString } from "grobax-json-handler";
import { Feature , Feature_Choice, Feature_Multi, Feature_Origin_Collection, Feature_Origin_Node, Feature_StatIncrease_apply, FeatureMultiArgs } from "..";
import { IOutputHandler } from "../../../Abstractions/IOutputHandler";
import { GrobBonusNode } from "../../../Nodes/GrobBonusNode";
import { GrobNodeType, TTRPGSystem } from "../../..";
import { IFeatureLoader, TTRPGSystemFeatureIndex } from "../../../Graph";
import { JsonFeature, JsonFeature_calcreplace, JsonFeature_StatIncrease_apply, startTest } from "./dependencies.test";

function createMultiFeature(){

	var m1,m2;
	// create choices 
		// create stat increase - feature
		m1 = new Feature_StatIncrease_apply();
		m1.name = 'Stat Increase';
		m1.text = '';
		m1.sourceCollections = [{sourceString	: 'fixed.stats'}];
		m1.increaseSize = 1;
		m1.increaseNumTargets = 2;

		m2 = new JsonFeature_calcreplace();
		m2.name = 'Improved Unarmored Defence!'
		m2.calc = '12 + @d'
		var o1 = new Feature_Origin_Node();
		o1.sourceString="derived.modifiers.dexterity";
		o1.symbol = "@d";
		m2.sources = [];
		m2.sources.push(o1);
		m2.text = " Tjubah !!!!! "; 
		
	
	var c = new Feature_Multi();
	c.name = 'level x ChoiceFeature';
	c.text = 'when you reach level X';
	c.features.push(m1);
	c.features.push(m2);
	
	return c;
}

test('choose - StatIncrease Feature and Ac', () => {
	
	const sys = startTest();
	const fet = createMultiFeature();

	// first we set the target nodes values 
	sys.getCollection('fixed','stats')?.getNodes().forEach( p => p.setValue (11) ) // Set all to 12, so +0;

	// first we aquire the nodes that we are going to choose to increase. and we set Their values.
	var n1 = sys.getNodeLocString('derived.modifiers.strength')
	var n2 = sys.getNodeLocString('derived.modifiers.dexterity')
	var n3 = sys.getNodeLocString('derived.modifiers.constitution')
	expect(n1?.getValue()).toBe(0)
	expect(n2?.getValue()).toBe(0)
	expect(n3?.getValue()).toBe(0)
	// also get the ac
	var ac = sys.getNodeLocString('derived.generic.armor class');
	expect(ac?.getValue()).toBe(10)

	// we chose the first choice in our choice and apply it
	var arg : FeatureMultiArgs[] = [];
	arg.push ( 
		{ 
			featureName : fet.features[0].name,
			args : [
				'fixed.stats.strength',
				'fixed.stats.dexterity'
			]
		}
	)
	arg.push ( 
		{ 
			featureName : fet.features[1].name,
			args : 'derived.generic.armor class'
		}
	)

	fet.apply(
		sys,
		arg
	)

	expect(n1?.getValue()).toBe(1)
	expect(n2?.getValue()).toBe(1)
	expect(n3?.getValue()).toBe(0)
	expect(ac?.getValue()).toBe(13) // 12 + 1

	fet.remove(sys)
	expect(n1?.getValue()).toBe(0)
	expect(n2?.getValue()).toBe(0)
	expect(n3?.getValue()).toBe(0)
	expect(ac?.getValue()).toBe(10)

	fet.apply(
		sys,
		arg
	)

	expect(n1?.getValue()).toBe(1)
	expect(n2?.getValue()).toBe(1)
	expect(n3?.getValue()).toBe(0)
	expect(ac?.getValue()).toBe(13) // 12 + 1

	fet.remove()
	expect(n1?.getValue()).toBe(0)
	expect(n2?.getValue()).toBe(0)
	expect(n3?.getValue()).toBe(0)
	expect(ac?.getValue()).toBe(10)

});
 