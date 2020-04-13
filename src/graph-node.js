'use strict';
var BaseNode = require('./base-node');

var GraphNode = module.exports = ({
    path,
    definition,
    onCreate
}) => {
    path = path || [];

    // FIXME: because cyclical includes
    var toNode = require('./to-node');

    var {
        graph: name,
        nodes: subNodeDefinitions,
        connect,
        ...other
    } = definition;

    var node = {
        ...other,
        ...BaseNode({
            type: 'graph',
            path,
            name,
            connect,
        })
    };

    if (Array.isArray(subNodeDefinitions)) {
        var subnodes = [],
            start = undefined;

        subNodeDefinitions.forEach(def => {
            var n = toNode({
                path: [ ...path, name ],
                definition: def,
                onCreate,
            });
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

    onCreate && onCreate(node);

    return node;
}
