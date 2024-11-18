import { JsonArrayClassTyped, JsonClassTyped, JSONHandler, JsonNumber, JsonObject, JsonString } from "grobax-json-handler";
import { Feature , Feature_Origin_Collection, Feature_Origin_Node, Feature_calcReplacement } from "..";
import { TTRPGSystemJSONFormatting } from "../../../../Tests/ModuleTest/ttrpgTest.test";
import { IOutputHandler } from "../../../Abstractions/IOutputHandler";
import { GrobBonusNode } from "../../../Nodes/GrobBonusNode";
import { GrobNodeType, TTRPGSystem } from "../../..";
import { IFeatureLoader, TTRPGSystemFeatureIndex } from "../../../Graph";
import exp from "constants";
import { JsonFeature, JsonFeature_calcreplace, startTest } from "./dependencies.test";
 



 
test('replace simple node And get value', () => {
	try{
	// get system and define the feature
	const sys1 = startTest();
	const sys2 = startTest();
	const featureOrig = new JsonFeature_calcreplace();
	
	featureOrig.name = 'Armor'
	featureOrig.calc = '12 + @d'
	var o1 = new Feature_Origin_Node();
	o1.sourceString="derived.modifiers.dexterity";
	o1.symbol = "@d";
	featureOrig.sources = [];
	featureOrig.sources.push(o1); 
	featureOrig.text = " Tjubah !!!!! ";
	featureOrig.source = "adssadasdadasdadad";
	
	// set the dex of the characters to 12
	var dex1 = sys1.getNode('fixed','stats','dexterity');
	var dex2 = sys2.getNode('fixed','stats','dexterity');
	dex1?.setValue(12);
	dex2?.setValue(12);

	var ac1 = sys1.getNode('derived','generic','armor class');
	var ac2 = sys2.getNode('derived','generic','armor class');
	expect(ac1?.getValue()).toEqual(11)
	expect(ac2?.getValue()).toEqual(11)
	
	featureOrig.apply(sys1, 'derived.generic.armor class' )
	expect(ac1?.getValue()).toEqual(13)
	expect(ac2?.getValue()).toEqual(11)

	featureOrig.remove(sys1);
	expect(ac1?.getValue()).toEqual(11)
	expect(ac2?.getValue()).toEqual(11)

	} catch ( e ) {
		console.error(e);
		expect(true).toEqual(false);
	}
})

