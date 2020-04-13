'use strict';
var NodeKey = require('./node-key');

var BaseNode = module.exports = ({
    type,
    path,
    name,
    connect,
}) => {
    var node = {
        type,
        path,
        name,
        connect,

        key: NodeKey(...path, name),
    };

    if (connect && typeof connect === 'string') {
        node.next = NodeKey(...path, connect);
    }

    return node;
};
