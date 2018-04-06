import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import PrizeItemContainer from './PrizeItemContainer';
import UIList from './uiElements/UIList';
export default class PrizeContainer extends UIList
{
    constructor()
    {
        super();
        this.onPrizeCollected = new Signals();


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.prizeDark.interactive = true;
        this.prizeDark.buttonMode = true;
        this.prizeDark.on('mousedown', this.collect.bind(this)).on('touchstart', this.collect.bind(this));
        this.addChild(this.prizeDark);

        this.starBackground = new PIXI.Sprite.from('results_newcat_rays_02');
        this.starBackground.anchor.set(0.5)
        this.addChild(this.starBackground);
        this.starBackground.x = config.width / 2;
        this.starBackground.y = config.height / 2;
        this.starBackgroundScale = config.width / this.starBackground.width * 0.75;
        this.starBackground.scale.set(this.starBackgroundScale)

        this.backgroundContainer = new PIXI.Container();
        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoStartScale = config.width / this.logoMask.width * 0.75;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.x = config.width / 2
        this.logoMask.y = config.height / 2

        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(0, 0, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = this.width // 2;
        bigBlur.height = this.height // 2;
        bigBlur.alpha = 0.2
        bigBlur.anchor.set(0.5);

        this.backgroundContainer.addChild(tiled)
        this.backgroundContainer.addChild(this.logoMask)
        this.backgroundContainer.mask = this.logoMask
        this.addChild(this.backgroundContainer);

        this.prizesContainer = new PIXI.Container();
        this.addChild(this.prizesContainer);
        this.itensList1 = [];

        this.w = this.logoMask.width * 0.8
        this.h = this.logoMask.height * 0.3
        for (var i = 0; i < 5; i++)
        {
            let item = new PrizeItemContainer(this.w / 3, this.w / 3);
            item.scaleContentMax = true;
            item.fitHeight = 1;
            item.setTexture('results_orange_cat');
            this.itensList1.push(item);
            this.elementsList.push(item);
            this.prizesContainer.addChild(item);
        }


        this.prizesContainer.x = config.width / 2 - this.w / 2;
        this.prizesContainer.y = config.height / 2 - this.h / 2;
    }
    update(delta)
    {
        if (this.visible)
        {
            this.starBackground.rotation += 0.05
        }
    }
    collect()
    {
        this.onPrizeCollected.dispatch();
        this.hide();
    }
    hide()
    {
        this.visible = false;
    }
    show(numberOfPrizes = 2)
    {
        if (this.parent)
        {
            this.parent.setChildIndex(this, this.parent.children.length - 1)
        }

        this.h = this.logoMask.height * 0.3 * ((5 / numberOfPrizes))

        this.h = Math.min(this.h, this.logoMask.height * 0.4)

        let list = GAME_DATA.getChestPrize(numberOfPrizes);
        this.elementsList = [];
        for (var i = 0; i < this.itensList1.length; i++)
        {
            this.elementsList.push(this.itensList1[i])
            this.itensList1[i].forceHide();
        }

        for (var i = list.length; i < this.itensList1.length; i++)
        {
            for (var j = this.elementsList.length - 1; j >= 0; j--)
            {
                if (this.itensList1[i] == this.elementsList[j])
                {
                    this.elementsList.splice(j, 1)
                }
            }
        }
        this.updateHorizontalList();

        this.prizesContainer.x = config.width / 2 - this.w / 2;
        this.prizesContainer.y = config.height / 2 - this.h / 2;

        for (var i = 0; i < list.length; i++)
        {
            let item = list[i] //this.itensList1[i];
            let itemC = this.itensList1[i]
            if (item.type == 'trophy')
            {
                itemC.setTexture(list[i].icon);
            }
            else if (item.type == 'cat')
            {
                itemC.setCat(list[i].icon);
            }
            else
            {
                itemC.setTexture(list[i].icon);
            }
            itemC.show(0.15 * i + 0.1);
            itemC.setValue(utils.formatPointsLabel(list[i].quant / MAX_NUMBER))
                // TweenLite.from(item.scale, 0.5, {x:0, y:0, delay:0.1 * i, ease:Back.easeOut});
                // TweenLite.to(item, 0.5, {alpha:1});
        }
        GAME_DATA.applyPrizes(list);
        this.prizeDark.alpha = 0;

        this.starBackground.scale.set(0)
        TweenLite.to(this.starBackground.scale, 0.5,
        {
            delay: 0.35,
            x: this.starBackgroundScale,
            y: this.starBackgroundScale,
            ease: Back.easeOut
        });

        this.logoMask.scale.set(0)
        TweenLite.to(this.logoMask.scale, 0.5,
        {
            delay: 0.25,
            x: this.logoStartScale,
            y: this.logoStartScale,
            ease: Back.easeOut
        });
        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.75
        });
        this.visible = true;
        console.log('WHAT');
    }
}