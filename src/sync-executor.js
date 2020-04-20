'use strict';
var NodeKey = require('./node-key'),
    OutNode = require('./out-node-arg'),
    getBranchTarget = require('./get-branch-target');

var SyncExecutor = module.exports = ({
    registry,
    key,
    onAction,
    onCondition
}) => {

    var findNext = (node) => {
        if (node.connect === '$end') {
            return;
        }

        if (node.type === 'condition') {
            var target = getBranchTarget({
                branches: node.connect,
                value: onCondition(node)
            });
            if (target === '$end') {
                return;
            }
            else {
                return NodeKey(...node.path, target)
            }
        }
        else {
            return node.next || undefined
        }
    }

    var doNode = (key) => {
        var node = registry.get(key);

        if (node.type === 'graph') {
            doGraphNode(node);
        }
        else if (node.type === 'chain') {
            doChainNode(node);
        }
        else if (node.type === 'condition') {
            // nothing to do here
            // the magic happens in findNext()
        }
        else if (node.type === 'action') {
            doActionNode(node);
        }

        var next = findNext(node);
        if (next) {
            doNode(next);
        }
    }

    var doGraphNode = (node) => {
        if (node.nodes) {
            doNode(node.start.key);
        }
        else {
            doNode(`/${node.name}`);
        }
    }

    var doChainNode = (node) => {
        if (node.actions) {
            // FIXME: not sure if lifting the scope is good or not
            node.actions.forEach(action => onAction(
                OutNode(node.path, action)
            ))
        }
        else {
            doNode(`/${node.name}`);
        }
    }

    var doActionNode = (node) => {
        if (node.name !== '$start') {
            onAction(
                OutNode(node.path, node.name)
            );
        }
    }

    doNode(key);
}
