var redux = require('redux'),
    teamug = require('./tea-mug'),
    recipe = require('./something-graph');

var reducer = (state, action) => {
    console.log(action.type);

    state = state || {
        boilerWaterTemparature: 0,
        mugWaterTemparature: 0,

        boilerWaterAmount: 0.0,
        mugWaterAmount: 0.0,
    }

    switch (action.type) {
        case 'fill water in boiler':
            state = {
                ...state,
                boilerWaterAmount: state.boilerWaterAmount + 0.1
            };
            break;
        case 'pour water into mug':
            state = {
                ...state,
                boilerWaterAmount: state.boilerWaterAmount - 0.1,
                mugWaterAmount: state.mugWaterAmount + 0.1
            };
            break;
        case 'wait for heated water':
            state = {
                ...state,
                boilerWaterTemparature: state.boilerWaterTemperature + 10,
            }
            break;
        case 'wait till tea is drinkable':
            state = {
                ...state,
                mugWaterTemparature: state.mugWaterTemperature - 5,
            }
            break;
    }

    return state;
}

var store = redux.createStore(reducer);

var actioneer = (graph_name, node_name) => {
    store.dispatch({ type: node_name });
}

var conditioneer = (graph_name, condition_name) => {
    var state = store.getState();
    
    var conditions = {
        'boiler water amount > 0.3 liters': () => (
            store.getState().boilerWaterAmount > 0.3
        ),
        'mug water amount > 0.2 liters': () => (
            store.getState().mugWaterAmount > 0.2
        ),
        'boiler water temparature > 100': () => (
            store.getState().boilerWaterTemparature > 100
        ),
        'mug water temparature < 60': () => (
            store.getState().mugWaterTemparatur < 60
        ),
    };

    return conditions[condition_name]()
}

var runner = (
    teamug
    .createCustomRunner() // default runner only accept reducer and conditions object?
    .recipe(recipe)

    .onNode(actioneer)
    .onCondition(conditioneer)
    
    //.onGraph('prepare tea mug')

    /*.onGraph('fill mug with water')
    .registerConditions({
        'mug water amount > 0.2 liters': () => (
            store.getState().mugWaterAmount > 0.2
        )
    })
    
    .onGraph('my tea making graph')
    .registerConditions({
        'boiler water amount > 0.3 liters': () => (
            store.getState().boilerWaterAmount > 0.3
        ),
        'boiler water temparature > 100': () => (
            store.getState().boilerWaterTemparature > 100
        ),
        'mug water temparature < 60': () => (
            store.getState().mugWaterTemparatur < 60
        ),
    })*/

    .make('my tea making graph') // should maybe respect "onGraph"
);
