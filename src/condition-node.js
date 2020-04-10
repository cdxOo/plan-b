'use strict';
var ConditionNode = module.exports = ({
    path,
    definition,
    onCreate
}) => {
    path = path || [];

    var node = {
        path,
        type: 'condition',
    };

    var { condition: name, type: removed, ...rest } = definition;
    node = {
        ...node,
        name,
        ...rest
    };

    onCreate && onCreate(node);

    return node;
}
