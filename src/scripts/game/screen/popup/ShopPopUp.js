import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import StandardPop from './StandardPop';
import ShopList from '../../ui/shop/ShopList';
import ShopItem from '../../ui/shop/ShopItem';
export default class ShopPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);

        let videoLabel = new PIXI.Text('collect the cats and bla bla bla\nonboarding...',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });


        this.popUp.alpha = 0;

        this.backgroundContainer = new PIXI.Container();
        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)

        this.backgroundContainer.interactive = true;

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = 0 //config.width / 2
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.y = 0 //config.height / 2

        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(-config.width / 2, -config.height / 2, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = this.width // 2;
        bigBlur.height = this.height // 2;
        bigBlur.alpha = 0.2
        bigBlur.anchor.set(0.5);

        tiled.x = -config.width / 2;
        tiled.y = -config.height / 2;

        this.backgroundContainer.addChild(tiled)
            // this.backgroundContainer.addChild(this.logoMask) 
            // this.backgroundContainer.mask = this.logoMask
        this.container.addChild(this.backgroundContainer);


        this.playButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.playButton.anchor.set(0.5)
        this.playButton.scale.set(config.height / this.playButton.height * 0.05)
            // this.playButtonScale = this.logoMask.height / this.playButton.height * 0.35
            // this.playButton.scale.set(this.playButtonScale);
            // this.playButton.y = config.height - this.container.y - this.playButton.height / 2 - 20
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mouseup', this.confirm.bind(this)).on('touchend', this.confirm.bind(this));
        this.container.addChild(this.playButton)

        this.cancelButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.cancelButton.anchor.set(0.5)
        this.cancelButton.scale.set(0.15)
            // this.cancelButtonScale = this.logoMask.height / this.cancelButton.height * 0.35
            // this.cancelButton.scale.set(this.cancelButtonScale);
            // this.cancelButton.y = config.height - this.container.y - this.cancelButton.height / 2 - 20
        this.cancelButton.interactive = true;
        this.cancelButton.buttonMode = true;
        // this.cancelButton.on('mouseup', this.close.bind(this)).on('touchend', this.close.bind(this));
        // this.container.addChild(this.cancelButton)


        // this.container.addChild(videoLabel)
        videoLabel.pivot.x = videoLabel.width / 2;
        videoLabel.pivot.y = videoLabel.height / 2;

        videoLabel.y = -this.h / 3 + 50
        this.cancelButton.x = -75
        this.cancelButton.y = 50
        this.playButton.x = -config.width / 2 + this.playButton.width
        this.playButton.y = -config.height / 2 + this.playButton.height

        let shopRect = {
            w: config.width * 0.85,
            h: config.height * 0.65
        }
        let pageItens = 6
        this.shopList = new ShopList(shopRect, pageItens);

        this.shopList.x = -shopRect.w / 2
        this.shopList.y = -shopRect.h / 2

        this.container.addChild(this.shopList)

        let shopItens = [];
        for (var i = 0; i < GAME_DATA.actionsData.length; i++)
        {
            let shopItem = new ShopItem(
            {
                w: shopRect.w,
                h: shopRect.h / pageItens
            });
            shopItem.setData(GAME_DATA.actionsData[i], 'actionsDataStatic')
            shopItens.push(shopItem)
        }

        for (var i = 0; i < GAME_DATA.shopData.length; i++)
        {
            let shopItem = new ShopItem(
            {
                w: shopRect.w,
                h: shopRect.h / pageItens
            });
            shopItem.setData(GAME_DATA.shopData[i], 'shopDataStatic')
            shopItens.push(shopItem)
        }

        this.shopList.addItens(shopItens);
        this.shopList.onItemShop.add(() =>
        {
            this.updateMoney(GAME_DATA.moneyData.currentCoins, false)
        })

        this.shopList.onVideoItemShop.add((item) =>
        {
            let staticData = GAME_DATA[item.staticData][item.id];
            console.log(item);
            this.screenManager.loadVideo(this.openVideoCallback.bind(this, staticData));
        })

        this.coinsContainer = new PIXI.Container();
        this.coinSprite = new PIXI.Sprite.from(GAME_DATA.moneyData.softIcon);
        this.coinsContainer.addChild(this.coinSprite);
        this.coinSprite.anchor.set(0, 0.5);

        this.moneyLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.moneyLabel.pivot.y = this.moneyLabel.height / 2;
        this.coinsContainer.addChild(this.moneyLabel);

        this.coinSprite.scale.set(config.height / this.coinSprite.height * 0.05)
        this.moneyLabel.scale.set(config.height / this.moneyLabel.height * 0.065)
        this.moneyLabel.x = this.coinSprite.width * 1.25;
        this.currentMoney = GAME_DATA.moneyData.currentCoins;
        this.coinsContainer.y = -config.height / 2 + this.coinsContainer.height + 20
        this.coinsContainer.x = -this.coinsContainer.width / 2

        this.container.addChild(this.coinsContainer);

        this.updateMoney(GAME_DATA.moneyData.currentCoins, true)

        this.screenManager.prizeContainer.onPrizeCollected.add(this.hidePrizeContainer.bind(this));

    }
    openVideoCallback(data)
    {
        console.log(data);
        console.log(data);
        console.log(data);
        this.screenManager.closeVideo();
        this.screenManager.prizeContainer.show(data.value);
    }
    hidePrizeContainer(){
        if(!this.visible){
            return;
        }
        this.shopList.updateItems();
        this.updateMoney(GAME_DATA.moneyData.currentCoins, false)
    }
    update(delta)
    {

    }
    show(param)
    {
        this.toRemove = false;
        this.onShow.dispatch(this);
        this.shopList.updateItems();

        this.container.scale.set(0, 2)
        this.updateMoney(GAME_DATA.moneyData.currentCoins, true)
        TweenLite.to(this.container.scale, 1,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        })
    }
    afterHide()
    {

    }
    hide(dispatch = true, callback = null)
    {
        TweenLite.to(this.container.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn,
            onComplete: () =>
            {
                if (dispatch)
                {
                    this.onHide.dispatch(this);
                }
                if (callback)
                {
                    callback();
                }
                this.afterHide();
                this.toRemove = true
            }
        })
    }
    updateMoney(money, force, delay = 0)
    {
        if (force)
        {
            this.moneyLabel.text = utils.formatPointsLabel(money / MAX_NUMBER);
            this.coinsContainer.x = -this.coinsContainer.width / 2;
            this.currentMoney = money;
            return;
        }
        if (this.currentTween)
        {
            TweenLite.killTweensOf(this.currentTween);
        }
        let moneyObj = {
            current: this.currentMoney,
            target: money
        }
        this.currentMoney = money;
        this.currentTween = TweenLite.to(moneyObj, 0.5,
        {
            delay: delay,
            current: money,
            onUpdateParams: [moneyObj],
            onUpdate: (moneyObj) =>
            {
                this.moneyLabel.text = utils.formatPointsLabel(moneyObj.current / MAX_NUMBER);
                this.coinsContainer.x = -this.coinsContainer.width / 2;
            },
            onComplete: () =>
            {

                this.coinsContainer.x = -this.coinsContainer.width / 2;
            }
        })
    }
    confirm()
    {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide();
    }
}