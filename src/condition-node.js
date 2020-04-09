'use strict';
var ConditionNode = module.exports = (definition) => {
    var node = {
        type: 'condition',
    };

    var { condition: name, type: removed, ...rest } = definition;
    node = {
        ...node,
        name,
        ...rest
    };

    return node;
}
