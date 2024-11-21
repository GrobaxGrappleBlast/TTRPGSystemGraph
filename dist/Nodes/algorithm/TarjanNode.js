"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrobAlgorithms = void 0;
var GrobAlgorithms = /** @class */ (function () {
    function GrobAlgorithms() {
    }
    GrobAlgorithms.TarjAlgo = function (nodes) {
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
        }
        que = [];
        nodes.forEach(function (node) {
            que.push(node);
        });
        algLevel = GrobAlgorithms.algLevel++;
        var lowlinkMapper = {};
        var NodeVistCounter = { num: 0 };
        while (que.length > 0) {
            var curr = que.pop();
            tarjanNodeVisit(algLevel, curr, lowlinkMapper, NodeVistCounter);
        }
        var strongComponents = Object.values(lowlinkMapper).filter(function (p) { return p.length > 1; });
        function tarjanNodeVisit(algLevel, node, lowlinkMapper, nodeVistCounter) {
            // Stop The algorithm if the node has already been visited
            if (node.tarjanAlgorithmAlgorithmIndex == algLevel) {
                return node.LowLinkValue;
            }
            // first if this node has not been visited before we give it a VisitCounter
            if (node.LowLinkValue == Number.MAX_SAFE_INTEGER) {
                node.LowLinkValue = nodeVistCounter.num++;
            }
            // we set the algortihm level 
            node.tarjanAlgorithmAlgorithmIndex = algLevel;
            // we aquire our low link value as a variable
            var lowLinkValue = node.LowLinkValue;
            // for debuggign we get the location key of the node. 
            //let src = node.getLocationKey();
            // we go through each of this nodes dependencies
            var que = Object.values(node.dependencies);
            while (que.length > 0) {
                // get the current item
                var curr = que.pop();
                // for debugging we get the current locationkey
                //let srci = curr.getLocationKey();
                // now we visit the node with this algorithm and get the lowest link it can get
                var lowLinkCandidate = tarjanNodeVisit(algLevel, curr, lowlinkMapper, nodeVistCounter);
                // if the new lowlink value is lower than ours, we register it as our new lowlink value
                if (lowLinkValue > lowLinkCandidate) {
                    lowLinkValue = lowLinkCandidate;
                }
            }
            // ! Here we register the link value. ! this is how we know of stronglyBoundComponents.
            // we mark this lowlink value for our node. and apply it to the node
            if (!lowlinkMapper[lowLinkValue])
                lowlinkMapper[lowLinkValue] = [];
            lowlinkMapper[lowLinkValue].push(node);
            node.LowLinkValue = lowLinkValue;
            // we return the lowlink value.
            return lowLinkValue;
        }
        // apply the object result, to the output obj.
        var hasStrongComponents = strongComponents.length != 0;
        return [hasStrongComponents, strongComponents];
    };
    GrobAlgorithms.algLevel = 1;
    return GrobAlgorithms;
}());
exports.GrobAlgorithms = GrobAlgorithms;
