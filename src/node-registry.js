'use strict';
var keyBy = require('./get-node-key'),
    NodeKey = require('./node-key');

var NodeRegistry = module.exports = () => {
    var reg = {},
        nodes = {};

    reg.add = (node) => {
        nodes[NodeKey(node)] = node;
    }

    reg.get = (path) => (
        Array.isArray(path)
        ? nodes[NodeKey(...path)]
        : nodes[path]
    )

    reg.all = () => (
        nodes
    )

    return reg;
}
