'use strict';
var ChainNode = module.exports = ({
    path,
    definition,
    onCreate
}) => {
    path = path || [];

    var node = {
        path,
        type: 'chain'
    };

    if (Array.isArray(definition)) {
        var [ first, ...rest ] = definition,
            last = rest.pop();

        node = {
            ...node,
            name: first,
            actions: [ first, ...rest ],
            connect: last,
        };
    }
    else if (typeof definition === 'object') {
        var { chain: name, type: removed, ...rest } = definition;
        node = {
            ...node,
            name,
            ...rest
        };
    }
    else {
        throw new Error('node defintion must be an array or an object');
    }
    onCreate && onCreate(node);

    return node;
}
