'use strict';
module.exports = ({ path, name, connect }, which) => {
    var prefix = path.join('/');
    return (
        which === 'connect'
        ? `${prefix}/${connect}`
        : `${prefix}/${name}`
    );
}

