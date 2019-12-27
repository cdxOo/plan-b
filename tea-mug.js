var createParser = (recipe) => {
    /*var parser = {
        graphs: [],
        nodes: [],
        conditions: [],
    };

    recipe.map((graph_definition) => {
        graphs.push();
        if (graph.graph)
    })

    return parser;*/
}

var createCustomRunner = () => {
    var runner = {},
        onNodeMiddleware = undefined,
        onConditionMiddleware = undefined,
        conditions = {},
        recipe = undefined;

    runner.onNode = (middleware) => {
        onNodeMiddleware = middleware;
        return runner;
    };

    runner.onCondition = (middleware) => {
        onConditionMiddleware = middleware;
        return runner;
    }

    runner.recipe = (r) => {
        recipe = r;
        return runner;
    };

    runner.registerConditions = (c) => {
        conditions = {
            ...conditions,
            ...c
        };
        return runner;
    };

    var graphsByName = {};
    runner.make = (graph_name) => {
        //var parser = createParser(recipe);

        recipe.forEach(graph => {
            if (graphsByName[graph.name]) {
                throw new Error('graph name duplication'); // FIXME: can we work around that ... probably
            }
            graphsByName[graph.name] = prepareGraph(graph);
        });

        console.log(graphsByName);

        runGraph(graph_name);
    }
    
    var prepareGraph = (graph_definition) => {
        var prepared = {
            name: graph_definition.name,
            entry: graph_definition.entry,
        };
        
        if (graph_definition.graph) {
            prepared.graph = {};

            graph_definition.graph.forEach((node_definition) => {
                var key = node_definition[0],
                    target = node_definition[1];

                if (typeof target === 'string') {
                    target = { connect: target };
                }
                
                if (prepared.graph[key]) {
                    throw new Error('duplicate node key');
                }
                else {
                    prepared.graph[key] = target;
                }
            })
        }
        else if (graph_definition.steps) {
             prepared.steps = graph_definition.steps; 
        }

        return prepared;
    }


    var runGraph = (graph_name) => {
        console.log(`RUN GRAPH ${graph_name}`);
        var graph = graphsByName[graph_name];
        if (graph.graph) {
            console.log(' => graph');
            runNode(graph_name, graph.entry);
        }
        else if (graph.steps) {
            console.log(' => steps');
            graph.steps.forEach(step => {
                console.log('step');
                onNodeMiddleware(graph_name, step);
            });
            console.log('ok')
        }
    }

    var runNode = (graph_name, node_key) => {
        if (node_key === '$end') {
            return;
        }

        console.log(`RUN NODE ${graph_name}::${node_key}`);
        var graph = graphsByName[graph_name].graph,
            node = graph[node_key];

        if (node.subgraph) {
            console.log(' => subgraph');
            console.log(node);
            runGraph(node.subgraph);
            
            var target = findTargetNode(graph_name, node);
            runNode(graph_name, target);
        }
        else {
            console.log(' => node');
            onNodeMiddleware(graph_name, node_key);

            var target = findTargetNode(graph_name, node);
            runNode(graph_name, target);
        }
    };

    var findTargetNode = (graph_name, link_definition) => {
        console.log(`FIND TARGET NODE ${graph_name}`);
        console.log(link_definition);
        if (link_definition.condition) {
            console.log(' => has condition');
            var value = onConditionMiddleware(graph_name, link_definition.condition),
                target = undefined;

            link_definition.connect.forEach((possible_target) => {
                if (possible_target[0] === value) {
                    target = possible_target[1];
                }
            })

            if (target === undefined) {
                throw new Error('condition value not found in connect array');
            }

            return target;
        }
        else {
            console.log(' => direct link');
            return link_definition.connect;
        }
    }

    return runner;
}

var teamug = {
    createCustomRunner,
}

module.exports = teamug;
