var expect = require('chai').expect,
    TeaMug = require('./tea-mug2');

var recipes = [
    {
        graph: 'make tea',
        nodes: [
            [
                '$start',
                'get cup',
                'put tea in cup',
                'grab water boiler',
                'fill water in boiler'
            ],
            {
                graph: 'fill water in boiler',
                nodes: [
                    [ '$start', 'enough water in boiler?' ],
                    {
                        condition: 'enough water in boiler?',
                        connect: [
                            [ false, 'more water' ],
                            [ true, '$end' ]
                        ]
                    },
                    [ 'more water', 'enough water in boiler?'],

                ],
                connect: 'boil water'
            },
            {
                graph: 'boil water',
                connect: 'pour water into cup'
            },
            [ 'pour water into cup', '$end']
        ]
    },
    {
        graph: 'boil water',
        nodes: [
            [ '$start', 'turn on heating', 'water hot?' ],
            {
                condition: 'water hot?',
                connect: [
                    [ false, 'wait' ],
                    [ true, 'turn off heating' ]
                ]
            },
            [ 'wait', 'water hot?' ],
            [ 'turn off heating', '$end' ]
        ]
    },
];

describe('TeaMug()', () => {
    it('things', () => {
        var barista = (
            TeaMug()
            .recipes(...recipes)
            .onAction((node) => {
                console.log(node.key);
            })
            .onCondition((node) => {
                //console.log(node.key);
                return true;
            })
        );

        barista.do('make tea');
    });
});
