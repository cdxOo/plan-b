'use strict';
var toNode = require('./to-node'),
    NodeKey = require('./node-key'),
    NodeRegistry = require('./node-registry');

var OutNode = (path, name) => ({
    key: NodeKey(...path, name),
    path,
    name
});

var TeaMug = module.exports = () => {
    var tm = {};

    var recipes = [],
        nodes = NodeRegistry(),

        onCondition = undefined,
        onAction = undefined;

    tm.recipes = (...args) => {
        args.forEach(definition => {
            var recipe = prepareRecipe({
                nodes,
                recipe: definition,
            });
            if (!tm.hasRecipe(recipe.name)) {
                recipes.push(recipe.name);
            }
            else {
                throw new Error(`recipe duplication for "${recipe.name}"`);
            }
        });

        return tm;
    }

    tm.hasRecipe = (name) => (
        recipes.indexOf(name) !== -1
    )

    tm.onCondition = (lambda) => {
        onCondition = lambda; 
        return tm;
    }

    tm.onAction = (lambda) => {
        onAction = lambda; 
        return tm;
    }

    tm.do = (recipeName) => {
        if (!tm.hasRecipe(recipeName)) {
            throw new Error(`dont have the "${recipeName}" recipe :(`);
        }

        if (!onAction) {
            throw new Error('onAction() is not set, dont know what to do :(');
        }

        if (!onCondition) {
            throw new Error('onCondition() is not set, cant figure out which branch to use in case of a condition');
        }

        tm.doNode(`/${recipeName}`);
    }

    tm.doNode = (key) => {
        var node = nodes.get(key);

        if (node.type === 'graph') {
            if (node.nodes) {
                tm.doNode(node.start.key);
            }
            else {
                tm.doNode(`/${node.name}`);
            }
        }
        else if (node.type === 'chain') {
            if (node.actions) {
                // FIXME: not sure if lifting the scope is good or not
                node.actions.forEach(action => onAction(
                    OutNode(node.path, action)
                ))
            }
            else {
                tm.doNode(`/${node.name}`);
            }
        }
        else if (node.type === 'condition') {
            // nothing to do here
            // the magic happens in findNext()
        }
        else if (node.type === 'action') {
            if (node.name !== '$start') {
                onAction(
                    OutNode(node.path, node.name)
                );
            }
        }

        var next = tm.findNext(node);
        if (next) {
            tm.doNode(next);
        }
    }

    tm.findNext = (node) => {
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

    return tm;
}

var prepareRecipe = ({
    recipe,
    nodes
}) => {
    var node = toNode({
        definition: recipe,
        onCreate: (node) => {
            nodes.add(node)
        }
    });
    return node;
}

var getBranchTarget = ({
    branches,
    value
}) => {
    var filtered = branches.filter(([ branchValue, target ]) => (
        value === branchValue
    ));
    
    if (filtered.length < 1) {
        throw new Error('cannot find any valid target node for condition');
    }
    if (filtered.length > 1) {
        throw new Error('there are multiple possible target nodes for condition')
    }

    return filtered[0][1];
}
