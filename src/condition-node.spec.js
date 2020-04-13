var expect = require('chai').expect,
    ConditionNode = require('./condition-node');

describe('ConditionNode', () => {

    it('can create from object definition', () => {
        var definition = {
            condition: 'foo',
            connect: [
                [ true, 'bar' ],
                [ false, 'baz' ],
            ]
        };

        var node = ConditionNode({ definition });

        expect(node).to.eql({
            path: [],
            type: 'condition',
            name: 'foo',
            connect: [
                [ true, 'bar' ],
                [ false, 'baz' ],
            ],
            key: '/foo',
            next: [
                [  true, '/bar'],
                [  false, '/baz'],
            ]
        });
    });

    it('calls onCreate() callback when given', () => {
        var onCreateArgs = undefined;

        var definition = {
            condition: 'foo',
            connect: [
                [ true, 'bar' ],
                [ false, 'baz' ],
            ]
        };

        var onCreate = (...args) => { onCreateArgs = args; },
            node = ConditionNode({ definition, onCreate });

        expect(onCreateArgs).to.eql([
            {
                path: [],
                type: 'condition',
                name: 'foo',
                connect: [
                    [ true, 'bar' ],
                    [ false, 'baz' ],
                ],
                key: '/foo',
                next: [
                    [  true, '/bar'],
                    [  false, '/baz'],
                ]
            }
        ]);
    });

});
