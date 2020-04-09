'use strict';
var ActionNode = module.exports = (definition) => {
    var node = {
        type: 'action',
    };

    if (Array.isArray(definition)) {
        var [ name, target ] = definition;
        
        if (typeof target === 'string') {
            target = { connect: target };
        }
        
        node = {
            ...node,
            name,
            ...target
        };
    }
    else if (typeof definition === 'object') {
        var { action: name, type: removed, ...rest } = definition;
        node = {
            ...node,
            name,
            ...rest,
        };
    }
    else {
        throw new Error('node defintion must be an array or an object');
    }

    return node;
}
