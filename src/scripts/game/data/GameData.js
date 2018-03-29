export default class GameData
{
    constructor()
    {

        this.catsData = [];

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

        this.chestData = {
            lastChestTime: new Date(),
            timeToNext: -1,
            chestAvailable: false,
            // chestTime: 90 * 1000
            chestTime: 15 * 1000 * 60
        }

        this.resetCatData();
    }
    resetCatData()
    {
        this.catsData = [];
        this.catsData.push(
        {
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

        this.catsData.push(
        {
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

        this.catsData.push(
        {
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
            catSrc: 'cat_turquoise_',
            catThumb: 'results_turquoise_cat',
            catName: 'lucifurr',
            require: 5000
        })

        this.catsData.push(
        {
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
            catSrc: 'cat_yellow_',
            catThumb: 'results_yellow_cat',
            catName: 'fluffy',
            require: 500000
        })
        this.catsData.push(
        {
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
            catSrc: 'cat_yellow_',
            catThumb: 'results_yellow_cat',
            catName: 'joe',
            require: 5000000
        })
        this.catsData.push(
        {
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
            catSrc: 'cat_yellow_',
            catThumb: 'results_yellow_cat',
            catName: 'clermont',
            require: 50000000
        })
    }
    applyPrizes(list)
    {
        console.log('apply list', list);
        let cats = []
        for (var i = 0; i < this.catsData.length; i++) {
            cats.push(0);
        }
        for (var i = 0; i < list.length; i++)
        {
            let item = list[i];
            if (item.type == 'cat')
            {
                console.log('add cat', item.quant);
                // this.catsData[item.id].quant += item.quant
                cats[item.id] += item.quant;
            }
            if (item.type == 'trophy')
            {
                this.updateTrophy(item.quant)
                // this.trophyData.collected += item.quant;
            }
        }
        this.addCats(cats)
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    isPossibleBuyAuto(id){
        let cat = this.catsData[id];
        if(cat.autoCollectPrice <= this.trophyData.collected){
            return true
        }
        return false
    }
    getChestPrize()
    {
        let prizesList = [];
        let availableIds = [];
        for (var i = 0; i < this.catsData.length; i++)
        {
            if (this.catsData.active)
            {
                availableIds.push(this.catsData.catID);
            }
        }
        for (var i = 0; i < 3; i++)
        {
            let rnd1 = Math.random();
            let obj = {
                type: 'cat',
                id: 0,
                quant: 0,
                icon: 0,
            }
            if (rnd1 < 0.3)
            {
                obj.type = 'trophy';
                obj.quant = this.getTrophyAmount();
                obj.icon = this.trophyData.icon
            }
            else
            {
                let cat = this.catsData[Math.floor(availableIds * Math.random())]
                obj.id = cat.catID
                obj.icon = cat.catThumb
                obj.quant = Math.ceil(cat.collected * Math.random() * 0.5 + 15 * Math.random() + 10)
            }

            prizesList.push(obj);
        }
        return prizesList
    }
    loadData(data)
    {
        if (!data.chestData)
        {
            STORAGE.reset();
            location.reload();
        }
        this.trophyData = data.trophy;
        this.chestData = data.chestData;
        this.maxPoints = data.highscore;
        for (var name in data)
        {
            let n = name.indexOf("cat");
            if (n >= 0)
            {
                console.log(parseInt(name.substring(3)));
                console.log(data[name]);
                let id = parseInt(name.substring(3))
                this.catsData[id] = data[name];
            }
        }

        this.chestData.lastChestTime = new Date(this.chestData.lastChestTime);

    }
    getNumberTrophyToSend()
    {
        let trophys = 0;
        let catsAcc = 0;
        let catsPercentageAcc = 0;
        for (var i = 0; i < this.catsData.length; i++)
        {
            catsAcc += this.catsData[i].collected;
            catsPercentageAcc += this.catsData[i].collectedMultiplier;
        }

        trophys = catsAcc * (this.trophyData.multplierPerCollected * this.trophyData.collected * 0.05) + Math.ceil(catsAcc * 0.2) // + Math.ceil(catsAcc * 0.1) * catsPercentageAcc//Math.ceil(catsAcc * 0.15) + 2
        return Math.ceil(trophys);
    }
    sendCatsToEarth()
    {
        this.updateTrophy(this.getNumberTrophyToSend());
        this.resetCatData();
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    getObjectData()
    {
        let obj = {
            trophy: this.trophyData,
            chestData: this.chestData,
            highscore: this.maxPoints,
        }
        for (var i = 0; i < this.catsData.length; i++)
        {
            obj['cat' + this.catsData[i].catID] = this.catsData[i];
        }

        return obj
    }
    getTrophyAmount()
    {
        let tempTrophy = Math.floor(this.trophyData.collected * (Math.random() * 0.05 + 0.05))
        if (tempTrophy <= 0)
        {
            tempTrophy = 1 // MAX_NUMBER
        }
        return tempTrophy;
    }
    updateTrophy(collected)
    {
        this.trophyData.collected += collected
        let mult = this.trophyData.collected * this.trophyData.multplierPerCollected // this.trophyData.maxCollectedMultiplier * this.trophyData.maxCollectedMultiplier;
        this.trophyData.collectedMultiplier = mult //* 0.01;

        console.log(this.trophyData);
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    updateCatsAllowed(points)
    {
        if (points > this.maxPoints)
        {
            this.maxPoints = points;
        }
        this.totalCatsAllowed = 1;
        let temp = [true]
        let hasNew = false;
        for (var i = 1; i < this.catsData.length; i++)
        {
            let require = this.catsData[i].require;
            // let prevCat = this.catsData[require.catID]
            // console.log('this car require ', require.quant, points);
            if (require <= points) //prevCat.collected)
            {
                this.catsData[i].canBeActive = true;
                if (!this.catsAllowed[i])
                {
                    hasNew = i;
                }
                temp.push(true);
                this.totalCatsAllowed++;
            }
            else
            {
                temp.push(false);
            }
        }
        this.catsAllowed = temp;
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
        return hasNew;
    }
    activeCat(data)
    {
        this.catsData[data.catID].active = true;
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    startNewRound()
    {
        this.totalCatsAllowed = 0;
        for (var i = 0; i < this.catsData.length; i++)
        {
            if (this.catsData[i].active)
            {
                this.totalCatsAllowed++
            }
        }
        console.log('cats', this.totalCatsAllowed);
    }
    enableAutoCollect(id)
    {
        let data = this.catsData[id];
        // console.log(data);
        if (this.trophyData.collected < data.autoCollectPrice)
        {
            console.log('something wrong');
            return
        }
        this.updateTrophy(-data.autoCollectPrice)
        // this.trophyData.collected -= data.autoCollectPrice
        this.catsData[id].isAuto = true;
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    addCats(list)
    {
        for (var i = 0; i < list.length; i++)
        {
            this.catsData[i].collected += list[i];

            let mult = this.catsData[i].collected / this.catsData[i].limitCatsToMultiply * this.catsData[i].maxCollectedMultiplier;
            this.catsData[i].collectedMultiplier = mult;

        }
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
    getAllowedCatsData()
    {
        return this.catsData[Math.floor(Math.random() * this.totalCatsAllowed)]
    }
}