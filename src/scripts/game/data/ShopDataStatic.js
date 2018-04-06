const data = []
data.push(
{
    id: 0,
    shopType: 'hard',
    type: 'cat_multiplier',
    var: 'actionMultiplier',
    default: 1,    
    icon: 'morecats',
    shopDesc: 'Multiply all your cats\nafter collect them',
    activeTime: 15,
    level: 1,
    levelMax: 1000,
    active: true,
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
        // cooldown:
        // {
        //     typeCurve: 'linearTween',
        //     min: 330,
        //     max: 20,
        // },
        // activeTime:
        // {
        //     typeCurve: 'linearTween',
        //     min: 15,
        //     max: 60,
        // },
    }
});
data.push(
{
    id: 1,
    shopType: 'hard',
    type: 'discount',
    var: 'actionSpeed',
    default: 1,    
    icon: 'discount',
    shopDesc: 'actionSpeed',
    activeTime: 15,
    level: 1,
    levelMax: 50,
    active: true,
    stats:
    {
        cost:
        {
            typeCurve: 'linearTween',
            min: 50,
            max: 55,
        },
        value:
        {
            typeCurve: 'easeInExpo',
            min: 1,
            max: 1.8,
        },        
    }
});
data.push(
{
    id: 2,
    shopType: 'video',
    type: 'auto_collect',
    var: 'actionAutoCollect',
    default: false,
    value: 5,
    icon: 'treasure_chest_03',
    shopDesc: 'actionSpeed',
    activeTime: 15,
    level: 1,
    levelMax: 1000,
    active: true,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInExpo',
            min: 50,
            max: 1000000,
        },
        // value:
        // {
        //     typeCurve: 'linearTween',
        //     min: 1.1,
        //     max: 10,
        // },
        // cooldown:
        // {
        //     typeCurve: 'linearTween',
        //     min: 330,
        //     max: 20,
        // },
        // activeTime:
        // {
        //     typeCurve: 'linearTween',
        //     min: 15,
        //     max: 60,
        // },
    }

});

export default data;