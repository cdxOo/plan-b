var blockquote = require('./block-quote');

var strict_digraph = (inner) => blockquote`
    strict digraph {
        ${inner}
    }
`;

var str = strict_digraph(blockquote`
    subgraph foo {{
        asdf
    }}
`);

console.log(str);
