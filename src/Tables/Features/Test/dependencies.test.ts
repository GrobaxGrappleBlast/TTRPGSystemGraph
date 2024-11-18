import { JsonArrayClassTyped, JsonClassTyped, JSONHandler, JsonNumber, JsonObject, JsonString } from "grobax-json-handler";
import { Feature , Feature_Origin_Collection, Feature_Origin_Node, Feature_calcReplacement , Feature_StatIncrease_apply } from "..";
import { IOutputHandler } from "../../../Abstractions/IOutputHandler";
import { GrobBonusNode } from "../../../Nodes/GrobBonusNode";
import { GrobNodeType, TTRPGSystem } from "../../..";
import { IFeatureLoader, TTRPGSystemFeatureIndex } from "../../../Graph";
import exp from "constants";
import { TTRPGSystemJSONFormatting } from "../../../../Tests/ModuleTest/testDependencies.test";
 


// Create System. 
interface TestIOutputHandler extends IOutputHandler{
	errorMessages 	:string[],
	logMessages 	:string[],
	clean : () => void
}
export var out : TestIOutputHandler = {
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
export function startTest() : TTRPGSystemJSONFormatting{

	const JSON = `{"fixed":{"name":"fixed","data":[{"name":"stats","data":[{"name":"strength","standardValue":1},{"name":"dexterity","standardValue":1},{"name":"constitution","standardValue":1},{"name":"wisdom","standardValue":1},{"name":"intelligence","standardValue":1},{"name":"charisma","standardValue":1},{"name":"Luck","standardValue":0}]},{"name":"SkillProficiencies","data":[{"name":"Athletics","standardValue":0},{"name":"Acrobatics","standardValue":0},{"name":"Sleight of Hand","standardValue":0},{"name":"Arcana","standardValue":0},{"name":"History","standardValue":0},{"name":"Investigation","standardValue":0},{"name":"Nature","standardValue":0},{"name":"Religion","standardValue":0},{"name":"Animal Handling","standardValue":0},{"name":"Insight","standardValue":0},{"name":"Medicine","standardValue":0},{"name":"Perception","standardValue":0},{"name":"Survival","standardValue":0},{"name":"Deception","standardValue":0},{"name":"Intimidation","standardValue":0},{"name":"Performance","standardValue":0},{"name":"Persuasion","standardValue":0}]},{"name":"generic","data":[{"name":"Proficiency Bonus","standardValue":1},{"name":"Hit Points","standardValue":1}]}]},"derived":{"name":"derived","data":[{"name":"modifiers","data":[{"name":"strength","calculationString":"Math.floor((@a-10)/2)","calcOrigins":[{"symbol":"@a","originKey":"fixed.stats.strength"}]},{"name":"dexterity","calculationString":"Math.floor((@a-10)/2)","calcOrigins":[{"symbol":"@a","originKey":"fixed.stats.dexterity"}]},{"name":"constitution","calculationString":"Math.floor((@a-10)/2)","calcOrigins":[{"symbol":"@a","originKey":"fixed.stats.constitution"}]},{"name":"wisdom","calculationString":"Math.floor((@a-10)/2)","calcOrigins":[{"symbol":"@a","originKey":"fixed.stats.wisdom"}]},{"name":"intelligence","calculationString":"Math.floor((@a-10)/2)","calcOrigins":[{"symbol":"@a","originKey":"fixed.stats.intelligence"}]},{"name":"charisma","calculationString":"Math.floor((@a-10)/2)","calcOrigins":[{"symbol":"@a","originKey":"fixed.stats.charisma"}]},{"name":"Luck","calculationString":"@a ","calcOrigins":[{"symbol":"@a","originKey":"fixed.stats.Luck"}]}]},{"name":"skillproficiencyBonus","data":[{"name":"Athletics","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Athletics"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.strength"}]},{"name":"Acrobatics","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Acrobatics"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.dexterity"}]},{"name":"Sleight of Hand","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Sleight of Hand"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.dexterity"}]},{"name":"Arcana","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Arcana"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.intelligence"}]},{"name":"History","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.History"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.intelligence"}]},{"name":"Investigation","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Investigation"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.intelligence"}]},{"name":"Nature","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Nature"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.intelligence"}]},{"name":"Religion","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Religion"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.intelligence"}]},{"name":"Animal Handling","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Animal Handling"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.wisdom"}]},{"name":"Insight","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Insight"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.wisdom"}]},{"name":"Medicine","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Medicine"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.wisdom"}]},{"name":"Perception","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Perception"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.wisdom"}]},{"name":"Survival","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Survival"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.wisdom"}]},{"name":"Deception","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Deception"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.charisma"}]},{"name":"Intimidation","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Intimidation"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.charisma"}]},{"name":"Performance","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Performance"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.charisma"}]},{"name":"Persuasion","calculationString":"@a * @c + @d","calcOrigins":[{"symbol":"@a","originKey":"fixed.SkillProficiencies.Persuasion"},{"symbol":"@c","originKey":"fixed.generic.Proficiency Bonus"},{"symbol":"@d","originKey":"derived.modifiers.charisma"}]}]},{"name":"Spell Bonus","data":[{"name":"strength","calculationString":"@a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.strength"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"dexterity","calculationString":"@a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.dexterity"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"constitution","calculationString":"@a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.constitution"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"wisdom","calculationString":"@a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.wisdom"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"intelligence","calculationString":"@a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.intelligence"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"charisma","calculationString":"@a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.charisma"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]}]},{"name":"Spell DC","data":[{"name":"strength","calculationString":"8 + @a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.strength"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"dexterity","calculationString":"8 + @a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.dexterity"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"constitution","calculationString":"8 + @a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.constitution"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"wisdom","calculationString":"8 + @a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.wisdom"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"intelligence","calculationString":"8 + @a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.intelligence"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]},{"name":"charisma","calculationString":"8 + @a + @b","calcOrigins":[{"symbol":"@a","originKey":"derived.modifiers.charisma"},{"symbol":"@b","originKey":"fixed.generic.Proficiency Bonus"}]}]},{"name":"generic","data":[{"name":"armor class","calculationString":"10 + @d","calcOrigins":[{"symbol":"@d","originKey":"derived.modifiers.dexterity"}]}]}]},"author":"Grobax","version":"0.0.1","systemCodeName":"0bdd1fd9-d27d-4e27-ad23-5da11796a0bc","systemName":"Grobax Default DnD For Obsidian"}`;
	const sys = JSONHandler.deserialize(TTRPGSystemJSONFormatting,JSON)
	return sys;
}


// --- Serializing Feature 
@JsonObject({
	onBeforeSerialization 	: (self) => {},
	onBeforeDeSerialization : (self, JsonObject ) => { 
		console.log(JsonObject['type']);
		switch(JsonObject['type']){
			case 'Feature_calcReplacement' : 
            return new JsonFeature_calcreplace();

            case 'Feature_StatIncrease_apply' : 
            return new JsonFeature_StatIncrease_apply() 
			default:
				return self;
		}
	}
})
export class JsonFeature extends Feature{
	
	remove(sys: TTRPGSystem): boolean {
		throw new Error("Method not implemented.");
	}
	apply(sys: TTRPGSystem, ...args: any[]): boolean {
		throw new Error("Method not implemented.");
	}
	disposeNode_fromNode(node: GrobBonusNode) {
		throw new Error("Method not implemented.");
	}
	updateTo(feature: Feature, out: IOutputHandler) : boolean{
		throw new Error("Method not implemented.");

	}
    public type: string = "TEST"; 
}
export class JsonFeature_calcreplace extends Feature_calcReplacement{
	
	@JsonString()
	declare public type: string ;
	
	@JsonString()
	declare public calc:string;

	@JsonClassTyped(Feature_Origin_Node)
	declare public sources : Feature_Origin_Node[];

	@JsonString()
    declare public name     :string;
	
	@JsonString()
    declare public source   :string;
    
	@JsonString()
	declare public text     :string;
}
export class JsonFeature_StatIncrease_apply extends Feature_StatIncrease_apply{
	@JsonString()
	declare public type :string;

	@JsonArrayClassTyped(Feature_Origin_Node)
    declare public sourceItems		:Feature_Origin_Node[];
    
	@JsonArrayClassTyped(Feature_Origin_Collection)
	declare public sourceCollections:Feature_Origin_Collection[];
    
	@JsonNumber()
	declare public increaseSize		: number;

	@JsonNumber()
    declare public increaseNumTargets: number;
}