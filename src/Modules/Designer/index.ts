


import { type groupKeyType } from './GraphV2/TTRPGSystemGraphModel';
import type { GrobNodeType } from './GraphV2/TTRPGSystemsGraphDependencies';
import { GrobCollection, type GrobCollectionType } from './GrobCollection';
import { GrobGroup, type GrobGroupType } from './GrobGroup';
import { GrobDerivedNode, GrobDerivedOrigin, GrobFixedNode } from './GrobNodte';
import { TTRPG_SCHEMES, TTRPGSystemJSONFormatting } from './JsonModuleImplementation/TTRPGSystemJSONFormatting';

 
export { 
	GrobFixedNode		,
	GrobDerivedOrigin	,
	GrobDerivedNode		,
	GrobNodeType		,

	GrobCollection		,
	GrobCollectionType	,

	GrobGroup			,
	GrobGroupType		,
	groupKeyType		,

	TTRPGSystemJSONFormatting as TTRPGSystem,
	TTRPG_SCHEMES as TTRPG_SCHEMES			,
}
	
export function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
	.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0, 
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
