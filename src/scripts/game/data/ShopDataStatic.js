const data = []
data.push(
{
    id: 0,
    shopType: 'hard',
    type: 'double_points',
    var: 'actionMultiplier',
    default: 1,
    value: 2,
    cost: 1,
    costMax: 10000000,
    icon: 'double_points_action',
    shopDesc: 'actionSpeed',
    time: 5,
    level: 1,
    levelMax: 100,
    active: true,
    waitTime: 10
});
data.push(
{
    id: 1,
    shopType: 'hard',
    type: 'double_speed',
    var: 'actionSpeed',
    default: 1,
    value: 2,
    cost: 1,
    costMax: 10000000,
    icon: 'double_speed_action',
    shopDesc: 'actionSpeed',
    time: 15,
    level: 1,
    levelMax: 100,
    active: true,
    waitTime: 10
});
data.push(
{
    id: 2,
    shopType: 'video',
    type: 'auto_collect',
    var: 'actionAutoCollect',
    default: false,
    value: true,
    cost: 1,
    costMax: 1000000,
    icon: 'auto_collect_action',
    shopDesc: 'actionSpeed',
    time: 15,
    level: 1,
    levelMax: 100,
    active: true,
    waitTime: 10,
    stats:
    {
        typeCurve: 'easeInExpo',
        type: 'cost',
        min: 50,
        max: 1000000,
    }
});

export default data;