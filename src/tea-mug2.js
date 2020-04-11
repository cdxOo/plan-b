'use strict';
var toNode = require('./to-node'),
    getNodeKey = require('./get-node-key'),
    NodeRegistry = require('./node-registry');

var NodeKey = (node) => ( getNodeKey(node, 'name') );
var ConnectKey = (node) => ( getNodeKey(node, 'connect') );

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

        if (!onNode) {
            throw new Error('onNode() is not set, dont know what to do :(');
        }

        if (!onCondition) {
            throw new Error('onCondition() is not set, cant figure out which branch to use in case of a condition');
        }
        
        var current = nodes.get(`/${recipeName}`);
        runNode(current);
        while(next = findNextNode(nodes, next))
        runNode({
            registry,
            onNode,
            onCondition,
        });
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
            console.log(node);
            nodes.add(node)
        }
    });
    return node;
}

var run = ({
    registry,
    node,
    onNode,
    onCondition
}) => {
    var next = undefined;

    if (node.connect === '$end') {
        var parent = nodes.get(NodeKey(node.path));
        next = nodes.get(NodeKey(
            ...parent.path,
            parent.connect
        ));
    }
    else {
        if (node.type === 'condition') {
            next = nodes.get(
                NodeKey(
                    ...node.path,
                    getBranchTarget({
                        branches,
                        value: onCondition(node)
                    })
                )
            );
        }
        else if (node.type === 'graph') {
            var { path, connect } = node.start;
            next = nodes.get(NodeKey(
                ...path,
                connect
            ));
        }
        else {
            next = nodes.get(NodeKey(...node.path, connect));
        }
    }

    if (node.type === 'action') {
        onNode(node)
    }

    return next;
}

var getNextNode ({
    nodes,
    current
})

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
