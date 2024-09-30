 
import { GrobCollection , GrobGroup , type GrobNodeType , GrobDerivedNode, GrobDerivedOrigin, GrobFixedNode, TTRPGSystem , uuidv4 } from "../../src/index";
import { JsonObject, JsonMappingRecordInArrayOut, JsonClassTyped, JsonString, JsonNumber, JsonArrayClassTyped } from "grobax-json-handler";
import { BASE_SCHEME } from "grobax-json-handler";
 

// if something is AGraphItem 
/*
@JsonString() 
public name ;
*/
// origins
export class GrobJDerivedOrigin extends GrobDerivedOrigin { 
	@JsonString()
	public symbol: string; 
	
	@JsonString()
	public originKey: string ;
}

 
// NODES  
export class GrobJDerivedNode extends GrobDerivedNode {
	@JsonString() 
	public name ;

	@JsonString({name : 'calculationString'})
	public calc:string;

	@JsonArrayClassTyped(GrobJDerivedOrigin,{name:'calcOrigins'})
	public origins : GrobJDerivedOrigin[];
} 
export class GrobJFixedNode extends GrobFixedNode {

	@JsonString() 
	public name ;

	@JsonNumber({name : 'standardValue'})
	public ___value:number
}
export type GrobJNodeType = GrobJDerivedNode | GrobJFixedNode;

 

//  COLLECTIONS 
export class GrobCollectionDerived extends GrobCollection<GrobJDerivedNode>{ 
	@JsonString() 
	public name ;
	
	@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data',type:GrobJDerivedNode })
	nodes_names: Record<string, GrobJDerivedNode> = {}
} 
export class GrobCollectionFixed extends GrobCollection<GrobJFixedNode>{

	@JsonString() 
	public name ;

	@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data',type:GrobJFixedNode  })
	nodes_names: Record<string, GrobJFixedNode> = {}
}





//  GROUPS 
export class GrobGroupDerived extends GrobGroup<GrobDerivedNode>{
	
	@JsonString() 
	public name ;

	@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data',type :GrobCollectionDerived  })
	collections_names: Record<string, GrobCollectionDerived > = {};

} 
export class GrobGroupFixed extends GrobGroup<GrobFixedNode>{
	
	@JsonString() 
	public name ;

	@JsonMappingRecordInArrayOut({KeyPropertyName:'getName', name:'data', type :GrobCollectionFixed  })
	collections_names: Record<string,GrobCollectionFixed> = {};

}





 
export class TTRPG_SCHEMES { 
	static PREVIEW ='mini';
} 

/**
 *  handles Model operations and Data Containment, 
 * Ensures that data is maintained, as well as graphlinks
*/
@JsonObject({
	onBeforeSerialization:(self:TTRPGSystemJSONFormatting) => {},
	onAfterDeSerialization:(self:TTRPGSystemJSONFormatting, ...args ) => {
		
		// add derived and fixed to groups 
		if ( !self.fixed	 ){
			self._createGroup('fixed');
			self.fixed	 = self._getGroup('fixed')	 as GrobGroupFixed	;
		}else{
			self.data['fixed'] = self.fixed;
		}
		if ( !self.derived ){
			self._createGroup('derived');
			self.derived = self._getGroup('derived') as GrobGroupDerived;	
		}else{
			self.data['derived'] = self.derived;
		}

		// For all groups 
		for(const group_key in (self as any).data ){
			const group = (self as any).data[group_key];
			group.parent = self;

			for(const col_key in (group as any).collections_names ){
				const collection : GrobCollection<GrobNodeType> = group.collections_names[col_key];
				collection.parent = group;
				group.collections_names[collection.getName()] = collection;

				for( const node_key in (collection as any).nodes_names ){
					const node = (collection as any).nodes_names[node_key];
					node.parent = collection;
					collection.nodes_names[node.getName()] = node;

					const origins : GrobDerivedOrigin[] = node.origins ?? [];
					origins.forEach( origin  => {
						let keys = origin.originKey.split('.');
						const target = self.getNode(keys[0] as any,keys[1],keys[2])
						origin.origin = target;

						node.addDependency(target)
					})
				}
			}
		}
		const groups = Object.values((self as any).data); 
	}
})
export class TTRPGSystemJSONFormatting extends TTRPGSystem {
	  
	@JsonClassTyped ( GrobGroupFixed )
	public fixed 	: GrobGroupFixed	;

	@JsonClassTyped ( GrobGroupDerived )
	public derived 	: GrobGroupDerived	;

	@JsonString()
	@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
	public author : string = "";

	@JsonString()
	@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
	public version: string = "";
	
	@JsonString()
	@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
	public systemCodeName:string = uuidv4();
	
	@JsonString()
	@JsonString({scheme:[BASE_SCHEME,TTRPG_SCHEMES.PREVIEW]})
	public systemName:string = "";
	
	public constructor(){
		super(); 
	}


}

import { JSONHandler } from "grobax-json-handler";
import { DerivedCollectionController } from "./derivedController.test";

const selAllInCollectionString = '- - Select all - -';

