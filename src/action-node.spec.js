var expect = require('chai').expect,
    ActionNode = require('./action-node');

describe('ActionNode', () => {

    it('can create from short array definition', () => {
        var definition = ['foo', 'bar'],
            node = ActionNode({ definition });

        expect(node).to.eql({
            path: [],
            type: 'action',
            name: 'foo',
            connect: 'bar'
        });
    });

    it('can create from long array definition', () => {
        var definition = ['foo', { connect: 'bar' }],
            node = ActionNode({ definition });

        expect(node).to.eql({
            path: [],
            type: 'action',
            name: 'foo',
            connect: 'bar'
        });
    });

    it('can create from object definition', () => {
        var definition = { action: 'foo', connect: 'bar' },
            node = ActionNode({ definition });

        expect(node).to.eql({
            path: [],
            type: 'action',
            name: 'foo',
            connect: 'bar'
        });
    });

});
