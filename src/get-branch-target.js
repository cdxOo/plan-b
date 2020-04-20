'use strict'

var getBranchTarget = module.exports = ({
    branches,
    value
}) => {
    var filtered = branches.filter(([ branchValue, target ]) => (
        value === branchValue
    ));
    
    if (filtered.length < 1) {
        throw new Error('cannot find any valid target node for condition');
    }
    if (filtered.length > 1) {
        throw new Error('there are multiple possible target nodes for condition')
    }

    return filtered[0][1];
}
