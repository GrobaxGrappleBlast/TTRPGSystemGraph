import exp from "constants";  
import { GrobBonusNode, GrobDerivedNode, TTRPGSystem } from "../..";
import { IOutputHandler } from "../../Abstractions/IOutputHandler";
import { GrobAlgorithms, GrobNode } from "./TarjanNode";


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
function startTest(){
	let sys = new TTRPGSystem();
	sys.initAsNew();
	sys.setOut(out);
	out.clean();

	function createDerivedFunctions(){
		for (let c = 0; c < 5; c++){
			const colName = (c+1) + 'c';
			sys.createDerivedCollection(colName)

			for (let i = 0; i < 5; i++) {
				sys.createDerivedNode(colName,(i+1)+'n');
				sys.createDerivedNode(colName,(i+1)+'n');
				sys.createDerivedNode(colName,(i+1)+'n');
				sys.createDerivedNode(colName,(i+1)+'n');
				sys.createDerivedNode(colName,(i+1)+'n');
			}
		}
	}
	function createfixedFunctions(){
		for (let c = 0; c < 6; c++){
			const colName = (c+1) + 'c';
			sys.createFixedCollection(colName)
			
			for (let i = 0; i < 6; i++) {
				sys.createFixedNode(colName,(i+1)+'n'); 
			}
		}
	}

	createDerivedFunctions();
	createfixedFunctions();
	return sys;
}

test('Tarjan - Succes ', () => {


	let sys = startTest();
	let arr : GrobNode[] = [];
	const groups = Object.values(sys.data);

	for (let g = 0; g < groups.length; g++) {
		const group = groups[g];
		
		const collections = Object.values(group.collections_names);
		for (let c = 0; c < collections.length; c++) {
			const col = collections[c];
			
			const nodes = Object.values(col.nodes_names);
			for (let n = 0; n < nodes.length; n++) {
				const node = nodes[n] as GrobNode;
				arr.push(node);
			}
		}
	}

	const res = GrobAlgorithms.TarjAlgo(arr);
	expect(res[0]).toBe(false);
	expect(Object.keys(res[1]).length).toBe(0);
 
});



test('Tarjan - Failure ', () => {


	let sys = startTest();
	let arr : GrobNode[] = [];
	const groups = Object.values(sys.data);

	// create a circular dependency
	let n1 : GrobDerivedNode = sys.getNode('derived','1c','1n') as GrobDerivedNode;
	let n2 : GrobDerivedNode = sys.getNode('derived','2c','2n') as GrobDerivedNode;
	let n3 : GrobDerivedNode = sys.getNode('derived','4c','3n') as GrobDerivedNode;
	let n4 : GrobDerivedNode = sys.getNode('derived','5c','4n') as GrobDerivedNode;
	n1.addDependency(n2);
	n2.addDependency(n3);
	n3.addDependency(n4);
	n4.addDependency(n1);


	for (let g = 0; g < groups.length; g++) {
		const group = groups[g];
		
		const collections = Object.values(group.collections_names);
		for (let c = 0; c < collections.length; c++) {
			const col = collections[c];
			
			const nodes = Object.values(col.nodes_names);
			for (let n = 0; n < nodes.length; n++) {
				const node = nodes[n] as GrobNode;
				arr.push(node);
			}
		}
	}

	const res = GrobAlgorithms.TarjAlgo(arr);
	expect(res[0]).toBe(true);
	expect(Object.keys(res[1]).length).toBeGreaterThan(0);

	let o = Object.values(res[1]);
	expect(o.length).toBeGreaterThan(0);
	expect(o[0].length).toBe(4);

	let ob = res[1][0].map(p=>p.name);
	expect(ob).toContain(n1.name);
	expect(ob).toContain(n2.name);
	expect(ob).toContain(n3.name);
	expect(ob).toContain(n4.name);
});


test('Test Singular Node', () => {

	//  
	let sys = startTest();

	// create the node.
	const node = GrobBonusNode.CreateNodeChain(sys, '_target_' )
	.addCalculation( '1' )
	.getNode();

	let res = GrobAlgorithms.TarjAlgo( [node]  );
	expect(res[0]).toBe(false);
	expect(res[1]).toEqual([]);
})



function setUpTests2(){
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

test('Tarjan Test Where it failed before', () => {
	let sys = setUpTests2();
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

	let v1 = node.getValue();
	node.addBonus('myBonusIndex',bonus);
	let v2 = node.getValue();

	expect(v2).toBe(v1 + 2);
});
