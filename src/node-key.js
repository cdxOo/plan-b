'use strict';
module.exports = (...path) => {
    if (typeof path[0] === 'object') {
        var node = path[0];
        path = [ ...node.path, node.name ];
    }
    
    return '/' + path.join('/');
}

