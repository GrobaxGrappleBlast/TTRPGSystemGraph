import exp from "constants";  
import { GrobDerivedNode, TTRPGSystem } from "../..";
import { IOutputHandler } from "../../Abstractions/IOutputHandler";
import { GrobNode, GrobNode_Algorithms } from "./TarjanNode";


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
				const node = nodes[n];
				
				arr.push(node);
			}
		}
	}

	const res = GrobNode_Algorithms.TarjAlgo(arr);
	expect(res[0]).toBe(true);
	expect(Object.keys(res[1]).length).toBe(0);
 
});



test('Tarjan - Failure ', () => {


	let sys = startTest();
	let arr : GrobNode[] = [];
	const groups = Object.values(sys.data);

	// create a circular dependency
	let n1 : GrobDerivedNode = sys.getNode('derived','1c','1n');
	let n2 : GrobDerivedNode = sys.getNode('derived','2c','3n');
	let n3 : GrobDerivedNode = sys.getNode('derived','4c','2n');
	let n4 : GrobDerivedNode = sys.getNode('derived','5c','4n');
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
				const node = nodes[n];
				
				arr.push(node);
			}
		}
	}

	const res = GrobNode_Algorithms.TarjAlgo(arr);
	expect(res[0]).toBe(false);
	expect(Object.keys(res[1]).length).toBeGreaterThan(0);
 
});