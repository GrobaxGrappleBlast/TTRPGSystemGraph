import { AGrobNode } from "../AGrobNodte";
import { NameValueTracker } from "./NameValueTracker";


export interface GrobNode extends AGrobNode<GrobNode>{}
export interface TarjanAlgorithmLink {

	// will allow us to recognize if a node is visitied, or not by THIS specific run of the algorithm. 
	// without cleaning, and being dependent on cleaning. 
	tarjanAlgorithmAlgorithmIndex : any;
	LowLinkValue : number 					 ;
	linkValue:number;
}



export class GrobAlgorithms{ 

	public static algLevel = 1;
	public static TarjAlgo( nodes : GrobNode[] , strongComponents : Record<string,GrobNode> = {}){
		/*	
			const derived = 'derived';
			function createGraph(  ) : Record<string,dependencyNode>{

				// creating the data we need to work with. 
				// first we Get the nodes with their names 
				var graph 		: Record<string,AGrobNode<any>> = {}; 
				data.forEach( Collection => {  
					Collection.data.forEach( stat => {
						const name = `${derived}.${Collection.name}.${stat.name}`;
						const node = new dependencyNode( name ); 
						graph[ name ] = node; 
					}) 
				}); 
			
				// We add the dependencies to the nodes as outgoing edges. 
				// While Doing so when we find an edge, we also add it as ingoing to its target. 
				for ( const key in graph ) {

					const node = graph[key];
					const item = dict[key];
						

					// get the edges 
					const edges = item.data.map(p => p.origin);
					edges.forEach( edge => {
						const target = graph[edge];
						
						// if item
						if( !target )
							return;

						// add outgoing
						node.dependencies.push( target );
		
						// add ingoing
						target.dependents.push(node);

					});
				}
					
				return graph;
			}

			// We need a dictionary where the names match the names in the pointers
			// where the pointers are the references to our objct.
			const dict: Record<string, IDerivedStat<T>> = {};
			for (let c = 0; c < data.length; c++) {
				const collection = data[c];
				for (let s = 0; s < collection.data.length; s++) {
					const stat = collection.data[s];
					dict[`derived.${collection.name}.${stat.name}`]	= stat;
				}
			} 
			var graph: Record<string,dependencyNode>  = createGraph(data,dict);  
		*/

		//  --- --- --- --- --- --- --- ---  --- --- --- --- --- ---
		// Tarjans Algorithm
		//  --- --- --- --- --- --- --- ---  --- --- --- --- --- ---
		
		// we use tarjans algorithm to count islands. look for cyclic dependencies ( in wich case, we ERROR )
		// and for this, wee need to prepare a que. we are going to use a copy of the node collection we have.
		let que : GrobNode[] = [];
		nodes.forEach(node => {
			que.push(node);
		});
		let algLevel = GrobAlgorithms.algLevel++;
		let counter = 0;
		//let cyclicCounter = 0;
		//let islands : GrobNode[][] = [];
		//let tracker = new  NameValueTracker<GrobNode>(); 

		let stack : GrobNode[] = [];
		// We create our stack, a list of all nodes where every node has a link and LowLink value.
		// BFS Searching to asign link values;
		while ( que.length > 0){	
			const curr = que.pop() as GrobNode;
			if ( curr.tarjanAlgorithmAlgorithmIndex != algLevel){
				curr.linkValue		= counter++;
				curr.LowLinkValue	= Number.MAX_SAFE_INTEGER;
				curr.tarjanAlgorithmAlgorithmIndex = algLevel;
				que.push(...Object.values(curr.dependencies));
			}
			stack.push(curr);

			// add tracking for this location. 
			//tracker.nameToNumber( curr.getLocationKey() , curr.LowLinkValue , curr );
		}

		que = [];
		nodes.forEach(node => {
			que.push(node);
		});
		algLevel = GrobAlgorithms.algLevel++; 
		while ( que.length > 0){	
			const curr = que.pop() as GrobNode;
			tarjanNodeVisit(algLevel,curr,strongComponents);
		}

		function tarjanNodeVisit( algLevel, node : GrobNode , strongComponents : Record<string,GrobNode> ){
			// Stop The algorithm if the node has already been visited
			if( node.tarjanAlgorithmAlgorithmIndex == algLevel ){
				return node.LowLinkValue;
			}
			let que : GrobNode[] = Object.values(node.dependencies);
			let lowLinkValue = node.LowLinkValue;
			node.tarjanAlgorithmAlgorithmIndex = algLevel;
			while ( que.length > 0){	
				const curr = que.pop() as GrobNode;
				const lowLinkCandidate = tarjanNodeVisit(algLevel,curr,strongComponents);
				
				if( curr.LowLinkValue == lowLinkCandidate){
					strongComponents[curr.getLocationKey()] = curr;
				}
 
				else if ( curr.LowLinkValue < lowLinkCandidate){
					lowLinkValue = lowLinkCandidate;
				}  

			}
			node.LowLinkValue = lowLinkValue;
			return lowLinkValue;
		}


		return [Object.keys(strongComponents).length == 0, strongComponents];

	} 
}
