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

        var node = GraphNode({ definition });

        expect(node).to.eql({
            path: [],
            type: 'graph',
            name: 'foo',
            start: {
                path: [ 'foo' ],
                type: 'action',
                name: '$start',
                connect: 'do something',
                key: '/foo/$start',
                next: '/foo/do something',
            },
            nodes: [
                {
                    path: [ 'foo' ],
                    type: 'action',
                    name: '$start',
                    connect: 'do something',
                    key: '/foo/$start',
                    next: '/foo/do something',
                },
                {
                    path: [ 'foo' ],
                    type: 'action',
                    name: 'do something',
                    connect: '$end',
                    key: '/foo/do something',
                    next: '/foo/$end',
                },
            ],
            connect: 'bar',
        });
    });

    it('calls onCreate() callback when given', () => {
        var onCreateArgs = undefined;

        var definition = {
            graph: 'foo',
            nodes: [
                ['$start', 'bar' ],
                ['bar', '$end' ]
            ],
            connect: 'baz'
        };

        var onCreate = (...args) => { onCreateArgs = args; },
            node = GraphNode({ definition, onCreate });

        expect(onCreateArgs).to.eql([
            {
                path: [],
                type: 'graph',
                name: 'foo',
                start: {
                    path: [ 'foo' ],
                    type: 'action',
                    name: '$start',
                    connect: 'bar',
                    key: '/foo/$start',
                    next: '/foo/bar',
                },
                nodes: [
                    {
                        path: [ 'foo' ],
                        type: 'action',
                        name: '$start',
                        connect: 'bar',
                        key: '/foo/$start',
                        next: '/foo/bar',
                    },
                    {
                        path: [ 'foo' ],
                        type: 'action',
                        name: 'bar',
                        connect: '$end',
                        key: '/foo/bar',
                        next: '/foo/$end',
                    }
                ],
                connect: 'baz',
            }
        ]);
    });

});
