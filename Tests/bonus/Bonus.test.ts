import exp from "constants"; 
import { IOutputHandler } from "../../src/Abstractions/IOutputHandler";
import { GrobBonusNode, GrobDerivedNode, TTRPGSystem } from "../../src";

interface TestIOutputHandler extends IOutputHandler{
	errorMessages 	:string[],
	logMessages 	:string[],
	clean : () => void
}

var out : TestIOutputHandler = {
	errorMessages: [],
	logMessages: [],
	outError: function (msg: any) {
		this.errorMessages.push(msg);
		//console.log('ERROR :' + msg);
	},
	outLog: function (msg: any) {
		this.logMessages.push(msg);
		//console.log('LOG :' + msg);
	},
	clean: function (): void {
		this.errorMessages	= [];
		this.logMessages	= [];
	}
}


function setUpTests(){
	let sys = new TTRPGSystem();
	sys.initAsNew();
	
	// Create Basic Stats 
	let colF = sys.createFixedCollection('stats');
	sys.createFixedNode('stats','strength');
	sys.createFixedNode('stats','dexterity');
	sys.createFixedNode('stats','constitution');
	sys.createFixedNode('stats','wisdom');
	sys.createFixedNode('stats','charisma');
	sys.createFixedNode('stats','intelligense');

	// Create Basic Infomation
	colF = sys.createFixedCollection('generel'); 
	sys.createFixedNode(colF,'proficiency bonus');

	// Derived Data 
	function createModifier(col,stat){
		let mod = sys.createDerivedNode(col,stat);
		if(!mod){
			throw new Error('Could not create Mod')
			return;
		}

		mod.setCalc('Math.floor((@a - 10 )/ 2 )');
		let fNode = sys.getFixedNode('stats',stat);
		mod.setOrigin('@a',fNode);
	}
	let colD = sys.createDerivedCollection('modifiers');
	createModifier('modifiers','strength')
	createModifier('modifiers','dexterity');
	createModifier('modifiers','constitution');
	createModifier(colD,'wisdom');
	createModifier(colD,'charisma');
	createModifier(colD,'intelligense');
 
	function SpellBonus( col , stat){
		let bonus = sys.createDerivedNode(col,stat);
		if(!bonus){
			throw new Error('Could not create bonus')
			return;
		}

		bonus.setCalc('@a + @b');
		let profBonus =sys.getFixedNode('generel','proficiency bonus')
		let modifier  =sys.getDerivedNode('modifiers',stat)
		bonus.setOrigin('@a',profBonus	);
		bonus.setOrigin('@b',modifier	); 
	}
	colD = sys.createDerivedCollection('Spell Bonus');
	SpellBonus('Spell Bonus', 'strength');
	SpellBonus('Spell Bonus', 'dexterity');
	SpellBonus('Spell Bonus', 'constitution');
	SpellBonus(colD, 'wisdom');
	SpellBonus(colD, 'charisma');
	SpellBonus(colD, 'intelligense'); 

	function SpellDC( col , stat){
		let bonus = sys.createDerivedNode(col,stat);
		if(!bonus){
			throw new Error('Could not create bonus')
			return;
		}

		bonus.setCalc('8 + @a + @b');
		let profBonus =sys.getFixedNode('generel','proficiency bonus')
		let modifier  =sys.getDerivedNode('modifiers',stat)
		bonus.setOrigin('@a',profBonus	);
		bonus.setOrigin('@b',modifier	); 
	}
	colD = sys.createDerivedCollection('Spell DC');
	SpellDC('Spell DC', 'strength');
	SpellDC('Spell DC', 'dexterity');
	SpellDC('Spell DC', 'constitution');
	SpellDC(colD, 'wisdom');
	SpellDC(colD, 'charisma');
	SpellDC(colD, 'intelligense');
  
	return sys;
	 
}

test('Try To Add a Bonus', () => {
	let sys = setUpTests();
	let node ;
 
	node = sys.getNode('fixed','generel','proficiency bonus');
	node.setValue(0);
	node = sys.getNode('fixed','stats','charisma');
	node.setValue(20);
	node = sys.getNode('derived','Spell Bonus','charisma') as GrobDerivedNode;

	const bonus = GrobBonusNode
	.CreateNodeChain(sys,'bonus1')
	.addCalculation('2')
	.update()
	.getNode();

	let depCount1= Object.keys(node.dependencies).length
	let v1 = node.getValue();
	node.addBonus('myBonusIndex',bonus);
	let depCount2= Object.keys(node.dependencies).length
	let v2 = node.getValue();
  
	expect(v2).toBe(v1 + 2);
	node.remBonus('myBonusIndex');
	let depCount3= Object.keys(node.dependencies).length
	let v3 = node.getValue();

	expect(v1).toBe(v3);
	expect(depCount1).toEqual(depCount3);
	expect(depCount1).toEqual(depCount2 - 1);
	
});
