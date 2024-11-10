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
	public static TarjAlgo( nodes : GrobNode[] ){
	 
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
		}

		que = [];
		nodes.forEach(node => {
			que.push(node);
		});
		algLevel = GrobAlgorithms.algLevel++; 
		let lowlinkMapper :Record<number,GrobNode[]> = {};
		let NodeVistCounter : {num:number } = { num : 0 };
		while ( que.length > 0){	
			const curr = que.pop() as GrobNode;
			tarjanNodeVisit(algLevel,curr, lowlinkMapper, NodeVistCounter);
		}

		let strongComponents = Object.values(lowlinkMapper).filter( p => p.length > 1);

		function tarjanNodeVisit( algLevel, node : GrobNode , lowlinkMapper : Record<number,GrobNode[]>, nodeVistCounter : {num:number }  ){
			
			// Stop The algorithm if the node has already been visited
			if( node.tarjanAlgorithmAlgorithmIndex == algLevel ){
				return node.LowLinkValue;
			}
			
			// first if this node has not been visited before we give it a VisitCounter
			if (node.LowLinkValue == Number.MAX_SAFE_INTEGER){
				node.LowLinkValue = nodeVistCounter.num++;
			}

			// we set the algortihm level 
			node.tarjanAlgorithmAlgorithmIndex = algLevel;

			// we aquire our low link value as a variable
			let lowLinkValue = node.LowLinkValue;
			
			// for debuggign we get the location key of the node. 
			//let src = node.getLocationKey();

			// we go through each of this nodes dependencies
			let que : GrobNode[] = Object.values(node.dependencies);
			while ( que.length > 0){	

				// get the current item
				const curr = que.pop() as GrobNode;
				
				// for debugging we get the current locationkey
				//let srci = curr.getLocationKey();

				// now we visit the node with this algorithm and get the lowest link it can get
				const lowLinkCandidate = tarjanNodeVisit(algLevel,curr,lowlinkMapper, nodeVistCounter  );
			
				// if the new lowlink value is lower than ours, we register it as our new lowlink value
				if ( lowLinkValue > lowLinkCandidate){
					lowLinkValue = lowLinkCandidate;
				}  

			}

			// ! Here we register the link value. ! this is how we know of stronglyBoundComponents.
			// we mark this lowlink value for our node. and apply it to the node
			if(!lowlinkMapper[lowLinkValue])
				lowlinkMapper[lowLinkValue] = []
			lowlinkMapper[lowLinkValue].push(node);
			node.LowLinkValue = lowLinkValue;

			// we return the lowlink value.
			return lowLinkValue;
		}

		// apply the object result, to the output obj.
		let hasStrongComponents = strongComponents.length != 0;
		return [ hasStrongComponents ,  strongComponents];
	} 
}
