var nodeutil = require('util');

module.exports = (o) => {
    console.error(nodeutil.inspect(o, { showHidden: false, depth: null }))
};
