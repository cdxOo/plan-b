var tea2dot = require('./tea2dot'),
    fspath = require('path');

var args = process.argv.slice(2);

var recipe = require(fspath.resolve(args[0]));

var s = (
    tea2dot
    .createCustomTranspiler()
    .recipe(recipe)
    .make('my tea making graph')
)

console.log(s);
