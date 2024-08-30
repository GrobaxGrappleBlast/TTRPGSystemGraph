


import { keyManagerInstance } from './Abstractions/KeyManager';
import { TTRPGSystemGraphModel, type groupKeyType } from './Graph/TTRPGSystemGraphModel';
import type { GrobNodeType } from './Graph/TTRPGSystemsGraphDependencies';
import { GrobCollection, type GrobCollectionType } from './GrobCollection';
import { GrobGroup, type GrobGroupType } from './GrobGroup';
import { GrobDerivedNode, GrobDerivedOrigin, GrobFixedNode } from './GrobNodte'; 

export {keyManagerInstance}
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
	
	TTRPGSystemGraphModel as TTRPGSystem, 
}
	
export function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
	.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0, 
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
