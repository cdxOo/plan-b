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

    var { chain: name, type: removed, ...rest } = definition;
    node = {
        ...node,
        name,
        ...rest
    };

    onCreate && onCreate(node);

    return node;
}
