var expect = require('chai').expect,
    TeaMug = require('./tea-mug');

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
        var water = 0,
            temp = 0;
        var barista = (
            TeaMug()
            .recipes(...recipes)
            .onAction((node) => {
                console.log(node.key);
                if (node.name === 'more water') {
                    water += 0.1;
                }
                else if (node.key === '/boil water/wait') {
                    temp += 10;
                }
            })
            .onCondition((node) => {
                console.log(node.key);
                if (node.name === 'enough water in boiler?') {
                    return (water > 0.4)
                }
                else if (node.name === 'water hot?') {
                    return (temp >= 100)
                }
            })
        );

        barista.do('make tea');
    });
});
