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

    it('can create when definition is array', () => {
        var definition = [ 'foo', 'bar', 'baz' ];
        
        var node = ChainNode({ definition });
        
        expect(node).to.eql({
            path: [],
            type: 'chain',
            name: 'foo',
            actions: [ 'foo', 'bar' ],
            connect: 'baz'
        });
    });

    it('calls onCreate() callback when given', () => {
        var onCreateArgs = undefined;

        var definition = { chain: 'foo', connect: 'bar' },
            onCreate = (...args) => { onCreateArgs = args; },
            node = ChainNode({ definition, onCreate });

        expect(onCreateArgs).to.eql([
            {
                path: [],
                type: 'chain',
                name: 'foo',
                connect: 'bar'
            }
        ]);
    });

});
