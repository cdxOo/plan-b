var bq = require('@cdxoo/block-quote'),
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
                nodes = [
                    dot_syntax.circle(subgraph.name + '/$end'),

                    ...keys.map(key => {
                        var definition = subgraph.graph[key];

                        if (definition.node) {
                            return (
                                definition.node === '$start'
                                ? dot_syntax.circle(subgraph.name + '/$start')
                                : dot_syntax.node(subgraph.name + '/' + key, key)
                            );
                        }
                        else if (definition.subgraph) {
                            return dot_syntax.node_for_subgraph(
                                subgraph.name + '/' + key, key
                            );
                        }
                        else if (definition.condition) {
                            return dot_syntax.diamond(
                                subgraph.name + '/' + key, key
                            );
                        }
                    })
                ];

                connections = [
                    ...connections,
                    ...keys.map(key => {
                        var { condition, connect } = subgraph.graph[key];

                        if (condition) {
                            return [
                                ...connect.map(([value, target]) => (
                                    dot_syntax.labeled_connection(
                                        subgraph.name + '/' + key,
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
                ];
            }
            else if (subgraph.steps) {
                nodes = [
                    dot_syntax.circle(subgraph.name + '/$start'),
                    dot_syntax.circle(subgraph.name + '/$end'),

                    ...subgraph.steps.map(key => {
                        return (
                            dot_syntax.node(subgraph.name + '/' + key, key)
                        );
                    })
                ];

                connections = [
                    ...connections,
                    dot_syntax.connection(
                        subgraph.name + '/$start',
                        subgraph.name + '/' + subgraph.steps[0],
                    ),
                    dot_syntax.connection(
                        subgraph.name + '/' + subgraph.steps.slice(-1)[0],
                        subgraph.name + '/$end',
                    ),
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
                if (Array.isArray(node_definition)) {
                    node_definition.slice(0, -1).forEach((key, i) => {
                        if (prepared.graph[key]) {
                            throw new Error('duplicate node key');
                        }
                        prepared.graph[key] = {
                            node: key,
                            connect: node_definition[i+1]
                        }
                    });
                }
                else if (typeof node_definition === 'object') {
                    var clone = { ...node_definition };
                        
                    var key = (
                        clone.node
                        || clone.subgraph
                        || clone.condition
                    );

                    if (!key) {
                        throw new Error('definition must include one of "condition", "subgraph", "node"');
                    }

                    if (prepared.graph[key]) {
                        throw new Error('duplicate node key');
                    }
                    
                    if (
                        typeof clone.connect === 'object'
                        && !Array.isArray(clone.connect)
                    ) {
                        clone.connect = (
                            Object.keys(clone.connect)
                            .map(val => ([ val, clone.connect[val] ]))
                        );
                    }

                    prepared.graph[key] = clone;
                }
                else {
                    throw new Error('unsupported node definition format');
                }

            })
        }
        else if (graph_definition.steps) {
             prepared.steps = graph_definition.steps; 
        }

        console.error(prepared);

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
            nodesep=0.2
            ranksep=0.2
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

    // FIXME: long labels inside of diamonds make it really really large
    // i dont want that and since graphviz is dead for like 3 years
    // theres not really a way to style that => falling back to "box"
    diamond: (id, label) => bq`
        "${id}" [ label="${label}" shape=box style="" ]
    `,
    
    circle: (id) => bq`
        "${id}" [ label="" shape=circle style="filled" fillcolor="#333333" ]
    `,

    subgraph: (name, inner) => bq`
        subgraph "cluster ${name}" {
            label="${name}"
            ${inner}
        }
    `,

    node_for_subgraph: (id, label) => bq`
        "${id}" [ label="${label}" color="blue" fontcolor="blue" fillcolor="#ccffcc"]
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
