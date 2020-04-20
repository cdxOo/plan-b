'use srict';
var NodeKey = require('./node-key');

var OutNode = module.exports = (path, name) => ({
    key: NodeKey(...path, name),
    path,
    name
});

