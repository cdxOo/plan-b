var expect = require('chai').expect,
    PlanB = require('./plan-b');

var sleep = (ms) => (
    new Promise(resolve => setTimeout(resolve, ms))
);

var plans = [
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

describe('PlanB()', () => {
    it('things', () => {
        var water = 0,
            temp = 0;

        var teamaker = (
            PlanB()
            .plans(...plans)
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

        teamaker.execute('make tea');
    });

    it('async', async () => {
        var water = 0,
            temp = 0;

        var executed = [];

        var teamaker = (
            PlanB()
            .async(true)
            .plans(...plans)
            .onAction(async (node) => {
                console.log(node.key);
                console.log('   waiting...');
                await sleep(10);
                console.log('   => ok');

                executed.push(node.key);
                
                if (node.name === 'more water') {
                    water += 0.1;
                }
                else if (node.key === '/boil water/wait') {
                    temp += 10;
                }
            })
            .onCondition(async (node) => {
                console.log(node.key);
                console.log('   waiting...');
                await sleep(10);
                console.log('   => ok');
                
                executed.push(node.key);
                
                if (node.name === 'enough water in boiler?') {
                    return (water > 0.4)
                }
                else if (node.name === 'water hot?') {
                    return (temp >= 100)
                }
            })
        );

        await teamaker.execute('make tea');

        expect(executed).to.eql([

            '/make tea/get cup',
            '/make tea/put tea in cup',
            '/make tea/grab water boiler',
            '/make tea/fill water in boiler/enough water in boiler?',
            '/make tea/fill water in boiler/more water',
            '/make tea/fill water in boiler/enough water in boiler?',
            '/make tea/fill water in boiler/more water',
            '/make tea/fill water in boiler/enough water in boiler?',
            '/make tea/fill water in boiler/more water',
            '/make tea/fill water in boiler/enough water in boiler?',
            '/make tea/fill water in boiler/more water',
            '/make tea/fill water in boiler/enough water in boiler?',
            '/make tea/fill water in boiler/more water',
            '/make tea/fill water in boiler/enough water in boiler?',
            '/boil water/turn on heating',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/wait',
            '/boil water/water hot?',
            '/boil water/turn off heating',
            '/make tea/pour water into cup',

        ]);
    });
});
