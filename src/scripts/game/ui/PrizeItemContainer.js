import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class PrizeItemContainer extends PIXI.Container
{
    constructor(w, h)
    {
        super();
        this.onFinishShow = new Signals();
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.topBg = new PIXI.Graphics().beginFill(0x00073f).drawRect(0, 0, w, h);
        this.container.addChild(this.topBg)

        this.itemContainer = new PIXI.Container();
        this.addChild(this.itemContainer);

        this.backTexture = new PIXI.Sprite.from('results_newcat_rays_02');
        this.backTexture.scale.set(this.topBg.width / (this.backTexture.width / this.backTexture.scale.x))
        this.backTexture.anchor.set(0.5);
        this.itemContainer.addChild(this.backTexture)

        this.itemSprite = new PIXI.Sprite.from('results_newcat_rays_02');
        this.itemContainer.addChild(this.itemSprite)
        this.itemSprite.anchor.set(0.5);


        this.itemContainer.x = w / 2
        this.itemContainer.y = h / 2

        this.labelContainer = new PIXI.Container();
        this.addChild(this.labelContainer);
        this.labelContainer.y = h;

         this.quantLabel = new PIXI.Text('65',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '28px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
         this.labelContainer.addChild(this.quantLabel)
    }
    setTexture(texture)
    {
        this.itemSprite.texture = new PIXI.Texture.from(texture);
        this.itemScale = this.topBg.width / (this.itemSprite.width / this.itemSprite.scale.x) * 0.75
        this.itemSprite.scale.set(this.itemScale)

    }
    setValue(value = 999){
    	this.quantLabel.text = value;
    	this.quantLabel.x = this.topBg.width / 2 - this.quantLabel.width / 2;
    }
    update(delta)
    {
        if (this.visible)
        {
            this.starBackground.rotation += 0.05
        }
    }
    forceHide()
    {
        this.alpha = 0;
    }
    show(delay = 0)
    {
        this.itemSprite.scale.set(0);
        TweenLite.to(this.itemSprite.scale, 0.5,
        {
            delay: delay,
            x: this.itemScale,
            y: this.itemScale,
            ease: Back.easeOut
        });
        TweenLite.to(this, 0.5,
        {
            delay: delay,
            alpha: 1
        });
    }
}