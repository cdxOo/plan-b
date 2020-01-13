var bq = require('./block-quote');

var createCustomTranspiler = () {
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
}

var dot_syntax = {
    strict_digraph: (name, inner) => bq`
        strict digraph "${name}" {
            ordering=out
            rankdir=LR
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

    node: (name) => bq`
        "${name}" [ label="${name}" ]
    `,

    subgraph: (name, inner) => bq`
        subgraph "${name}" {
            label="${name}"
            ${inner}
        }
    `,

};
