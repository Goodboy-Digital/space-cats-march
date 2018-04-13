const data = []
data.push(
{
    id: 0,
    shopType: 'hard',
    type: 'cat_multiplier',
    var: '',
    default: 1,    
    icon: 'morecats',
    shopDesc: 'Multiply all your cats\nafter collect them',
    activeTime: 15,
    level: 1,
    levelMax: 500,
    active: true,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInCirc',
            zero: 50,
            min: 50,
            max: 10000000,
            hideOnShop:true
        },
        value:
        {
            typeCurve: 'linearTween',
            zero: 1,
            min: 1.2,
            max: 10,
        },
    }
});
data.push(
{
    id: 1,
    shopType: 'hard',
    type: 'discount',
    var: '',
    default: 1,    
    icon: 'discount',
    shopDesc: 'Reduce all the prices on shop',
    activeTime: 15,
    level: 1,
    levelMax: 50,
    active: true,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInCirc',
            zero: 50,
            min: 50,
            max: 100000,
            hideOnShop:true
        },
        value:
        {
            typeCurve: 'easeInExpo',
            zero: 1,
            min: 1.2,
            max: 5,
        },        
    }
});
data.push(
{
    id: 2,
    shopType: 'video',
    type: 'auto_collect',
    var: '',
    default: false,
    value: 5,
    icon: 'treasure_chest_03',
    shopDesc: 'actionSpeed',
    videoDesc: 'watch a video to\nopen a Golden Chest',
    activeTime: 15,
    level: 1,
    levelMax: 1000,
    active: true,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInExpo',
            zero: 50,
            min: 50,
            max: 1000000,
            hideOnShop:true
        },
    }

});

export default data;