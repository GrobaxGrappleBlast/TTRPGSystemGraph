import { JsonArrayClassTyped, JsonClassTyped, JSONHandler, JsonNumber, JsonObject, JsonString } from "grobax-json-handler";
import { Feature , Feature_Choice, Feature_Origin_Collection, Feature_Origin_Node, Feature_StatIncrease_apply } from "..";
import { IOutputHandler } from "../../../Abstractions/IOutputHandler";
import { GrobBonusNode } from "../../../Nodes/GrobBonusNode";
import { GrobNodeType, TTRPGSystem } from "../../..";
import { IFeatureLoader, TTRPGSystemFeatureIndex } from "../../../Graph";
import { JsonFeature, JsonFeature_StatIncrease_apply, startTest } from "./dependencies.test";

function createChoiceFeature(){

	var m1,m2;
	// create choices 
		// create stat increase - feature
		m1 = new Feature_StatIncrease_apply();
		m1.name = 'Stat Increase';
		m1.text = '';
		m1.sourceCollections = [{sourceString	: 'fixed.stats'}];
		m1.increaseSize = 1;
		m1.increaseNumTargets = 2;

		// create stat increase - feature
		m2 = new Feature_StatIncrease_apply();
		m2.name = 'Generic Increase';
		m2.text = '';
		m2.sourceCollections = [{sourceString	: 'fixed.generic'}];
		m2.increaseSize = 1;
		m2.increaseNumTargets = 2;

	
	var c = new Feature_Choice();
	c.name = 'level x ChoiceFeature';
	c.text = 'when you reach level X';
	c.maxChoices = 1;
	c.choices.push(m1);
	c.choices.push(m2);
	
	return c;
}

test('StatIncrease Feature', () => {
	
	const sys = startTest();
	const fet = createChoiceFeature();

	// first we set the target nodes values 
	sys.getCollection('fixed','stats')?.getNodes().forEach( p => p.setValue (11) ) // Set all to 12, so +0;

	// first we aquire the nodes that we are going to choose to increase. and we set Their values.
	var n1 = sys.getNodeLocString('derived.modifiers.strength')
	var n2 = sys.getNodeLocString('derived.modifiers.dexterity')
	var n3 = sys.getNodeLocString('derived.modifiers.constitution')
	expect(n1?.getValue()).toBe(0)
	expect(n2?.getValue()).toBe(0)
	expect(n3?.getValue()).toBe(0)

	// we chose the first choice in our choice and apply it
	var choice = fet.choices[0].name;
	var choiceArgs = [
		'fixed.stats.strength',
		'fixed.stats.dexterity'
	]
	fet.apply(
		sys,
		choice,
		choiceArgs
	)

	expect(n1?.getValue()).toBe(1)
	expect(n2?.getValue()).toBe(1)
	expect(n3?.getValue()).toBe(0)


});