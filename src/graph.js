var Graph = module.exports = (definition) => {
    var graph = {
        name: definition.name,
        start: undefined,
        nodes: {},
        subgraphs: {},
    };

    if (definition.graph) {
        graph.nodes = {};

        definition.graph.forEach((nodeDefinition) => {
            var node = undefined;
            if (Array.isArray(nodeDefinition)) {
                node = ActionNode(nodeDefinition);
            }
            else if (typeof nodeDefinition === 'object') {
                if (nodeDefinition.action) {
                    node = ActionNode(nodeDefinition)
                }
                else if (nodeDefinition.condition) {
                    node = ConditionNode(nodeDefinition);
                }
                else if (nodeDefinition.subgraph) {
                    node = SubgraphNode(nodeDefinition);
                }
            }

            if (node.name === '$start') {
                if (graph.start == undefined) {
                    graph.start = node;
                }
                else {
                    throw new Error('multiple $start nodes');
                }
            }

            if (graph.nodes[node.name]) {
                throw new Error('duplicate node name');
            }
            else {
                graph.nodes[node.name] = node;
            }
        });
    }

    return graph;
}

