var teamug = {
    createCustomRunner,
}

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
        onNodeMiddleware = [],
        onConditionMiddleware = [],
        conditions = {},
        recipe = undefined;

    runner.onNode = (middleware) => {
        onNodeMiddleware.push(middleware)
        return runner;
    };

    runner.onCondition = (middleware) => {
        onNodeMiddleware.push(middleware)
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

    runner.make = (graph_name) => {
        //var parser = createParser(recipe);

        var graphsByName = {};

        recipe.forEach(graph => {
            graphsByName[graph.name] = graph;
        });


    }

    return runner;
}
