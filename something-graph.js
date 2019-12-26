module.exports = [
    {
        name: 'my tea making graph',
        first: 'prepare tea mug',
        graph: [
            //[ a, b ,c, d ] ????
            [ 'prepare tea mug', {
                'subgraph': 'prepare tea mug', // maybe that could be optional as well
                //steps: [ ... ]
                connect: 'take boiler from stand'
            }],
            [ 'take boiler from stand', 'fill water in boiler' ],
            // short for [ 'take boiler from stand', { connect: 'fill water in boiler' } ],
            [ 'fill water in boiler',  {
                condition: 'boiler water amount > 0.3 liters',
                connect: [
                    [ true, 'put boiler on stand' ],
                    [ false, 'fill water in boiler' ]
                ]
            }],
            [ 'put boiler on stand', 'turn on boiler' ],
            [ 'turn on boiler', {
                condition: 'water temparature > 100',
                connect: [
                    [ true, 'turn off boiler' ],
                    [ false, 'wait for heated water' ]
                ]
            }],
            [ 'wait for heated water', {
                condition: 'water temperature > 100',
                connect: [
                    [ true, 'turn off boiler' ],
                    [ false, 'wait for heated water' ]
                ]
            }],
            [ 'turn off boiler', 'fill mug with water' ],
            [ 'fill mug with water', {
                subgraph: 'fill mug with water',
                connect: 'wait til tea is drinkable'
            }]
        ]
    },
    {
        name: 'prepare tea mug',
        steps: [
            'get mug from shelf',
            'get tea container from shelf',
            'open tea container',
            'take tea bag from tea container',
            'put tea bag into mug',
            'close tea bag container',
            'put tea bag container bak to shelf'
        ]
    },
    {
        name: 'fill mug with water',
        graph: [
            [ 'take boiler from stand', 'pour water into mug' ],
            [ 'pour water into mug', {
                condition: 'mug water amount > 0.2 liters',
                connect: [
                    [ true, 'put boiler on stand' ],
                    [ false, 'pour water into mug' ]
                ]
            }],
        ]
    }
]

