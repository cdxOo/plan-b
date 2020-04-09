var expect = require('chai').expect,
    GraphNode = require('./graph-node');

describe('GraphNode', () => {

    it('can create from object definition', () => {
        var definition = {
            graph: 'foo',
            nodes: [
                [ '$start', 'do something' ],
                [ 'do something', '$end' ],
            ],
            connect: 'bar'
        };

        var node = GraphNode(definition);

        expect(node).to.eql({
            type: 'graph',
            name: 'foo',
            start: {
                type: 'action',
                name: '$start',
                connect: 'do something'
            },
            nodes: [
                {
                    type: 'action',
                    name: '$start',
                    connect: 'do something'
                },
                {
                    type: 'action',
                    name: 'do something',
                    connect: '$end'
                },
            ],
            connect: 'bar',
        });
    });

});
