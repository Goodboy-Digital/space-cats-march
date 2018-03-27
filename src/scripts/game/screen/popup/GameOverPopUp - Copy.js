import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import StandardPop from './StandardPop';
import AutoCollectButton from '../../ui/AutoCollectButton';
import CatItemList from '../../ui/CatItemList';
export default class GameOverPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);


        this.popUp.tint = 0x999999
        this.onInitRedirect = new Signals();

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = config.width / 2
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.y = this.logoMask.height / 2 + config.height * 0.1

        this.container.y = this.logoMask.height / 2 + config.height * 0.1

        this.lines = [];
        let tot = CAT_LIST.length;
        this.catListContainer = new PIXI.Container();

        this.catItemList = new CatItemList({w:this.logoMask.width * 0.75, h:this.logoMask.height * 0.75});
        this.addChild(this.catItemList)

        this.catItemList.x = 100
        this.catItemList.y = 100

        this.catItemList.updateAllItens();

        let thumbH = 0;


        this.catNames = [];
        this.catBonus = [];
        this.catLabels = [];
        this.catsSprite = [];
        this.plusSprites = [];
        this.autoCollectActive = [];


        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            let container = new PIXI.Container();
            let totalLabel = new PIXI.Text('0000',
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '18px',
                fill: 0xFFFFFF,
                align: 'right',
                fontWeight: '800'
            });
            totalLabel.pivot.y = totalLabel.height / 2;
            container.addChild(totalLabel)
                // tempLabel.x = thumb.width

            let thumb = new PIXI.Sprite.from(GAME_DATA.catsData[i].catThumb);
            thumb.scale.set(this.height / thumb.height * 0.12)
            container.addChild(thumb);
            container.y = i * thumb.height * 1.25
            // totalLabel.x = -20
            if (i == 0)
            {
                thumb.buttonMode = true;
                thumb.interactive = true;
                thumb.on('mouseup', this.addMany.bind(this)).on('touchend', this.addMany.bind(this));
            }

            if (i == 2)
            {
                thumb.buttonMode = true;
                thumb.interactive = true;
                thumb.on('mouseup', this.resetAll.bind(this)).on('touchend', this.resetAll.bind(this));
            }

            container.x = 0
                // container.x = -this.w / 3
            thumb.x = totalLabel.x + totalLabel.width + 5
            thumb.y = -thumb.height * 0.5
            thumbH = thumb.height;

            totalLabel.text = ''
            let plusIcon = new PIXI.Sprite.from('results_arrow');
            // plusIcon.scale.set(this.height / plusIcon.height * 0.12)
            container.addChild(plusIcon);
            plusIcon.scale.set(thumbH / plusIcon.height * 0.25)
            plusIcon.anchor.set(0.5)
            plusIcon.x = thumb.x + thumb.width + 15

            this.plusSprites.push(plusIcon);


            let bonusLabel = new PIXI.Text(GAME_DATA.catsData[i].collectedMultiplier.toFixed(3) + '%',
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '14px',
                fill: 0xFFFFFF,
                align: 'center',
                fontWeight: '800'
            });
            bonusLabel.pivot.y = bonusLabel.height / 2;

            container.addChild(bonusLabel)
            bonusLabel.x = plusIcon.x + plusIcon.width

            let catNameLabel = new PIXI.Text(GAME_DATA.catsData[i].catName,
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '14px',
                fill: 0xFFFFFF,
                align: 'center',
                fontWeight: '800'
            });
            catNameLabel.pivot.y = catNameLabel.height / 2;

            container.addChild(catNameLabel)
            catNameLabel.x = bonusLabel.x + bonusLabel.width + 5


            let autocollect = new AutoCollectButton(i)
            // autocollect.scale.set(this.height / autocollect.height * 0.12)
            container.addChild(autocollect);
            autocollect.scale.set(thumbH / autocollect.height * 0.5)
            autocollect.x = catNameLabel.x + catNameLabel.width + 15
            
            autocollect.enableAutoCollect.add(this.onAutoCollect.bind(this));

            this.autoCollectActive.push(autocollect);

            this.catLabels.push(totalLabel);
            this.catsSprite.push(thumb);
            this.catNames.push(catNameLabel);
            this.catBonus.push(bonusLabel);
            // this.catListContainer.addChild(container);

        }
        this.catListContainer.pivot.x = this.catListContainer.width / 2;
        this.catListContainer.pivot.y = -thumbH / 2 + this.catListContainer.height / 2 // this.catListContainer.height / 2// + thumbH * -0.25;
        this.container.addChild(this.catListContainer);
        // this.playButton.y = this.height * 0.5 - this.playButton.height
        this.popUp.alpha = 0;

        this.playButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.playButton.anchor.set(0.5)
        this.playButtonScale = this.logoMask.height / this.playButton.height * 0.35
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
        this.resetButton.on('mouseup', this.redirectToInit.bind(this)).on('touchend', this.redirectToInit.bind(this));
        // this.container.addChild(this.resetButton)




        this.addPointsContainers();

        this.addTrophyContainer();
        this.addSpaceShipContainer();
        this.addChestContainer();

        // this.playButton.y =  config.height + gbPosition.y
    }

    enableAutoCollect(data){
        GAME_DATA.enableAutoCollect(data)
        this.screenManager.closeVideo();
    }
    onAutoCollect(data){
        // console.log(data);
        this.screenManager.loadVideo(this.enableAutoCollect.bind(this, data.catID), data.catID);
    }
    resetAll()
    {
        STORAGE.reset();
        location.reload();
    }
    addMany()
    {
        // this.addCats([100,100,100,100])
        GAME_DATA.addCats([100, 100, 100, 100]);
        GAME_DATA.updateCatsAllowed(5555555555);
        this.updateCatsQuant()
    }
    toInit()
    {
        this.onInitRedirect.dispatch();
    }
    redirectToInit()
    {
        this.hide(false, this.toInit.bind(this));
    }
    addSpaceShipContainer()
    {
        this.screenBlocker = new PIXI.Graphics().beginFill().drawRect(0, 0, config.width, config.height);
        this.addChild(this.screenBlocker);
        this.screenBlocker.alpha = 0.5
        this.screenBlocker.interactive = true;
        this.screenBlocker.buttonMode = true;
        this.screenBlocker.on('mouseup', this.closeSpaceship.bind(this)).on('touchend', this.closeSpaceship.bind(this));
        this.screenBlocker.visible = false;

        this.spaceShipContainer = new PIXI.Container();

        this.spaceShipSin = 0;

        this.spaceShipBubble = new PIXI.Sprite.from('pickup_bubble');
        this.spaceShipBubble.anchor.set(0.5, 0.5);

        let trophyIcon = new PIXI.Sprite.from('spaceship');
        trophyIcon.anchor.set(0.5, 0.5);

        this.availableTrohpy = new PIXI.Text('1.5T',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.availableTrohpy.pivot.x = this.availableTrohpy.width / 2;
        this.availableTrohpy.y = -15;

        trophyIcon.scale.set(0.3)
        this.spaceShipContainer.addChild(trophyIcon);
        this.spaceShipContainer.addChild(this.spaceShipBubble);
        this.addChild(this.spaceShipContainer)
        this.spaceShipContainerScale = config.width / this.spaceShipContainer.width * 0.25
        this.spaceShipContainer.scale.set(this.spaceShipContainerScale)

        this.spaceShipContainer.x = config.width * 0.8
        this.spaceShipContainer.y = config.height * 0.5

        this.spaceShipBubble.interactive = true;
        this.spaceShipBubble.buttonMode = true;
        this.spaceShipBubble.on('mouseup', this.openSpaceshipInfo.bind(this)).on('touchend', this.openSpaceshipInfo.bind(this));

        this.spaceShipInfoContainer = new PIXI.Container();

        let shipInfoSprite = new PIXI.Sprite.from('score_plinth');
        this.spaceShipInfoContainer.addChild(shipInfoSprite);

        let trophyIcon2 = new PIXI.Sprite.from('pickup_fish');
        trophyIcon2.anchor.set(0.5, 0.5);
        // trophyIcon2.scale.set(0.7);
        trophyIcon2.x = trophyIcon2.width + 20
        trophyIcon2.y = shipInfoSprite.height / 2

        this.confirmSpaceship = new PIXI.Sprite.from('rocket_button_off');

        let sellCatsInfo = new PIXI.Text('Do you want change your cats by fish?',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });

        sellCatsInfo.x = shipInfoSprite.width / 2 - sellCatsInfo.width / 2
        sellCatsInfo.y = 20

        this.spaceShipInfoLabel = new PIXI.Text('x 582',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '64px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });
        this.spaceShipInfoLabel.x = trophyIcon2.x + trophyIcon2.width - 20
        this.spaceShipInfoLabel.y = trophyIcon2.y - this.spaceShipInfoLabel.height / 2
        this.confirmSpaceship.anchor.set(0.5);
        this.confirmSpaceship.scale.set(0.75);
        this.confirmSpaceship.x = shipInfoSprite.width - this.confirmSpaceship.width / 2 - 20
        this.confirmSpaceship.y = shipInfoSprite.height / 2 //- this.confirmSpaceship.height / 2
        shipInfoSprite.addChild(trophyIcon2);
        shipInfoSprite.addChild(sellCatsInfo);
        shipInfoSprite.addChild(this.confirmSpaceship);
        shipInfoSprite.addChild(this.spaceShipInfoLabel);
        shipInfoSprite.scale.set(shipInfoSprite.width / config.width * 0.75)
        this.spaceShipInfoContainer.x = -this.spaceShipInfoContainer.width
            // this.spaceShipInfoContainer.y = - this.spaceShipBubble.height / 4;
        this.spaceShipContainer.addChild(this.spaceShipInfoContainer);

        this.spaceShipInfoContainer.visible = false;
        this.confirmSpaceship.interactive = true;
        this.confirmSpaceship.buttonMode = true;
        this.confirmSpaceship.on('mouseup', this.onSpaceshipClick.bind(this)).on('touchend', this.onSpaceshipClick.bind(this));
    }

    openSpaceshipInfo()
    {
        console.log('OPEN');

        this.spaceShipInfoLabel.text = 'x' + utils.formatPointsLabel(GAME_DATA.getNumberTrophyToSend() / MAX_NUMBER);



        this.screenBlocker.visible = true;
        this.spaceShipInfoContainer.alpha = 0;
        this.screenBlocker.alpha = 0;
        this.spaceShipInfoContainer.visible = true;
        TweenLite.to(this.screenBlocker, 0.5,
        {
            alpha: 0.5,
        })
        TweenLite.to(this.spaceShipInfoContainer, 0.5,
        {
            alpha: 1,
        })
        this.spaceInfoOpen = true;
    }

    closeSpaceship()
    {
        TweenLite.to(this.screenBlocker, 0.25,
        {
            alpha: 0
        });
        TweenLite.to(this.spaceShipInfoContainer, 0.25,
        {
            alpha: 0,
            onComplete: () =>
            {

                this.spaceInfoOpen = false;
                this.spaceShipInfoContainer.visible = false;
                this.screenBlocker.visible = false;
                this.spaceShipContainer.interactive = true;
            }
        })

    }
    onConfirmSpaceship()
    {
        this.spaceShipContainer.visible = false;
        this.screenManager.closeVideo();
        GAME_DATA.sendCatsToEarth();
        this.updateCatsQuant();
        this.updateTrophyQuant();

        this.closeSpaceship();

    }
    onSpaceshipClick()
    {
        if (!this.spaceInfoOpen)
        {
            return
        }

        this.screenManager.loadVideo(this.onConfirmSpaceship.bind(this));



    }
    addTrophyContainer()
    {
        this.trophyContainer = new PIXI.Container();

        this.trophySin = 0;

        this.trophyBubble = new PIXI.Sprite.from('pickup_bubble');
        this.trophyBubble.anchor.set(0.5, 0.5);

        let trophyIcon = new PIXI.Sprite.from('pickup_fish');
        trophyIcon.anchor.set(0.5, 0.5);
        trophyIcon.scale.set(0.7);
        trophyIcon.y = -this.trophyBubble.height * 0.15;

        this.quantTrophy = new PIXI.Text('1.5T',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        // trophyIcon.x = -this.trophyBubble.width * 0.15;
        this.quantTrophy.pivot.x = this.quantTrophy.width / 2;
        this.quantTrophy.y = -15;
        // this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;

        let plusIcon = new PIXI.Sprite.from('results_arrow');
        plusIcon.anchor.set(0.5)
        plusIcon.y = this.trophyBubble.height * 0.2;
        plusIcon.x = -this.trophyBubble.width * 0.15 + plusIcon.width / 2;

        this.bonusTrophy = new PIXI.Text('10.2%',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.bonusTrophy.x = plusIcon.x + plusIcon.width
        this.bonusTrophy.y = plusIcon.y - this.bonusTrophy.height * 0.5

        this.trophyContainer.addChild(plusIcon);
        this.trophyContainer.addChild(trophyIcon);
        this.trophyContainer.addChild(this.quantTrophy);
        this.trophyContainer.addChild(this.bonusTrophy);
        this.trophyContainer.addChild(this.trophyBubble);
        this.addChild(this.trophyContainer)
        this.trophyContainerScale = config.width / this.trophyContainer.width * 0.25
        this.trophyContainer.scale.set(this.trophyContainerScale)

        this.trophyContainer.x = config.width * 0.2
        this.trophyContainer.y = config.height * 0.5

    }

    addChestContainer()
    {
        this.chestContainer = new PIXI.Container();

        this.chestSin = 0;

        this.chestBubble = new PIXI.Sprite.from('pickup_bubble');
        this.chestBubble.anchor.set(0.5, 0.5);

        let chestIcon = new PIXI.Sprite.from('pickup_fish');
        chestIcon.anchor.set(0.5, 0.5);
        chestIcon.scale.set(0.7);
        chestIcon.y = -this.chestBubble.height * 0.15;

        this.quantchest = new PIXI.Text('Open a free\nchest!\n35:05',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        // chestIcon.x = -this.chestBubble.width * 0.15;
        this.quantchest.pivot.x = this.quantchest.width / 2;
        this.quantchest.y = -15;
        // this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;

        this.chestContainer.addChild(chestIcon);
        this.chestContainer.addChild(this.quantchest);
        this.chestContainer.addChild(this.chestBubble);
        this.addChild(this.chestContainer)
        this.chestContainerScale = config.width / this.chestContainer.width * 0.35
        this.chestContainer.scale.set(this.chestContainerScale)

        this.chestContainer.x = config.width * 0.8
        this.chestContainer.y = config.height * 0.85

        this.chestContainer.interactive = true;
        this.chestContainer.buttonMode = true;
        this.chestContainer.on('mouseup', this.onChestClick.bind(this)).on('touchend', this.onChestClick.bind(this));

        this.prizeContainer = new PIXI.Container();
        this.addChild(this.prizeContainer);
        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        let prizeBg = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, this.w, this.h) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        prizeBg.pivot.x = prizeBg.width / 2
        prizeBg.pivot.y = prizeBg.height / 2
            // prizeBg.scale.set((this.size / prizeBg.width));
        prizeBg.alpha = 1;
        prizeBg.rotation = Math.PI / 4;
        prizeBg.tint = 0xFFFFFF;
        prizeBg.x = config.width / 2;
        prizeBg.y = config.height / 2;

        let prizeInfo = new PIXI.Text('HERE YOUR PRIZE',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0x000000,
            align: 'center',
            fontWeight: '800'
        });

        prizeInfo.pivot.x = prizeInfo.width / 2;
        prizeInfo.pivot.y = prizeInfo.height / 2;

        prizeInfo.x = config.width / 2;
        prizeInfo.y = config.height / 2;
        this.prizeDark.alpha = 0.3;
        this.prizeContainer.addChild(this.prizeDark)
        this.prizeContainer.addChild(prizeBg)
        this.prizeContainer.addChild(prizeInfo)

        this.prizeDark.interactive = true;
        this.prizeDark.buttonMode = true;
        this.prizeDark.on('mouseup', this.hidePrizeContainer.bind(this)).on('touchend', this.hidePrizeContainer.bind(this));

    }

    hidePrizeContainer()
    {
        this.prizeContainer.visible = false;
    }
    openChest()
    {
        this.screenManager.closeVideo();
        this.chestContainer.visible = false;
        this.prizeContainer.visible = true;
    }
    onChestClick()
    {
        this.screenManager.loadVideo(this.openChest.bind(this));
    }

    addPointsContainers()
    {
        this.pointsContainer = new PIXI.Container();
        this.currentPointsSprite = new PIXI.Sprite.from('score_plinth');
        this.currentPointsSprite.scale.set(config.height / this.currentPointsSprite.height * 0.1)
        this.pointsContainer.addChild(this.currentPointsSprite);

        this.pointsLabelInfo = new PIXI.Text('YOUR SCORE',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.pointsLabelInfo.pivot.x = this.pointsLabelInfo.width / 2;
        this.pointsLabelInfo.pivot.y = this.pointsLabelInfo.height;
        this.pointsLabelInfo.y = -this.pointsLabelInfo.height;
        this.currentPointsSprite.addChild(this.pointsLabelInfo);


        this.currentPointsLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '124px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
        this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;
        this.currentPointsLabel.y = 10;
        this.currentPointsSprite.anchor.set(0.5);
        this.currentPointsSprite.addChild(this.currentPointsLabel);


        this.currentHighscoreSprite = new PIXI.Sprite.from('score_plinth');
        this.currentHighscoreSprite.scale.set(config.height / this.currentHighscoreSprite.height * 0.1)
        this.pointsContainer.addChild(this.currentHighscoreSprite);

        this.higscoreLabelInfo = new PIXI.Text('ALL TIME BEST',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.higscoreLabelInfo.pivot.x = this.higscoreLabelInfo.width / 2;
        this.higscoreLabelInfo.pivot.y = this.higscoreLabelInfo.height;
        this.higscoreLabelInfo.y = -this.higscoreLabelInfo.height;
        this.currentHighscoreSprite.addChild(this.higscoreLabelInfo);

        this.higscoreLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '124px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.higscoreLabel.pivot.x = this.higscoreLabel.width / 2;
        this.higscoreLabel.pivot.y = this.higscoreLabel.height / 2;
        this.higscoreLabel.y = 10;
        this.currentHighscoreSprite.anchor.set(0.5);
        this.currentHighscoreSprite.addChild(this.higscoreLabel);
        this.currentHighscoreSprite.y = this.currentPointsSprite.height + 10

        this.addChild(this.pointsContainer);
        this.pointsContainer.x = config.width / 2
        this.pointsContainer.y = config.height / 2 + this.currentPointsSprite.height + 10
    }
    updatePoints(current, high)
    {
        this.currentPointsLabel.text = current
        this.higscoreLabel.text = high

        this.currentPointsLabel.pivot.x = this.currentPointsLabel.width / 2;
        this.currentPointsLabel.pivot.y = this.currentPointsLabel.height / 2;

        this.higscoreLabel.pivot.x = this.higscoreLabel.width / 2;
        this.higscoreLabel.pivot.y = this.higscoreLabel.height / 2;
    }
    hide(dispatch, callback)
    {
        console.log(dispatch);
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

    updateCatsQuant()
    {
        this.catItemList.updateAllItens();
        return
        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            let catData = GAME_DATA.catsData[i];
            // let quant = utils.formatPointsLabel(1000 / MAX_NUMBER);
            let quant = utils.formatPointsLabel(catData.collected / MAX_NUMBER);

            this.catLabels[i].text = quant == 0 ? '' : quant
            this.catLabels[i].x = this.catsSprite[i].x - this.catsSprite[i].width / 2 - this.catLabels[i].width
            this.catBonus[i].text = catData.collectedMultiplier.toFixed(2) + '%';

            // this.catLabels[i].scale.set(this.catNames[i].height / this.catLabels[i].height * 1.5)
            if (!catData.active)
            {
                this.catsSprite[i].texture = PIXI.Texture.from('results_locked_cat');
                this.catLabels[i].text = ''
                this.catNames[i].text = 'unlock at ' + utils.formatPointsLabel(catData.require / MAX_NUMBER);
                this.plusSprites[i].texture = PIXI.Texture.from('results_lock');
                this.autoCollectActive[i].visible = false;

            }
            else
            {
                this.catsSprite[i].tint = 0xFFFFFF;
                this.catsSprite[i].texture = PIXI.Texture.from(catData.catThumb);

                this.catNames[i].text = catData.catName;
                this.plusSprites[i].texture = PIXI.Texture.from('results_arrow');
                console.log(catData.amountToAutoCollect, 'AMOUNT');
                if(catData.collected >= catData.amountToAutoCollect){
                    this.autoCollectActive[i].visible = true;
                }else{
                    this.autoCollectActive[i].visible = false;
                }

                if(catData.isAuto){
                    this.autoCollectActive[i].enable();
                }else{
                    this.autoCollectActive[i].reset();
                }
                this.autoCollectActive[i].x = this.catNames[i].x + this.catNames[i].width + 25
            }
            // catNameLabel.x + catNameLabel.width + 15
        }

        if (!GAME_DATA.catsData[1].active)
        {
            this.spaceShipContainer.visible = false;
        }
        else
        {
            this.spaceShipContainer.visible = true;
        }
    }

    updateTrophyQuant()
    {
        let percent = GAME_DATA.trophyData.collectedMultiplier
        if (GAME_DATA.trophyData.collectedMultiplier >= 1)
        {
            percent = utils.formatPointsLabel(GAME_DATA.trophyData.collectedMultiplier / MAX_NUMBER)
        }
        this.bonusTrophy.text = percent + '%';
        this.quantTrophy.text = utils.formatPointsLabel(GAME_DATA.trophyData.collected / MAX_NUMBER);
        this.quantTrophy.pivot.x = this.quantTrophy.width / 2;
    }
    show(param)
    {
        // param = {
        //     catsList: [500, 500, 500, 500],
        //     points: 50121689
        // }
        // GAME_DATA.updateTrophy(0)
        this.updateTrophyQuant();
        let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
        this.updatePoints(0, high);

        if (param)
        {

            GAME_DATA.addCats(param.catsList);
            param.points = Math.round(param.points * MAX_NUMBER);

            let hasNew = GAME_DATA.updateCatsAllowed(param.points);
            let current = utils.formatPointsLabel(param.points / MAX_NUMBER);
            let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
            this.updatePoints(current, high);

        }
        this.updateCatsQuant()
        for (var i = 0; i < GAME_DATA.catsAllowed.length; i++)
        {
            let catData = GAME_DATA.catsData[i];
            this.updateCatsQuant()



        }

        if (!GAME_DATA.catsData[1].active)
        {
            this.spaceShipContainer.visible = false;
        }
        else
        {
            this.spaceShipContainer.visible = true;
        }


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

        this.prizeContainer.visible = false;

        this.chestContainer.visible = true;

        this.trophyContainer.alpha = 0;
        TweenLite.to(this.trophyContainer, 0.75,
        {
            delay: 0.5,
            alpha: 1
        });
        this.chestContainer.alpha = 0;
        TweenLite.to(this.chestContainer, 0.75,
        {
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
        // if(this.spaceInfoOpen)
        this.spaceShipSin += this.spaceInfoOpen ? 0.005 : 0.05
        this.spaceShipSin %= Math.PI * 2;
        this.spaceShipContainer.rotation = Math.sin(this.spaceShipSin) * 0.1 + 0.2
        this.spaceShipContainer.scale.set(this.spaceShipContainerScale + Math.cos(this.spaceShipSin) * 0.01, this.spaceShipContainerScale + Math.sin(this.spaceShipSin) * 0.01)
        this.spaceShipInfoContainer.rotation = -this.spaceShipContainer.rotation;

        this.trophySin += 0.05
        this.trophySin %= Math.PI * 2;
        this.trophyContainer.rotation = Math.sin(this.trophySin) * 0.1 - 0.2
        this.trophyContainer.scale.set(this.trophyContainerScale + Math.cos(this.trophySin) * 0.01, this.trophyContainerScale + Math.sin(this.trophySin) * 0.01)


        this.chestSin += 0.05
        this.chestSin %= Math.PI * 2;
        this.chestContainer.rotation = Math.sin(this.chestSin) * 0.1 + 0.2
        this.chestContainer.scale.set(this.chestContainerScale + Math.sin(this.chestSin) * 0.01, this.chestContainerScale + Math.cos(this.chestSin) * 0.01)
    }
}