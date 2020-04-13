'use strict';
var BaseNode = require('./base-node');

var ActionNode = module.exports = ({
    path,
    definition,
    onCreate
}) => {
    path = path || [];

    var name = undefined,
        connect = undefined,
        other = undefined;

    if (Array.isArray(definition)) {
        ([ name, connect ] = definition);
    }
    else if (typeof definition === 'object') {
        ({ action: name, connect, ...other } = definition);
    }
    else {
        throw new Error('node defintion must be an array or an object');
    }

    var node = {
        ...other,
        ...BaseNode({
            type: 'action',
            path,
            name,
            connect,
        })
    };

    onCreate && onCreate(node);

    return node;
}
