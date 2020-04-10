'use strict';
var ActionNode = require('./action-node'),
    ConditionNode = require('./condition-node'),
    ChainNode = require('./chain-node'),
    GraphNode = require('./graph-node');

var toNode = module.exports = ({
    path,
    definition,
    onCreate,
}) => {
    var node;

    var downstream = {
        path,
        definition,
        onCreate,
    };
    if (Array.isArray(definition)) {
        node = ActionNode(downstream);
    }
    else if (typeof definition === 'object') {
        if (definition.action) {
            node = ActionNode(downstream)
        }
        else if (definition.condition) {
            node = ConditionNode(downstream);
        }
        else if (definition.chain) {
            node = ChainNode(downstream);
        }
        else if (definition.graph) {
            node = GraphNode(downstream);
        }
    }

    return node;
};
