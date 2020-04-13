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
        
        // FIXME: thats not really clean i think
        other.actions = other.actions.filter(
            action => (action !== '$start')
        );
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
