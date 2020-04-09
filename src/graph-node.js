'use strict';
var toNode = require('./to-node');

var GraphNode = module.exports = (definition) => {
    var node = {
        type: 'graph'
    };

    var {
        graph: name,
        type: removed,
        nodes: subNodeDefinitions,
        ...rest
    } = definition;

    node = {
        ...node,
        name,
        ...rest
    };

    if (Array.isArray(subNodeDefinitions)) {
        var subnodes = [],
            start = undefined;

        subNodeDefinitions.forEach(def => {
            var n = toNode(def);
            if (n.name === '$start') {
                if (start === undefined) {
                    start = n;
                }
                else {
                    throw new Error('multiple start nodes in graph');
                }
            }
            subnodes.push(n);
        });

        node.start = start;
        node.nodes = subnodes;
    }

    return node;
}
