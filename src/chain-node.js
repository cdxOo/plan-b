'use strict';
var BaseNode = require('./base-node');

var ChainNode = module.exports = ({
    path,
    definition,
    onCreate
}) => {
    path = path || [];

    var name,
        connect,
        other;

    if (Array.isArray(definition)) {
        var [ first, ...rest ] = definition,
            last = rest.pop();

        name = first;
        connect = last;
        other = { actions: [ first, ...rest ] };
    }
    else if (typeof definition === 'object') {
        ({
            chain: name,
            connect,
            ...other
        } = definition);
    }
    else {
        throw new Error('node defintion must be an array or an object');
    }

    var node = {
        ...other,
        ...BaseNode({
            type: 'chain',
            path,
            name,
            connect
        })
    }

    onCreate && onCreate(node);

    return node;
}
