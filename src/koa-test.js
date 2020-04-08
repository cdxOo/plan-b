

var runner = (
    teamug
    .create()
    .recipe([
        ..recipes
    ])
    .onGraph(onGraph)
    .onNode(onNode)
    .onCondition(onCondition)
)

var onGraph = (graph) => {
    // nothing to do here probably
}

var onNode = async (graph, node, context) => {
    await registry.getNodeCallback(graph, node)(context)
}

var onCondition = async (graph, condition, context) => {
    await registtry.getConditionCallback(graph, condition)(context)
}

var dispatchEventMW = async (context, next) => {
    var event = context.body.name;

    await (
        runner
        .context(context)
        .run(event)
    );

    await next;
};
