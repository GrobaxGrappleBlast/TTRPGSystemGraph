"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobAlgorithms = void 0;
var GrobAlgorithms = /** @class */ (function () {
    function GrobAlgorithms() {
    }
    GrobAlgorithms.TarjAlgo = function (nodes, strongComponents) {
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
        if (strongComponents === void 0) { strongComponents = {}; }
        //  --- --- --- --- --- --- --- ---  --- --- --- --- --- ---
        // Tarjans Algorithm
        //  --- --- --- --- --- --- --- ---  --- --- --- --- --- ---
        // we use tarjans algorithm to count islands. look for cyclic dependencies ( in wich case, we ERROR )
        // and for this, wee need to prepare a que. we are going to use a copy of the node collection we have.
        var que = [];
        nodes.forEach(function (node) {
            que.push(node);
        });
        var algLevel = GrobAlgorithms.algLevel++;
        var counter = 0;
        //let cyclicCounter = 0;
        //let islands : GrobNode[][] = [];
        //let tracker = new  NameValueTracker<GrobNode>(); 
        var stack = [];
        // We create our stack, a list of all nodes where every node has a link and LowLink value.
        // BFS Searching to asign link values;
        while (que.length > 0) {
            var curr = que.pop();
            if (curr.tarjanAlgorithmAlgorithmIndex != algLevel) {
                curr.linkValue = counter++;
                curr.LowLinkValue = Number.MAX_SAFE_INTEGER;
                curr.tarjanAlgorithmAlgorithmIndex = algLevel;
                que.push.apply(que, Object.values(curr.dependencies));
            }
            stack.push(curr);
            // add tracking for this location. 
            //tracker.nameToNumber( curr.getLocationKey() , curr.LowLinkValue , curr );
        }
        que = [];
        nodes.forEach(function (node) {
            que.push(node);
        });
        algLevel = GrobAlgorithms.algLevel++;
        while (que.length > 0) {
            var curr = que.pop();
            tarjanNodeVisit(algLevel, curr, strongComponents);
        }
        function tarjanNodeVisit(algLevel, node, strongComponents) {
            // Stop The algorithm if the node has already been visited
            if (node.tarjanAlgorithmAlgorithmIndex == algLevel) {
                return node.LowLinkValue;
            }
            var que = Object.values(node.dependencies);
            var lowLinkValue = node.LowLinkValue;
            node.tarjanAlgorithmAlgorithmIndex = algLevel;
            while (que.length > 0) {
                var curr = que.pop();
                var lowLinkCandidate = tarjanNodeVisit(algLevel, curr, strongComponents);
                if (curr.LowLinkValue == lowLinkCandidate) {
                    strongComponents[curr.getLocationKey()] = curr;
                }
                else if (curr.LowLinkValue < lowLinkCandidate) {
                    lowLinkValue = lowLinkCandidate;
                }
            }
            node.LowLinkValue = lowLinkValue;
            return lowLinkValue;
        }
        return [Object.keys(strongComponents).length == 0, strongComponents];
    };
    GrobAlgorithms.algLevel = 1;
    return GrobAlgorithms;
}());
exports.GrobAlgorithms = GrobAlgorithms;
