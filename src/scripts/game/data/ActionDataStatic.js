const data = []
data.push(
{
    id: 0,
    shopType: 'soft',
    type: 'double_points',
    var: 'actionMultiplier',
    shopDesc: 'actionSpeed',
    default: 1,
    value: 2,    
    icon: 'coin_pig',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 1000,
    active: true,
    waitTime: 300,
    waitTimeMin: 30,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInExpo',
            min: 50,
            max: 1000000,
        },
        value:
        {
            typeCurve: 'linearTween',
            min: 1,
            max: 10,
        },
        cooldown:
        {
            typeCurve: 'linearTween',
            min: 330,
            max: 20,
        },
        activeTime:
        {
            typeCurve: 'linearTween',
            min: 15,
            max: 60,
        },

    }
});
data.push(
{
    id: 1,
    shopType: 'soft',
    type: 'double_speed',
    var: 'actionSpeed',
    shopDesc: 'actionSpeed',
    default: 1,
    value: 2,    
    icon: 'rollerskate',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 1000,
    active: true,
    waitTime: 200,
    waitTimeMin: 20,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInExpo',
            min: 50,
            max: 1000000,
        },
        value:
        {
            typeCurve: 'linearTween',
            min: 1,
            max: 3.5,
        },
        cooldown:
        {
            typeCurve: 'linearTween',
            min: 330,
            max: 20,
        },
        activeTime:
        {
            typeCurve: 'linearTween',
            min: 15,
            max: 60,
        },


    }
});
data.push(
{
    id: 2,
    shopType: 'soft',
    type: 'auto_collect',
    var: 'actionAutoCollect',
    shopDesc: 'actionSpeed',
    default: false,
    value: true,    
    icon: 'automate',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 1000,
    active: true,
    waitTime: 100,
    waitTimeMin: 10,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInExpo',
            min: 50,
            max: 1000000,
        },
        value:
        {
            typeCurve: 'linearTween',
            min: 1,
            max: 1,
        },
        cooldown:
        {
            typeCurve: 'linearTween',
            min: 330,
            max: 20,
        },
        activeTime:
        {
            typeCurve: 'linearTween',
            min: 15,
            max: 60,
        },



    }
});

export default data;