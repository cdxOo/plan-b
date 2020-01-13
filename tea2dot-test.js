var tea2dot = require('./tea2dot'),
    recipe = require('./something-graph');

var s = (
    tea2dot
    .createCustomTranspiler()
    .recipe(recipe)
    .make('my tea making graph')
)

console.log(s);
