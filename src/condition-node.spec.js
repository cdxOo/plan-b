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

        var node = ConditionNode(definition);

        expect(node).to.eql({
            type: 'condition',
            name: 'foo',
            connect: [
                [ true, 'bar' ],
                [ false, 'baz' ],
            ]
        });
    });

});
