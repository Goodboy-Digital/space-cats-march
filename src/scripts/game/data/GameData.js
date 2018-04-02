export default class GameData {
    constructor() {

        this.catsData = [];

        this.actionsDataStatic = []
        this.actionsDataStatic.push({
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
        this.actionsDataStatic.push({
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
        this.actionsDataStatic.push({
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

        this.actionsData = []
        this.actionsData.push({
            id: 0,
            level: 1,
            active: true,
            staticData: 'actionsDataStatic',
            dataType: 'actionsData',
        });
        this.actionsData.push({
            id: 1,
            level: 1,
            active: true,
            staticData: 'actionsDataStatic',
            dataType: 'actionsData',
        });
        this.actionsData.push({
            id: 2,
            level: 1,
            active: true,
            staticData: 'actionsDataStatic',
            dataType: 'actionsData',
        });

        this.shopDataStatic = []
        this.shopDataStatic.push({
            id: 0,
            shopType: 'hard',
            type: 'double_points',
            var: 'actionMultiplier',
            default: 1,
            value: 2,
            cost: 1,
            costMax: 1000,
            icon: 'double_points_action',
            shopDesc: 'actionSpeed',
            time: 5,
            level: 1,
            levelMax: 10,
            active: true,
            waitTime: 10
        });
        this.shopDataStatic.push({
            id: 1,
            shopType: 'hard',
            type: 'double_speed',
            var: 'actionSpeed',
            default: 1,
            value: 2,
            cost: 1,
            costMax: 10000,
            icon: 'double_speed_action',
            shopDesc: 'actionSpeed',
            time: 15,
            level: 1,
            levelMax: 10,
            active: true,
            waitTime: 10
        });
        this.shopDataStatic.push({
            id: 2,
            shopType: 'video',
            type: 'auto_collect',
            var: 'actionAutoCollect',
            default: false,
            value: true,
            cost: 1,
            costMax: 10000,
            icon: 'auto_collect_action',
            shopDesc: 'actionSpeed',
            time: 15,
            level: 1,
            levelMax: 10,
            active: true,
            waitTime: 10
        });

        this.shopData = []
        this.shopData.push({
            id: 0,
            level: 1,
            active: true,
            staticData: 'shopDataStatic',
            dataType: 'shopData',
        });
        this.shopData.push({
            id: 1,
            level: 1,
            active: true,
            staticData: 'shopDataStatic',
            dataType: 'shopData',
        });
        this.shopData.push({
            id: 2,
            level: 1,
            active: true,
            staticData: 'shopDataStatic',
            dataType: 'shopData',
        });

        this.trophyData = {
            collected: 0,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 100,
            multplierPerCollected: 0.0125,
            limitToMultiply: 1750,
            icon: 'pickup_fish',
        }

        this.totalCatsAllowed = 1;
        this.catsAllowed = [true, false, false, false];
        this.maxLife = 3;
        this.maxPoints = 0;

        this.gameTokens = {
            quant: 1,
            icon: 'pickup_fish',
        }
        this.chestData = {
            lastChestTime: new Date(),
            timeToNext: -1,
            chestAvailable: false,
            // chestTime: 90 * 1000
            chestTime: 15 * 1000 * 60
        }

        this.moneyData = {
            currentCoins: 0,
            softIcon: 'cat_coin',
            videoIcon: 'video_icon',
        }

        this.sessionData = {
            tokens: 1,
        }

        this.version = '0.0.0.10';

        this.resetCatData();
    }
    resetCatData() {
        this.catsData = [];
        this.catsData.push({
            catID: 0,
            collected: 0,
            active: true,
            canBeActive: true,
            isAuto: false,
            autoCollectPrice: 100,
            amountToAutoCollect: 100,
            pointsMultiplier: 1,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 10,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_orange_',
            catThumb: 'results_orange_cat',
            catName: 'pancakes',
            require: null
        })

        this.catsData.push({
            catID: 1,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 1000,
            amountToAutoCollect: 200,
            pointsMultiplier: 3,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 15,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_pink_cat',
            catName: 'mr.\npotatoes',
            require: 100
        })

        this.catsData.push({
            catID: 2,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 10000,
            amountToAutoCollect: 300,
            pointsMultiplier: 5,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 20,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_orange_',
            catThumb: 'results_turquoise_cat',
            catName: 'lucifurr',
            require: 5000
        })

        this.catsData.push({
            catID: 3,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'fluffy',
            require: 500000
        })
        this.catsData.push({
            catID: 4,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'joe',
            require: 5000000
        })
        this.catsData.push({
            catID: 5,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'clermont',
            require: 50000000
        })
        this.catsData.push({
            catID: 6,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'julien',
            require: 500000000
        })
        this.catsData.push({
            catID: 7,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'mat',
            require: 750000000
        })
        this.catsData.push({
            catID: 8,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'john',
            require: 1000000000
        })
        this.catsData.push({
            catID: 9,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'james',
            require: 300000000000
        })

        this.catsData.push({
            catID: 10,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'kim',
            require: 800000000000
        })

        this.catsData.push({
            catID: 11,
            collected: 0,
            active: false,
            canBeActive: false,
            isAuto: false,
            autoCollectPrice: 100000,
            amountToAutoCollect: 400,
            pointsMultiplier: 10,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 30,
            limitCatsToMultiply: 1500,
            catSrc: 'cat_pink_',
            catThumb: 'results_yellow_cat',
            catName: 'oswaldo',
            require: 2500000000000
        })
    }
    canBuyIt(data) {
        let currType = this[data.staticData][data.id].shopType
        let staticData = this[data.staticData][data.id]
        let cost = this.getShopValues(data).cost;
         if(currType == 'hard'){
            return this.trophyData.collected >= cost;
        }else if(currType == 'soft'){
            return this.moneyData.currentCoins  >= cost;
        }
    }
    getUpdatedItem(type, id) {
        return this[type][id];
    }
    buyUpgrade(data, realCost) {
        let currType = this[data.staticData][data.id].shopType
        if(currType == 'hard'){
            this.trophyData.collected -= realCost;
        }else if(currType == 'soft'){
            this.moneyData.currentCoins -= realCost;
        }
        this[data.dataType][data.id].level ++;
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    getShopValues(data) {
        let shopData;
        for (var i = 0; i < this.shopDataStatic.length; i++) {
            if (this.shopDataStatic[i].id == data.id) {
                shopData = this.shopDataStatic[i];
            }
        }
        let level = data.level;
        let shopCoast = shopData.costMax / shopData.levelMax * level;// + shopData.cost;

        // console.log(shopCoast, shopData);
        return {
            cost: shopCoast
        }

    }
    getItemValues(data) {
        let actionData;
        for (var i = 0; i < this.actionsDataStatic.length; i++) {
            if (this.actionsDataStatic[i].id == data.id) {
                actionData = this.actionsDataStatic[i];
            }
        }
        let level = data.level;
        let shopCoast = actionData.costMax / actionData.levelMax * level * actionData.cost;
        let actionTime = actionData.timeMax / actionData.levelMax * level * actionData.time;

        console.log(shopCoast);
        return {
            cost: shopCoast
        }

    }
    applyPrizes(list) {
        // console.log('apply list', list);
        let cats = []
        for (var i = 0; i < this.catsData.length; i++) {
            cats.push(0);
        }
        for (var i = 0; i < list.length; i++) {
            let item = list[i];
            if (item.type == 'cat') {
                // console.log('add cat', item.quant);
                // this.catsData[item.id].quant += item.quant
                cats[item.id] += item.quant;
            }
            if (item.type == 'trophy') {
                this.updateTrophy(item.quant)
                    // this.trophyData.collected += item.quant;
            }
        }
        this.addCats(cats)
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    isPossibleBuyAuto(id) {
        let cat = this.catsData[id];
        if (cat.autoCollectPrice <= this.trophyData.collected) {
            return true
        }
        return false
    }
    getChestPrize() {
        let prizesList = [];
        let availableIds = [];
        for (var i = 0; i < this.catsData.length; i++) {
            if (this.catsData[i].active) {
                availableIds.push(this.catsData[i].catID);
            }
        }

        for (var i = 0; i < 3; i++) {
            let rnd1 = Math.random();
            let obj = {
                type: 'cat',
                id: 0,
                quant: 0,
                icon: 0,
            }
            if (rnd1 < 0.3) {
                obj.type = 'trophy';
                obj.quant = this.getTrophyAmount();
                obj.icon = this.trophyData.icon
            } else {
                let id = Math.floor(availableIds.length * Math.random())
                let cat = this.catsData[id]
                obj.id = cat.catID
                obj.icon = cat.catSrc
                obj.quant = Math.ceil(cat.collected * Math.random() * 0.5 + 15 * Math.random() + 10)
            }

            prizesList.push(obj);
        }
        return prizesList
    }
    loadData(data) {
        if (!data.chestData || !data.version || data.version != this.version) {
            STORAGE.reset();
            location.reload();
        }
        this.trophyData = data.trophy;
        this.chestData = data.chestData;
        this.maxPoints = data.highscore;
        this.moneyData = data.money;
        this.actionsData = data.actionsData;
        this.shopData = data.shopData;
        for (var name in data) {
            let n = name.indexOf("cat");
            if (n >= 0) {
                // console.log(parseInt(name.substring(3)));
                // console.log(data[name]);
                let id = parseInt(name.substring(3))
                this.catsData[id] = data[name];
            }
        }

        this.chestData.lastChestTime = new Date(this.chestData.lastChestTime);

    }
    getObjectData() {
        let obj = {
            trophy: this.trophyData,
            chestData: this.chestData,
            highscore: this.maxPoints,
            money: this.moneyData,
            version: this.version,
            shopData: this.shopData,
            actionsData: this.actionsData,
        }
        for (var i = 0; i < this.catsData.length; i++) {
            obj['cat' + this.catsData[i].catID] = this.catsData[i];
        }

        return obj
    }
    getNumberTrophyToSend() {
        let trophys = 0;
        let catsAcc = 0;
        let catsPercentageAcc = 0;
        for (var i = 0; i < this.catsData.length; i++) {
            catsAcc += this.catsData[i].collected;
            catsPercentageAcc += this.catsData[i].collectedMultiplier;
        }

        trophys = catsAcc * (this.trophyData.multplierPerCollected * this.trophyData.collected * 0.05) + Math.ceil(catsAcc * 0.2) // + Math.ceil(catsAcc * 0.1) * catsPercentageAcc//Math.ceil(catsAcc * 0.15) + 2
        return Math.ceil(trophys);
    }
    sendCatsToEarth() {
        this.updateTrophy(this.getNumberTrophyToSend());
        this.resetCatData();
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    getTrophyAmount() {
        let tempTrophy = Math.floor(this.trophyData.collected * (Math.random() * 0.05 + 0.05))
        if (tempTrophy <= 0) {
            tempTrophy = 1 // MAX_NUMBER
        }
        return tempTrophy;
    }
    updateTrophy(collected) {
        this.trophyData.collected += collected
        let mult = this.trophyData.collected * this.trophyData.multplierPerCollected // this.trophyData.maxCollectedMultiplier * this.trophyData.maxCollectedMultiplier;
        this.trophyData.collectedMultiplier = mult //* 0.01;

        //console.log(this.trophyData);
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    addCoins(points) {
        this.moneyData.currentCoins += points;
    }
    updateCatsAllowed(points) {
        this.addCoins(points);
        if (points > this.maxPoints) {
            this.maxPoints = points;
        }
        this.totalCatsAllowed = 1;
        let temp = [true]
        let hasNew = false;
        for (var i = 1; i < this.catsData.length; i++) {
            let require = this.catsData[i].require;
            // let prevCat = this.catsData[require.catID]
            // console.log('this car require ', require.quant, points);
            if (require <= this.moneyData.currentCoins) //prevCat.collected)
            {
                this.catsData[i].canBeActive = true;
                if (!this.catsAllowed[i]) {
                    hasNew = i;
                }
                temp.push(true);
                this.totalCatsAllowed++;
            } else {
                temp.push(false);
            }
        }
        this.catsAllowed = temp;
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
        return hasNew;
    }
    activeCat(data) {
        this.catsData[data.catID].active = true;
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    startNewRound() {
        this.totalCatsAllowed = 0;
        for (var i = 0; i < this.catsData.length; i++) {
            if (this.catsData[i].active) {
                this.totalCatsAllowed++
            }
        }
        this.sessionData.tokens = this.gameTokens.quant;
        // console.log('cats', this.totalCatsAllowed);
    }
    enableAutoCollect(id) {
        let data = this.catsData[id];
        // console.log(data);
        if (this.trophyData.collected < data.autoCollectPrice) {
            console.log('something wrong');
            return
        }
        this.updateTrophy(-data.autoCollectPrice)
            // this.trophyData.collected -= data.autoCollectPrice
        this.catsData[id].isAuto = true;
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    addCats(list) {
        for (var i = 0; i < list.length; i++) {
            this.catsData[i].collected += list[i];

            let mult = this.catsData[i].collected / this.catsData[i].limitCatsToMultiply * this.catsData[i].maxCollectedMultiplier;
            this.catsData[i].collectedMultiplier = mult;

        }
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    getAllowedCatsData() {
        return this.catsData[Math.floor(Math.random() * this.totalCatsAllowed)]
    }
}