var expect = require('chai').expect,
    ChainNode = require('./chain-node');

describe('ChainNode', () => {

    it('can create from object definition', () => {
        var definition = {
            chain: 'foo',
            actions: [
                'get mug',
                'boil water',
                'brew tea'
            ],
            connect: 'bar'
        };

        var node = ChainNode({ definition });

        expect(node).to.eql({
            path: [],
            type: 'chain',
            name: 'foo',
            actions: [
                'get mug',
                'boil water',
                'brew tea'
            ],
            connect: 'bar'
        });
    });

    it('can create when action list is omitted', () => {
        var definition = {
            chain: 'foo',
            connect: 'bar'
        };
        
        var node = ChainNode({ definition });
        
        expect(node).to.eql({
            path: [],
            type: 'chain',
            name: 'foo',
            connect: 'bar'
        });
    });

});
