'use strict';
var ActionNode = require('./action-node'),
    ConditionNode = require('./condition-node'),
    ChainNode = require('./chain-node'),
    GraphNode = require('./graph-node');

var toNode = module.exports = (definition) => {
    var node;

    if (Array.isArray(definition)) {
        node = ActionNode(definition);
    }
    else if (typeof definition === 'object') {
        if (definition.action) {
            node = ActionNode(definition)
        }
        else if (definition.condition) {
            node = ConditionNode(definition);
        }
        else if (definition.chain) {
            node = ChainNode(definition);
        }
        else if (definition.graph) {
            node = GraphNode(definition);
        }
    }

    return node;
};
