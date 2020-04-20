'use strict';
var toNode = require('./to-node'),
    NodeKey = require('./node-key'),
    NodeRegistry = require('./node-registry'),
    
    OutNode = require('./out-node-arg'),
    SyncExecutor = require('./sync-executor'),
    AsyncExecutor = require('./async-executor');

var PlanB = module.exports = () => {
    var tm = {};

    var plans = [],
        registry = NodeRegistry(),

        onCondition = undefined,
        onAction = undefined,
        isAsync = false;

    tm.plans = (...args) => {
        args.forEach(definition => {
            var plan = preparePlan({
                registry,
                plan: definition,
            });
            if (!tm.hasPlan(plan.name)) {
                plans.push(plan.name);
            }
            else {
                throw new Error(`plan duplication for "${plan.name}"`);
            }
        });

        return tm;
    }

    tm.hasPlan = (name) => (
        plans.indexOf(name) !== -1
    )

    tm.onCondition = (lambda) => {
        onCondition = lambda; 
        return tm;
    }

    tm.onAction = (lambda) => {
        onAction = lambda; 
        return tm;
    }

    tm.async = (flag) => {
        flag = flag || false;
        isAsync = flag;
        return tm;
    }

    tm.execute = (planName) => {
        if (!tm.hasPlan(planName)) {
            throw new Error(`dont have the "${planName}" plan :(`);
        }

        if (!onAction) {
            throw new Error('onAction() is not set, dont know what to do :(');
        }

        if (!onCondition) {
            throw new Error('onCondition() is not set, cant figure out which branch to use in case of a condition');
        }
        
        if (isAsync) {
            return AsyncExecutor({
                registry,
                key: `/${planName}`,
                onAction,
                onCondition
            });
        }
        else {
            SyncExecutor({
                registry,
                key: `/${planName}`,
                onAction,
                onCondition
            });
        }
    }

    return tm;
}

var preparePlan = ({
    plan,
    registry
}) => {
    var node = toNode({
        definition: plan,
        onCreate: (node) => {
            registry.add(node)
        }
    });
    return node;
}

