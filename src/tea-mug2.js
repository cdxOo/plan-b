'use strict';
var toNode = require('./to-node'),
    NodeKey = require('./node-key'),
    NodeRegistry = require('./node-registry');

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

        runGraph(nodes, `/${recipeName}`, onAction, onCondition);
    }

    return tm;
}

var runGraph = (registry, key, onAction, onCondition) => {
    var current = registry.get(key);
    run(current, onAction);
    while(current = findNextNode(registry, current, onCondition)) {
        if (current.type === 'graph' && !current.nodes) {
            runGraph(registry, `/${current.name}`, onAction, onCondition);
        }
        else {
            run(current, onAction);
        }
    }
}

var run = (node, onAction) => {
    if (node.type === 'action') {
        onAction(node)
    }
    else if (node.type === 'chain') {
        node.actions.forEach(action => onAction({
            // FIXME: thats no clean 
            name: action,
            key: node.key + '/' + action
        }))
    }
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

var findNextNode = (registry, node, onCondition) => {
    var next = undefined;
    console.log(node.key);

    if (node.connect === '$end') {
        if (node.path.length > 1) {
            var parent = registry.get(NodeKey(...node.path));
            
            if (!parent) {
                throw new Error('could not find parent node');
            }

            if (!(parent.type === 'graph' || parent.type === 'chain')) {
                throw new Error('parent node must be graph or chain');
            }
            
            next = registry.get(parent.next);
        }
        else if (node.path.length === 1) {
            // this is the end there is no next node
            next = false;
        }
        else {
            throw new Error('path length should never be < 1');
        }
    }
    else {
        if (node.type === 'condition') {
            var name = getBranchTarget({
                branches: node.connect,
                value: onCondition(node)
            })
            if (name === '$end') {
                var parent = registry.get(NodeKey(...node.path));
                if (parent.next) {
                    next = registry.get(parent.next);
                }
                else {
                    next = false;
                }
            }
            else {
                next = registry.get(NodeKey(...node.path, name));
            }
        }
        else if (node.type === 'graph') {
            var start = node.start;
            if (start.type === 'chain') {
                next = start;
            }
            else {
                next = registry.get(start.next);
            }
        }
        else {
            next = registry.get(node.next);
        }
    
    }

    if (next === undefined) {
        throw new Error('couldnt find next node');
    }

    return next;
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