const loadedSystemJSON = `{"fixed": {"name": "fixed","collections_names": [{"name": "stats","data": [{"name": "strength","standardValue": 1},{"name": "dexterity","standardValue": 1},{"name": "constitution","standardValue": 1},{"name": "wisdom","standardValue": 1},{"name": "intelligense","standardValue": 1},{"name": "charisma","standardValue": 1}]},{"name": "SkillProficiencies","data": [{"name": "Athletics","standardValue": 0},{"name": "Acrobatics","standardValue": 0},{"name": "Sleight of Hand","standardValue": 0},{"name": "Arcana","standardValue": 0},{"name": "History","standardValue": 0},{"name": "Investigation","standardValue": 0},{"name": "Nature","standardValue": 0},{"name": "Religion","standardValue": 0},{"name": "Animal Handling","standardValue": 0},{"name": "Insight","standardValue": 0},{"name": "Medicine","standardValue": 0},{"name": "Perception","standardValue": 0},{"name": "Survival","standardValue": 0},{"name": "Deception","standardValue": 0},{"name": "Intimidation","standardValue": 0},{"name": "Performance","standardValue": 0},{"name": "Persuasion","standardValue": 0}]},{"name": "generic","data": [{"name": "Proficiency Bonus","standardValue": 1},{"name": "Hit Points","standardValue": 1}]}]},"author": "","version": "","systemCodeName": "","systemName": ""}`;
 
function checkDependentHasNodeInDependencies (node:GrobJNodeType, dependent:GrobJNodeType ){
	const v = Object.values(dependent.dependencies).find( p => p._key == node._key);
	return v != null;
}
function checkDependencyHasNodeInDependents (node:GrobJNodeType, dependency:GrobJNodeType ){
	const v = Object.values(dependency.dependents).find( p => p._key == node._key);
	return v != null;
}

Array.prototype['remove'] = function(element) {
    const index = this.indexOf(element);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};
Array.prototype['contains'] = function(substring) {
    return this.includes(substring);
};

test('Test Collection Designer Derived Elements', () => {
 
	// create the start requirements
	let system : TTRPGSystemJSONFormatting = JSONHandler.deserialize( TTRPGSystemJSONFormatting , loadedSystemJSON );
	let origins = JSON.parse('[{"key":"@a","segments":["fixed","stats","- - Select all - -"],"active":true,"testValue":1,"inCalc":true,"target":null,"isSelectAllTarget":true}]')
	system.createFixedCollection('stats');
	system.createFixedNode('stats','strength');
	system.createFixedNode('stats','dexterity');
	system.createFixedNode('stats','constitution');
	system.createFixedNode('stats','wisdom');
	system.createFixedNode('stats','charisma');
	system.createFixedNode('stats','intelligense');

	// creating the Creation view settings
	let controller = new DerivedCollectionController();
	controller.setControllerDeps( system ); 
	controller.recalculateCalcAndOrigins()
	controller.checkIsValid(); 
	controller.mappedOrigins			.set(origins); 
	controller.name						.set('testCollection');
	controller.nameCalc					.set('@a');
	controller.calc						.set('@a'); 

	// save it 
	controller.saveCollection();

	// SERIALIZE 
	let json = JSONHandler.serialize(system);
	let system2 = JSONHandler.deserialize( TTRPGSystemJSONFormatting , json );
	console.log(json,system2);

	let _1 = Object.keys(system.data);
	let _2 = Object.keys(system2.data);
	expect(_1).toEqual(_2);

	var keys = Object.keys(system.data);
	for (let g = 0; g < keys.length; g++) {
		const group_key = keys[g];
		const group_a = system .data[group_key];
		const group_b = system2.data[group_key];
		
		const col_keys = Object.keys(group_a.collections_names); 
		
		// WE should be checking the same group
		expect(group_a.name).toEqual(group_b.name)
		expect(col_keys).toEqual(Object.keys(group_b.collections_names))

		for (let c = 0; c < col_keys.length; c++) {
			const col_key = col_keys[c];
			const col_a = group_a.collections_names[col_key];
			const col_b = group_b.collections_names[col_key];

			const node_keys = Object.keys(col_a.nodes_names); 

			// WE should be checking the same collection
			expect(col_a.name).toEqual(col_b.name)
			expect(node_keys).toEqual(Object.keys(col_b.nodes_names))

			for (let n = 0; n < node_keys.length; n++) {
				const node_key = node_keys[n];
				const node_a = col_a.nodes_names[node_key] as GrobJNodeType;
				const node_b = col_b.nodes_names[node_key] as GrobJNodeType;
 
				// WE should be checking the same collection
				expect(node_a.name).toEqual(node_b.name)  

				const dependents_a = Object.values(node_a.dependents).map(p => p.name);
				const dependents_b = Object.values(node_b.dependents).map(p => p.name);

				const dependents_a_valid = Object.values(node_a.dependents).map(p => checkDependentHasNodeInDependencies(node_a, p ));
				const dependents_b_valid = Object.values(node_b.dependents).map(p => checkDependentHasNodeInDependencies(node_b, p ));

				// ensure that dependents are stil correct. 
				expect(dependents_a).toEqual(dependents_b);
				dependents_a_valid.forEach( p=> {expect(p).toBe(true)})
				dependents_b_valid.forEach( p=> {expect(p).toBe(true)})
				
				const dependencies_a = Object.values(node_a.dependencies).map(p => p.name);
				const dependencies_b = Object.values(node_b.dependencies).map(p => p.name);

				const dependencies_a_valid = Object.values(node_a.dependencies).map(p => checkDependencyHasNodeInDependents(node_a, p ));
				const dependencies_b_valid = Object.values(node_b.dependencies).map(p => checkDependencyHasNodeInDependents(node_b, p ));
				
				// ensure that dependents are stil correct. 
				expect(dependencies_a).toEqual(dependencies_b);
				dependencies_a_valid.forEach( p=> {expect(p).toBe(true)})
				dependencies_b_valid.forEach( p=> {expect(p).toBe(true)})
				
			}
		}
	}

	const isValid = system2.isValid([]);
	expect(isValid).toBe(true);
})


