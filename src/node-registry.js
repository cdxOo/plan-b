'use strict';

var NodeRegistry = module.exports = () => {
    var reg = {},
        nodes = {};

    var keyBy = ({ path, name, connect }, which) => {
        var prefix = path.join('/');
        return (
            which === 'connect'
            ? `${prefix}/${connect}`
            : `${prefix}/${name}`
        );
    }

    reg.add = (node) => {
        nodes[keyBy(node, 'name')] = node;
    }

    reg.get = (key) => (
        nodes[key]
    )

    reg.nextFor = (node) => (
        nodes[keyBy(node, 'connect')]
    )

    return reg;
}
