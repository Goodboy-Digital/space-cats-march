import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import PrizeItemContainer from './PrizeItemContainer';
import HorizontalList from './uiElements/HorizontalList';
export default class PrizeContainer extends HorizontalList
{
    constructor()
    {
        super();
        this.onPrizeCollected = new Signals();


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.75;
        this.prizeDark.interactive = true;
        this.prizeDark.buttonMode = true;
        this.prizeDark.on('mouseup', this.collect.bind(this)).on('touchend', this.collect.bind(this));
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
        this.logoStartScale = config.width / this.logoMask.width * 0.5;
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
        this.itensList = [];

        this.w = this.logoMask.width * 0.8
        this.h = this.logoMask.height * 0.3
        for (var i = 0; i < 3; i++)
        {
            let item = new PrizeItemContainer(this.w / 3, this.w / 3);
            item.scaleContentMax = true;
            item.setTexture('results_orange_cat');
            this.itensList.push(item);
            this.elementsList.push(item);
            this.prizesContainer.addChild(item);
        }
        this.prizesContainer.x = config.width / 2 - this.w / 2;
        this.prizesContainer.y = config.height / 2 - this.h / 2;
        this.updateHorizontalList();
    }
    update(delta)
    {
        if (this.visible)
        {
            this.starBackground.rotation += 0.05
        }
    }
    collect(){
        this.onPrizeCollected.dispatch();
        this.hide();
    }
    hide()
    {
        this.visible = false;
    }
    show()
    {
        console.log('SHOW PRIZE');
        let list = GAME_DATA.getChestPrize();

        for (var i = 0; i < this.itensList.length; i++) {
            // this.itensList[i].setTexture('results_orange_cat');
            // this.itensList[i].alpha = 0;
            this.itensList[i].forceHide();
        }
        this.updateHorizontalList();

        for (var i = 0; i < this.itensList.length; i++) {
            let item = this.itensList[i];
            console.log(list[i]);
            item.setTexture(list[i].icon);
            item.show(0.15 * i + 0.1);
            item.setValue(list[i].quant)
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
    }
}