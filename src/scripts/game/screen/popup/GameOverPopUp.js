import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import StandardPop from './StandardPop';
import AutoCollectButton from '../../ui/AutoCollectButton';
import CatItemList from '../../ui/CatItemList';
import TrophyContainer from '../../ui/TrophyContainer';
import PointsContainer from '../../ui/PointsContainer';
import SpaceShipContainer from '../../ui/SpaceShipContainer';
import ChestContainer from '../../ui/ChestContainer';
import PrizeContainer from '../../ui/PrizeContainer';
import GameOverCatsContainer from '../../ui/GameOverCatsContainer';
import HUD from '../../ui/HUD';
export default class GameOverPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);


        this.popUp.alpha = 0;
        this.popUp.tint = 0x999999
        this.onInitRedirect = new Signals();
        this.onShopRedirect = new Signals();

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = config.width / 2
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.y = this.logoMask.height / 2 + config.height * 0.1

        this.container.y = this.logoMask.height / 2 + config.height * 0.1

        this.lines = [];
        this.catListContainer = new PIXI.Container();

        this.catItemList = new CatItemList(
        {
            w: this.logoMask.width * 0.85,
            h: this.logoMask.height * 0.75
        });
        this.catListContainer.addChild(this.catItemList)
        this.catItemList.updateAllItens();
        this.catItemList.onAutoCollect.add(this.onAutoCollect.bind(this));
        this.catItemList.onActiveCat.add(this.onActiveCat.bind(this));
        this.catListContainer.x = -this.catItemList.width / 2;
        this.catListContainer.y = -this.catItemList.height / 2
        this.container.addChild(this.catListContainer);


        this.playButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.playButton.anchor.set(0.5)
        this.playButtonScale = this.logoMask.height / this.playButton.height * 0.3
        this.playButton.scale.set(this.playButtonScale);
        this.playButton.y = config.height - this.container.y - this.playButton.height / 2 - 20
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mouseup', this.confirm.bind(this)).on('touchend', this.confirm.bind(this));
        this.container.addChild(this.playButton)
        this.playButton.scale.set(0);


        this.resetButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.resetButton.anchor.set(0.5)
            // this.resetButton.scale.set(-0.5, 0.5)
        this.resetButtonScale = this.logoMask.height / this.resetButton.height * 0.15
        this.resetButton.scale.set(-this.resetButtonScale, this.resetButtonScale);
        this.resetButton.x = -config.width / 2 + this.resetButton.width;
        this.resetButton.y = -config.height / 2 + this.resetButton.height + config.height * 0.2;
        // this.resetButton.y = -300
        this.resetButton.interactive = true;
        this.resetButton.buttonMode = true;
        this.resetButton.on('mouseup', this.addMany.bind(this)).on('touchend', this.addMany.bind(this));
        // this.resetButton.on('mouseup', this.redirectToInit.bind(this)).on('touchend', this.redirectToInit.bind(this));
        this.container.addChild(this.resetButton)


        this.resetButton2 = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.resetButton2.anchor.set(0.5)
            // this.resetButton2.scale.set(-0.5, 0.5)
        this.resetButton2Scale = this.logoMask.height / this.resetButton2.height * 0.15
        this.resetButton2.scale.set(-this.resetButton2Scale, this.resetButton2Scale);
        this.resetButton2.x = config.width / 2 - this.resetButton2.width;
        this.resetButton2.y = -config.height / 2 + this.resetButton2.height + config.height * 0.2;
        // this.resetButton2.y = -300
        this.resetButton2.interactive = true;
        this.resetButton2.buttonMode = true;
        this.resetButton2.on('mouseup', this.resetAll.bind(this)).on('touchend', this.resetAll.bind(this));
        // this.resetButton2.on('mouseup', this.redirectToInit.bind(this)).on('touchend', this.redirectToInit.bind(this));
        this.container.addChild(this.resetButton2)


        this.shopButton = new PIXI.Sprite(PIXI.Texture.from('shop_button'));
        this.shopButton.anchor.set(0.5)
            // this.shopButton.scale.set(-0.5, 0.5)
        this.shopButtonScale = this.logoMask.height / this.shopButton.height * 0.20
        this.shopButton.scale.set(this.shopButtonScale, this.shopButtonScale);
        this.shopButton.x = config.width * 0.17 - config.width / 2
        this.shopButton.y = this.playButton.y //+ this.shopButton.height + config.height * 0.2;
            // this.shopButton.y = -300
        this.shopButton.interactive = true;
        this.shopButton.buttonMode = true;

        this.shopInfo = new PIXI.Sprite.from('info');
        this.shopInfo.anchor.set(0.5);
        this.shopButton.addChild(this.shopInfo)
        this.shopInfo.scale.set(1.5);
        // this.container.addChild(this.shopInfo);
        this.shopInfo.x = this.shopButton.width / this.shopButtonScale * 0.5;
        this.shopInfo.y = -this.shopButton.height / this.shopButtonScale * 0.5;
        // this.shopInfo.y = this.shopButton.height / 3.5;
        // this.shopButton.on('mouseup', this.resetAll.bind(this)).on('touchend', this.resetAll.bind(this));
        this.shopButton.on('mouseup', this.redirectToShop.bind(this)).on('touchend', this.redirectToShop.bind(this));
        this.container.addChild(this.shopButton)


        this.pointsContainer = new PointsContainer();
        this.addChild(this.pointsContainer)
        this.pointsContainer.x = config.width / 2
        this.pointsContainer.y = config.height / 2 + this.pointsContainer.height * 0.75

        this.trophyContainer = new TrophyContainer();
        this.addChild(this.trophyContainer)
        this.trophyContainer.x = config.width * 0.17
        this.trophyContainer.y = config.height * 0.6

        this.chestContainer = new ChestContainer();
        this.addChild(this.chestContainer)
        this.chestContainer.x = config.width * 0.8;
        this.chestContainer.y = config.height * 0.85;
        this.chestContainer.onConfirm.add(() =>
        {
            this.onConfirmChest();
        });
        this.screenBlocker = new PIXI.Graphics().beginFill().drawRect(0, 0, config.width, config.height);
        this.addChild(this.screenBlocker);
        this.screenBlocker.alpha = 0.5
        this.screenBlocker.interactive = true;
        this.screenBlocker.buttonMode = true;
        this.screenBlocker.on('mouseup', this.closeSpaceship.bind(this)).on('touchend', this.closeSpaceship.bind(this));
        this.screenBlocker.visible = false;

        this.spaceShipContainer = new SpaceShipContainer();
        this.addChild(this.spaceShipContainer)
        this.spaceShipContainer.x = config.width * 0.83
        this.spaceShipContainer.y = config.height * 0.6
        this.spaceShipContainer.onOpenInfo.add(() =>
        {
            this.showScreenBlocker();
        })
        this.spaceShipContainer.onCloseInfo.add(() =>
        {
            this.hideScreenBlocker();
        })
        this.spaceShipContainer.onConfirm.add(() =>
        {
            this.onConfirmSpaceship();
        })


        this.prizeContainer = new PrizeContainer();
        this.prizeContainer.onPrizeCollected.add(this.hidePrizeContainer.bind(this));
        this.addChild(this.prizeContainer)

        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, true)

        this.gameOverCatsContainer = new GameOverCatsContainer();
        this.addChild(this.gameOverCatsContainer)
        this.gameOverCatsContainer.hide();
        this.gameOverCatsContainer.onHide.add(this.onHideCatsGameOverList.bind(this));
    }

    enableAutoCollect(data)
    {
        GAME_DATA.enableAutoCollect(data)
        this.updateTrophyQuant();
        this.screenManager.closeVideo();
        this.catItemList.updateAllItens()
    }
    onActiveCat(data)
    {
        GAME_DATA.activeCat(data);
        this.catItemList.updateItemActive(data.catID);
        this.updateCatsQuant();
        let staticData = GAME_DATA.getStaticCatData(data.catID)
        GAME_DATA.moneyData.currentCoins -= staticData.cost;
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins)
    }
    onAutoCollect(data)
    {
        // this.showScreenBlocker();
        //console.log('AUTO COLLECT');
        this.screenManager.loadVideo(this.enableAutoCollect.bind(this, data.catID), data.catID);
    }
    resetAll()
    {
        STORAGE.reset();
        location.reload();
    }
    addMany()
    {
        GAME_DATA.addCats([100, 100, 100, 100]);
        GAME_DATA.updateTrophy(10000);

        let tempCurrent = GAME_DATA.maxPoints * 1.5 + 20;
        let current = utils.formatPointsLabel(tempCurrent / MAX_NUMBER);

        GAME_DATA.updateCatsAllowed(tempCurrent);
        let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
        this.updatePoints(current, high, tempCurrent);
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, false, 0.1)
        this.pointsContainer.erasePoints(0.1)
        this.updateAllData()
    }
    hideScreenBlocker()
    {
        this.screenBlocker.visible = true;
        TweenLite.to(this.screenBlocker, 0.5,
        {
            alpha: 0,
            onComplete: () =>
            {
                this.screenBlocker.visible = false;
            }
        })
    }
    showScreenBlocker()
    {
        this.screenBlocker.visible = true;
        this.screenBlocker.alpha = 0;
        TweenLite.to(this.screenBlocker, 0.5,
        {
            alpha: 0.5,
        })
    }
    toInit()
    {
        this.onInitRedirect.dispatch();
    }
    redirectToInit()
    {
        this.hide(false, this.toInit.bind(this));
    }
    redirectToShop()
    {
        this.onShopRedirect.dispatch();
    }

    closeSpaceship()
    {
        this.spaceShipContainer.closeSpaceship();
    }

    spaceshipVideoCallback()
    {
        // this.spaceShipContainer.visible = false;
        this.screenManager.closeVideo();
        GAME_DATA.sendCatsToEarth();
        this.updateCatsQuant();
        this.updateTrophyQuant();
        this.pointsContainer.erasePoints(0.1);
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins)

    }
    onConfirmSpaceship()
    {
        this.closeSpaceship();
        this.screenManager.loadVideo(this.spaceshipVideoCallback.bind(this));
    }

    hidePrizeContainer()
    {
        this.updateAllData();
    }
    openChestVideoCallback()
    {
        this.screenManager.closeVideo();
        // this.chestContainer.visible = false;
        this.prizeContainer.show();
    }
    onConfirmChest()
    {
        this.screenManager.loadVideo(this.openChestVideoCallback.bind(this));
    }

    updatePoints(current, high, currentNumber)
    {
        this.pointsContainer.updatePoints(current, high, currentNumber)

    }
    hide(dispatch, callback)
    {
        //console.log(dispatch);
        TweenLite.to(this.logoMask.scale, 0.5,
        {
            x: 5,
            y: 5,
            onComplete: () =>
            {
                this.screenManager.mask = null;
                if (this.logoMask.parent)
                    this.logoMask.parent.removeChild(this.logoMask)
                this.onHide.dispatch(this);
                this.toRemove = true
                super.hide(dispatch, callback);

            }
        })

        TweenLite.to(this.chestContainer, 0.5,
        {
            onComplete: () =>
            {
                this.chestContainer.visible = false;
            },
            alpha: 0
        });
        TweenLite.to(this.trophyContainer, 0.5,
        {
            alpha: 0
        });

        TweenLite.to(this.spaceShipContainer, 0.5,
        {
            alpha: 0
        });

        TweenLite.to(this.pointsContainer, 0.5,
        {
            alpha: 0
        });

        TweenLite.to(this.container.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn
        })
    }
    updateAllData()
    {
        this.updateCatsQuant();
        this.updateTrophyQuant();
        this.catItemList.updateAllItens();
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins);
    }
    updateCatsQuant()
    {
        this.catItemList.updateAllItens();


        // return
        if (!GAME_DATA.catsData[1].active)
        {
            this.spaceShipContainer.visible = false;
        }
        else
        {
            if (!this.spaceShipContainer.visible)
            {
                this.spaceShipContainer.x = config.width + this.spaceShipContainer.width
                TweenLite.to(this.spaceShipContainer, 0.65,
                {
                    x: config.width * 0.83,
                    ease: Back.easeOut
                })
            }
            this.spaceShipContainer.visible = true;
        }
    }

    updateTrophyQuant()
    {
        let percent = GAME_DATA.trophyData.collectedMultiplier

        if (percent >= 1)
        {
            percent = utils.formatPointsLabel(GAME_DATA.trophyData.collectedMultiplier / MAX_NUMBER)
        }
        else
        {
            percent = percent.toFixed(2);
        }
        let data = {
            bonus: percent + '%',
            quant: utils.formatPointsLabel(GAME_DATA.trophyData.collected / MAX_NUMBER)
        }


        this.trophyContainer.updateData(data);
    }
    onHideCatsGameOverList()
    {
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, false, 0.25)
        this.pointsContainer.erasePoints(0.25)

        this.updateCatsQuant()
    }
    updateCurrency()
    {
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, true, 0)
        this.updateTrophyQuant();
    }
    show(param)
    {
        this.updateTrophyQuant();
        let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
        this.updatePoints(0, high);

        if (param)
        {

            console.log(param.catsList);
            let totCats = 0;
            for (var i = 0; i < param.catsList.length; i++) {
                totCats += param.catsList[i]
            }
            let updatedCatList = param.catsList
            if(totCats > 0){
                updatedCatList = this.gameOverCatsContainer.show(param.catsList);
            }

            GAME_DATA.addCats(updatedCatList);
            param.points = Math.round(param.points * MAX_NUMBER);

            let hasNew = GAME_DATA.updateCatsAllowed(param.points);
            let current = utils.formatPointsLabel(param.points / MAX_NUMBER);
            let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
            this.updatePoints(current, high, param.points);

            if(totCats <= 0){
                this.onHideCatsGameOverList();
            }

        }
        else
        {
            this.onHideCatsGameOverList();
            this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, true)

        }





        // if (!GAME_DATA.catsData[1].active)
        // {
        //     this.spaceShipContainer.visible = false;
        // }
        // else
        // {
        //     this.spaceShipContainer.visible = true;
        // }


        this.logoMask.scale.set(5)
        if (this.screenManager.screensContainer.mask)
        {
            this.screenManager.screensContainer.mask = null;
        }
        this.screenManager.screensContainer.mask = this.logoMask;
        this.screenManager.screensContainer.addChild(this.logoMask)
        TweenLite.to(this.logoMask.scale, 0.75,
        {
            x: this.logoStartScale,
            y: this.logoStartScale,
            onComplete: () =>
            {}
        })

        this.prizeContainer.hide();



        this.trophyContainer.alpha = 0;
        TweenLite.to(this.trophyContainer, 0.75,
        {
            delay: 0.5,
            alpha: 1
        });
        this.chestContainer.alpha = 0;
        TweenLite.to(this.chestContainer, 0.75,
        {
            onStart: () =>
            {
                this.chestContainer.visible = true;
            },
            delay: 0.5,
            alpha: 1
        });

        this.spaceShipContainer.alpha = 0;
        TweenLite.to(this.spaceShipContainer, 0.75,
        {
            delay: 0.5,
            alpha: 1
        });

        this.pointsContainer.alpha = 0;
        TweenLite.to(this.pointsContainer, 0.75,
        {
            delay: 0.5,
            alpha: 1
        });

        TweenLite.to(this.playButton.scale, 0.75,
        {
            delay: 0.5,
            x: this.playButtonScale,
            y: this.playButtonScale,
            ease: Elastic.easeOut
        })
        super.show(param);
    }
    update(delta)
    {
        this.spaceShipContainer.update(delta);
        this.trophyContainer.update(delta)
        this.chestContainer.update(delta)
        this.prizeContainer.update(delta)
        this.catItemList.update(delta)
            // this.hud.update(delta)
            // this.catAnimation.update(delta);
    }
}