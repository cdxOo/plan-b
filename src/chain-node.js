'use strict';
var ChainNode = module.exports = (definition) => {
    var node = {
        type: 'chain'
    };

    var { chain: name, type: removed, ...rest } = definition;
    node = {
        ...node,
        name,
        ...rest
    };

    return node;
}
