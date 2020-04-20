'use strict';
var NodeKey = require('./node-key'),
    OutNode = require('./out-node-arg'),
    getBranchTarget = require('./get-branch-target');

var AsyncExecutor = module.exports = async ({
    registry,
    key,
    onAction,
    onCondition
}) => {
    
    var findNext = async (node) => {
        if (node.connect === '$end') {
            return;
        }

        if (node.type === 'condition') {
            var target = getBranchTarget({
                branches: node.connect,
                value: await onCondition(node)
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

    var doNode = async (key) => {
        var node = registry.get(key);

        if (node.type === 'graph') {
            await doGraphNode(node);
        }
        else if (node.type === 'chain') {
            await doChainNode(node);
        }
        else if (node.type === 'condition') {
            // nothing to do here
            // the magic happens in findNext()
        }
        else if (node.type === 'action') {
            await doActionNode(node);
        }

        var next = await findNext(node);
        if (next) {
            await doNode(next);
        }
    }

    var doGraphNode = async (node) => {
        if (node.nodes) {
            await doNode(node.start.key);
        }
        else {
            await doNode(`/${node.name}`);
        }
    }

    var doChainNode = async (node) => {
        if (node.actions) {
            await node.actions.reduce((promise, action) => (
                promise.then(() => (
                    onAction(OutNode(node.path, action))
                ))
            ), Promise.resolve())
        }
        else {
            await doNode(`/${node.name}`);
        }
    }

    var doActionNode = async (node) => {
        if (node.name !== '$start') {
            await onAction(
                OutNode(node.path, node.name)
            );
        }
    }

    await doNode(key);
}

