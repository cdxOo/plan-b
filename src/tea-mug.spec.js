var expect = require('chai').expect,
    TeaMug = require('./tea-mug2');

describe.skip('TeaMug()', () => {
    it('things', () => {
        var barista = (
            TeaMug()
            .recipes({
                graph: 'my-recipe',
                nodes: [
                    [ '$start', 'foo?' ],
                    {
                        condition: 'foo?',
                        connect: [
                            [ true, 'bar' ],
                            [ false, 'baz' ]
                        ]
                    },
                    [ 'bar', '$end' ],
                    [ 'baz', '$end' ]
                ]
            })
            .onAction((node) => {
                console.log(node);
            })
            .onCondition((node) => {
                console.log(node);
                return true;
            })
        );

        barista.do('my-recipe');
    });
});
