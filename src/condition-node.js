'use strict';
var NodeKey = require('./node-key'),
    BaseNode = require('./base-node');

var ConditionNode = module.exports = ({
    path,
    definition,
    onCreate
}) => {
    path = path || [];

    var {
        condition: name,
        connect,
        ...other
    } = definition;

    var next = connect.map(
        ([ value, target ]) => ([
            value,
            NodeKey(...path, target)
        ])
    );

    var node = {
        ...other,
        ...BaseNode({
            type: 'condition',
            path,
            name,
            connect,
        }),
        
        next
    };

    onCreate && onCreate(node);

    return node;
}
