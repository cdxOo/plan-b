var bq = require('./block-quote'),
    inspect = require('./inspect');

var createCustomTranspiler = () => {
    var transpiler = {},
        onNodeMiddleware = undefined,
        onConditionMiddleware = undefined,
        recipe = undefined;

    transpiler.recipe = (r) => {
        recipe = r;
        return transpiler;
    }

    transpiler.onNode = (middleware) => {
        onNodeMiddleware = middleware;
        return transpiler;
    }

    transpiler.onCondition = (middleware) => {
        onConditionMiddleware = middleware;
        return transpiler;
    }

    var graphsByName = {};
    transpiler.make = (graph_name) => {
        
        recipe.forEach(graph => {
            if (graphsByName[graph.name]) {
                throw new Error('graph name duplication'); // FIXME: can we work around that ... probably
            }
            graphsByName[graph.name] = prepareGraph(graph);
        });

        inspect(graphsByName);

        return (
            dot_syntax.digraph(
                graph_name, 
                transpileRecipe()
            )
        );
    }

    transpileRecipe = () => {
        console.error(`TRANSPILE RECIPE`);

        var subgraphs = Object.values(graphsByName),
            connections = [];

        var strings = subgraphs.map(subgraph => {
            var nodes = [];

            if (subgraph.graph) {
                var keys = Object.keys(subgraph.graph);
                nodes = (
                    keys.map(key => {
                        var definition = subgraph.graph[key];
                        return dot_syntax.node(subgraph.name + '/' + key, key)
                    })
                );

                connections = [ ...connections, ...(
                    keys.map(key => {
                        var { condition, connect } = subgraph.graph[key];

                        if (condition) {
                            nodes.push(
                                dot_syntax.diamond(
                                    subgraph.name + '/' + key + ' to ' + condition,
                                    "" //condition
                                )
                            );

                            return [
                                dot_syntax.labeled_connection(
                                    subgraph.name + '/' + key,
                                    subgraph.name + '/' + key + ' to ' + condition,
                                    condition
                                ),
                                ...connect.map(([value, target]) => (
                                    dot_syntax.labeled_connection(
                                        subgraph.name + '/' + key + ' to ' + condition,
                                        subgraph.name + '/' + target,
                                        value.toString()
                                    )
                                ))
                            ].join("\n")
                        }
                        else {
                            return dot_syntax.connection(
                                subgraph.name + '/' + key,
                                subgraph.name + '/' + connect,
                            )
                        }
                    })
                )];
            }
            else if (subgraph.steps) {
                connections = [
                    ...connections,
                    ...subgraph.steps.slice(0, -1).map((step, i) => (
                        dot_syntax.connection(
                            subgraph.name + '/' + step,
                            subgraph.name + '/' + subgraph.steps[i+1],
                        )
                    ))
                ];
            }

                /*var connections = [
                dot_syntax.connection(sub.name + '/A', sub.name + '/B'),
                dot_syntax.connection(sub.name + '/B', sub.name + '/C'),
            ]*/

            return dot_syntax.subgraph(
                subgraph.name,
                nodes.join("\n")
            );
        })

            /*if (graph.graph) {
            console.log(' => graph');
            graph.graph.map()
        }
        else if (graph.steps) {
            console.log(' => steps');
        }*/

        console.error(connections);
        return [ ...strings, ...connections ].join("\n");
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


    return transpiler;
}

var dot_syntax = {
    digraph: (name, inner) => bq`
        digraph "${name}" {
            ordering=out
            splines=true
            overlap=false
            nodesep=0.16
            ranksep=0.18
            fontname="Helvetica-bold"
            fontsize=9
            style="rounded,bold,filled"
            fillcolor="#ffffff"
            compound=true
            node [shape=box style="rounded, filled" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
            edge [color="#00000077" penwidth=2.0 arrowhead=normal fontname=Helvetica fontsize=9]

            ${inner}
        }
    `,

    node: (id, label) => bq`
        "${id}" [ label="${label}" ]
    `,

    diamond: (id, label) => bq`
        "${id}" [ label="${label}" shape=diamond style="" ]
    `,

    subgraph: (name, inner) => bq`
        subgraph "cluster ${name}" {
            label="${name}"
            ${inner}
        }
    `,

    connection: (source, target) => bq`
        "${source}" -> "${target}"
    `,

    labeled_connection: (source, target, label) => bq`
        "${source}" -> "${target}" [ label="${label}" ]
    `,

};

module.exports = {
    createCustomTranspiler
};
