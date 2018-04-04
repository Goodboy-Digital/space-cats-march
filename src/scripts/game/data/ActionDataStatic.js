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
    cost: 1,
    costMax: 1000,
    icon: 'double_points_action',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 10,
    active: true,
    waitTime: 300,
    waitTimeMin: 30
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
    cost: 1,
    costMax: 100000,
    icon: 'double_speed_action',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 10,
    active: true,
    waitTime: 200,
    waitTimeMin: 20
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
    cost: 1,
    costMax: 1000000,
    icon: 'auto_collect_action',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 10,
    active: true,
    waitTime: 100,
    waitTimeMin: 10
});

export default data;