test('Have Several Armors ', () => {
	
	// get system and define the feature
	const sys1 = startTest();
	const sys2 = startTest();

	const lightArmor = new JsonFeature_calcreplace();
	lightArmor.name = 'Armor'
	lightArmor.calc = '12 + @d'
	var o1 = new Feature_Origin_Node();
	o1.sourceString="derived.modifiers.dexterity";
	o1.symbol = "@d";
	lightArmor.sources = [];
	lightArmor.sources.push(o1);
	lightArmor.text = " Tjubah !!!!! ";
	lightArmor.source = "adssadasdadasdadad";

	const heavyArmor = new JsonFeature_calcreplace();
	heavyArmor.name = 'Heavy Armor'
	heavyArmor.calc = '18';
	heavyArmor.sources = []; 
	heavyArmor.text = " Tjubah !!!!! ";
	heavyArmor.source = "adssadasdadasdadad";

	const MonkUnarmored = new JsonFeature_calcreplace();
	MonkUnarmored.name = 'unarmored defense (monk)'
	MonkUnarmored.calc = '12 + @d + @w'
	var o2 = new Feature_Origin_Node();
	o2.sourceString="derived.modifiers.dexterity";
	o2.symbol = "@d";
	var o1 = new Feature_Origin_Node();
	o1.sourceString="derived.modifiers.wisdom";
	o1.symbol = "@w";
	MonkUnarmored.sources = [];
	MonkUnarmored.sources.push(o2);
	MonkUnarmored.sources.push(o1);
	MonkUnarmored.text = " Tjubah !!!!! ";
	MonkUnarmored.source = "adssadasdadasdadad";

	const BarUnarmored = new JsonFeature_calcreplace();
	BarUnarmored.name = 'unarmored defense (Barbarian)'
	BarUnarmored.calc = '10 + @d + @c'
	var o1 = new Feature_Origin_Node();
	var o2 = new Feature_Origin_Node();
	o1.sourceString="derived.modifiers.constitution";
	o1.symbol = "@c";
	o2.sourceString="derived.modifiers.dexterity";
	o2.symbol = "@d";
	BarUnarmored.sources = [];
	BarUnarmored.sources.push(o1);
	BarUnarmored.sources.push(o2);
	BarUnarmored.text = " Tjubah !!!!! ";
	BarUnarmored.source = "adssadasdadasdadad";
	
	// set the dex of the characters to 12
	var dex1 = sys1.getNode('fixed','stats','dexterity');
	var dex2 = sys2.getNode('fixed','stats','dexterity');
	dex1?.setValue(12);
	dex2?.setValue(12);

	var ac1 = sys1.getNode('derived','generic','armor class');
	var ac2 = sys2.getNode('derived','generic','armor class');
	expect(ac1?.getValue()).toEqual(11)
	expect(ac2?.getValue()).toEqual(11)
	
	lightArmor		.apply(sys1, 'derived.generic.armor class' ) 
	heavyArmor		.apply(sys1, 'derived.generic.armor class' ) 
	MonkUnarmored	.apply(sys1, 'derived.generic.armor class' ) 
	BarUnarmored	.apply(sys1, 'derived.generic.armor class' ) 

	var armorNameToKeys = {};
	ac1?.getReplacements().forEach( p => armorNameToKeys[p.name] = p._key );

	// dnd 5e Rules.
	// we set Values that affect armor class of the different types 
	sys1.getNode('fixed','stats','dexterity')	?.setValue(12); // gives mod +1
	sys1.getNode('fixed','stats','wisdom')		?.setValue(12); // gives mod +1
	sys1.getNode('fixed','stats','constitution')?.setValue(14); // gives mod +2

	
	// so monk should be 
	//lightArmor.calc = '12 + @d'			// 12 + 1 = 13	
	//heavyArmor.calc = '18';				// 18
	//MonkUnarmored.calc = '12 + @d + @w'	// 12 + 1 + 1 = 14 		
	//BarUnarmored.calc = '10 + @d + @c'	// 10 + 1 + 2 = 13
	let AClightArmor	= 13;	
	let ACheavyArmor	= 18;
	let ACMonkUnarmored	= 14;
	let ACBarUnarmored	= 13;	

	// The rules are that the first replacement applied, stays applied
	expect(ac1?.getValue()).toEqual( AClightArmor )	// i exspect it to be lightarmor 13
	expect(ac2?.getValue()).toEqual(11) // sys without this applied stil is unaffected

	// now when i choose the light armor i exspect nothing to change
	ac1?.activateReplacementByKey( armorNameToKeys[lightArmor.name] );
	expect(ac1?.getValue()).toEqual( AClightArmor )	// i exspect it to be light armor 13. 
	expect(ac2?.getValue()).toEqual(11) // sys without this applied stil is unaffected

	// now when i choose the heavy amor i exspect, heavy Armor's AC
	ac1?.activateReplacementByKey( armorNameToKeys[heavyArmor.name] );
	expect(ac1?.getValue()).toEqual( ACheavyArmor )	// i exspect it to be heavyArmor 18. 
	expect(ac2?.getValue()).toEqual(11) // sys without this applied stil is unaffected

	// now when choosing monk . we exspect unarmored from monk. 
	ac1?.activateReplacementByKey( armorNameToKeys[MonkUnarmored.name] );
	expect(ac1?.getValue()).toEqual( ACMonkUnarmored )	// i exspect it to be unarmored from monk 14. 
	expect(ac2?.getValue()).toEqual(11) // sys without this applied stil is unaffected

	// now when choosing barbarian . we exspect unarmored from barbarian. 
	ac1?.activateReplacementByKey( armorNameToKeys[BarUnarmored.name] );
	expect(ac1?.getValue()).toEqual( ACBarUnarmored )	// i exspect it to be unarmored from barbarian 13. 
	expect(ac2?.getValue()).toEqual(11) // sys without this applied stil is unaffected

	// now remove all of them one at a time.
	// only when all replacements are removed
	// can it be at the original AC
	ac1?.remReplacementByKey( armorNameToKeys[lightArmor.name] )
	expect(ac1?.getValue() == 11 ).toEqual( false )	// is stil not standard
	ac1?.remReplacementByKey( armorNameToKeys[heavyArmor.name] )
	expect(ac1?.getValue() == 11 ).toEqual( false )	// is stil not standard
	ac1?.remReplacementByKey( armorNameToKeys[MonkUnarmored.name] )
	expect(ac1?.getValue() == 11 ).toEqual( false )	// is stil not standard
	ac1?.remReplacementByKey( armorNameToKeys[BarUnarmored.name] ) 

	// Now when all are removed. it should be back to normal
	expect(ac1?.getValue() == 11 ).toEqual( true )

})


 
test(' Serialize unserialize then use ' , () => {
	
	// get system and define the feature
	const sys1 = startTest();
	const sys2 = startTest();
	const featureOrig = new JsonFeature_calcreplace();
	
	featureOrig.name = 'Armor'
	featureOrig.calc = '12 + @d'
	var o1 = new Feature_Origin_Node();
	o1.sourceString="derived.modifiers.dexterity";
	o1.symbol = "@d";
	featureOrig.sources = [];
	featureOrig.sources.push(o1); 
	featureOrig.text = " Tjubah !!!!! ";
	featureOrig.source = "adssadasdadasdadad";
	
	var JSON = JSONHandler.serialize(featureOrig);
	var feature = JSONHandler.deserialize(JsonFeature, JSON);

	// set the dex of the characters to 12
	var dex1 = sys1.getNode('fixed','stats','dexterity');
	var dex2 = sys2.getNode('fixed','stats','dexterity');
	dex1?.setValue(12);
	dex2?.setValue(12);

	var ac1 = sys1.getNode('derived','generic','armor class');
	var ac2 = sys2.getNode('derived','generic','armor class');
	expect(ac1?.getValue()).toEqual(11)
	expect(ac2?.getValue()).toEqual(11)
	
	feature.apply(sys1, 'derived.generic.armor class' )
	expect(ac1?.getValue()).toEqual(13)
	expect(ac2?.getValue()).toEqual(11)

	feature.remove(sys1);
	expect(ac1?.getValue()).toEqual(11)
	expect(ac2?.getValue()).toEqual(11)

	
})
